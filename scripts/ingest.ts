import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY is not defined in .env!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface DocumentChunk {
  content: string;
  section: string;
  metadata: {
    source: string;
    chunkIndex: number;
    charCount: number;
  };
}

function chunkDocument(text: string, source: string): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  
  // Split document strictly by major numbered sections (e.g. ## 1. Professional Summary, ## 2. Technical Skills, ## 3. Featured Projects, etc.)
  const sectionRegex = /(?=\n##\s+\d+\.\s+|^##\s+\d+\.\s+)/gm;
  const rawSections = text.split(sectionRegex);
  
  let chunkCounter = 0;
  
  for (const rawSection of rawSections) {
    const trimmed = rawSection.trim();
    // Filter out empty or trivial title-only chunks
    if (!trimmed || trimmed.length < 40) continue;
    
    // Extract major section heading
    const headingMatch = trimmed.match(/^##?\s*(\d+\.\s*[^\n]+)/m) || trimmed.match(/^#+\s*(.+)$/m);
    const sectionName = headingMatch ? headingMatch[1].trim() : 'General Portfolio Overview';
    
    // Always store as complete section chunk
    chunks.push({
      content: `[Section: ${sectionName}]\n${trimmed}`,
      section: sectionName,
      metadata: {
        source,
        chunkIndex: chunkCounter++,
        charCount: trimmed.length,
      },
    });
  }
  
  return chunks;
}

async function generateEmbedding(text: string, maxRetries = 3): Promise<number[]> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const response: any = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });
      
      const values = response.embeddings?.[0]?.values || response.embedding?.values || response.values;
      if (values && Array.isArray(values)) {
        return values;
      }
      console.error('Embedding response detail:', JSON.stringify(response));
    } catch (err: any) {
      if (attempt >= maxRetries) throw err;
      console.warn(`  ⚠️ Attempt ${attempt} failed. Retrying embedding generation... (${err.message})`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error('Failed to generate embedding after retries');
}

async function ingest() {
  console.log('🚀 Starting Portfolio Vector Embedding Ingestion Pipeline...');

  // 1. Locate single canonical Markdown file
  const mdPath = path.resolve(process.cwd(), 'Portfolio_Documentation.md');
  
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Error: Portfolio_Documentation.md file not found!');
    process.exit(1);
  }

  console.log(`📄 Reading canonical document: ${mdPath}`);
  const rawText = fs.readFileSync(mdPath, 'utf-8');
  const documentSource = 'Portfolio_Documentation.md';

  // 2. Chunk document into semantic major section blocks
  console.log('✂️ Chunking text into complete section-aware blocks...');
  const chunks = chunkDocument(rawText, documentSource);
  console.log(`✅ Generated ${chunks.length} rich section chunks from Portfolio_Documentation.md.`);

  // 3. Database reset & ingestion setup
  if (!DATABASE_URL || DATABASE_URL.includes('your_neon_postgresql_connection_string_here')) {
    console.warn('\n⚠️ DATABASE_URL not set in .env file!');
    console.warn('   Local fallback mode will be active for server RAG queries.\n');
    return;
  }

  // 4. Connect to Neon PostgreSQL & reset vector DB
  console.log('🔌 Connecting to Neon PostgreSQL Database...');
  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    console.log('🧹 Resetting existing vector database embeddings table...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await client.query('DROP TABLE IF EXISTS portfolio_embeddings;');

    console.log('🏗️ Creating portfolio_embeddings schema with 768-dimensional vector support...');
    await client.query(`
      CREATE TABLE portfolio_embeddings (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        section VARCHAR(150),
        metadata JSONB,
        embedding vector(768),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('⚡ Creating HNSW vector index for ultra-fast similarity search...');
    await client.query(`
      CREATE INDEX portfolio_embeddings_hnsw_idx 
      ON portfolio_embeddings USING hnsw (embedding vector_cosine_ops);
    `);

    // 5. Generate & insert embeddings into vector DB
    console.log(`🧠 Generating Gemini embeddings & inserting ${chunks.length} rich chunks into vector DB...`);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`  [${i + 1}/${chunks.length}] Embedding section: "${chunk.section}"...`);
      
      const embedding = await generateEmbedding(chunk.content);
      const vectorStr = `[${embedding.join(',')}]`;

      await client.query(
        `INSERT INTO portfolio_embeddings (content, section, metadata, embedding) VALUES ($1, $2, $3, $4::vector)`,
        [chunk.content, chunk.section, JSON.stringify(chunk.metadata), vectorStr]
      );
    }

    console.log(`\n🎉 SUCCESS! Vector database reset & ${chunks.length} rich section chunks embedded into Neon PostgreSQL vector DB!`);
  } catch (err) {
    console.error('❌ Error during vector database ingestion:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

ingest().catch((err) => {
  console.error('💥 Fatal Ingestion Error:', err);
  process.exit(1);
});
