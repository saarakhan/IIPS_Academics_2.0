import React from "react";
import { BookOpenIcon, UserIcon, BuildingIcon } from "../../../Icons";

function SubjectCard({ subject, onClick }) {
  const handleCardClick = () => {
    if (onClick) onClick(subject.id || "");
  };

  return (
    <div
      className="relative group bg-white rounded-2xl overflow-hidden 
    shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 w-full border"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 -mr-10 -mt-10 bg-gradient-to-br from-[#77B0CF]/20 to-[#5a9db7]/20
       rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"
      ></div>

      <div className="relative px-4 py-4 bg-gradient-to-r bg-[#F3F6F2] ">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>

        <div className="relative z-10">
          <span className="inline-block text-xs font-semibold bg-white/20 rounded-full px-2 py-0.5 mb-1">
            {subject.code}
          </span>
          <h2 className="text-lg font-bold truncate mb-1">{subject.name}</h2>
          <p className="text-sm italic opacity-90 truncate">
            {subject.description}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between gap-2 mb-2">
          <div className="flex-1 bg-gray-50 rounded-md p-1.5 text-center group-hover:bg-gray-100 transition">
            <div className="text-[9px] font-bold uppercase text-[#C79745]/90 mb-0.5">
              Semester
            </div>
            <div className="text-xs font-semibold text-gray-800">
              {subject.semester}
            </div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-md p-1.5 text-center group-hover:bg-gray-100 transition">
            <div className="text-[9px] font-bold uppercase text-[#C79745]/90 mb-0.5">
              Department
            </div>
            <div className="text-xs font-medium text-gray-800 truncate">
              {subject.department}
            </div>
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-2 mb-4 group-hover:bg-gray-100/80 transition-colors">
          <UserIcon className="h-4 w-4 mr-2 text-[#C79745]" />
          <span className="truncate">
            <span className="text-[#C79745] font-semibold">Instructor:</span>{" "}
            <span className="font-medium text-gray-800">
              {subject.teacher || "TBA"}
            </span>
          </span>
        </div>

        <button
          onClick={handleCardClick}
          className="cursor-pointer w-full bg-gradient-to-r bg-[#2b3333] hover:bg-black
            text-white font-semibold text-sm py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Click to View Resource
        </button>
      </div>
    </div>
  );
}

export default SubjectCard;
