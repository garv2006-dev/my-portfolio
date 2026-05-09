import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Download, Mail, Phone, MapPin, ExternalLink, Code2, Database, Wrench, Layout, Check, ArrowRight, Send, Globe, Hash } from 'lucide-react';

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

// ==================== HOOKS ====================

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isInView };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => { const s = window.scrollY; const d = document.documentElement.scrollHeight - window.innerHeight; setProgress(d > 0 ? (s / d) * 100 : 0); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return progress;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function useCountUp(end: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor(end * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [end, duration, inView]);
  return count;
}

function useTypewriter(words: string[], speed = 80, delSpeed = 40, pause = 2000) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[idx];
    const t = setTimeout(() => {
      if (!del) {
        setText(w.substring(0, text.length + 1));
        if (text.length + 1 === w.length) setTimeout(() => setDel(true), pause);
      } else {
        setText(w.substring(0, text.length - 1));
        if (text.length === 0) { setDel(false); setIdx((p) => (p + 1) % words.length); }
      }
    }, del ? delSpeed : speed);
    return () => clearTimeout(t);
  }, [text, idx, del, words, speed, delSpeed, pause]);
  return text;
}

// ==================== ANIMATED WRAPPER ====================

function FadeIn({ children, delay = 0, direction = 'up', className = '' }: { children: ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'; className?: string }) {
  const dirs = { up: { y: 40 }, down: { y: -40 }, left: { x: 40 }, right: { x: -40 } };
  return (
    <motion.div initial={{ opacity: 0, ...dirs[direction] }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

// ==================== NAVBAR ====================

const navLinks = [
  { id: 'home', label: 'Home' }, { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' }, { id: 'journey', label: 'Journey' }, { id: 'contact', label: 'Contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();
  const active = useActiveSection(navLinks.map(l => l.id));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <motion.div className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400" style={{ width: `${progress}%` }} />
      </div>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-lg shadow-black/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <motion.button onClick={() => scrollTo('home')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm font-[Space_Grotesk] shadow-lg shadow-blue-500/25">GV</div>
              <span className={`font-[Space_Grotesk] font-semibold text-lg hidden sm:block transition-colors ${scrolled ? 'text-white' : 'text-[#111827]'}`}>Garv<span className="text-blue-500">.</span></span>
            </motion.button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${active === link.id ? (scrolled ? 'text-[#64ffda]' : 'text-blue-500') : (scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#111827]')}`}>
                  {link.label}
                  {active === link.id && <motion.div layoutId="activeNav" className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${scrolled ? 'bg-[#64ffda]' : 'bg-blue-500'}`} />}
                </button>
              ))}
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-4 px-5 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-shadow cursor-pointer"><Download size={14} />Resume</motion.a>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${scrolled ? 'text-white hover:bg-white/10' : 'text-[#111827] hover:bg-black/5'}`}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass-dark border-t border-white/10">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <button key={link.id} onClick={() => scrollTo(link.id)} className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${active === link.id ? 'text-[#64ffda] bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>{link.label}</button>
                ))}
                <a href="#" className="block w-full text-center mt-3 px-5 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer">Download Resume</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

// ==================== HERO ====================

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



function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const typedText = useTypewriter(['Full-Stack Developer', 'React & Node.js Specialist', 'UI Enthusiast', 'Problem Solver'], 80, 40, 2000);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh section-snap">
      {floatingSymbols.map((sym, i) => (
        <motion.div key={i} className={`absolute ${sym.size} font-mono text-blue-300/20 select-none pointer-events-none`} style={{ left: sym.x, top: sym.y }} animate={{ opacity: [0.1, 0.25, 0.1], y: [0, -20, 0], rotate: [0, 10, -5, 0] }} transition={{ duration: 6, delay: sym.delay, repeat: Infinity, ease: 'easeInOut' }}>{sym.text}</motion.div>
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
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
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 1 + i * 0.08 }} className="flex">
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

// ==================== ABOUT ====================

function About() {
  const { ref, isInView } = useInView(0.2);
  const c1 = useCountUp(10, 2000, isInView);
  const c2 = useCountUp(5, 2000, isInView);
  const c3 = useCountUp(2024, 2000, isInView);
  const c4 = useCountUp(100, 2000, isInView);

  const stats = [
    { value: `${c1}+`, label: 'Projects Built', icon: Code2 },
    { value: `${c2}+`, label: 'Tech Stacks', icon: Layout },
    { value: `${c3}`, label: 'BCA Graduate', icon: Globe },
    { value: `${c4}%`, label: 'Dedication', icon: Hash },
  ];

  const traits = ['Clean, maintainable code', 'Full-stack problem solving', 'Pixel-perfect UI implementation', 'Fast learner & team collaborator'];

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-[#F8FAFC] overflow-hidden section-snap">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">Get to know me</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">About Me</h2>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white text-6xl font-bold font-[Space_Grotesk] shadow-2xl shadow-blue-500/30 mb-8 animate-pulse-glow">GV</div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-light rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
                    <s.icon size={20} className="text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#111827] font-[Space_Grotesk]">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div>
              <p className="text-gray-600 leading-relaxed text-base mb-4">Hey! I'm <span className="font-semibold text-[#111827]">Garv Variya</span> — a passionate Full-Stack Developer based in Surat, Gujarat. I completed my Bachelor of Computer Applications (BCA) from <span className="font-semibold text-blue-600">Vivekananda College, Surat</span>, where I discovered my deep love for building things on the web.</p>
              <p className="text-gray-600 leading-relaxed text-base mb-4">I specialize in crafting end-to-end web applications — from pixel-perfect frontends with React and Tailwind CSS to robust backends powered by Node.js, PostgreSQL, MongoDB, and Firebase.</p>
              <p className="text-gray-600 leading-relaxed text-base mb-6">What drives me? Turning complex problems into elegant, user-friendly solutions. I believe great software is not just functional — it's beautiful, fast, and intuitive.</p>

              <h3 className="font-semibold text-[#111827] text-lg mb-4 font-[Space_Grotesk]">What I bring to the table</h3>
              <div className="space-y-3">
                {traits.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><Check size={14} className="text-blue-600" /></div>
                    <span className="text-gray-700 font-medium">{t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ==================== SKILLS ====================

const skillCategories = {
  Frontend: { icon: Layout, color: 'from-blue-400 to-blue-600', skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Tailwind CSS'] },
  Backend: { icon: Code2, color: 'from-green-400 to-green-600', skills: ['Node.js', 'Express.js', 'REST API', 'GraphQL (basic)'] },
  Databases: { icon: Database, color: 'from-purple-400 to-purple-600', skills: ['PostgreSQL', 'MongoDB', 'Firebase (Realtime DB + Firestore)'] },
  Tools: { icon: Wrench, color: 'from-orange-400 to-orange-600', skills: ['Git & GitHub', 'VS Code', 'Postman', 'Vercel', 'Netlify', 'Figma (basic)'] },
};

const topSkills = [
  { name: 'HTML', pct: 90, color: '#E34F26' },
  { name: 'CSS', pct: 85, color: '#1572B6' },
  { name: 'JavaScript', pct: 88, color: '#F7DF1E' },
  { name: 'React', pct: 85, color: '#61DAFB' },
  { name: 'Node.js', pct: 80, color: '#339933' },
  { name: 'MongoDB', pct: 75, color: '#47A248' },
];

function SkillBar({ name, pct, color, delay, inView }: { name: string; pct: number; color: string; delay: number; inView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-500">{pct}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: inView ? `${pct}%` : '0%' }} transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} />
      </div>
    </motion.div>
  );
}

function Skills() {
  const [activeTab, setActiveTab] = useState('Frontend');
  const { ref, isInView } = useInView(0.1);
  const cat = skillCategories[activeTab as keyof typeof skillCategories];

  return (
    <section id="skills" className="relative py-24 lg:py-32 bg-white overflow-hidden section-snap">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">What I know</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">My Tech Stack</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Technologies I work with professionally</p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.keys(skillCategories).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab}</button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.skills.map((skill, i) => (
                  <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-light rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} mx-auto mb-2 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <cat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#111827] mb-6 font-[Space_Grotesk]">Proficiency</h3>
            {topSkills.map((s, i) => (<SkillBar key={s.name} {...s} delay={i * 0.1} inView={isInView} />))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== PROJECTS ====================

const projects = [
  { title: 'ShopNow', subtitle: 'E-Commerce Platform', desc: 'A full-stack e-commerce web app with product listings, cart, checkout, user auth, and admin dashboard.', tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'JWT Auth'], features: ['Product search & filter', 'Order management', 'Payment gateway UI', 'Responsive design'], badge: 'Full Stack', gradient: 'from-blue-500 to-cyan-400', icon: '🛒' },
  { title: 'TaskFlow', subtitle: 'Project Management App', desc: 'Kanban-style task management with real-time updates, team collaboration, and drag-and-drop UI.', tech: ['React', 'Firebase', 'Tailwind CSS'], features: ['Drag & drop boards', 'Real-time sync', 'Team collaboration', 'Task prioritization'], badge: 'React + Firebase', gradient: 'from-purple-500 to-pink-400', icon: '📋' },
  { title: 'DevBlog', subtitle: 'Technical Blogging Platform', desc: 'A developer blog platform with rich text editor, syntax highlighting, tags, and SEO optimization.', tech: ['Next.js', 'MongoDB', 'Node.js', 'Markdown'], features: ['Rich text editor', 'Syntax highlighting', 'Tag system', 'SEO optimized'], badge: 'Full Stack', gradient: 'from-green-500 to-teal-400', icon: '📝' },
  { title: 'WeatherNow', subtitle: 'Weather Dashboard', desc: 'Real-time weather tracking app with 7-day forecast, geolocation, animated weather icons.', tech: ['React', 'TypeScript', 'OpenWeather API'], features: ['7-day forecast', 'Geolocation', 'Animated icons', 'City search'], badge: 'React + TypeScript', gradient: 'from-orange-500 to-yellow-400', icon: '🌤️' },
  { title: 'ChatApp', subtitle: 'Real-Time Messaging', desc: 'Real-time chat application with rooms, private messaging, online status, and message history.', tech: ['Node.js', 'Socket.io', 'MongoDB', 'React'], features: ['Chat rooms', 'Private messaging', 'Online status', 'Message history'], badge: 'Real-time App', gradient: 'from-blue-500 to-cyan-400', icon: '💬' },
  { title: 'AuthFlow', subtitle: 'Auth System Boilerplate', desc: 'Production-ready authentication system with JWT, refresh tokens, role-based access, and email verify.', tech: ['Node.js', 'PostgreSQL', 'JWT', 'Express'], features: ['JWT auth', 'Refresh tokens', 'Role-based access', 'Email verification'], badge: 'Backend', gradient: 'from-red-500 to-pink-400', icon: '🔐' },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="min-h-screen flex items-center py-16 section-snap">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'direction-rtl'}`}>
        <FadeIn direction={isEven ? 'left' : 'right'} className={isEven ? 'lg:order-1' : 'lg:order-2'}>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} className="relative group">
            <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${project.gradient} p-1 shadow-2xl`}>
              <div className="w-full h-full rounded-xl bg-gray-900/90 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)` }} />
                <div className="text-center z-10">
                  <div className="text-6xl mb-4">{project.icon}</div>
                  <div className="text-white font-bold text-2xl font-[Space_Grotesk]">{project.title}</div>
                  <div className="text-gray-400 text-sm mt-1">{project.subtitle}</div>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
            <div className={`absolute -top-3 ${isEven ? '-right-3' : '-left-3'} px-4 py-1.5 rounded-full bg-gradient-to-r ${project.gradient} text-white text-xs font-bold shadow-lg`}>{project.badge}</div>
          </motion.div>
        </FadeIn>

        <FadeIn direction={isEven ? 'right' : 'left'} className={isEven ? 'lg:order-2' : 'lg:order-1'}>
          <div>
            <span className="text-blue-500 font-medium text-sm">Featured Project</span>
            <h3 className="text-3xl sm:text-4xl font-bold font-[Space_Grotesk] text-[#111827] mt-2 mb-4">{project.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{project.desc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map(t => (<span key={t} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">{t}</span>))}
            </div>
            <ul className="space-y-2 mb-8">
              {project.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-600 text-sm"><Check size={14} className="text-blue-500 flex-shrink-0" />{f}</li>
              ))}
            </ul>
            <div className="flex gap-4">
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"><ExternalLink size={14} />Live Demo</motion.a>
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm flex items-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"><GithubIcon size={14} />GitHub</motion.a>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative bg-white">
      <div className="py-24 lg:py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8">
              <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">My work</span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">Featured Projects</h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">A selection of projects that showcase my skills and passion</p>
            </div>
          </FadeIn>
        </div>
      </div>
      {projects.map((p, i) => (<ProjectCard key={p.title} project={p} index={i} />))}
      <div className="py-16 text-center bg-[#F8FAFC]">
        <FadeIn>
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 cursor-pointer">More on GitHub <ArrowRight size={16} /></motion.a>
        </FadeIn>
      </div>
    </section>
  );
}

// ==================== JOURNEY ====================

const timeline = [
  { year: '2021', title: 'Discovered Web Development', desc: 'Started learning HTML, CSS, JavaScript through online resources. Built first static websites.', color: 'from-blue-400 to-blue-600' },
  { year: '2021-2024', title: 'BCA at Vivekananda College, Surat', desc: 'Bachelor of Computer Applications. Studied data structures, algorithms, DBMS, networking, and software engineering.', color: 'from-purple-400 to-purple-600' },
  { year: '2022', title: 'Dived into React & Node.js', desc: 'Started building full-stack projects. Learned React ecosystem, REST APIs, and backend development with Node.js and Express.', color: 'from-green-400 to-green-600' },
  { year: '2023', title: 'Expanded to Databases & Cloud', desc: 'Mastered MongoDB, PostgreSQL, and Firebase. Deployed first production app on Vercel.', color: 'from-orange-400 to-orange-600' },
  { year: '2024', title: 'TypeScript & Advanced Concepts', desc: 'Adopted TypeScript in all new projects. Started exploring system design and scalable architecture.', color: 'from-cyan-400 to-cyan-600' },
  { year: 'Present', title: 'Actively Seeking Opportunities', desc: 'Building open-source projects, expanding portfolio, looking for exciting full-stack roles.', color: 'from-pink-400 to-pink-600' },
];

function Journey() {
  return (
    <section id="journey" className="relative py-24 lg:py-32 bg-[#0a192f] overflow-hidden section-snap">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[#64ffda] font-medium text-sm tracking-widest uppercase">My path</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-white mt-3">Education & Journey</h2>
          </div>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:-translate-x-px" />

          {timeline.map((item, i) => (
            <FadeIn key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
              <div className={`relative flex items-start mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-4 border-[#0a192f] -translate-x-1/2 mt-6 z-10 shadow-lg shadow-blue-500/50" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                  <motion.div whileHover={{ scale: 1.02, y: -3 }} className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                    <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-bold mb-3`}>{item.year}</span>
                    <h3 className="text-lg font-bold text-white font-[Space_Grotesk] mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== CONTACT ====================

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const socials = [
    { icon: GithubIcon, label: 'GitHub', href: '#' },
    { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
    { icon: TwitterIcon, label: 'Twitter', href: '#' },
    { icon: InstagramIcon, label: 'Instagram', href: '#' },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-[#0a192f] overflow-hidden section-snap">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-[#64ffda] font-medium text-sm tracking-widest uppercase">Get in touch</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-white mt-3">Contact Me</h2>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          <FadeIn direction="left">
            <div className="glass rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-white font-[Space_Grotesk] mb-6">Let's Build Something Together</h3>
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Mail size={20} className="text-blue-400" /></div>
                  <div><p className="text-gray-400 text-xs">Email</p><p className="text-white font-medium">garv.variya@gmail.com</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Phone size={20} className="text-blue-400" /></div>
                  <div><p className="text-gray-400 text-xs">Phone</p><p className="text-white font-medium">+91 98765 43210</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><MapPin size={20} className="text-blue-400" /></div>
                  <div><p className="text-gray-400 text-xs">Location</p><p className="text-white font-medium">Surat, Gujarat, India</p></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#64ffda]/5 border border-[#64ffda]/10 mb-8">
                <p className="text-[#64ffda] text-sm font-medium">Open to full-time & freelance opportunities</p>
              </div>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <motion.a key={i} href={s.href} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#64ffda] hover:bg-[#64ffda]/10 transition-all duration-300 cursor-pointer" aria-label={s.label}>
                    <s.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <div className="space-y-5">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Subject</label>
                  <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Project inquiry" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Message</label>
                  <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" placeholder="Tell me about your project..." />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 relative overflow-hidden group cursor-pointer">
                  <span className="relative z-10">{sent ? 'Message Sent!' : 'Send Message'}</span>
                  {!sent && <Send size={16} className="relative z-10" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  return (
    <footer className="bg-[#060d1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm font-[Space_Grotesk]">GV</div>
              <span className="font-[Space_Grotesk] font-semibold text-lg text-white">Garv Variya</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Building the web, one component at a time.</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {['About', 'Projects', 'Contact'].map(l => (
              <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">{l}</button>
            ))}
          </div>
          <div className="flex gap-3 justify-start md:justify-end">
            {[GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ scale: 1.15, y: -2 }} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#64ffda] hover:bg-[#64ffda]/10 transition-all cursor-pointer"><Icon size={18} /></motion.a>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">&copy; 2024 Garv Variya. Designed & Developed with React + Tailwind</p>
          <p className="text-gray-600 text-xs">Made with <span className="text-red-400">&#9829;</span> in Surat, India</p>
        </div>
      </div>
    </footer>
  );
}

// ==================== APP ====================

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Contact />
      <Footer />
    </div>
  );
}
