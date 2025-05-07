import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { testimonials } from "../../assets/testimonials"; // Adjust the path as necessary

const SuccessStories = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            Success <span className="text-orange-500">Stories</span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
              className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="flex items-center mb-4">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-14 h-14 rounded-full object-cover mr-3 border-2 border-orange-400"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
                <div>
                  <h4 className="font-bold text-gray-800">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
              <FaQuoteLeft className="text-2xl text-orange-300 mb-3" />
              <p className="text-gray-700 italic mb-4 line-clamp-4">
                {testimonial.quote}
              </p>
              <motion.button
                onClick={() => setSelectedTestimonial(testimonial)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
              >
                Read Full Story
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Modal with glassy overlay */}
        <AnimatePresence>
          {selectedTestimonial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTestimonial(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <img
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.author}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-orange-400"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {selectedTestimonial.author}
                        </h3>
                        <p className="text-gray-600">
                          {selectedTestimonial.company}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTestimonial(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                  <FaQuoteLeft className="text-3xl text-orange-300 mb-4" />
                  <p className="text-gray-700 italic mb-4 text-lg">
                    {selectedTestimonial.quote}
                  </p>
                  <div className="h-[200px] overflow-y-auto pr-2">
                    <p className="text-gray-600 whitespace-pre-line">
                      {selectedTestimonial.extendedQuote}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end">
                  <motion.button
                    onClick={() => setSelectedTestimonial(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SuccessStories;
