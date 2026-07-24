import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useScrollProgress, useActiveSection } from '../hooks';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();
  const activeSection = useActiveSection(navLinks.map((l) => l.id));

  // Theme state initialization with localStorage & system preference fallback
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;

      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return systemPreference;
    }
    return 'light';
  });

  // Apply theme class on load / toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Standard offset to align perfectly with section headers, considering the floating navbar
    const headerOffset = 90;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar at the absolute top */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Navbar Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 py-4 pointer-events-none sm:px-6 lg:px-8">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-4xl h-14 px-6 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/20"
        >
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm font-[Space_Grotesk] shadow-lg shadow-blue-500/25 overflow-hidden group">
              <span className="relative z-10">GV</span>
              {/* Premium Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
            <span className="font-[Space_Grotesk] font-bold text-lg hidden sm:block transition-colors duration-500 tracking-wide text-white">
              Garv
            </span>
          </motion.button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`group relative px-4.5 py-2 text-sm font-semibold rounded-full transition-colors duration-500 cursor-pointer ${isActive
                    ? 'text-cyan-accent'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {/* Sliding Active Highlight Capsule */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full -z-10 border bg-white/10 border-white/10 shadow-md shadow-black/10 transition-all duration-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Soft Pointer Hover Capsule */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full -z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/5" />
                  )}

                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}

            {/* Premium Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white cursor-pointer transition-colors duration-300 flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-400 stroke-[2.5]" />
              ) : (
                <Moon size={16} className="text-blue-300 stroke-[2.5]" />
              )}
            </motion.button>

          </div>

          {/* Mobile Animated Hamburger Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-full transition-colors duration-500 cursor-pointer text-white hover:bg-white/10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 6.25 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ originX: '12px', originY: '6px' }}
              />
              <motion.line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -6.25 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ originX: '12px', originY: '18px' }}
              />
            </svg>
          </button>
        </motion.nav>
      </div>

      {/* Floating Mobile Dropdown Menu Card */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 right-4 z-40 md:hidden p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-500 pointer-events-auto top-20 bg-slate-950/90 border-white/10 shadow-black/40"
          >
            <div className="space-y-1.5">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${isActive
                      ? 'text-cyan-accent bg-white/10 border border-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </motion.button>
                );
              })}

              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="w-full flex items-center justify-center gap-2 mt-3 px-5 py-3 text-sm font-semibold rounded-xl border border-white/10 bg-white/10 text-white shadow-lg hover:bg-white/15 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={16} className="text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-blue-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
