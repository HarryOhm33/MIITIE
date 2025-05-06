import { FaLightbulb, FaRocket, FaUsers, FaChartLine, FaQuoteLeft } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  // Programs data
  const programs = [
    {
      icon: <FaLightbulb className="text-4xl mb-4 text-orange-500" />,
      title: "Pre-Incubation",
      description: "Idea validation and early-stage support for student startups"
    },
    {
      icon: <FaRocket className="text-4xl mb-4 text-orange-500" />,
      title: "Full Incubation",
      description: "Comprehensive support for growth-stage startups"
    },
    {
      icon: <FaUsers className="text-4xl mb-4 text-orange-500" />,
      title: "Corporate Program",
      description: "Industry collaboration for scalable ventures"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "The incubation program transformed our college project into a viable business with real customers.",
      author: "Rahul Kumar",
      company: "Founder, EduTech Solutions"
    },
    {
      quote: "The mentorship and infrastructure support helped us secure our first round of funding.",
      author: "Priya Sharma",
      company: "Co-Founder, AgriInnovate"
    }
  ];

  // Stats data
  const stats = [
    { number: "50+", label: "Startups Incubated" },
    { number: "₹5Cr+", label: "Funding Raised" },
    { number: "100+", label: "Jobs Created" },
    { number: "25+", label: "Industry Partners" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Igniting <span className="text-orange-500">Innovation</span> at DCE
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              MIITIE Startup Incubation Centre provides the perfect launchpad for student entrepreneurs to transform ideas into successful ventures.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
                Apply for Incubation
              </button>
              <button className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors">
                Explore Programs
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-orange-100 rounded-lg w-full max-w-md h-64 md:h-80 flex items-center justify-center">
              <span className="text-2xl text-orange-300">Hero Illustration</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Brief Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About <span className="text-orange-500">MIITIE</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The MIITIE Startup Incubation Centre at Darbhanga College of Engineering is a hub for innovation and entrepreneurship, providing students with resources, mentorship, and infrastructure to build successful startups.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-center">
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-800">{program.title}</h3>
                <p className="text-gray-600 text-center">{program.description}</p>
                <div className="text-center mt-4">
                  <button className="text-orange-500 font-medium flex items-center justify-center mx-auto">
                    Learn more <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Success <span className="text-orange-500">Stories</span>
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg">
                <FaQuoteLeft className="text-3xl text-orange-300 mb-4" />
                <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-500 font-bold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Launch Your Startup?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join our vibrant community of innovators and turn your ideas into reality with our comprehensive support system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 bg-white text-orange-500 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
            <button className="px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;