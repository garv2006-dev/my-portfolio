import { motion } from 'framer-motion';
import { Award, CheckCircle2, Calendar, Building2, ShieldCheck } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  platform?: string;
  date: string;
  validity?: string;
  badge: string;
  gradient: string;
  description: string;
  skills: string[];
}

const certifications: Certification[] = [
  {
    title: 'Oracle Certified Foundations Associate — Agentic AI',
    issuer: 'Oracle University',
    date: 'Jul 2026 – Jul 2028',
    validity: '2 Years Validity',
    badge: 'Agentic AI',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    description: 'Certified in Agentic AI foundations, autonomous agent workflows, LLM tool integration, prompt engineering, and enterprise AI solution architecture.',
    skills: ['Agentic AI', 'LLM Integration', 'AI Foundations', 'Prompt Engineering', 'Autonomous Workflows'],
  },
  {
    title: 'AI – Data Engineering Analyst',
    issuer: 'NASSCOM',
    platform: 'Skill India Digital Hub',
    date: 'Jul 2026',
    validity: 'Certificate of Participation',
    badge: 'AI & Data Eng',
    gradient: 'from-blue-500 via-indigo-500 to-cyan-500',
    description: 'Comprehensive certification in data engineering pipelines, data analysis with Python (Pandas/NumPy), machine learning workflows, and data preprocessing.',
    skills: ['Data Engineering', 'Python Data Analysis', 'ML Pipelines', 'Data Preprocessing'],
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-12 sm:py-16 lg:py-20 bg-bg-primary overflow-hidden section-snap transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-56 sm:w-72 h-56 sm:h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-blue-500 font-semibold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Award size={15} className="text-blue-500" /> Professional Credentials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">
            Certifications & Recognition
          </h2>
          <p className="text-text-secondary mt-2 text-xs sm:text-sm max-w-lg mx-auto">
            Industry-recognized credentials validating expertise in Agentic AI, Machine Learning, and Data Engineering
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-card-bg border border-card-border/80 shadow-sm rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-500/40 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cert.gradient}`} />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform duration-300">
                    <ShieldCheck size={20} className="text-blue-500" />
                  </div>
                  <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${cert.gradient} shadow-sm`}>
                    {cert.badge}
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-base sm:text-lg font-bold text-text-primary font-[Space_Grotesk] group-hover:text-blue-500 dark:group-hover:text-cyan-accent transition-colors duration-300 mb-1.5 leading-snug">
                  {cert.title}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-text-secondary mb-3">
                  <span className="flex items-center gap-1 font-medium text-text-primary">
                    <Building2 size={13} className="text-blue-500 flex-shrink-0" />
                    {cert.issuer} {cert.platform ? `(${cert.platform})` : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-blue-500 flex-shrink-0" />
                    {cert.date}
                  </span>
                </div>

                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                  {cert.description}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/30 flex items-center gap-1"
                    >
                      <CheckCircle2 size={11} className="text-blue-500 flex-shrink-0" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer / Status */}
              <div className="pt-3 border-t border-card-border/60 flex items-center justify-between text-[11px] text-text-secondary">
                <span className="font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Credential
                </span>
                {cert.validity && (
                  <span className="text-text-secondary font-medium">{cert.validity}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
