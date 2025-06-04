import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#C79745]">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">IIPS Academics</h3>
          <p className="text-gray-600">
            The unofficial website for IIPS providing resources and info for students.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Academics", "Placements", "Events", "About"].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-[#C79745] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Resources</h4>
          <ul className="space-y-2">
            {["Study Material", "Previous Year Papers", "Syllabus", "Timetable"].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-700 hover:text-[#C79745] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#C79745] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 IIPS Academics. All rights reserved
        </div>
      </div>
    </footer>
  );
}

