/**
 * RAG Guardrails Module for Garv AI Assistant
 * Provides Input, Retrieval, and Output Security & Quality Guardrails.
 */

export interface RetrievedContext {
  content: string;
  section: string;
  similarity: number;
  metadata?: {
    source?: string;
    chunkIndex?: number;
    charCount?: number;
  };
}

export interface InputValidationResult {
  safe: boolean;
  sanitizedInput: string;
  blockReason?: 'PROMPT_INJECTION' | 'SYSTEM_LEAK_ATTEMPT' | 'ABUSIVE_CONTENT' | 'EXCESSIVE_LENGTH' | 'EMPTY';
  refusalResponse?: string;
}

export interface OutputValidationResult {
  safe: boolean;
  sanitizedOutput: string;
  modified: boolean;
  warnings: string[];
}

// 1. INPUT GUARDRAILS
// High-risk prompt injection and jailbreak patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+|previous\s+|prior\s+)*instructions/i,
  /disregard\s+(all\s+|previous\s+|prior\s+)*instructions/i,
  /override\s+(system\s+|previous\s+)*prompt/i,
  /forget\s+(your\s+)*instructions/i,
  /you\s+are\s+now\s+(DAN|unrestricted|godmode|jailbroken)/i,
  /act\s+as\s+an?\s+(unrestricted|jailbroken|evil|hacked)/i,
  /bypass\s+(safety|content|security)\s+filters?/i,
  /system\s*:\s*roleplay/i,
  /pretend\s+to\s+be\s+a?\s+(terminal|linux|root|system|hacker)/i,
  /\[system\s+instruction\]/i,
];

// Patterns attempting to extract secret keys, environment variables, or raw system prompts
const SYSTEM_LEAK_PATTERNS = [
  /show\s*(me\s*)?(your\s*)?system\s*(prompt|instructions?|rules)/i,
  /print\s*(your\s*)?system\s*(prompt|instructions?)/i,
  /reveal\s*(your\s*)?system\s*(prompt|instructions?)/i,
  /what\s+are\s+your\s+instructions\??/i,
  /show\s*environment\s*variables/i,
  /print\s*(the\s*)?(GEMINI_API_KEY|DATABASE_URL|SECRET)/i,
  /what\s+is\s+the\s+api\s*key/i,
  /dump\s*config/i,
];

// Abusive, profane, or malicious patterns
const ABUSIVE_PATTERNS = [
  /\b(fuck|shit|bitch|asshole)\b/i,
  /\b(hack|exploit|ddos|inject\s+sql)\b/i,
];

export function validateAndSanitizeInput(rawMessage: unknown): InputValidationResult {
  if (typeof rawMessage !== 'string') {
    return {
      safe: false,
      sanitizedInput: '',
      blockReason: 'EMPTY',
      refusalResponse: "Please provide a valid text message.",
    };
  }

  // Sanitize control characters, zero-width spaces, and excess whitespace
  let cleaned = rawMessage
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length === 0) {
    return {
      safe: false,
      sanitizedInput: '',
      blockReason: 'EMPTY',
      refusalResponse: "Your message cannot be empty.",
    };
  }

  // Length guardrail (Max 250 characters)
  if (cleaned.length > 250) {
    cleaned = cleaned.slice(0, 250);
  }

  // Check System Leak Attempts
  for (const pattern of SYSTEM_LEAK_PATTERNS) {
    if (pattern.test(cleaned)) {
      console.warn(`🛡️ [Input Guardrail] System Leak Attempt Blocked: "${cleaned}"`);
      return {
        safe: false,
        sanitizedInput: cleaned,
        blockReason: 'SYSTEM_LEAK_ATTEMPT',
        refusalResponse: "I am **Garv AI**, official assistant for Garv Variya's portfolio. I cannot display internal system prompts or environment configurations. How can I help you with Garv's projects, skills, or experience?",
      };
    }
  }

  // Check Prompt Injection Attacks
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      console.warn(`🛡️ [Input Guardrail] Prompt Injection Attempt Blocked: "${cleaned}"`);
      return {
        safe: false,
        sanitizedInput: cleaned,
        blockReason: 'PROMPT_INJECTION',
        refusalResponse: "I am **Garv AI**, official assistant for Garv Variya's software developer portfolio. I operate strictly within portfolio guidelines and cannot override safety policies. Ask me about Garv's projects, certifications, or contact info!",
      };
    }
  }

  // Check Abusive Content
  for (const pattern of ABUSIVE_PATTERNS) {
    if (pattern.test(cleaned)) {
      console.warn(`🛡️ [Input Guardrail] Abusive Query Blocked: "${cleaned}"`);
      return {
        safe: false,
        sanitizedInput: cleaned,
        blockReason: 'ABUSIVE_CONTENT',
        refusalResponse: "Please keep questions respectful and focused on Garv Variya's developer portfolio, projects, and skills.",
      };
    }
  }

  return {
    safe: true,
    sanitizedInput: cleaned,
  };
}

