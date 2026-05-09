import { motion } from 'framer-motion';

const timeline = [
  { year: '2021', title: 'Discovered Web Development', desc: 'Started learning HTML, CSS, JavaScript through online resources. Built first static websites.', color: 'from-blue-400 to-blue-600' },
  { year: '2021-2024', title: 'BCA at Vivekananda College, Surat', desc: 'Bachelor of Computer Applications. Studied data structures, algorithms, DBMS, networking, and software engineering.', color: 'from-purple-400 to-purple-600' },
  { year: '2022', title: 'Dived into React & Node.js', desc: 'Started building full-stack projects. Learned React ecosystem, REST APIs, and backend development with Node.js and Express.', color: 'from-green-400 to-green-600' },
  { year: '2023', title: 'Expanded to Databases & Cloud', desc: 'Mastered MongoDB, PostgreSQL, and Firebase. Deployed first production app on Vercel.', color: 'from-orange-400 to-orange-600' },
  { year: '2024', title: 'TypeScript & Advanced Concepts', desc: 'Adopted TypeScript in all new projects. Started exploring system design and scalable architecture.', color: 'from-cyan-400 to-cyan-600' },
  { year: 'Present', title: 'Actively Seeking Opportunities', desc: 'Building open-source projects, expanding portfolio, looking for exciting full-stack roles.', color: 'from-pink-400 to-pink-600' },
];

export default function Journey() {
  return (
    <section id="journey" className="relative py-24 lg:py-32 bg-[#0a192f] overflow-hidden section-snap">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-[#64ffda] font-medium text-sm tracking-widest uppercase">My path</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-[Space_Grotesk] text-white mt-3">Education & Journey</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:-translate-x-px" />

          {timeline.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative flex items-start mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block md:w-1/2" />
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-4 border-[#0a192f] -translate-x-1/2 mt-6 z-10 shadow-lg shadow-blue-500/50" />
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                <motion.div whileHover={{ scale: 1.02, y: -3 }} className="glass rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-bold mb-3`}>{item.year}</span>
                  <h3 className="text-lg font-bold text-white font-[Space_Grotesk] mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}