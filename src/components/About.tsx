import { motion } from 'framer-motion';
import { Code2, Brain, Globe, ShieldCheck, Check } from 'lucide-react';
import { useInView, useCountUp } from '../hooks';

export default function About() {
  const { ref, isInView } = useInView(0.2);
  const c1 = useCountUp(1, 1000, 0, isInView);
  const c2 = useCountUp(2, 2000, 0, isInView);
  const c3 = useCountUp(1, 2000, 0, isInView);
  const c4 = useCountUp(100, 2000, 0, isInView);

  const stats = [
    { value: `${c1}`, label: 'Project Built', icon: Code2 },
    { value: `${c2}`, label: 'Certifications', icon: ShieldCheck },
    { value: `${c3}+ Year`, label: 'Full-Stack Exp.', icon: Globe },
    { value: `${c4}%`, label: 'AI/ML Focus', icon: Brain },
  ];

  const traits = [
    'AI & Machine Learning foundations (Python, scikit-learn, TensorFlow, PyTorch)',
    'Generative AI, Prompt Engineering, RAG & LLM Tool Calling',
    'Full-stack Web Development (React.js, Next.js, Node.js, Express)',
    'Vector Databases & Search (MongoDB Vector Search, Firebase, PostgreSQL)',
    'Clean, maintainable code & CI/CD deployment (Vercel, Render, Railway)',
  ];

  return (
    <section id="about" className="relative py-12 sm:py-16 lg:py-20 bg-bg-secondary overflow-hidden section-snap transition-colors duration-300">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
          <span className="text-blue-500 font-semibold text-xs sm:text-sm tracking-widest uppercase">Get to know me</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">About Me</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center lg:items-start">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold font-[Space_Grotesk] shadow-xl shadow-blue-500/20 mb-6 animate-pulse-glow">GV</div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card-bg border border-card-border/80 shadow-sm rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-all">
                  <s.icon size={18} className="text-blue-500 mx-auto mb-1.5" />
                  <div className="text-xl sm:text-2xl font-bold text-text-primary font-[Space_Grotesk]">{s.value}</div>
                  <div className="text-[11px] sm:text-xs text-text-secondary mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-text-secondary leading-relaxed text-xs sm:text-sm mb-3">
              Hey! I'm <span className="font-semibold text-text-primary">Garv Variya</span> — an <span className="font-semibold text-blue-600 dark:text-blue-400">AI/ML Engineer & Full-Stack Developer</span> based in Surat, Gujarat. I completed my Bachelor of Computer Applications (BCA) from <span className="font-semibold text-text-primary">Vivekanand College, Surat</span>.
            </p>
            <p className="text-text-secondary leading-relaxed text-xs sm:text-sm mb-3">
              I specialize in bridging the gap between intelligent AI systems and modern full-stack web applications. My expertise spans Python data analysis, machine learning foundations (scikit-learn, TensorFlow, PyTorch), and Generative AI (LLM application development, RAG, prompt engineering, LangChain, MongoDB Vector Search, and tool calling).
            </p>
            <p className="text-text-secondary leading-relaxed text-xs sm:text-sm mb-5">
              Backed by 1+ year of professional full-stack development experience at Pixeldart Software Services, I build scalable web applications using React.js, Next.js, Node.js, REST APIs, Clerk Auth, Firebase, and MongoDB with production deployments on Vercel, Render, Railway, and Netlify.
            </p>

            <h3 className="font-semibold text-text-primary text-base sm:text-lg mb-3 font-[Space_Grotesk]">What I bring to the table</h3>
            <div className="space-y-2">
              {traits.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-blue-600 dark:text-blue-400" /></div>
                  <span className="text-text-primary font-medium text-xs sm:text-sm">{t}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}