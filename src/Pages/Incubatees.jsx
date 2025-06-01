import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa";
import { incubateesData } from "../assets/incubatees";

const Incubatees = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Our <span className="text-orange-500">Incubatees</span>
          </h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Meet the innovative startups nurtured through our incubation program
          </p>
        </motion.div>

        {/* Incubatees Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100"
        >
          {incubateesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Startup
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Founder(s)
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Brief Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Registered with Bihar Startup?
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Links
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incubateesData.map((incubatee) => (
                    <motion.tr
                      key={incubatee.id}
                      variants={itemVariants}
                      className="hover:bg-orange-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-center font-medium text-gray-900">
                          {incubatee.startupName || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-center text-gray-800">
                          {incubatee.founderName || "N/A"}
                          {incubatee.coFounderName && (
                            <>
                              ,
                              <br />
                              {incubatee.coFounderName}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-center text-gray-600 text-sm max-w-xs mx-auto">
                          {incubatee.details || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-center text-gray-800">
                          {incubatee.sector || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-center text-gray-800">
                          {incubatee.registeredWithBiharStartup ? "Yes" : "No"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center space-x-3">
                          {incubatee.website ? (
                            <a
                              href={incubatee.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-600 transition-colors"
                              aria-label="Website"
                            >
                              <FaGlobe className="h-5 w-5" />
                            </a>
                          ) : null}
                          {incubatee.instagram ? (
                            <a
                              href={incubatee.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-600 transition-colors"
                              aria-label="Instagram"
                            >
                              <FaInstagram className="h-5 w-5" />
                            </a>
                          ) : null}
                          {incubatee.twitter ? (
                            <a
                              href={incubatee.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-600 transition-colors"
                              aria-label="Twitter"
                            >
                              <FaTwitter className="h-5 w-5" />
                            </a>
                          ) : null}
                          {incubatee.linkedin ? (
                            <a
                              href={incubatee.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-600 transition-colors"
                              aria-label="LinkedIn"
                            >
                              <FaLinkedin className="h-5 w-5" />
                            </a>
                          ) : null}
                          {!incubatee.website &&
                            !incubatee.instagram &&
                            !incubatee.twitter &&
                            !incubatee.linkedin && (
                              <span className="text-gray-400">N/A</span>
                            )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-600"
            >
              No incubatees to display currently
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Incubatees;
