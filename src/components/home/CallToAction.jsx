import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fff3b0, #ffd180, #ffeb99)",
      }}
    >
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute w-32 h-32 border-4 border-orange-400 rounded-full opacity-30"
        style={{ top: "10%", left: "10%" }}
        initial={{ rotate: 0, scale: 0.9 }}
        animate={{
          rotate: 360,
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          rotate: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className="absolute w-48 h-48 border-4 border-orange-500 rounded-full opacity-45"
        style={{ bottom: "10%", right: "15%" }}
        initial={{ rotate: 0, scale: 0.95 }}
        animate={{
          rotate: -360,
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          rotate: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 12 + 6; // 6px to 18px
        const colors = ["bg-orange-600", "bg-yellow-500", "bg-orange-700"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const xOffset = (Math.random() - 0.5) * 50; // More movement
        const yOffset = (Math.random() - 0.5) * 50;
        const scale = Math.random() * 0.3 + 0.85;

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color} opacity-40 pointer-events-none`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 1,
            }}
            animate={{
              x: [0, xOffset, 0],
              y: [0, yOffset, 0],
              scale: [1, scale, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: Math.random() * 10 + 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        );
      })}

      {/* Content (unchanged) */}
      <div className="container mx-auto px-4 text-center relative z-10">
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <Link to="/apply">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Apply Now
            </motion.button>
          </Link>

          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors"
            >
              Contact Us
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
