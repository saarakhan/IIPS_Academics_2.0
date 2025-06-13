import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBookOpen, FaFileAlt, FaGraduationCap } from "react-icons/fa";

function InfoCard({
  title,
  description,
  content,
  link,
  buttonText,
  icon,
  color,
  delay,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      data-aos="fade-up"
      data-aos-delay={delay * 200}
    >
      <div
        className={`p-8 rounded-2xl bg-white border-t-4 h-full flex flex-col transition-all duration-300 transform ${
          isHovered ? "shadow-xl -translate-y-1" : "shadow-md"
        }`}
        style={{ borderColor: color }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-gray-700 mb-2 text-lg">{description}</p>
        <p className="text-gray-600 mb-8 flex-grow">{content}</p>

        <Link
          href={link}
          className="group relative inline-flex items-center justify-center w-full py-3 px-6 rounded-xl font-medium text-white overflow-hidden transition-all duration-300"
          style={{ backgroundColor: color }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {buttonText}
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
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
          </span>
          <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </Link>
      </div>
    </motion.div>
  );
}

const infoData = [
  {
    title: "Course Materials",
    description: "Access study material for all courses",
    content:
      "Find lecture notes, presentations, and reference notes for all subjects",
    link: "/materials",
    buttonText: "View Materials",
    icon: <FaBookOpen size={24} />,
    color: "#4F46E5", // Indigo
  },
  {
    title: "Previous Year Papers",
    description: "Practice with past exams ;)",
    content:
      "Access previous years question papers and solutions for better preparation",
    link: "/papers",
    buttonText: "View Papers",
    icon: <FaGraduationCap size={24} />,
    color: "#C79745", // Gold
  },
  {
    title: "Syllabus",
    description: "Course Structure and Curriculum",
    content: "Detailed syllabus for all courses and semesters at IIPS",
    link: "/syllabus",
    buttonText: "View Syllabus",
    icon: <FaFileAlt size={24} />,
    color: "#10B981", // Emerald
  },
];

export default function CardGroup() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Academic Resources</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for academic excellence in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoData.map((item, idx) => (
            <InfoCard key={idx} {...item} delay={idx * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
