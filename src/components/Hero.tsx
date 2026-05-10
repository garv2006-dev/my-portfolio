import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTypewriter } from '../hooks';

// Social Icons as SVG components
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

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

const codeLines = [
  'import React from \'react\';',
  'import { motion } from \'framer-motion\';',
  '',
  'const App = () => {',
  '  const [count, setCount] = useState(0);',
  '',
  '  return (',
  '    <motion.div animate={{ opacity: 1 }}>',
  '      <h1 className="text-blue-500">',
  '        Hello, World!',
  '      </h1>',
  '    </motion.div>',
  '  );',
  '};',
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const typedText = useTypewriter(['Full-Stack Developer', 'React & Node.js Specialist', 'UI Enthusiast', 'Problem Solver'], 80, 40, 2000);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh section-snap pt-24 pb-12">
      {floatingSymbols.map((sym, i) => (
        <motion.div key={i} className={`absolute ${sym.size} font-mono text-blue-300/20 select-none pointer-events-none`} style={{ left: sym.x, top: sym.y }} animate={{ opacity: [0.1, 0.25, 0.1], y: [0, -20, 0], rotate: [0, 10, -5, 0] }} transition={{ duration: 6, delay: sym.delay, repeat: Infinity, ease: 'easeInOut' }}>{sym.text}</motion.div>
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="text-center lg:text-left lg:max-w-xl mx-auto lg:mx-0">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-500 text-lg font-medium mb-3">Hi, I'm</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[Space_Grotesk] text-gradient-blue leading-tight mb-4">Garv Variya</motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-xl sm:text-2xl font-medium text-gray-600 mb-4 h-9">
              <span className="text-blue-500">&gt;</span> {typedText}<span className="animate-typing-cursor text-blue-500 ml-0.5">|</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">BCA Graduate from Vivekananda College, Surat · Building scalable web apps with modern tech</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              <motion.button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3.5 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold text-base hover:bg-blue-500/5 transition-colors relative overflow-hidden group cursor-pointer">
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
              <div className="p-5 font-mono text-sm leading-7 overflow-hidden">
                {codeLines.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 1 + i * 0.08 }} className="code-line flex">
                    <span className="text-gray-600 w-6 text-right mr-4 select-none text-xs leading-7">{i + 1}</span>
                    <span className="text-gray-300">{line}</span>
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