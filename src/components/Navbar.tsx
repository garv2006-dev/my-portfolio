import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { useScrollProgress, useActiveSection } from '../hooks';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

const resumeUrl = '../../public/images/My Resume.pdf';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();
  const activeSection = useActiveSection(navLinks.map((l) => l.id));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-dark shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <motion.button
              onClick={() => scrollTo('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm font-[Space_Grotesk] shadow-lg shadow-blue-500/25">
                GV
              </div>
              <span className={`font-[Space_Grotesk] font-semibold text-lg hidden sm:block transition-colors ${isScrolled ? 'text-white' : 'text-charcoal'}`}>
                Garv<span className="text-blue-500">.</span>
              </span>
            </motion.button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                    activeSection === link.id
                      ? isScrolled
                        ? 'text-cyan-accent'
                        : 'text-blue-500'
                      : isScrolled
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-charcoal'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                        isScrolled ? 'bg-cyan-accent' : 'bg-blue-500'
                      }`}
                    />
                  )}
                </button>
              ))}
              <motion.a
                href={resumeUrl}
                download="Garv_Variya_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-5 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-shadow cursor-pointer"
              >
                <Download size={14} />
                Resume
              </motion.a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled ? 'text-white hover:bg-white/10' : 'text-charcoal hover:bg-black/5'
              }`}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === link.id
                        ? 'text-cyan-accent bg-white/5'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href={resumeUrl}
                  download="Garv_Variya_Resume.pdf"
                  className="block w-full text-center mt-3 px-5 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer"
                >
                  Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
