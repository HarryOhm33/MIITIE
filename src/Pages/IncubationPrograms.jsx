import { motion } from "framer-motion";
import { FaLightbulb, FaRocket } from "react-icons/fa";
import { useEffect } from "react";

const IncubationPrograms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const programs = [
    {
      title: "Pre-Incubation Program",
      icon: <FaLightbulb className="text-4xl mb-4 text-orange-500" />,
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60",
      description:
        "Idea validation and early-stage support for student startups",
      benefits: [
        "Idea Validation",
        "Seed Funding Opportunities",
        "Dedicated Mentorship Support",
      ],
    },
    {
      title: "Full Incubation",
      icon: <FaRocket className="text-4xl mb-4 text-orange-500" />,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
      description: "Comprehensive support for growth-stage startups",
      benefits: [
        "Networking & Industry Connect",
        "Co-Working Space Access",
        "Prototype Development Support",
        "Legal & IT Infrastructure Assistance",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28 mt-[-4.2rem]">
      <div className="container mx-auto px-4">
        {/* Animated Heading and Underline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Our <span className="text-orange-500">Incubation Programs</span>
          </h2>
          <motion.div
            className="w-34 h-1 bg-orange-500 mx-auto mb-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Animated Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto"
        >
          {programs.map((program, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={program.image}
                alt={program.title}
                className="rounded-md mb-4 w-full h-40 object-cover"
              />
              {program.icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {program.title}
              </h3>
              <p className="text-gray-600 mb-4">{program.description}</p>

              <ul className="space-y-2">
                {program.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IncubationPrograms;
