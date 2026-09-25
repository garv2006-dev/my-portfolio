import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pg from 'pg';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import {
  validateAndSanitizeInput,
  applyRetrievalGuardrails,
  validateAndSanitizeOutput,
} from './guardrails.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY is missing in .env!');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

// 1. Security & Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' })); // Restrict payload size to prevent DOS

// Express Rate Limiter: Max 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 1 minute.' },
});

app.use('/api/', limiter);

// PostgreSQL Pool for Neon pgvector
let pool: pg.Pool | null = null;
if (DATABASE_URL && !DATABASE_URL.includes('your_neon_postgresql_connection_string_here')) {
  pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log('✅ Connected to Neon PostgreSQL database.');
} else {
  console.warn('⚠️ DATABASE_URL not set. Running in Local Memory Fallback Mode for portfolio queries.');
}

// Fallback local document loader if DB connection string is pending setup
let fallbackChunks: { content: string; section: string }[] = [];
function loadFallbackDocument() {
  const mdPath = path.resolve(process.cwd(), 'Portfolio_Documentation.md');
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, 'utf-8');
    const sections = raw.split(/(?=##?\s+\d+\.)/g);
    fallbackChunks = sections.map((s, idx) => {
      const match = s.match(/##?\s+([^\n]+)/);
      return {
        content: s.trim(),
        section: match ? match[1].trim() : `Portfolio Section ${idx + 1}`,
      };
    });
  }
}
loadFallbackDocument();

// In-Memory Query Cache for Token Reduction (avoid re-embedding identical queries)
const queryCache = new Map<string, { answer: string; sources: any[]; tokensSavedEstimate: number }>();
queryCache.clear();

// Simple Vector Dot Product calculation for local fallback similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Normalize queries by removing whitespace anomalies
function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, ' ').trim();
}

// 2. RAG Retrieval & Context Compression Function
interface RetrievedContext {
  content: string;
  section: string;
  similarity: number;
  metadata?: {
    source?: string;
    chunkIndex?: number;
    charCount?: number;
  };
}

// In-Memory Query Vector Cache to save embedding calls on frequent queries
const embeddingCache = new Map<string, number[]>();

async function retrieveRelevantContext(userQuery: string): Promise<RetrievedContext[]> {
  const normalized = normalizeQuery(userQuery);

  let queryVector: number[] | null = null;
  if (embeddingCache.has(normalized)) {
    queryVector = embeddingCache.get(normalized)!;
  } else {
    // Generate Query Embedding using Gemini gemini-embedding-001
    const embedResponse: any = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: normalized,
      config: {
        outputDimensionality: 768,
      },
    });

    queryVector = embedResponse.embeddings?.[0]?.values || embedResponse.embedding?.values || embedResponse.values;
    if (queryVector && Array.isArray(queryVector)) {
      if (embeddingCache.size > 200) {
        const first = embeddingCache.keys().next().value;
        if (first) embeddingCache.delete(first);
      }
      embeddingCache.set(normalized, queryVector);
    }
  }

  if (!queryVector || !Array.isArray(queryVector)) {
    throw new Error('Could not generate query embedding from Gemini');
  }

  // Vector Search via Neon PostgreSQL pgvector
  if (pool) {
    const vectorStr = `[${queryVector.join(',')}]`;
    const result = await pool.query(
      `
      SELECT content, section, metadata,
             1 - (embedding <=> $1::vector) AS similarity
      FROM portfolio_embeddings
      WHERE 1 - (embedding <=> $1::vector) > 0.15
      ORDER BY embedding <=> $1::vector
      LIMIT 5;
      `,
      [vectorStr]
    );

    return result.rows.map((row: any) => ({
      content: row.content,
      section: row.section,
      metadata: row.metadata || { source: 'Portfolio_Documentation.md' },
      similarity: parseFloat(row.similarity).toFixed(3) as any,
    }));
  }

  // Fallback memory retrieval if DB connection string is pending configuration
  const scored = [];
  for (let idx = 0; idx < fallbackChunks.length; idx++) {
    const chunk = fallbackChunks[idx];
    const textLower = chunk.content.toLowerCase();
    const queryTerms = normalized.toLowerCase().split(/\s+/);
    let score = 0.5;
    for (const term of queryTerms) {
      if (term.length > 2 && textLower.includes(term)) {
        score += 0.15;
      }
    }
    scored.push({
      content: chunk.content,
      section: chunk.section,
      metadata: { source: 'Portfolio_Documentation.md', chunkIndex: idx, charCount: chunk.content.length },
      similarity: Math.min(score, 0.95),
    });
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, 5);
}

