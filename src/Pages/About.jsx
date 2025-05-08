import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPhone, FaEnvelope, FaLightbulb, FaUsers, FaChartLine } from 'react-icons/fa';

const About = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const facultyMembers = [
    {
      id: 1,
      name: "Mr. Ankit Kumar",
      designation: "Faculty Incharge, Startup Cell",
      mobile: "+91-7250840578",
      email: "ankitkr606@gmail.com",
      image: "/faculty/ankit.jpg" // Replace with actual image path
    },
    {
      id: 2,
      name: "Mr. Surya Prakash",
      designation: "Startup Cell Coordinator",
      mobile: "7004906223",
      email: "suryaind22@gmail.com",
      image: "/faculty/surya.jpg" // Replace with actual image path
    }
  ];

  const features = [
    {
      icon: <FaLightbulb className="text-4xl text-orange-500" />,
      title: "Innovation Support",
      description: "We nurture groundbreaking ideas and help transform them into viable businesses"
    },
    {
      icon: <FaUsers className="text-4xl text-orange-500" />,
      title: "Mentorship",
      description: "Access to industry experts and successful entrepreneurs for guidance"
    },
    {
      icon: <FaChartLine className="text-4xl text-orange-500" />,
      title: "Growth Acceleration",
      description: "Programs designed to help startups scale quickly and efficiently"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            About <span className="text-orange-500">MIITIE</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Mithila Institute of Inclusive Technological Innovation & Entrepreneurship
          </motion.p>
        </div>
      </motion.section>

      {/* About Content Section */}
      <motion.section 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our <span className="text-orange-500">Mission</span>
              </h2>
              <div className="w-24 h-1 bg-orange-500 mb-6"></div>
              <p className="text-lg text-gray-600 mb-6">
                MIITIE (Mithila Institute of Inclusive Technological Innovation & Entrepreneurship) is the incubation centre of DCE Darbhanga that supports aspiring entrepreneurs by providing workspace, infrastructure, mentoring, and training to incubate and accelerate innovative, socially impactful, and eco-friendly startups.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We aim to create an ecosystem that fosters innovation, supports entrepreneurship, and bridges the gap between academia and industry.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="bg-orange-100 p-3 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="order-1 md:order-2 relative"
            >
              <div className="bg-orange-100 rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
                <img 
                  src="/about-image.jpg" // Replace with your actual image path
                  alt="MIITIE Incubation Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg w-3/4 z-10 hidden md:block"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">25+ Startups Incubated</h3>
                <p className="text-gray-600">Transforming ideas into successful businesses</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Faculty Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our <span className="text-orange-500">Team</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {facultyMembers.map((member) => (
              <motion.div 
                key={member.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
                    <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl text-orange-500 font-bold">{member.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-orange-500 font-medium mb-4">{member.designation}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2 text-orange-500" />
                        <a href={`tel:${member.mobile}`} className="hover:text-orange-500 transition-colors">
                          {member.mobile}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2 text-orange-500" />
                        <a href={`mailto:${member.email}`} className="hover:text-orange-500 transition-colors">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <div className="text-4xl font-bold mb-2">25+</div>
              <div>Startups</div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <div className="text-4xl font-bold mb-2">₹5Cr+</div>
              <div>Funding Raised</div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <div className="text-4xl font-bold mb-2">100+</div>
              <div>Jobs Created</div>
            </motion.div>
            <motion.div 
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="p-4"
            >
              <div className="text-4xl font-bold mb-2">15+</div>
              <div>Industry Partners</div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;