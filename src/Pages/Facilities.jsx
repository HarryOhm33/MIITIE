import { motion, AnimatePresence } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaCoffee,
  FaDesktop,
  FaWifi,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { facilities, galleryImages } from "../assets/facilities";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

const ZoomableImage = ({ src, alt, onClose, onNext, onPrev }) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  const bind = useGesture(
    {
      onDrag: ({
        offset: [dx, dy],
        event,
        tap,
        direction: [xDir],
        velocity,
      }) => {
        event.preventDefault();

        // Handle swipe navigation when not zoomed
        if (scale.get() <= 1) {
          if (tap) {
            onClose();
            return;
          }

          // If swiped horizontally with enough velocity
          if (Math.abs(xDir) > 0 && velocity > 0.3) {
            if (xDir > 0) {
              onPrev();
            } else {
              onNext();
            }
            return;
          }
        }

        // Normal drag behavior when zoomed
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ offset: [d], event }) => {
        event.preventDefault();
        api.start({ scale: d });
      },
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        api.start({
          scale: Math.max(0.5, Math.min(5, scale.get() - dy * 0.005)),
        });
      },
      onDoubleClick: ({ event }) => {
        event.preventDefault();
        const newScale = scale.get() > 1 ? 1 : 2;
        api.start({ scale: newScale, x: 0, y: 0 });
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: () => {
          const currentScale = scale.get();
          if (currentScale <= 1)
            return { left: 0, right: 0, top: 0, bottom: 0 };

          const img = imgRef.current;
          if (!img) return { left: 0, right: 0, top: 0, bottom: 0 };

          const width = img.offsetWidth;
          const height = img.offsetHeight;
          const scaledWidth = width * currentScale;
          const scaledHeight = height * currentScale;

          return {
            left: -(scaledWidth - width) / 2,
            right: (scaledWidth - width) / 2,
            top: -(scaledHeight - height) / 2,
            bottom: (scaledHeight - height) / 2,
          };
        },
        rubberband: 0.1,
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 5 },
        rubberband: true,
      },
      wheel: {
        eventOptions: { passive: false },
      },
    }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
      onClick={(e) => {
        if (e.target === containerRef.current && scale.get() <= 1) {
          onClose();
        }
      }}
    >
      <animated.img
        {...bind()}
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          x,
          y,
          scale,
          touchAction: "none",
          cursor: scale.get() > 1 ? "grab" : "default",
        }}
        className="object-contain max-h-[90vh] max-w-full select-none"
        draggable={false}
      />
    </div>
  );
};

const Facilities = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "auto";
  };

  const goToNext = (e) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = (e) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Auto-rotate gallery in lightbox
  useEffect(() => {
    let interval;
    if (isFullscreen) {
      interval = setInterval(() => {
        goToNext();
      }, 100000);
    }
    return () => clearInterval(interval);
  }, [isFullscreen, currentImageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
        if (e.key === "Escape") closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, currentImageIndex]);

  const getIconComponent = (iconName) => {
    const icons = {
      FaDesktop: <FaDesktop className="text-2xl text-white" />,
      FaChalkboardTeacher: (
        <FaChalkboardTeacher className="text-2xl text-white" />
      ),
      FaWifi: <FaWifi className="text-2xl text-white" />,
      FaCoffee: <FaCoffee className="text-2xl text-white" />,
    };
    return icons[iconName] || icons.FaDesktop;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "backOut" },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const galleryItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" },
    },
    hover: {
      scale: 1.05,
      zIndex: 10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
      <div className="container mx-auto px-4">
        {/* Facilities Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our <span className="text-orange-500">Facilities</span>
          </h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative h-56 w-full overflow-hidden group">
                <motion.img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute top-3 left-3 bg-orange-500 p-2 rounded-full shadow-lg">
                  {getIconComponent(facility.icon)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {facility.title}
                </h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Our <span className="text-orange-500">Gallery</span>
            </h2>
            <motion.div
              className="w-24 h-1 bg-orange-500 mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities through these images
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {galleryImages.map((img, index) => (
              <motion.div
                key={img.id}
                variants={galleryItemVariants}
                whileHover="hover"
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
                onClick={() => openLightbox(index)}
              >
                <motion.img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium truncate">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Virtual Tour Section */}
        <motion.div
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Take a <span className="text-orange-500">Virtual Tour</span>
            </h3>
            <motion.div
              className="w-20 h-1 bg-orange-500 mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Experience our facilities from anywhere in the world
            </p>
          </div>

          <motion.div
            className="relative aspect-video bg-orange-100 rounded-xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              src="https://www.youtube.com/embed/clOImDZiS9g?si=Dw9Z9uM-7_8sbxCu"
              title="Virtual tour of our facilities"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>

        {/* Enhanced Lightbox Modal */}
        <AnimatePresence>
          {isFullscreen && currentImageIndex !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeLightbox();
                }
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative w-full h-full max-w-6xl max-h-[90vh]"
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Navigation Arrows */}
                <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-orange-600 transition-colors"
                  onClick={goToPrev}
                  aria-label="Previous image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronLeft className="text-xl md:text-2xl" />
                </motion.button>

                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-orange-600 transition-colors"
                  onClick={goToNext}
                  aria-label="Next image"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronRight className="text-xl md:text-2xl" />
                </motion.button>

                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-orange-600 p-2 rounded-full shadow-lg transition-colors"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>

                {/* Current Image with Zoomable Component */}
                <ZoomableImage
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  onClose={closeLightbox}
                  onNext={goToNext}
                  onPrev={goToPrev}
                />

                {/* Image Info */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-block bg-black/70 text-white py-2 px-4 rounded-lg backdrop-blur-sm">
                    <p className="text-sm md:text-base">
                      {galleryImages[currentImageIndex].alt}
                    </p>
                    <p className="text-xs opacity-80 mt-1">
                      {currentImageIndex + 1} / {galleryImages.length}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Facilities;
