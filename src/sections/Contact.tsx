const Contact = () => {
  return (
    <section id="contact" className="bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact</h2>
        <p className="text-gray-400 mb-6">
          Let’s build something great together 🚀
        </p>

        <a
          href="mailto:your@email.com"
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold"
        >
          Email Me
        </a>
      </div>
    </section>
  );
};

export default Contact;