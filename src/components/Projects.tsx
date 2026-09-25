import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Check, ArrowRight, Bot, Database, Sparkles, Lock, Maximize2, X, Globe } from 'lucide-react';

interface Project {
  title: string;
  subtitle: string;
  desc: string;
  type?: string;
  tech: string[];
  features: string[];
  // badge: string;
  gradient: string;
  icon?: React.ReactNode | string;
  image?: string;
  imageFit?: 'cover' | 'contain' | 'fill';
  imagePosition?: string;
  imageAspect?: string;
  liveLink?: string;
  period?: string;
}

const projects: Project[] = [
  {
    title: 'Nexus AI — Full-Stack AI Chat & Collaborative Workspace Platform',
    subtitle: 'AI Chat & Team Knowledge Workspace Platform',
    desc: 'Designed and developed an end-to-end AI chat and team knowledge platform featuring Retrieval-Augmented Generation (RAG) with FlashRank re-ranking, multi-format document indexing (PDF, DOCX, TXT), collaborative team workspaces, Clerk authentication, Stripe subscription management, and real-time streaming AI interactions.',
    type: 'AI + Full-Stack Platform',
    period: 'Jan 2026 – Present',
    tech: [
      'React.js',
      'FastAPI',
      'Python',
      'Google Gemini LLM',
      'LangChain',
      'FlashRank',
      'RAG',
      'Supabase / PostgreSQL',
      'Clerk Auth',
      'Stripe API',
      'Tailwind CSS',
      'REST APIs',
    ],
    features: [
      'Implemented Retrieval-Augmented Generation (RAG): Context-aware AI responses using vector embeddings, document chunking, and FlashRank re-ranking for ultra-precise retrieval',
      'Integrated Google Gemini & OpenAI LLMs: Streaming AI responses, customizable safety guardrails, and persistent multi-turn chat sessions',
      'Collaborative Team Workspaces & RBAC: Built workspaces supporting role-based access control (Admin, Member, Viewer), team member management, and email invitation workflows',
      'High-Performance Document Engine: Multi-format document parser (PDF, DOCX, TXT) with semantic text splitting and instant search indexing',
      'Billing & Credit System: Integrated Stripe payment gateway supporting subscription tiers, webhook processing, and token usage tracking',
      'Enterprise Security & Auth: Verified authentication using Clerk JWKS public key verification and backend authorization middleware',
      'Modern React UI/UX: Built with React 18, Vite, Tailwind CSS v4, Framer Motion animations, markdown rendering, and syntax highlighting',
    ],
    // badge: 'Present AI Platform',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    image: '/images/nexus.png',
    imageFit: 'cover',
    imagePosition: 'top',
    imageAspect: 'aspect-[16/10]',
    liveLink: 'https://nexus-frontend-eight-iota.vercel.app',
  },
  {
    title: 'Emotion AI — Real-Time NLP Emotion Classifier',
    subtitle: 'Real-Time Text Emotion Tone Classifier',
    desc: 'An interactive full-stack NLP application that analyzes user text and predicts its dominant emotional tone in real time. The system combines TF-IDF feature extraction with Logistic Regression and presents probability scores for six emotion classes through a responsive Flask interface.',
    type: 'NLP & Machine Learning System',
    period: 'Jan 2026 – Present',
    tech: [
      'Python',
      'Flask',
      'scikit-learn',
      'TF-IDF',
      'Logistic Regression',
      'REST API',
      'HTML5',
      'CSS3',
      'JavaScript',
      'Docker',
    ],
    features: [
      'Built a real-time text classification workflow for anger, fear, joy, love, sadness, and surprise',
      'Implemented a REST API with prediction, health-check, and example-prompt endpoints',
      'Added probability-based results so users can inspect the complete emotion distribution, not only the top prediction',
      'Designed a responsive glassmorphism interface with sample prompts, loading states, retry handling, and model status feedback',
      'Added safe model loading with automatic TF-IDF and Logistic Regression fallback training when serialized artifacts are unavailable',
      'Containerized the application for deployment with Docker and Render',
    ],
    // badge: 'Present ML Project',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    image: '/images/emotion.png',
    imageFit: 'cover',
    imagePosition: 'top',
    imageAspect: 'aspect-[16/10]',
    liveLink: 'https://emotion-ai-7xw8.onrender.com/',
  },
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
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    image: '/images/hotel.png',
    imageFit: 'cover',
    imagePosition: 'top',
    imageAspect: 'aspect-[16/10]',
    liveLink: 'https://www.luxuryhotelrooms.site/',
  },
];

const getDomainName = (url?: string) => {
  if (!url) return 'localhost:3000';
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
};

