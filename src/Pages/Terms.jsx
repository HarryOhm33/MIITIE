import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50 py-12"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-orange-500">Terms</span> & Conditions
          </h1>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-orange-500 to-yellow-400">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              MIITIE Incubation Terms
            </motion.h2>
          </div>

          <div className="p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="prose max-w-none"
            >
              <motion.section
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  1. General Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  By applying to the MIITIE Startup Incubation Centre, you agree
                  to comply with all the terms and conditions outlined herein.
                  These terms govern your participation in our incubation
                  program.
                </p>
                <p className="text-gray-600">
                  The MIITIE reserves the right to modify these terms at any
                  time without prior notice.
                </p>
              </motion.section>

              <motion.section
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  2. Eligibility
                </h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Applicants must be at least 18 years of age</li>
                  <li>Startups must have a viable business model</li>
                  <li>
                    Teams must demonstrate technical or business expertise
                  </li>
                  <li>
                    Applicants must commit to full participation in the program
                  </li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  3. Intellectual Property
                </h2>
                <p className="text-gray-600 mb-4">
                  All intellectual property developed by the startup prior to
                  and during the incubation period remains the sole property of
                  the startup.
                </p>
                <p className="text-gray-600">
                  MIITIE may request a non-exclusive license to showcase the
                  startup's progress for promotional purposes.
                </p>
              </motion.section>

              <motion.section
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  4. Program Expectations
                </h2>
                <p className="text-gray-600 mb-4">
                  Selected startups are expected to:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Attend all mandatory sessions and meetings</li>
                  <li>Meet milestones and deliverables</li>
                  <li>Provide regular progress updates</li>
                  <li>Participate in demo days and showcase events</li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  5. Termination
                </h2>
                <p className="text-gray-600">
                  MIITIE reserves the right to terminate a startup's
                  participation in the incubation program for failure to comply
                  with these terms or for any conduct deemed detrimental to the
                  program or other participants.
                </p>
              </motion.section>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <Link
                to="/apply"
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors inline-block"
              >
                Back to Application
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Terms;
