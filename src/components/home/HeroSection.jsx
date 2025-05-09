import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28">
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
          <div className="bg-orange-100 rounded-lg w-full max-w-md h-64 md:h-80 flex items-center justify-center overflow-hidden">
            <img
              src="https://www.dce-darbhanga.org/wp-content/uploads/2024/08/mo.jpg"
              alt="Hero Illustration"
              className="w-full h-full object-cover transform scale-130"
              loading="lazy"
            />
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
            Igniting <span className="text-orange-500">Innovation</span> at DCE
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
            MIITIE (Mithila Institute of Inclusive Technological Innovation &
            Entrepreneurship) Incubation Centre, Darbhanga College Of
            Engineering, Darbhanga provides the perfect launchpad for student
            entrepreneurs to transform ideas into successful ventures.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/apply">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors cursor-pointer text-center"
                >
                  Apply for Incubation
                </motion.div>
              </Link>

              <Link to="/programs">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors cursor-pointer text-center"
                >
                  Explore Programs
                </motion.div>
              </Link>
            </motion.div>
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
  );
};

export default HeroSection;
