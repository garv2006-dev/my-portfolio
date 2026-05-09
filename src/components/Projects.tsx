import { motion } from 'framer-motion';
import { ExternalLink, Check, ArrowRight } from 'lucide-react';

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
        <motion.div initial={{ opacity: 0, x: isEven ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className={isEven ? 'lg:order-1' : 'lg:order-2'}>
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
        </motion.div>

        <motion.div initial={{ opacity: 0, x: isEven ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className={isEven ? 'lg:order-2' : 'lg:order-1'}>
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
              <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm flex items-center gap-2 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">GitHub</motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-white">
      <div className="py-24 lg:py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">My work</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">Featured Projects</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">A selection of projects that showcase my skills and passion</p>
          </motion.div>
        </div>
      </div>
      {projects.map((p, i) => (<ProjectCard key={p.title} project={p} index={i} />))}
      <div className="py-16 text-center bg-[#F8FAFC]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 cursor-pointer">More on GitHub <ArrowRight size={16} /></motion.a>
        </motion.div>
      </div>
    </section>
  );
}