import React from 'react';
import { BookOpenIcon, UserIcon, BuildingIcon } from '../../../Icons';

function SubjectCard({ subject, onClick }) {
  const handleCardClick = () => {
    if (onClick) onClick(subject.id || '');
  };

  return (
    <div className='relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 w-full'>
      <div className='absolute top-0 right-0 w-24 h-24 -mr-10 -mt-10 bg-gradient-to-br from-[#77B0CF]/20 to-[#5a9db7]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500'></div>

      <div className='relative px-4 py-3 text-white bg-gradient-to-r from-[#5a9db7] to-[#4a8da7]'>
        <div className='absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]'></div>
        <div className='relative inline-flex items-center gap-1.5 text-xs font-medium bg-white/20 rounded-full px-2 py-0.5 mb-1'>
          <span className='z-10 text-white'>{subject.code}</span>
        </div>
        <h2 className='text-base font-bold leading-tight truncate' title={subject.name}>
          {subject.name}
        </h2>
      </div>

      <div className='p-4'>
        <div className='grid grid-cols-2 gap-2 mb-3'>
          <div className='bg-gray-50 rounded-lg p-2 text-center group-hover:bg-gray-100/80 transition-colors'>
            <div className='text-[10px] font-semibold uppercase tracking-wide text-[#C79745]/90 mb-1'>Semester</div>
            <div className='text-sm font-bold text-gray-800'>{subject.semester}</div>
          </div>
          <div className='bg-gray-50 rounded-lg p-2 text-center group-hover:bg-gray-100/80 transition-colors'>
            <div className='text-[10px] font-semibold uppercase tracking-wide text-[#C79745]/90 mb-1'>Year</div>
            <div className='text-sm font-bold text-gray-800'>{subject.year}</div>
          </div>
        </div>

        <div className='flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-2 group-hover:bg-gray-100/80 transition-colors'>
          <BuildingIcon className='h-4 w-4 mr-2 text-[#C79745]' />
          <span className='font-medium text-gray-800 truncate'>{subject.department}</span>
        </div>

        <div className='flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-2 group-hover:bg-gray-100/80 transition-colors'>
          <UserIcon className='h-4 w-4 mr-2 text-[#C79745]' />
          <span className='truncate'>
            <span className='text-[#C79745]'>Instructor:</span> <span className='font-medium text-gray-800'>{subject.teacher || 'TBA'}</span>
          </span>
        </div>

        <button
          onClick={handleCardClick}
          className='cursor-pointer mt-1 w-full bg-gradient-to-r from-[#5a9db7] to-[#4a8da7] hover:from-[#4a8da7] hover:to-[#3a7d97] text-white font-semibold text-sm py-2 rounded-xl shadow hover:shadow-md transition-all duration-300'>
          Click to View Resource
        </button>
      </div>
    </div>
  );
}

export default SubjectCard;
