import { useState } from "react";
import {
  FaBookOpen,
  FaFileAlt,
  FaGraduationCap,
  FaFlask,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  {
    title: "Notes",
    count: 500,
    available: "Available",
    icon: <FaBookOpen className="w-6 h-6" />,
    color: "#3B82F6", // blue
    lightColor: "#EFF6FF", // blue-50
  },
  {
    title: "Syllabus",
    count: 200,
    available: "Available",
    icon: <FaFileAlt className="w-6 h-6" />,
    color: "#10B981", // green
    lightColor: "#ECFDF5", // green-50
  },
  {
    title: "PYQs",
    count: 150,
    available: "Available",
    icon: <FaGraduationCap className="w-6 h-6" />,
    color: "#8B5CF6", // purple
    lightColor: "#F5F3FF", // purple-50
  },
  {
    title: "Lab Work",
    count: 80,
    available: "Available",
    icon: <FaFlask className="w-6 h-6" />,
    color: "#F59E0B", // amber
    lightColor: "#FFFBEB", // amber-50
  },
];

export default function StatsCard() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="px-4 py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-purple-100 opacity-40 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className="flex justify-center items-center mb-16"
          data-aos="fade-up"
        >
          <div className="text-center">
            <span className="inline-block mb-4 text-sm font-medium px-4 py-2 bg-[#C79745]/10 text-[#C79745] rounded-full">
              Our Resources
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Academic Materials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive collection of resources to support your academic
              journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              className="relative"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div
                className={`h-full bg-white rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 ${
                  hoveredIndex === index
                    ? "shadow-xl transform -translate-y-1"
                    : "shadow-md"
                }`}
                style={{
                  background:
                    hoveredIndex === index
                      ? `linear-gradient(135deg, white 60%, ${item.lightColor})`
                      : "white",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: item.lightColor,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: item.color }}
                >
                  <CountUp
                    end={item.count}
                    suffix="+"
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyDelay={100}
                  />
                </div>

                <p className="text-gray-500">{item.available}</p>

                {hoveredIndex === index && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-100 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="text-sm font-medium flex items-center justify-center gap-1 w-full"
                      style={{ color: item.color }}
                    >
                      View Details
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
