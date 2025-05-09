import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import {
  FaCalendarAlt,
  FaExclamationCircle,
  FaRegBell,
  FaRegCheckCircle,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const Notifications = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "backOut",
      },
    },
  };

  // Sample notification data - easily editable
  const notifications = [
    {
      id: 1,
      title: "Extended Deadline for Abstract Submission",
      date: "April 20, 2025",
      description:
        "The deadline for abstract submissions has been extended to April 20, 2025.",
      isImportant: true,
    },
    {
      id: 2,
      title: "Notification of Acceptance",
      date: "April 20, 2025",
      description:
        "Authors will be notified about the acceptance of their abstracts by this date.",
      isImportant: true,
    },
    {
      id: 3,
      title: "Early Bird Registration Deadline",
      date: "April 30, 2025",
      description:
        "Register before this date to avail early bird discounts for the conference.",
      isImportant: false,
    },
    {
      id: 4,
      title: "Full-Length Paper Submission",
      date: "May 15, 2025",
      description:
        "Deadline for submission of full-length papers for accepted abstracts.",
      isImportant: false,
    },
    {
      id: 5,
      title: "Conference Dates",
      date: "May 24 - 25, 2025",
      description:
        "Main conference events will be held on these dates at DCE Darbhanga campus.",
      isImportant: true,
    },
    {
      id: 6,
      title: "Registration Guidelines",
      date: "Upon acceptance of Abstract",
      description:
        "Registration may be done after receiving acceptance notification.",
      isImportant: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-hidden mt-[-3rem]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center bg-orange-100 p-4 rounded-full mb-6"
          >
            <FaRegBell className="text-orange-500 text-3xl" />
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            <span className="text-orange-500">Notifications</span> &
            Announcements
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Stay updated with important dates and announcements from MIITIE
          </motion.p>
        </div>
      </motion.section>

      {/* Important Dates Section */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6 text-white">
                <motion.h2
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold flex items-center"
                >
                  <FaCalendarAlt className="mr-3" />
                  Key Dates & Deadlines
                </motion.h2>
              </div>
              <motion.div variants={containerVariants} className="bg-white p-6">
                <ul className="space-y-4 divide-y divide-gray-100">
                  {notifications
                    .filter((n) => n.isImportant)
                    .map((notification) => (
                      <motion.li
                        key={notification.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className="pt-4 first:pt-0"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start">
                            <FaExclamationCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {notification.title}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {notification.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-orange-500 font-medium sm:ml-4 mt-2 sm:mt-0 whitespace-nowrap">
                            {notification.date}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* All Notifications Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: -20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaRegCheckCircle className="text-orange-500 mr-3" />
              All Notifications
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                  notification.isImportant
                    ? "border-orange-500"
                    : "border-gray-200"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    {notification.isImportant && (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        Important
                      </motion.span>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center text-gray-500 mb-4"
                  >
                    <FaCalendarAlt className="mr-2 text-sm" />
                    <span className="text-sm">{notification.date}</span>
                  </motion.div>
                  <p className="text-gray-600">{notification.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Archive Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="pb-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="max-w-2xl mx-auto bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-orange-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-orange-800">
                  Looking for older notifications?
                </h3>
                <div className="mt-2 text-orange-700">
                  <p>
                    Visit our{" "}
                    <a
                      href="#"
                      className="font-semibold underline hover:text-orange-600"
                    >
                      notification archive
                    </a>{" "}
                    for previous announcements and circulars.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Notifications;
