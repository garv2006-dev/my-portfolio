import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Brain, Sparkles, Database, Wrench, Bot, Cpu, ShieldCheck } from 'lucide-react';
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
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiGithub,
  SiPostman,
  SiVercel,
  SiNetlify,
  SiRender,
  SiPython,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiTensorflow,
  SiPytorch,
  SiNextdotjs,
  SiRailway,
  SiFastapi,
  SiFlask,
  SiDocker,
  SiSupabase,
  SiStripe,
} from 'react-icons/si';

const skillCategories = {
  'AI/ML & Data': {
    color: 'from-amber-400 to-orange-600',
    skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch'],
  },
  'Generative AI': {
    color: 'from-purple-400 to-pink-600',
    skills: [
      'LLM Application Development',
      'Prompt Engineering',
      'RAG (Retrieval-Augmented Generation)',
      'FlashRank Re-ranking',
      'LangChain',
      'MongoDB Vector Search',
      'Tool Calling',
    ],
  },
  'Frontend': {
    color: 'from-blue-400 to-blue-600',
    skills: ['React.js', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  'Backend': {
    color: 'from-green-400 to-green-600',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'REST API'],
  },
  'Databases': {
    color: 'from-cyan-400 to-teal-600',
    skills: ['MongoDB', 'Supabase / PostgreSQL', 'Firebase (Realtime DB + Firestore)'],
  },
  'Tools & Deployment': {
    color: 'from-orange-400 to-red-600',
    skills: ['Docker', 'Git & GitHub', 'Clerk Authentication', 'Stripe', 'Vercel', 'Netlify', 'Railway', 'Render', 'Postman', 'VS Code'],
  },
};

type IconComponent = IconType | React.ElementType;

const skillIconMap: Record<string, { icon: IconComponent; color: string }> = {
  // AI/ML & Data
  'Python': { icon: SiPython, color: '#3776AB' },
  'Pandas': { icon: SiPandas, color: '#150458' },
  'NumPy': { icon: SiNumpy, color: '#013243' },
  'scikit-learn': { icon: SiScikitlearn, color: '#F7931E' },
  'TensorFlow': { icon: SiTensorflow, color: '#FF6F00' },
  'PyTorch': { icon: SiPytorch, color: '#EE4C2C' },

  // Generative AI
  'LLM Application Development': { icon: Bot, color: '#8B5CF6' },
  'Prompt Engineering': { icon: Sparkles, color: '#EC4899' },
  'RAG (Retrieval-Augmented Generation)': { icon: Brain, color: '#3B82F6' },
  'FlashRank Re-ranking': { icon: Cpu, color: '#A855F7' },
  'LangChain': { icon: Cpu, color: '#10B981' },
  'MongoDB Vector Search': { icon: Database, color: '#13AA52' },
  'Tool Calling': { icon: Wrench, color: '#F59E0B' },

  // Frontend
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'JavaScript (ES6+)': { icon: SiJavascript, color: '#F7DF1E' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#38B2AC' },
  'HTML5': { icon: SiHtml5, color: '#E34F26' },
  'CSS3': { icon: SiCss, color: '#1572B6' },

  // Backend
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'Express.js': { icon: SiExpress, color: '#000000' },
  'FastAPI': { icon: SiFastapi, color: '#009688' },
  'Flask': { icon: SiFlask, color: '#000000' },
  'REST API': { icon: Code2, color: '#7C3AED' },

  // Databases
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Supabase / PostgreSQL': { icon: SiSupabase, color: '#3ECF8E' },
  'Firebase (Realtime DB + Firestore)': { icon: SiFirebase, color: '#FFCA28' },

  // Tools & Deployment
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Git & GitHub': { icon: SiGithub, color: '#181717' },
  'Clerk Authentication': { icon: ShieldCheck, color: '#6C47FF' },
  'Stripe API': { icon: SiStripe, color: '#635BFF' },
  'Vercel': { icon: SiVercel, color: '#000000' },
  'Netlify': { icon: SiNetlify, color: '#00C7B7' },
  'Railway': { icon: SiRailway, color: '#0B0D0E' },
  'Render': { icon: SiRender, color: '#000000' },
  'Postman': { icon: SiPostman, color: '#FF6C37' },
  'VS Code': { icon: VscVscode, color: '#007ACC' },
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState('AI/ML & Data');
  const cat = skillCategories[activeTab as keyof typeof skillCategories];

  return (
    <section id="skills" className="relative py-12 sm:py-16 lg:py-20 bg-bg-primary overflow-hidden section-snap transition-colors duration-300">
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
          <span className="text-blue-500 font-semibold text-xs sm:text-sm tracking-widest uppercase">What I Know & Build With</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[Space_Grotesk] text-text-primary mt-2">My Tech Stack</h2>
          <p className="text-text-secondary mt-2 text-xs sm:text-sm max-w-lg mx-auto">AI/ML Engineering, Generative AI, LLM Applications & Full-Stack Web Development</p>
        </motion.div>

        <div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-6 sm:mb-8">
            {Object.keys(skillCategories).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-bg-secondary text-text-secondary border border-card-border/60 hover:bg-card-border hover:text-text-primary'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 justify-items-center"
            >
              {cat.skills.map((skill, i) => {
                const entry = skillIconMap[skill];
                const Icon = entry?.icon ?? Code2;
                const iconColor = entry?.color ?? '#3B82F6';
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="w-full min-h-[95px] sm:min-h-[110px] flex flex-col items-center justify-center text-center group cursor-default p-2.5 sm:p-4 rounded-xl bg-card-bg border border-card-border/80 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-lg bg-blue-500/5 border border-card-border/60 flex items-center justify-center p-1.5 sm:p-2 group-hover:scale-105 group-hover:bg-blue-500/10 transition-all duration-300 mb-1.5 sm:mb-2.5 shrink-0">
                      <Icon color={iconColor} size={22} className="sm:hidden" />
                      <Icon color={iconColor} size={26} className="hidden sm:block" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-text-primary group-hover:text-blue-500 dark:group-hover:text-cyan-accent transition-colors duration-300 leading-tight break-words max-w-full px-1">
                      {skill}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}