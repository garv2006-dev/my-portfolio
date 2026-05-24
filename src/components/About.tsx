import { motion } from 'framer-motion';
import { Code2, Layout, Globe, Hash, Check } from 'lucide-react';
import { useInView, useCountUp } from '../hooks';

export default function About() {
  const { ref, isInView } = useInView(0.2);
  const c1 = useCountUp(10, 2000, 0, isInView);
  const c2 = useCountUp(5, 2000, 0, isInView);
  const c3 = useCountUp(2026, 2000, 0, isInView);
  const c4 = useCountUp(100, 2000, 0, isInView);

  const stats = [
    { value: `${c1}+`, label: 'Projects Built', icon: Code2 },
    { value: `${c2}+`, label: 'Tech Stacks', icon: Layout },
    { value: `${c3}`, label: 'BCA Graduate', icon: Globe },
    { value: `${c4}%`, label: 'Dedication', icon: Hash },
  ];

  const traits = ['Clean, maintainable code', 'Full-stack problem solving', 'Pixel-perfect UI implementation', 'Fast learner & team collaborator'];

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden section-snap transition-colors duration-300">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-blue-500 font-semibold text-sm tracking-widest uppercase">Get to know me</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-text-primary mt-3">About Me</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col items-center lg:items-start">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white text-6xl font-bold font-[Space_Grotesk] shadow-2xl shadow-blue-500/30 mb-8 animate-pulse-glow">GV</div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card-bg border border-card-border shadow-sm shadow-card-shadow rounded-xl p-4 text-center hover:shadow-lg transition-all">
                  <s.icon size={20} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary font-[Space_Grotesk]">{s.value}</div>
                  <div className="text-xs text-text-secondary mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="">
            <p className="text-text-secondary leading-relaxed text-base mb-4">Hey! I'm <span className="font-semibold text-text-primary">Garv Variya</span> — a passionate Full-Stack Developer based in Surat, Gujarat. I completed my Bachelor of Computer Applications (BCA) from <span className="font-semibold text-blue-600 dark:text-blue-400">Vivekananda College, Surat</span>, where I discovered my deep love for building things on the web.</p>
            <p className="text-text-secondary leading-relaxed text-base mb-4">I specialize in crafting end-to-end web applications — from pixel-perfect frontends with React and Tailwind CSS to robust backends powered by Node.js, PostgreSQL, MongoDB, and Firebase.</p>
            <p className="text-text-secondary leading-relaxed text-base mb-6">What drives me? Turning complex problems into elegant, user-friendly solutions. I believe great software is not just functional — it's beautiful, fast, and intuitive.</p>

            <h3 className="font-semibold text-text-primary text-lg mb-4 font-[Space_Grotesk]">What I bring to the table</h3>
            <div className="space-y-3">
              {traits.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"><Check size={14} className="text-blue-600 dark:text-blue-400" /></div>
                  <span className="text-text-primary font-medium">{t}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}