import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTypewriter } from '../hooks';

interface CodeToken {
  text: string;
  className?: string;
}

const floatingSymbols = [
  { text: '<>', x: '10%', y: '20%', delay: 0, size: 'text-2xl' },
  { text: '{}', x: '85%', y: '15%', delay: 1, size: 'text-3xl' },
  { text: '()', x: '15%', y: '70%', delay: 2, size: 'text-xl' },
  { text: '[]', x: '80%', y: '65%', delay: 0.5, size: 'text-2xl' },
  { text: '=>', x: '50%', y: '10%', delay: 1.5, size: 'text-lg' },
  { text: '/>', x: '90%', y: '40%', delay: 2.5, size: 'text-xl' },
  { text: '&&', x: '5%', y: '45%', delay: 3, size: 'text-lg' },
  { text: '||', x: '70%', y: '80%', delay: 1.8, size: 'text-lg' },
];

const codeLines: CodeToken[][] = [
  // import React from 'react';
  [
    { text: 'import ', className: 'text-pink-500 font-semibold' },
    { text: 'React ', className: 'text-blue-400' },
    { text: 'from ', className: 'text-pink-500 font-semibold' },
    { text: "'react'", className: 'text-emerald-400' },
    { text: ';', className: 'text-gray-400' }
  ],
  // import { motion } from 'framer-motion';
  [
    { text: 'import ', className: 'text-pink-500 font-semibold' },
    { text: '{ ', className: 'text-gray-400' },
    { text: 'motion ', className: 'text-blue-400' },
    { text: '} ', className: 'text-gray-400' },
    { text: 'from ', className: 'text-pink-500 font-semibold' },
    { text: "'framer-motion'", className: 'text-emerald-400' },
    { text: ';', className: 'text-gray-400' }
  ],
  // empty line
  [],
  // const App = () => {
  [
    { text: 'const ', className: 'text-pink-500 font-semibold' },
    { text: 'App ', className: 'text-cyan-400' },
    { text: '= ', className: 'text-pink-500' },
    { text: '() ', className: 'text-gray-400' },
    { text: '=> ', className: 'text-pink-500 font-semibold' },
    { text: '{', className: 'text-gray-400' }
  ],
  //   const [count, setCount] = useState(0);
  [
    { text: '  const ', className: 'text-pink-500 font-semibold' },
    { text: '[', className: 'text-gray-400' },
    { text: 'count', className: 'text-blue-400' },
    { text: ', ', className: 'text-gray-400' },
    { text: 'setCount', className: 'text-cyan-400' },
    { text: '] = ', className: 'text-pink-500' },
    { text: 'useState', className: 'text-blue-400' },
    { text: '(', className: 'text-gray-400' },
    { text: '0', className: 'text-violet-400' },
    { text: ');', className: 'text-gray-400' }
  ],
  // empty line
  [],
  //   return (
  [
    { text: '  return ', className: 'text-pink-500 font-semibold' },
    { text: '(', className: 'text-gray-400' }
  ],
  //     <motion.div animate={{ opacity: 1 }}>
  [
    { text: '    <', className: 'text-gray-400' },
    { text: 'motion.div ', className: 'text-cyan-400' },
    { text: 'animate', className: 'text-yellow-400' },
    { text: '={', className: 'text-pink-500 font-semibold' },
    { text: '{ ', className: 'text-gray-400' },
    { text: 'opacity', className: 'text-blue-400' },
    { text: ': ', className: 'text-gray-400' },
    { text: '1', className: 'text-violet-400' },
    { text: ' }', className: 'text-gray-400' },
    { text: '}>', className: 'text-pink-500 font-semibold' }
  ],
  //       <h1 className="text-blue-500">
  [
    { text: '      <', className: 'text-gray-400' },
    { text: 'h1 ', className: 'text-pink-500' },
    { text: 'className', className: 'text-yellow-400' },
    { text: '="text-blue-500"', className: 'text-emerald-400' },
    { text: '>', className: 'text-gray-400' }
  ],
  //         Hello, World!
  [
    { text: '        Hello, World!', className: 'text-white font-medium' }
  ],
  //       </h1>
  [
    { text: '      </', className: 'text-gray-400' },
    { text: 'h1', className: 'text-pink-500' },
    { text: '>', className: 'text-gray-400' }
  ],
  //     </motion.div>
  [
    { text: '    </', className: 'text-gray-400' },
    { text: 'motion.div', className: 'text-cyan-400' },
    { text: '>', className: 'text-gray-400' }
  ],
  //   );
  [
    { text: '  );', className: 'text-gray-400' }
  ],
  // };
  [
    { text: '};', className: 'text-gray-400' }
  ]
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const typedText = useTypewriter(['Full-Stack Developer', 'React & Node.js Specialist', 'UI/UX Specialist', 'Problem Solver'], 80, 40, 2000);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen lg:h-screen lg:min-h-[750px] flex items-center justify-center overflow-hidden bg-mesh section-snap pt-20 pb-12 lg:pt-0 lg:pb-0">
      {floatingSymbols.map((sym, i) => (
        <motion.div key={i} className={`absolute ${sym.size} font-mono text-blue-300/20 select-none pointer-events-none`} style={{ left: sym.x, top: sym.y }} animate={{ opacity: [0.1, 0.25, 0.1], y: [0, -20, 0], rotate: [0, 10, -5, 0] }} transition={{ duration: 6, delay: sym.delay, repeat: Infinity, ease: 'easeInOut' }}>{sym.text}</motion.div>
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left lg:max-w-xl mx-auto lg:mx-0 flex flex-col justify-center">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-500 text-lg font-medium mb-3">Hi, I'm</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[Space_Grotesk] text-gradient-blue leading-tight mb-4">Garv Variya</motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-xl sm:text-2xl font-medium text-gray-600 mb-4 h-9">
              <span className="text-blue-500">&gt;</span> {typedText}<span className="animate-typing-cursor text-blue-500 ml-0.5">|</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">BCA Graduate from Vivekananda College, Surat · Building scalable web apps with modern tech</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              <motion.button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold text-sm hover:bg-blue-500/5 transition-colors relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">Contact Me</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="hidden lg:block">
            <div className="code-window">
              <div className="code-window-header">
                <div className="code-dot bg-red-500" />
                <div className="code-dot bg-yellow-500" />
                <div className="code-dot bg-green-500" />
                <span className="ml-3 text-xs text-gray-400 font-mono">App.tsx</span>
              </div>

              <div className="p-6 font-mono text-xs sm:text-sm leading-6 sm:leading-7 overflow-hidden bg-[#111827]/95">
                {codeLines.map((tokens, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
                    className="code-line flex"
                  >
                    <span className="text-gray-600 w-6 text-right mr-4 select-none text-xs leading-7">{i + 1}</span>
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div className="animate-bounce-arrow"><ChevronDown size={20} className="text-blue-400" /></motion.div>
      </motion.div>
    </section>
  );
}