// Context Compression: Preserves newlines so Markdown lists and headings remain intact
function compressContext(contexts: RetrievedContext[]): string {
  return contexts
    .map((c, i) => `--- Snippet ${i + 1} (${c.section}) ---\n${c.content.trim()}`)
    .join('\n\n');
}

// 3. API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', database: pool ? 'connected' : 'fallback-mode', timestamp: new Date() });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { message, history } = req.body;

    // 1. INPUT GUARDRAIL: Sanitize & Validate Query (Prompt Injection, System Leak, Abusive Content)
    const inputValidation = validateAndSanitizeInput(message);
    if (!inputValidation.safe) {
      return res.json({
        answer: inputValidation.refusalResponse,
        sources: [],
        tokensSavedEstimate: 0,
        responseMs: Date.now() - startTime,
        guardrailTriggered: 'INPUT_GUARDRAIL',
        blockReason: inputValidation.blockReason,
      });
    }

    const sanitizedQuery = inputValidation.sanitizedInput;

    // Check Cache for token savings & sub-10ms response time
    const cacheKey = sanitizedQuery.toLowerCase();
    if (queryCache.has(cacheKey)) {
      console.log(`⚡ Cache Hit for query: "${sanitizedQuery}"`);
      const cached = queryCache.get(cacheKey)!;
      return res.json({
        ...cached,
        cached: true,
        responseMs: Date.now() - startTime,
      });
    }

    // 2. RETRIEVAL GUARDRAIL: Retrieve Context & Apply Quality / Boundary Isolation Filters
    const rawContexts = await retrieveRelevantContext(sanitizedQuery);
    const retrievalGuardrail = applyRetrievalGuardrails(rawContexts);

    const contexts = retrievalGuardrail.contexts;
    const compressedContext = retrievalGuardrail.compressedContext;

    // Calculate Estimated Tokens Saved compared to full document prompt (~1500 tokens -> ~350 tokens)
    const tokensSavedEstimate = Math.max(0, 1500 - (compressedContext.length / 4));

    // Streamlined Concise System Instruction (reduces token usage by ~70%)
    const systemInstruction = `You are Garv AI, official assistant for Garv Variya's software developer portfolio.
Garv is an AI/ML Engineer & Full-Stack Developer from Surat, Gujarat (BCA Graduate 2023-2026).

STRICT RESPONSE RULES:
1. Provide a direct, comprehensive, clear, and perfectly formatted answer using GitHub-flavored Markdown (bold text, bullet points, headers).
2. Ground all answers strictly in the PORTFOLIO CONTEXT provided below inside strict XML boundaries.
3. If asked about his present projects, detail his 3 featured applications:
   - **Nexus AI**: Full-Stack AI Chat & Collaborative Workspace Platform (RAG + FlashRank, FastAPI, Gemini/OpenAI, Supabase, Clerk Auth, Stripe API).
   - **Emotion AI**: Real-Time NLP Text Emotion Classifier (Python, Flask, scikit-learn, TF-IDF, Logistic Regression, Docker, Render).
   - **Luxury Hotels**: AI-Powered Full-Stack Hotel Booking & RAG Platform (React.js, Node.js, Express.js, MongoDB Vector Search, Gemini LLM, Tool Calling - Live at https://www.luxuryhotelrooms.site/).
4. If asked about certifications, highlight Oracle Certified Foundations Associate — Agentic AI (Valid Jul 2026 – Jul 2028) and AI – Data Engineering Analyst (NASSCOM / Skill India Digital Hub).
5. Highlight contact info garvvariya03@gmail.com, GitHub (garv2006-dev), LinkedIn (garv-variya-5912aa363) when asked about contact or hiring.
6. Make every answer accurate, enthusiastic, professional, and visually clean without filler text.

PORTFOLIO CONTEXT:
${compressedContext || '<retrieved_document section="General">Garv Variya is an AI/ML Engineer & Full-Stack Developer whose present AI/ML projects include Nexus AI (Full-Stack AI Chat & Collaborative Workspace Platform), Emotion AI (Real-Time NLP Emotion Classifier), and Luxury Hotels (AI Hotel Booking & RAG Platform).</retrieved_document>'}`;

    // Format Multi-Turn Conversation Context Window
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add up to last 4 turns from history for context continuity
    if (Array.isArray(history) && history.length > 0) {
      const validHistory = history.slice(-4);
      for (const turn of validHistory) {
        if (turn.role && turn.text && typeof turn.text === 'string') {
          formattedContents.push({
            role: turn.role === 'ai' || turn.role === 'model' ? 'model' : 'user',
            parts: [{ text: turn.text.trim().slice(0, 200) }],
          });
        }
      }
    }

    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: sanitizedQuery }],
    });

    // Valid, active Gemini model hierarchy for ultra-fast performance
    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
    ];
    let llmResponse: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        llmResponse = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
            maxOutputTokens: 1000,
            temperature: 0.2,
          },
        });

        // Check if response text is valid and non-empty
        const text = llmResponse?.text?.trim();
        if (text && text.length > 0) {
          break;
        }
      } catch (retryErr: any) {
        lastError = retryErr;
        console.warn(`⚠️ Model ${modelName} failed: ${retryErr.message || retryErr}. Trying next model...`);
      }
    }

    let rawAnswer = llmResponse?.text?.trim();

    // Context-driven Synthesis Fallback if API rate-limits occur on free tier
    if (!rawAnswer && contexts.length > 0) {
      console.log('📌 Synthesizing answer directly from retrieved vector context...');
      const cleanedSnippets = contexts.map(c => {
        const text = c.content.replace(/^\[Section:[^\]]+\]\n?/, '').trim();
        return `### ${c.section}\n${text}`;
      }).join('\n\n');
      rawAnswer = cleanedSnippets;
    }

    if (!rawAnswer) {
      rawAnswer = "Garv Variya is an AI/ML Engineer & Full-Stack Developer proficient in Python, PyTorch, React.js, Node.js, Express.js, PostgreSQL, MongoDB, and Tailwind CSS. You can contact him at garvvariya03@gmail.com.";
    }

    // 3. OUTPUT GUARDRAIL: Security Scanning (Secret Redaction & XSS Filtering)
    const outputValidation = validateAndSanitizeOutput(rawAnswer, sanitizedQuery);
    const finalAnswer = outputValidation.sanitizedOutput;

    // Deduplicate & filter sources with metadata by section & highest similarity
    const cleanSectionName = (sec: string) => sec.replace(/^\d+\.\s*/, '').trim();
    const uniqueSourcesMap = new Map<string, { section: string; similarity: number; metadata: any }>();
    contexts.forEach((c) => {
      const cleanSec = cleanSectionName(c.section);
      const existing = uniqueSourcesMap.get(cleanSec);
      if (!existing || Number(c.similarity) > existing.similarity) {
        uniqueSourcesMap.set(cleanSec, {
          section: cleanSec,
          similarity: Number(c.similarity),
          metadata: c.metadata || { source: 'Portfolio_Documentation.md' },
        });
      }
    });
    const uniqueSources = Array.from(uniqueSourcesMap.values());

    const responseMs = Date.now() - startTime;

    const responsePayload = {
      answer: finalAnswer,
      sources: uniqueSources,
      tokensSavedEstimate: Math.round(tokensSavedEstimate),
      responseMs,
      guardrailPassed: true,
      retrievalInfo: {
        totalRetrieved: rawContexts.length,
        passedGuardrail: contexts.length,
        rejectedCount: retrievalGuardrail.rejectedCount,
      },
    };

    // Store in query cache (limit cache size to 100 items)
    if (queryCache.size > 100) {
      const firstKey = queryCache.keys().next().value;
      if (firstKey) queryCache.delete(firstKey);
    }
    queryCache.set(cacheKey, responsePayload);

    return res.json(responsePayload);
  } catch (error: any) {
    console.error('❌ Error in /api/chat:', error);
    return res.status(500).json({
      error: 'An error occurred while generating response.',
      details: error.message,
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌐 RAG Server running securely on http://localhost:${PORT}`);
  });
}

export default app;
