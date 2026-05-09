import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Code2, Database, Wrench } from 'lucide-react';
import { useInView } from '../hooks';

const skillCategories = {
  Frontend: { icon: Layout, color: 'from-blue-400 to-blue-600', skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Tailwind CSS'] },
  Backend: { icon: Code2, color: 'from-green-400 to-green-600', skills: ['Node.js', 'Express.js', 'REST API', 'GraphQL (basic)'] },
  Databases: { icon: Database, color: 'from-purple-400 to-purple-600', skills: ['PostgreSQL', 'MongoDB', 'Firebase (Realtime DB + Firestore)'] },
  Tools: { icon: Wrench, color: 'from-orange-400 to-orange-600', skills: ['Git & GitHub', 'VS Code', 'Postman', 'Vercel', 'Netlify', 'Figma (basic)'] },
};

const topSkills = [
  { name: 'HTML', pct: 90, color: '#E34F26' },
  { name: 'CSS', pct: 85, color: '#1572B6' },
  { name: 'JavaScript', pct: 88, color: '#F7DF1E' },
  { name: 'React', pct: 85, color: '#61DAFB' },
  { name: 'Node.js', pct: 80, color: '#339933' },
  { name: 'MongoDB', pct: 75, color: '#47A248' },
];

function SkillBar({ name, pct, color, delay, inView }: { name: string; pct: number; color: string; delay: number; inView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-500">{pct}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color, width: inView ? `${pct}%` : '0%' }} transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('Frontend');
  const { ref, isInView } = useInView(0.1);
  const cat = skillCategories[activeTab as keyof typeof skillCategories];

  return (
    <section id="skills" className="relative py-24 lg:py-32 bg-white overflow-hidden section-snap">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">What I know</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">My Tech Stack</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">Technologies I work with professionally</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.keys(skillCategories).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab}</button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.skills.map((skill, i) => (
                  <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-light rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} mx-auto mb-2 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <cat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#111827] mb-6 font-[Space_Grotesk]">Proficiency</h3>
            {topSkills.map((s, i) => (<SkillBar key={s.name} {...s} delay={i * 0.1} inView={isInView} />))}
          </div>
        </div>
      </div>
    </section>
  );
}