// 2. RETRIEVAL GUARDRAILS
export interface RetrievalGuardrailResult {
  contexts: RetrievedContext[];
  compressedContext: string;
  isLowConfidence: boolean;
  rejectedCount: number;
}

const MIN_SIMILARITY_THRESHOLD = 0.20; // Minimum confidence score to pass guardrail
const MAX_RETRIEVED_SNIPPETS = 4;      // Max snippets allowed in context window

export function applyRetrievalGuardrails(rawContexts: RetrievedContext[]): RetrievalGuardrailResult {
  if (!Array.isArray(rawContexts) || rawContexts.length === 0) {
    return {
      contexts: [],
      compressedContext: '',
      isLowConfidence: true,
      rejectedCount: 0,
    };
  }

  // Filter 1: Enforce minimum similarity score threshold
  const validContexts = rawContexts.filter((c) => {
    const score = Number(c.similarity);
    return !isNaN(score) && score >= MIN_SIMILARITY_THRESHOLD;
  });

  const rejectedCount = rawContexts.length - validContexts.length;

  // Filter 2: Deduplicate snippets by section
  const sectionMap = new Map<string, RetrievedContext>();
  for (const c of validContexts) {
    const cleanSection = c.section.replace(/^\d+\.\s*/, '').trim();
    if (!sectionMap.has(cleanSection) || Number(c.similarity) > Number(sectionMap.get(cleanSection)!.similarity)) {
      sectionMap.set(cleanSection, c);
    }
  }

  const deduplicatedContexts = Array.from(sectionMap.values());

  // Filter 3: Sort by similarity and slice to max allowed snippets
  deduplicatedContexts.sort((a, b) => Number(b.similarity) - Number(a.similarity));
  const finalContexts = deduplicatedContexts.slice(0, MAX_RETRIEVED_SNIPPETS);

  const isLowConfidence = finalContexts.length === 0;

  // Filter 4: Context Boundary Isolation & Injection Escaping
  // Escape potential XML/HTML tags embedded inside retrieved text to prevent prompt injection escaping
  const compressedContext = finalContexts
    .map((c, i) => {
      const escapedContent = c.content
        .replace(/<\/retrieved_document>/gi, '[/retrieved_document]')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      return `<retrieved_document index="${i + 1}" section="${c.section}">\n${escapedContent.trim()}\n</retrieved_document>`;
    })
    .join('\n\n');

  if (rejectedCount > 0) {
    console.log(`🛡️ [Retrieval Guardrail] Filtered out ${rejectedCount} low-confidence/duplicate context chunks below threshold (${MIN_SIMILARITY_THRESHOLD}).`);
  }

  return {
    contexts: finalContexts,
    compressedContext,
    isLowConfidence,
    rejectedCount,
  };
}

// 3. OUTPUT GUARDRAILS
const SENSITIVE_DATA_PATTERNS = [
  /AIzaSy[A-Za-z0-9_-]{33}/g, // Gemini API Key pattern
  /postgres:\/\/[^:\s]+:[^@\s]+@[^\s]+/gi, // DB Connection string pattern
  /DATABASE_URL\s*=\s*[^\s]+/gi,
  /GEMINI_API_KEY\s*=\s*[^\s]+/gi,
  /STRICT RESPONSE RULES:/g, // System prompt rule leakage
];

const DANGEROUS_HTML_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
];

export function validateAndSanitizeOutput(rawOutput: string, userQuery: string): OutputValidationResult {
  const warnings: string[] = [];
  let sanitized = rawOutput || '';
  let modified = false;

  // Rule 1: Check and Redact Sensitive Data Leaks
  for (const pattern of SENSITIVE_DATA_PATTERNS) {
    if (pattern.test(sanitized)) {
      console.warn(`🛡️ [Output Guardrail] Redacting sensitive pattern leak from response.`);
      sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
      warnings.push('Redacted sensitive data pattern from model output.');
      modified = true;
    }
  }

  // Rule 2: Strip Dangerous HTML / Script Tags (XSS Prevention)
  for (const pattern of DANGEROUS_HTML_PATTERNS) {
    if (pattern.test(sanitized)) {
      console.warn(`🛡️ [Output Guardrail] Stripping dangerous script/HTML tag from response.`);
      sanitized = sanitized.replace(pattern, '');
      warnings.push('Stripped executable HTML/JavaScript tags from response.');
      modified = true;
    }
  }

  // Rule 3: Output Scope Guardrail (Fallback if output is empty or corrupted)
  if (!sanitized.trim()) {
    sanitized = "Garv Variya is an AI/ML Engineer & Full-Stack Developer proficient in Python, PyTorch, React.js, Node.js, Express.js, PostgreSQL, MongoDB, and Tailwind CSS. You can contact him at garvvariya03@gmail.com.";
    warnings.push('Output was empty after validation; replaced with safe portfolio profile fallback.');
    modified = true;
  }

  return {
    safe: true,
    sanitizedOutput: sanitized,
    modified,
    warnings,
  };
}
