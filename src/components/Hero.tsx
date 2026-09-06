import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useTypewriter } from '../hooks';

interface CodeToken {
  text: string;
  className?: string;
}

const floatingSymbols = [
  { text: 'Python', x: '10%', y: '20%', delay: 0, size: 'text-xs font-semibold' },
  { text: 'PyTorch', x: '85%', y: '15%', delay: 1, size: 'text-xs font-semibold' },
  { text: 'RAG', x: '15%', y: '70%', delay: 2, size: 'text-xs font-bold' },
  { text: 'LLMs', x: '80%', y: '65%', delay: 0.5, size: 'text-xs font-bold' },
  { text: 'React.js', x: '50%', y: '10%', delay: 1.5, size: 'text-xs font-semibold' },
  { text: 'VectorSearch', x: '90%', y: '40%', delay: 2.5, size: 'text-[11px] font-mono' },
  { text: 'LangChain', x: '5%', y: '45%', delay: 3, size: 'text-[11px] font-mono' },
  { text: 'TensorFlow', x: '70%', y: '80%', delay: 1.8, size: 'text-xs font-semibold' },
];

const codeLines: CodeToken[][] = [
  // import { GeminiLLM, VectorDB } from '@ai/sdk';
  [
    { text: 'import ', className: 'text-pink-500 font-semibold' },
    { text: '{ ', className: 'text-gray-400' },
    { text: 'GeminiLLM', className: 'text-cyan-400' },
    { text: ', ', className: 'text-gray-400' },
    { text: 'MongoDBVectorSearch ', className: 'text-amber-400' },
    { text: '} ', className: 'text-gray-400' },
    { text: 'from ', className: 'text-pink-500 font-semibold' },
    { text: "'@ai/sdk'", className: 'text-emerald-400' },
    { text: ';', className: 'text-gray-400' }
  ],
  // empty line
  [],
  // const aiEngine = new AIEmbeddingEngine({
  [
    { text: 'const ', className: 'text-pink-500 font-semibold' },
    { text: 'aiEngine ', className: 'text-blue-400' },
    { text: '= ', className: 'text-pink-500' },
    { text: 'new ', className: 'text-pink-500 font-semibold' },
    { text: 'AIEmbeddingEngine', className: 'text-cyan-400' },
    { text: '({', className: 'text-gray-400' }
  ],
  //   model: 'gemini-pro',
  [
    { text: '  model', className: 'text-yellow-400' },
    { text: ': ', className: 'text-gray-400' },
    { text: "'gemini-pro'", className: 'text-emerald-400' },
    { text: ',', className: 'text-gray-400' }
  ],
  //   ragEnabled: true,
  [
    { text: '  ragEnabled', className: 'text-yellow-400' },
    { text: ': ', className: 'text-gray-400' },
    { text: 'true', className: 'text-violet-400' },
    { text: ',', className: 'text-gray-400' }
  ],
  //   tools: [bookingSearchTool, roomQueryTool]
  [
    { text: '  tools', className: 'text-yellow-400' },
    { text: ': ', className: 'text-gray-400' },
    { text: '[', className: 'text-gray-400' },
    { text: 'bookingTool', className: 'text-cyan-400' },
    { text: ', ', className: 'text-gray-400' },
    { text: 'roomTool', className: 'text-cyan-400' },
    { text: ']', className: 'text-gray-400' }
  ],
  // });
  [
    { text: '});', className: 'text-gray-400' }
  ],
  // empty line
  [],
  // async function handleUserQuery(prompt: string) {
  [
    { text: 'async function ', className: 'text-pink-500 font-semibold' },
    { text: 'handleUserQuery', className: 'text-blue-400' },
    { text: '(', className: 'text-gray-400' },
    { text: 'prompt', className: 'text-amber-400' },
    { text: ': ', className: 'text-gray-400' },
    { text: 'string', className: 'text-violet-400' },
    { text: ') {', className: 'text-gray-400' }
  ],
  //   const embeddings = await aiEngine.retrieveContext(prompt);
  [
    { text: '  const ', className: 'text-pink-500 font-semibold' },
    { text: 'context ', className: 'text-cyan-400' },
    { text: '= ', className: 'text-pink-500' },
    { text: 'await ', className: 'text-pink-500 font-semibold' },
    { text: 'aiEngine', className: 'text-blue-400' },
    { text: '.', className: 'text-gray-400' },
    { text: 'vectorSearch', className: 'text-yellow-400' },
    { text: '(', className: 'text-gray-400' },
    { text: 'prompt', className: 'text-amber-400' },
    { text: ');', className: 'text-gray-400' }
  ],
  //   return await aiEngine.generateResponse({ prompt, context });
  [
    { text: '  return await ', className: 'text-pink-500 font-semibold' },
    { text: 'aiEngine', className: 'text-blue-400' },
    { text: '.', className: 'text-gray-400' },
    { text: 'generateWithTools', className: 'text-yellow-400' },
    { text: '({ ', className: 'text-gray-400' },
    { text: 'prompt', className: 'text-amber-400' },
    { text: ', ', className: 'text-gray-400' },
    { text: 'context ', className: 'text-cyan-400' },
    { text: '});', className: 'text-gray-400' }
  ],
  // }
  [
    { text: '}', className: 'text-gray-400' }
  ]
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const typedText = useTypewriter(
    ['AI/ML Engineer', 'Full-Stack Developer', 'Generative AI & LLM Specialist', 'React & Node.js Developer'],
    80,
    40,
    2000
  );

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen lg:h-screen lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-mesh section-snap pt-16 pb-8 lg:pt-0 lg:pb-0">
      {floatingSymbols.map((sym, i) => (
        <motion.div key={i} className={`absolute ${sym.size} font-mono text-blue-400/20 select-none pointer-events-none`} style={{ left: sym.x, top: sym.y }} animate={{ opacity: [0.1, 0.3, 0.1], y: [0, -15, 0], rotate: [0, 8, -4, 0] }} transition={{ duration: 6, delay: sym.delay, repeat: Infinity, ease: 'easeInOut' }}>{sym.text}</motion.div>
      ))}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left lg:max-w-xl mx-auto lg:mx-0 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] sm:text-xs font-semibold mb-3 mx-auto lg:mx-0 w-fit">
              <Sparkles size={13} className="text-blue-500" /> AI/ML Engineer & Full-Stack Developer
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Space_Grotesk] text-gradient-blue leading-tight mb-3">
              Garv Variya
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-3 h-8">
              <span className="text-blue-500">&gt;</span> {typedText}<span className="animate-typing-cursor text-blue-500 ml-0.5">|</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6">
              Building intelligent AI/ML models, RAG systems, and LLM applications — backed by 1+ year of professional Full-Stack web development experience in React, Next.js, and Node.js.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">View AI & Web Projects</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              <motion.button onClick={() => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2.5 border border-blue-500/80 text-blue-500 rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-500/5 transition-colors relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">View Certifications</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="hidden lg:block">
            <div className="code-window border border-card-border/80 shadow-md">
              <div className="code-window-header py-2.5 px-4">
                <div className="code-dot bg-red-500" />
                <div className="code-dot bg-yellow-500" />
                <div className="code-dot bg-green-500" />
                <span className="ml-3 text-xs text-gray-400 font-mono">rag_llm_agent.ts</span>
              </div>

              <div className="p-4 font-mono text-xs leading-6 overflow-hidden bg-[#111827]/95">
                {codeLines.map((tokens, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.8 + i * 0.06 }}
                    className="code-line flex"
                  >
                    <span className="text-gray-600 w-5 text-right mr-3 select-none text-xs leading-6">{i + 1}</span>
                    <span className="flex-1 flex flex-wrap">
                      {tokens.length === 0 ? (
                        <span className="text-gray-300">&nbsp;</span>
                      ) : (
                        tokens.map((token, j) => (
                          <span key={j} className={token.className || "text-gray-300"}>{token.text}</span>
                        ))
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div className="animate-bounce-arrow"><ChevronDown size={18} className="text-blue-400" /></motion.div>
      </motion.div>
    </section>
  );
}