function ProjectCard({
  project,
  index,
  onOpenLightbox,
}: {
  project: Project;
  index: number;
  onOpenLightbox: (imgUrl: string, title: string, liveLink?: string) => void;
}) {
  const isEven = index % 2 === 0;
  const domain = getDomainName(project.liveLink);

  return (
    <div className="py-8 sm:py-14 section-snap">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        {/* IMAGE / MOCKUP CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={isEven ? 'lg:order-1' : 'lg:order-2'}
        >
          <motion.div whileHover={{ scale: 1.01, y: -3 }} transition={{ duration: 0.3 }} className="relative group">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-card-border/80 bg-slate-950">
              {/* Browser Header Bar */}
              <div className="py-2 px-3 sm:px-4 bg-slate-900/95 border-b border-slate-800/80 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/90 border border-red-600/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/90 border border-yellow-600/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/90 border border-green-600/40" />
                </div>

                <div className="bg-slate-950/90 border border-slate-800/80 rounded-md px-2.5 py-0.5 sm:py-1 text-[11px] text-slate-300 font-mono flex items-center gap-1.5 max-w-[140px] xs:max-w-[200px] sm:max-w-[280px] truncate shadow-inner">
                  <Lock size={11} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-500 text-[10px] hidden xs:inline">https://</span>
                  <span className="truncate font-medium">{domain}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <Globe size={13} className="hidden sm:block text-slate-400" />
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      title="Open Live Website"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Crisp Image Container */}
              <div
                className={`relative ${project.imageAspect || 'aspect-[16/10]'
                  } overflow-hidden bg-slate-900 flex items-center justify-center`}
              >
                {project.image ? (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={{
                        objectFit: project.imageFit || 'cover',
                        objectPosition: project.imagePosition || 'top',
                      }}
                    />

                    {/* Glassmorphism Action Overlay on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-950/60 backdrop-blur-[2px] flex flex-col sm:flex-row items-center justify-center gap-3 p-4">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 cursor-pointer"
                        >
                          <ExternalLink size={14} /> Visit Live Project
                        </a>
                      )}
                      <button
                        onClick={() => onOpenLightbox(project.image!, project.title, project.liveLink)}
                        className="px-4 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/50 text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 cursor-pointer"
                      >
                        <Maximize2 size={14} /> Full View
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${project.gradient}`}
                  >
                    <div className="flex justify-center gap-2 mb-3">
                      <span className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20">
                        <Bot size={20} />
                      </span>
                      <span className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20">
                        <Database size={20} />
                      </span>
                      <span className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20">
                        <Sparkles size={20} />
                      </span>
                    </div>
                    <div className="text-white font-bold text-xl sm:text-2xl font-[Space_Grotesk] drop-shadow-md">
                      {project.title}
                    </div>
                    <div className="text-cyan-200 text-xs sm:text-sm mt-1 font-medium">{project.subtitle}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* DETAILS SIDE */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={isEven ? 'lg:order-2' : 'lg:order-1'}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-blue-500 font-semibold text-xs tracking-widest uppercase">
                Present Project
              </span>
              {project.period && (
                <span className="text-[11px] text-text-secondary px-2.5 py-0.5 rounded-full bg-card-bg border border-card-border/80 font-medium">
                  {project.period}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-[Space_Grotesk] text-text-primary mb-2.5 leading-snug">
              {project.title}
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4 text-xs sm:text-sm">{project.desc}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-[11px] font-medium rounded-md border border-blue-100/50 dark:border-blue-900/30"
                >
                  {t}
                </span>
              ))}
            </div>

            <ul className="space-y-2 mb-6">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-text-secondary text-xs sm:text-sm">
                  <Check size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
              {project.liveLink && (
                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer text-center"
                >
                  <ExternalLink size={14} /> Visit Live Demo
                </motion.a>
              )}
              {project.image && (
                <motion.button
                  onClick={() => onOpenLightbox(project.image!, project.title, project.liveLink)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-card-bg hover:bg-card-border/30 text-text-primary border border-card-border rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                >
                  <Maximize2 size={14} className="text-blue-500" /> Full Screenshot
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [lightbox, setLightbox] = useState<{ url: string; title: string; liveLink?: string } | null>(null);

  return (
    <section id="projects" className="relative bg-bg-primary transition-colors duration-300">
      <div className="py-12 sm:py-16 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <span className="text-blue-500 font-semibold text-xs sm:text-sm tracking-widest uppercase">
              My Work & AI Systems
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">
              Present Projects
            </h2>
            <p className="text-text-secondary mt-2 text-xs sm:text-sm max-w-lg mx-auto">
              Production web applications & AI/ML powered platforms built with modern technology
            </p>
          </motion.div>
        </div>
      </div>

      {projects.map((p, i) => (
        <ProjectCard
          key={p.title}
          project={p}
          index={i}
          onOpenLightbox={(url, title, liveLink) => setLightbox({ url, title, liveLink })}
        />
      ))}

      <div className="py-10 text-center bg-bg-secondary">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.a
            href="https://github.com/garv2006-dev"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Explore More on GitHub <ArrowRight size={15} />
          </motion.a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header */}
              <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4 className="text-white font-semibold text-sm truncate font-[Space_Grotesk]">
                    {lightbox.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  {lightbox.liveLink && (
                    <a
                      href={lightbox.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink size={12} /> Visit Site
                    </a>
                  )}
                  <button
                    onClick={() => setLightbox(null)}
                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close Preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Body */}
              <div className="flex-1 overflow-auto p-2 sm:p-4 bg-slate-950 flex items-center justify-center">
                <img
                  src={lightbox.url}
                  alt={lightbox.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
