import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBriefcase, FaLinkedin, FaUserTie, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const AdvisorsMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const mentorsRef = collection(db, "mentors");
      const q = query(mentorsRef, orderBy("cardPosition", "asc"));
      const querySnapshot = await getDocs(q);

      const mentorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMentors(mentorsList);
      console.log(mentorsList);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28 mt-[-4rem]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            Our <span className="text-orange-500">Advisors & Mentors</span>
          </motion.h2>

          <motion.div
            className="w-34 h-1 bg-orange-500 mx-auto mb-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          />

          <p className="text-gray-600 max-w-2xl mx-auto">
            Experienced professionals guiding our vision with their expertise
            and leadership.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          /* Mentor Cards */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {mentors.length > 0 ? (
              mentors.map((mentor) => {
                return (
                  <motion.div
                    key={mentor.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6 text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-orange-300 shadow-md">
                        {imageErrors[mentor.id] || !mentor.image ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FaUserTie className="text-5xl text-orange-300" />
                          </div>
                        ) : (
                          <img
                            src={mentor.image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(mentor.id)}
                          />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-orange-500 font-medium mb-2">
                        {mentor.role}
                      </p>
                      <div className="flex items-center justify-center text-gray-600 text-sm mb-4 min-h-[3rem]">
                        <FaBriefcase className="mr-2 flex-shrink-0" />
                        <span>{mentor.designation}</span>
                      </div>
                      {mentor.social && (
                        <a
                          href={mentor.social}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 mx-auto bg-gray-100 rounded-full hover:bg-orange-100 transition-colors group"
                        >
                          {mentor.social.includes("linkedin") ? (
                            <FaLinkedin className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                          ) : mentor.social.includes("facebook") ? (
                            <FaFacebook className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                          ) : (
                            <FaUserTie className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                          )}
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-600">No mentors available</p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            to="/mentor-form"
            className="inline-block px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
          >
            Become a Mentor
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvisorsMentors;
