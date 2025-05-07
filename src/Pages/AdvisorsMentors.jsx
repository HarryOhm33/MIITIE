import { FaLinkedin, FaBriefcase, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { advisors } from "../assets/mentor"; // Adjust the path as necessary

const AdvisorsMentors = () => {
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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-500">Advisors & Mentors</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experienced professionals guiding our vision with their expertise
            and leadership.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
        >
          {advisors.map((advisor) => {
            const [imgError, setImgError] = useState(false); // move inside map

            return (
              <motion.div
                key={advisor.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {imgError ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaUserTie className="text-5xl text-orange-300" />
                      </div>
                    ) : (
                      <img
                        src={advisor.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {advisor.name}
                  </h3>
                  <p className="text-orange-500 font-medium mb-2">
                    {advisor.role}
                  </p>
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-4 min-h-[3rem]">
                    <FaBriefcase className="mr-2 flex-shrink-0" />
                    <span>{advisor.designation}</span>
                  </div>
                  <a
                    href={advisor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 mx-auto bg-gray-100 rounded-full hover:bg-orange-100 transition-colors group"
                  >
                    <FaLinkedin className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">
            Become a Mentor
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvisorsMentors;
