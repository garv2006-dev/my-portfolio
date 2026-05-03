const projects = [
  {
    title: "SaaS Workspace App",
    desc: "Multi-workspace productivity platform",
  },
  {
    title: "Task Manager",
    desc: "Full-stack task tracking system",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="p-6 border border-white/10 rounded-xl hover:border-white/30 transition"
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-400 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;