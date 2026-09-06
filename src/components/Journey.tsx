import { motion } from 'framer-motion';

const timeline = [
  {
    year: 'Jun 2025 – Jun 2026',
    title: 'Full-Stack Developer — Pixeldart Software Services',
    location: 'Surat, India',
    desc: 'Engineered responsive web applications for 5+ client projects, built 20+ reusable React components, integrated REST APIs, implemented Clerk Auth, user onboarding workflows, and team collaboration modules. Managed CI/CD deployments to Vercel, Netlify, Render, and Railway.',
    color: 'from-blue-500 to-indigo-600',
    type: 'Work Experience',
  },
  {
    year: '2025 – Present',
    title: 'AI/ML Engineering & Generative AI',
    desc: 'Self-directed study and practical implementation of Machine Learning, Deep Learning (TensorFlow, PyTorch, scikit-learn), and LLM Applications (LangChain, RAG, MongoDB Vector Search, Prompt Engineering, Tool Calling).',
    color: 'from-purple-500 to-pink-600',
    type: 'Specialization',
  },
  {
    year: 'Jun 2023 – Apr 2026',
    title: 'BCA — Vivekanand College, Surat',
    desc: 'Bachelor of Computer Applications. Relevant coursework: Programming Concepts, Web Development, Database Management, Software Engineering, and Data Structures.',
    color: 'from-cyan-400 to-blue-600',
    type: 'Education',
  },
  {
    year: 'Jul 2026',
    title: 'Oracle & NASSCOM Certifications',
    desc: 'Earned Oracle Certified Foundations Associate in Agentic AI (Oracle University) and AI – Data Engineering Analyst certification (NASSCOM / Skill India Digital Hub).',
    color: 'from-amber-400 to-orange-600',
    type: 'Certifications',
  },
  {
    year: 'Present',
    title: 'Actively Seeking AI/ML & Full-Stack Roles',
    desc: 'Entry-level AI/ML Engineer and Full-Stack Developer passionate about building intelligent LLM applications, RAG systems, and high-performance web platforms.',
    color: 'from-emerald-400 to-teal-600',
    type: 'Career Goal',
  },
];

export default function Journey() {
  return (
    <section id="journey" className="relative py-12 sm:py-16 lg:py-20 bg-bg-secondary overflow-hidden section-snap transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
          <span className="text-blue-600 font-semibold text-xs sm:text-sm tracking-widest uppercase">My Path & Experience</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">Experience & Education</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500 md:-translate-x-px" />

          {timeline.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`relative flex items-start mb-8 sm:mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block md:w-1/2" />
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-4 border-timeline-dot-border -translate-x-1/2 mt-5 z-10 shadow-md shadow-blue-500/40 transition-all duration-300" />
              <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:text-right'}`}>
                <motion.div whileHover={{ scale: 1.01, y: -2 }} className="bg-card-bg border border-card-border/80 shadow-sm rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
                  <div className={`flex items-center gap-1.5 flex-wrap mb-1.5 ${i % 2 === 0 ? '' : 'md:justify-end'}`}>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white text-[11px] font-bold`}>{item.year}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/30">{item.type}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary font-[Space_Grotesk] mb-1">{item.title}</h3>
                  {item.location && <p className="text-xs font-medium text-blue-500 mb-1.5">{item.location}</p>}
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}