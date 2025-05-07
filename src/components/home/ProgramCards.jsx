import { motion } from "framer-motion";
import { FaLightbulb, FaRocket, FaUsers, FaHandshake } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const ProgramCards = () => {
  const programs = [
    {
      icon: <FaLightbulb className="text-4xl mb-4 text-orange-500" />,
      title: "Pre-Incubation",
      description:
        "Idea validation and early-stage support for student startups",
      features: [
        "Idea pitching workshops",
        "Market validation support",
        "Prototype development guidance",
      ],
    },
    {
      icon: <FaRocket className="text-4xl mb-4 text-orange-500" />,
      title: "Full Incubation",
      description: "Comprehensive support for growth-stage startups",
      features: [
        "Dedicated working space",
        "Funding assistance",
        "Mentorship network",
      ],
    },
    {
      icon: <FaHandshake className="text-4xl mb-4 text-orange-500" />,
      title: "Corporate Program",
      description: "Industry collaboration for scalable ventures",
      features: [
        "Industry partnerships",
        "Pilot project opportunities",
        "Investor connect",
      ],
    },
  ];

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1 }}
    >
      {programs.map((program, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            delay: index * 0.15,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{
            y: -8,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          className="bg-white p-8 rounded-xl shadow-md border-t-4 border-orange-500 transition-all"
        >
          <div className="flex justify-center">{program.icon}</div>
          <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
            {program.title}
          </h3>
          <p className="text-gray-600 text-center mb-4">
            {program.description}
          </p>

          <ul className="mb-6 space-y-2">
            {program.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <motion.button
              className="text-orange-500 font-medium flex items-center justify-center mx-auto group"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Learn more
              <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProgramCards;
