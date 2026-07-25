import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaBriefcase, FaLinkedin, FaUserTie, FaFacebook, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

const ZoomableImage = ({ src, alt, onClose }) => {
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
      onDrag: ({ offset: [dx, dy], event, tap }) => {
        event.preventDefault();
        if (tap && scale.get() <= 1) {
          onClose();
          return;
        }
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

const AdvisorsMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (image, alt) => {
    if (!image) return;
    setFullscreenImage({ image, alt });
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "auto";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28 mt-[-4rem]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
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
                const hasImage = mentor.image && !imageErrors[mentor.id];
                return (
                  <motion.div
                    key={mentor.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6 text-center">
                      <div
                        className={`w-32 h-32 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border-4 border-orange-300 shadow-md ${
                          hasImage ? "cursor-pointer" : ""
                        }`}
                        onClick={() => hasImage && openFullscreen(mentor.image, mentor.name)}
                      >
                        {!hasImage ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FaUserTie className="text-5xl text-orange-300" />
                          </div>
                        ) : (
                          <img
                            src={mentor.image}
                            alt={mentor.name}
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
            className="inline-block px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg animate-none"
          >
            Become a Mentor
          </Link>
        </motion.div>

        {/* Fullscreen Image Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            >
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <FaTimes />
              </button>
              <ZoomableImage
                src={fullscreenImage?.image}
                alt={fullscreenImage?.alt}
                onClose={closeFullscreen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AdvisorsMentors;
