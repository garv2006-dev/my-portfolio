import { motion } from 'framer-motion';
import { ExternalLink, Check, ArrowRight } from 'lucide-react';

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
}

const projects: Project[] = [
  { title: 'Luxury Hotel Website', subtitle: 'Modern Hotel Booking UI', desc: 'A modern hotel booking web app with room listings, online reservations, secure payment integration, user authentication, and an admin dashboard.', type: 'Hotel Website', tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'JWT Auth'], features: ['Online booking system', 'Payment gateway integration', 'Responsive design', 'Room filtering'], badge: 'Hospitality', gradient: 'from-blue-500 to-cyan-400', image: 'https://images.unsplash.com/photo-1501117716987-c8e6d71b5d65?auto=format&fit=crop&w=1200&q=80', liveLink: 'https://www.luxuryhotelrooms.site/' },
  // { title: 'Pave', subtitle: 'Workspace Collaboration Platform', desc: 'A collaborative workspace management web app with calendar integration, meeting scheduling, task management, secure authentication, and workspace creation features.', type: 'Workspace App', tech: ['React JS', 'Nest JS', 'PostgreSQL', 'Tailwind CSS', 'Auth System'], features: ['Calendar & meeting scheduling', 'Task management system', 'Workspace creation & collaboration', 'Responsive design'], badge: 'Collaboration', gradient: 'from-sky-500 to-indigo-500', icon: '🧩', image: 'https://images.unsplash.com/photo-1581091012184-13f81ff8455a?auto=format&fit=crop&w=1200&q=80', liveLink: 'https://app.pave.sh/' },
];
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="min-h-screen flex items-center py-16 section-snap">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'direction-rtl'}`}>
        <motion.div initial={{ opacity: 0, x: isEven ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className={isEven ? 'lg:order-1' : 'lg:order-2'}>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }} className="relative group">
            <div
              className={`aspect-[4/3] rounded-xl p-1 shadow-2xl overflow-hidden ${project.image ? '' : `bg-gradient-to-br ${project.gradient}`}`}
              style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              <div className={`w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden ${project.image ? 'bg-black/35' : 'bg-gray-900/90'}`}>
                {project.image && <div className="absolute inset-0 bg-black/30" />}
                <div className="relative text-center z-10 px-4 py-6">
                  {/* <div className="text-6xl mb-4">{project.icon}</div> */}
                  <div className="text-white font-bold text-2xl font-[Space_Grotesk]">{project.title}</div>
                  <div className="text-gray-200 text-sm mt-1">{project.subtitle}</div>
                  {project.type && <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-white/10 text-white text-xs uppercase tracking-[0.18em] font-semibold">{project.type}</div>}
                </div>
                {!project.image && <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)` }} />}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
            <div className={`absolute -top-3 ${isEven ? '-right-3' : '-left-3'} px-4 py-1.5 rounded-full bg-gradient-to-r ${project.gradient} text-white text-xs font-bold shadow-lg`}>{project.badge}</div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: isEven ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className={isEven ? 'lg:order-2' : 'lg:order-1'}>
          <div>
            <span className="text-blue-500 font-medium text-sm">Featured Project</span>
            <h3 className="text-3xl sm:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2 mb-4">{project.title}</h3>
            <p className="text-text-secondary leading-relaxed mb-6">{project.desc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                  {t}
                </span>
              ))}
            </div>
            <ul className="space-y-2 mb-8">
              {project.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-text-secondary text-sm"><Check size={14} className="text-blue-500 flex-shrink-0" />{f}</li>
              ))}
            </ul>
            <div className="flex gap-4">
              <motion.a href={project.liveLink || '#'} target={project.liveLink ? '_blank' : undefined} rel={project.liveLink ? 'noreferrer' : undefined} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"><ExternalLink size={14} />Live Demo</motion.a>
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
      <div className="py-24 lg:py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">My work</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-text-primary mt-3">Featured Projects</h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">A selection of projects that showcase my skills and passion</p>
          </motion.div>
        </div>
      </div>
      {projects.map((p, i) => (<ProjectCard key={p.title} project={p} index={i} />))}
      <div className="py-16 text-center bg-bg-secondary">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.a href="https://github.com/garv2006-dev" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 cursor-pointer">More on GitHub <ArrowRight size={16} /></motion.a>
        </motion.div>
      </div>
    </section>
  );
}