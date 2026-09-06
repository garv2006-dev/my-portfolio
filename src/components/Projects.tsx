import { motion } from 'framer-motion';
import { ExternalLink, Check, ArrowRight, Bot, Database, Sparkles } from 'lucide-react';

interface Project {
  title: string;
  subtitle: string;
  desc: string;
  type?: string;
  tech: string[];
  features: string[];
  badge: string;
  gradient: string;
  icon?: React.ReactNode | string;
  image?: string;
  liveLink?: string;
  period?: string;
}

const projects: Project[] = [
  {
    title: 'Luxury Hotels — AI-Powered Full-Stack Hotel Booking System',
    subtitle: 'AI-Powered Hotel Booking & RAG Platform',
    desc: 'Designed and developed an end-to-end hotel booking platform featuring an AI Assistant powered by Google Gemini LLM, Retrieval-Augmented Generation (RAG), MongoDB Vector Search, and function tool calling to handle intelligent room recommendations and reservation workflows.',
    type: 'AI + Full-Stack Application',
    period: 'Nov 2025 – Feb 2026',
    tech: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB Vector Search',
      'Google Gemini LLM',
      'RAG',
      'Tool Calling',
      'LangChain',
      'Tailwind CSS',
      'REST APIs',
    ],
    features: [
      'Implemented Retrieval-Augmented Generation (RAG) for context-aware responses using hotel application data',
      'Integrated Google LLM (Gemini) for AI response generation and intelligent user support',
      'Implemented MongoDB Vector Search as a vector database for storing and retrieving document embeddings for RAG',
      'Built tool calling mechanism to allow LLM to invoke backend room search & booking functions based on user queries',
      'Developed REST APIs to manage hotels, room availability, bookings, and secure user authentication',
      'Designed responsive UI using HTML5, CSS3, JavaScript, and React.js with mobile-first principles',
    ],
    badge: 'Present AI Project',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    image: 'https://images.unsplash.com/photo-1501117716987-c8e6d71b5d65?auto=format&fit=crop&w=1200&q=80',
    liveLink: 'https://www.luxuryhotelrooms.site/',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="py-10 sm:py-14 section-snap">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isEven ? '' : 'direction-rtl'}`}>
        <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={isEven ? 'lg:order-1' : 'lg:order-2'}>
          <motion.div whileHover={{ scale: 1.01, y: -3 }} transition={{ duration: 0.3 }} className="relative group">
            <div
              className={`aspect-[4/3] rounded-xl p-1 shadow-lg overflow-hidden border border-card-border/80 ${project.image ? '' : `bg-gradient-to-br ${project.gradient}`}`}
              style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              <div className={`w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden ${project.image ? 'bg-black/50' : 'bg-gray-900/90'}`}>
                {project.image && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />}
                <div className="relative text-center z-10 px-4 sm:px-6 py-6">
                  <div className="flex justify-center gap-2 mb-2">
                    <span className="p-1.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30"><Bot size={18} /></span>
                    <span className="p-1.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-400/30"><Database size={18} /></span>
                    <span className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"><Sparkles size={18} /></span>
                  </div>
                  <div className="text-white font-bold text-xl sm:text-2xl font-[Space_Grotesk] leading-tight">{project.title}</div>
                  <div className="text-cyan-300 text-xs sm:text-sm mt-1.5 font-medium">{project.subtitle}</div>
                  {project.type && <div className="mt-3 inline-flex px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-white text-[11px] uppercase tracking-wider font-semibold">{project.type}</div>}
                </div>
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
            <div className={`absolute -top-2.5 ${isEven ? '-right-2.5' : '-left-2.5'} px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} text-white text-[11px] font-bold shadow-md`}>{project.badge}</div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={isEven ? 'lg:order-2' : 'lg:order-1'}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-blue-500 font-semibold text-xs tracking-widest uppercase">Present Project</span>
              {project.period && <span className="text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-card-bg border border-card-border/80">{project.period}</span>}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-[Space_Grotesk] text-text-primary mb-2.5 leading-snug">{project.title}</h3>
            <p className="text-text-secondary leading-relaxed mb-4 text-xs sm:text-sm">{project.desc}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.map(t => (
                <span key={t} className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-[11px] font-medium rounded-md border border-blue-100/50 dark:border-blue-900/30">
                  {t}
                </span>
              ))}
            </div>

            <ul className="space-y-2 mb-6">
              {project.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-text-secondary text-xs sm:text-sm">
                  <Check size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <motion.a href={project.liveLink || '#'} target={project.liveLink ? '_blank' : undefined} rel={project.liveLink ? 'noreferrer' : undefined} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer">
                <ExternalLink size={14} /> Visit luxuryhotelrooms.site
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-bg-primary transition-colors duration-300">
      <div className="py-12 sm:py-16 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4">
            <span className="text-blue-500 font-semibold text-xs sm:text-sm tracking-widest uppercase">My Work & AI Systems</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">Present Projects</h2>
            <p className="text-text-secondary mt-2 text-xs sm:text-sm max-w-lg mx-auto">Production web applications & AI/ML powered platforms built with modern technology</p>
          </motion.div>
        </div>
      </div>
      {projects.map((p, i) => (<ProjectCard key={p.title} project={p} index={i} />))}
      <div className="py-10 text-center bg-bg-secondary">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.a href="https://github.com/garv2006-dev" target="_blank" rel="noreferrer" whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 cursor-pointer">
            Explore More on GitHub <ArrowRight size={15} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}