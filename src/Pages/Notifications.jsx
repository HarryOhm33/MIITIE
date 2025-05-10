import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaRegBell, FaExclamationCircle } from "react-icons/fa";
import { useEffect } from "react";
import { notifications } from "../assets/notifications";

const Notifications = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-12 md:py-12">
      <div className="container mx-auto px-4">
        {/* Animated Heading and Underline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FaBell className="text-4xl text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">
              MITTE <span className="text-orange-500">Notifications</span>
            </h2>
          </div>
          <motion.div
            className="w-34 h-1 bg-orange-500 mx-auto mb-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and announcements from
            MITTE Incubation Centre
          </p>
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence>
          {notifications.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-1 gap-6 max-w-4xl mx-auto"
            >
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${
                    notification.isImportant
                      ? "border-red-500"
                      : "border-orange-500"
                  } hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        {notification.isNew && (
                          <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-2">
                        {notification.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 md:text-right">
                      {notification.date}
                    </div>
                  </div>
                  {notification.isImportant && (
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Important
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-lg shadow-sm max-w-4xl mx-auto"
            >
              <FaRegBell className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                No notifications available
              </h3>
              <p className="text-gray-500 mt-2">
                There are currently no notifications.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Notifications;
