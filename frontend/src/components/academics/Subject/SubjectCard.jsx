import { UserIcon } from "../../../Icons";

function SubjectCard({ subject, onClick }) {
  const handleCardClick = () => {
    if (onClick) onClick(subject.id || "");
  };

  return (
    <div
      className="relative group bg-white rounded-xl overflow-hidden 
        transition-all duration-300 w-full border border-gray-100"
      style={{
        boxShadow: '14px 11px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '18px 15px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '14px 11px 8px rgba(0, 0, 0, 0.1)';
      }}
    >

      <div className="relative px-6 py-6 bg-gradient-to-r bg-[#F4F9FF] border-b border-gray-100/50">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-block text-xs font-bold bg-white/60 backdrop-blur-sm rounded-full px-3 py-1 text-gray-700 border border-white/20">
              {subject.code}
            </span>
            <div className="w-2 h-2 bg-[#C79745]/30 rounded-full group-hover:bg-[#C79745]/50 transition-colors"></div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
              {subject.name}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {subject.description}
            </p>
          </div>
        </div>
      </div>


      <div className="p-6 space-y-4">
        {/* Academic Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100/80 transition-colors border border-gray-100">
            <div className="text-xs font-bold uppercase text-[#C79745] mb-1 tracking-wide">
              Semester
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {subject.semester}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-gray-100/80 transition-colors border border-gray-100">
            <div className="text-xs font-bold uppercase text-[#C79745] mb-1 tracking-wide">
              Department
            </div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {subject.department}
            </div>
          </div>
        </div>


        <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-lg px-4 py-3 group-hover:from-gray-100/80 group-hover:to-gray-100/50 transition-all border border-gray-100">
          <div className="flex-shrink-0 w-8 h-8 bg-[#C79745]/10 rounded-full flex items-center justify-center mr-3">
            <UserIcon className="h-4 w-4 text-[#C79745]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[#C79745] uppercase tracking-wide mb-0.5">
              Instructor
            </div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              {subject.teacher || "To Be Announced"}
            </div>
          </div>
        </div>

        <button
          onClick={handleCardClick}
          className="relative w-full bg-[#2b3333] text-white font-semibold text-sm py-3 px-4 rounded-xl 
            overflow-hidden flex items-center justify-center space-x-2 group/button
            transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            boxShadow: '0 4px 15px rgba(43, 51, 51, 0.3)'
          }}
         
        >

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
            transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out"></div>
          

          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-white/0 group-active/button:bg-white/20 
              transition-colors duration-150 rounded-xl"></div>
          </div>
          
          <span className="relative z-10 transition-all duration-300">View Resources</span>
          <svg 
            className="relative z-10 w-4 h-4 transition-all duration-300 group-hover/button:translate-x-1 group-hover/button:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SubjectCard;
