import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaLightbulb, FaUsersCog } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            About <span className="text-orange-500">MIITIE</span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
          >
            MIITIE (Mithila Institute of Inclusive Technological Innovation &
            Entrepreneurship) is the incubation centre of DCE Darbhanga that
            supports aspiring entrepreneurs by providing workspace,
            infrastructure, mentoring, and training to incubate and accelerate
            innovative, socially impactful, and eco-friendly startups.
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-orange-50 rounded-xl p-8 max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
            Our Key Activities
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <FaChalkboardTeacher className="text-2xl text-orange-500" />
                ),
                title: "Events & Workshops",
                description: "Multiple events & workshops conducted regularly",
              },
              {
                icon: <FaUsersCog className="text-2xl text-orange-500" />,
                title: "Co-Working Spaces",
                description: "Dedicated spaces created for startups",
              },
              {
                icon: <FaLightbulb className="text-2xl text-orange-500" />,
                title: "Mentorship",
                description: "Regular sessions with industry experts",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h4 className="font-semibold text-center mb-2">{item.title}</h4>
                <p className="text-gray-600 text-center text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
