import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import img1 from "../../assets/hero-img/img1.jpg";
import img2 from "../../assets/hero-img/img2.jpg";
import img3 from "../../assets/hero-img/img3.jpg";

const slides = [
  { src: img1, alt: "Students working at MIITIE" },
  { src: img2, alt: "Incubation center facilities" },
 // { src: img3, alt: "Entrepreneurship workshop" },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              transition: { duration: 1.5 },
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-1" />

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Igniting <span className="text-orange-400">Innovation</span> at DCE
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            MIITE (Mithila Institute of Inclusive Technological Innovation &
            Entrepreneurship) Incubation Centre, Darbhanga College Of
            Engineering, Darbhanga provides the perfect launchpad for student
            entrepreneurs to transform ideas into successful ventures.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/apply">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-lg"
              >
                Apply for Incubation
              </motion.button>
            </Link>

            <Link to="/programs">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Explore Programs
              </motion.button>
            </Link>
          </div>

          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to="/notifications"
              className="inline-flex items-center text-white hover:text-orange-300 font-medium transition-colors"
            >
              View Latest Notifications <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-orange-400 w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
