import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center flex-grow py-12 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "95vh" }} // Adjust based on your header/footer height
    >
      {/* Rest of your NotFound content remains the same */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <div className="text-9xl font-bold text-orange-500 mb-2">404</div>
        <div className="text-4xl font-medium text-gray-800 mb-4">
          Page Not Found
        </div>
      </motion.div>

      <motion.p
        className="text-xl text-gray-600 max-w-2xl mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <FaHome /> Return Home
          </motion.button>
        </Link>

        <Link to="/programs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            <FaSearch /> Explore Programs
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
