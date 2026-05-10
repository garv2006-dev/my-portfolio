import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';
import type { IconType } from 'react-icons';
import { VscVscode } from 'react-icons/vsc';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiGithub,
  SiPostman,
  SiVercel,
  SiNetlify,
  SiRender,
} from 'react-icons/si';

const skillCategories = {
  Frontend: {
    color: 'from-blue-400 to-blue-600',
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Tailwind CSS'],
  },
  Backend: {
    color: 'from-green-400 to-green-600',
    skills: ['Node.js', 'Express.js', 'REST API', 'GraphQL (basic)'],
  },
  Databases: {
    color: 'from-purple-400 to-purple-600',
    skills: ['PostgreSQL', 'MongoDB', 'Firebase (Realtime DB + Firestore)'],
  },
  Tools: {
    color: 'from-orange-400 to-orange-600',
    skills: ['Git & GitHub', 'VS Code', 'Postman', 'Vercel', 'Netlify', 'Render'],
  },
};

const skillIconMap: Record<string, { icon: IconType; color: string }> = {
  'HTML5': { icon: SiHtml5, color: '#E34F26' },
  'CSS3': { icon: SiCss, color: '#1572B6' },
  'JavaScript (ES6+)': { icon: SiJavascript, color: '#F7DF1E' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#38B2AC' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'Express.js': { icon: SiExpress, color: '#000000' },
  'REST API': { icon: Code2, color: '#7C3AED' },
  'GraphQL (basic)': { icon: SiGraphql, color: '#E535AB' },
  'PostgreSQL': { icon: SiPostgresql, color: '#336791' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Firebase (Realtime DB + Firestore)': { icon: SiFirebase, color: '#FFCA28' },
  'Git & GitHub': { icon: SiGithub, color: '#181717' },
  'VS Code': { icon: VscVscode, color: '#007ACC' },
  'Postman': { icon: SiPostman, color: '#FF6C37' },
  'Vercel': { icon: SiVercel, color: '#000000' },
  'Netlify': { icon: SiNetlify, color: '#00C7B7' },
  'Render': { icon: SiRender, color: '#000000' },
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState('Frontend');
  const cat = skillCategories[activeTab as keyof typeof skillCategories];

  return (
    <section id="skills" className="relative py-24 lg:py-32 bg-white overflow-hidden section-snap">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-blue-500 font-medium text-sm tracking-widest uppercase">What I know</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-[#111827] mt-3">My Tech Stack</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">Technologies I work with professionally</p>
        </motion.div>

        <div className="grid gap-16">
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.keys(skillCategories).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab}</button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cat.skills.map((skill, i) => {
                  const entry = skillIconMap[skill];
                  const Icon = entry?.icon ?? Code2;
                  const iconColor = entry?.color ?? '#4B5563';
                  return (
                    <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-light rounded-xl p-4 text-center group cursor-default">
                      <div className="w-12 h-12 rounded-2xl bg-white mx-auto mb-2 flex items-center justify-center p-2 shadow-sm">
                        <Icon color={iconColor} size={26} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}