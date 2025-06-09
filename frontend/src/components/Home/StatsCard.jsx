import React from "react";
import {
  FaBookOpen, // Notes
  FaFileAlt, // Syllabus
  FaGraduationCap, // PYQs
  FaFlask, // Lab Work
} from "react-icons/fa";

const stats = [
  {
    title: "Notes",
    count: "500+",
    available: "Available",
    icon: <FaBookOpen className="text-blue-600 w-6 h-6" />,
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-200",
  },
  {
    title: "Syllabus",
    count: "200+",
    available: "Available",
    icon: <FaFileAlt className="text-green-600 w-6 h-6" />,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-200",
  },
  {
    title: "PYQs",
    count: "150+",
    available: "Available",
    icon: <FaGraduationCap className="text-purple-600 w-6 h-6" />,
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-200",
  },
  {
    title: "Lab Work",
    count: "80+",
    available: "Available",
    icon: <FaFlask className="text-orange-600 w-6 h-6" />,
    bg: "bg-orange-100",
    shadow: "hover:shadow-orange-200",
  },
];

export default function StatsCard() {
  return (
    <div className="px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-14">
      <div className="flex justify-center items-center p-2 mb-4">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 p-2">
          Resources
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl border border-gray-100 p-6 text-center transition-transform duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-md ${item.shadow}`}
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-full ${item.bg} flex items-center justify-center shadow-sm`}
            >
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="text-2xl font-bold text-yellow-700 mt-2">
              {item.count}
            </p>
            <p className="text-sm text-gray-500">{item.available}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
