import { motion } from "framer-motion";
import { FaLightbulb, FaQuoteLeft, FaRocket, FaUsers } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// Enhanced animation configurations with smoother transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.4,
      ease: [0.16, 1, 0.3, 1], // Custom easing for smoothness
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.98, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hover: {
    y: -5,
    transition: { duration: 0.3 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Home = () => {
  // Programs data
  const programs = [
    {
      icon: <FaLightbulb className="text-4xl mb-4 text-orange-500" />,
      title: "Pre-Incubation",
      description:
        "Idea validation and early-stage support for student startups",
    },
    {
      icon: <FaRocket className="text-4xl mb-4 text-orange-500" />,
      title: "Full Incubation",
      description: "Comprehensive support for growth-stage startups",
    },
    {
      icon: <FaUsers className="text-4xl mb-4 text-orange-500" />,
      title: "Corporate Program",
      description: "Industry collaboration for scalable ventures",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote:
        "The incubation program transformed our college project into a viable business with real customers.",
      author: "Rahul Kumar",
      company: "Founder, EduTech Solutions",
    },
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote:
        "The mentorship and infrastructure support helped us secure our first round of funding.",
      author: "Priya Sharma",
      company: "Co-Founder, AgriInnovate",
    },
    {
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      quote:
        "MIITIE gave us not only a platform but also a strong network and industry connections.",
      author: "Aman Verma",
      company: "CTO, HealthHive",
    },
    {
      image: "https://randomuser.me/api/portraits/women/56.jpg",
      quote:
        "Being part of MIITIE boosted our credibility and helped us scale faster than we imagined.",
      author: "Neha Jaiswal",
      company: "CEO, CleanEarth Tech",
    },
  ];

  // Stats data
  const stats = [
    { number: "50+", label: "Startups Incubated" },
    { number: "₹5Cr+", label: "Funding Raised" },
    { number: "100+", label: "Jobs Created" },
    { number: "25+", label: "Industry Partners" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 flex justify-center order-1 md:order-2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            <div className="bg-orange-100 rounded-lg w-full max-w-md h-64 md:h-80 flex items-center justify-center">
              <span className="text-2xl text-orange-300">
                Hero Illustration
              </span>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 order-2 md:order-1"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Igniting <span className="text-orange-500">Innovation</span> at
              DCE
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              MIITIE Startup Incubation Centre provides the perfect launchpad
              for student entrepreneurs to transform ideas into successful
              ventures.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
              >
                Apply for Incubation
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors"
              >
                Explore Programs
              </motion.button>
            </motion.div>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              <Link
                to="/notifications"
                className="inline-block bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-base font-medium shadow-sm hover:bg-yellow-200 transition duration-300"
              >
                🔔 View Latest Notifications
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Brief Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About <span className="text-orange-500">MIITIE</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The MIITIE Startup Incubation Centre at Darbhanga College of
              Engineering is a hub for innovation and entrepreneurship,
              providing students with resources, mentorship, and infrastructure
              to build successful startups.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center">{program.icon}</div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {program.description}
                </p>
                <div className="text-center mt-4">
                  <motion.button
                    className="text-orange-500 font-medium flex items-center justify-center mx-auto"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Learn more <FiArrowRight className="ml-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our <span className="text-orange-500">Impacts</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Success <span className="text-orange-500">Stories</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.1,
                    },
                  },
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-400"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <FaQuoteLeft className="text-3xl text-orange-300 mb-4" />
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fff3b0, #ffd180, #ffeb99)",
        }}
      >
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Ready to Launch Your Startup?
          </motion.h2>
          <motion.p
            className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            Join our vibrant community of innovators and turn your ideas into
            reality with our comprehensive support system.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Apply Now
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Background decorative elements with smoother animations */}
        <motion.div
          className="absolute w-32 h-32 border-4 border-orange-400 rounded-full opacity-30"
          style={{ top: "10%", left: "10%" }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.div
          className="absolute w-48 h-48 border-4 border-orange-500 rounded-full opacity-45"
          style={{ bottom: "10%", right: "15%" }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute w-6 h-6 rounded-full bg-orange-600"
          style={{ top: "25%", right: "30%" }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-8 h-8 rounded-full bg-yellow-500"
          style={{ bottom: "30%", left: "25%" }}
          animate={{
            x: [0, -10, 0],
            y: [0, 15, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />

        <motion.div
          className="absolute w-5 h-5 rounded-full bg-orange-700"
          style={{ top: "40%", left: "40%" }}
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </section>
    </div>
  );
};

export default Home;
