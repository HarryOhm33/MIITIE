import { FaHandshake, FaLightbulb, FaRocket } from "react-icons/fa";

const IncubationPrograms = () => {
  const programs = [
    {
      title: "Pre-Incubation Program",
      icon: <FaLightbulb className="text-4xl mb-4 text-orange-500" />,
      description:
        "Idea validation and early-stage support for student startups",
      duration: "3 months",
      benefits: ["Mentorship", "Workshops", "Prototyping support"],
    },
    {
      title: "Full Incubation",
      icon: <FaRocket className="text-4xl mb-4 text-orange-500" />,
      description: "Comprehensive support for growth-stage startups",
      duration: "12-18 months",
      benefits: [
        "Funding access",
        "Office space",
        "Legal support",
        "Market connect",
      ],
    },
    {
      title: "Corporate Partnership",
      icon: <FaHandshake className="text-4xl mb-4 text-orange-500" />,
      description: "Industry collaboration for scalable ventures",
      duration: "Custom",
      benefits: [
        "Industry mentorship",
        "Pilot opportunities",
        "Investment readiness",
      ],
    },
  ];

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28 mt-[-4.2rem]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our <span className="text-orange-500">Incubation Programs</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition-all duration-300"
            >
              {program.icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {program.title}
              </h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <p className="text-sm font-medium text-orange-500 mb-3">
                Duration: {program.duration}
              </p>
              <ul className="space-y-2">
                {program.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IncubationPrograms;
