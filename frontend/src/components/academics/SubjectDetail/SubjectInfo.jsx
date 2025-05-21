import React from 'react';
import { CalendarIcon, UserIcon, BuildingIcon, BookOpenIcon } from '../../../Icons';
const SubjectInfo = ({ subject }) => {
  return (
    <div>
      <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-[#e0e5ec]'>
        <div className='grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e0e5ec]'>
          <div className='p-4'>
            <div className='flex items-center mb-1.5'>
              <CalendarIcon className='h-4 w-4 text-[#003366] mr-2' />
              <h3 className='text-xs font-medium text-gray-500 uppercase'>Year</h3>
            </div>
            <p className='text-[#2b3333] font-semibold'>{subject.year || 'Not specified'}</p>
          </div>
          <div className='p-4'>
            <div className='flex items-center mb-1.5'>
              <CalendarIcon className='h-4 w-4 text-[#003366] mr-2' />
              <h3 className='text-xs font-medium text-gray-500 uppercase'>Semester</h3>
            </div>
            <p className='text-[#2b3333] font-semibold'>{subject.semester}</p>
          </div>

          <div className='p-4'>
            <div className='flex items-center mb-1.5'>
              <UserIcon className='h-4 w-4 text-[#003366] mr-2' />
              <h3 className='text-xs font-medium text-gray-500 uppercase'>Instructor</h3>
            </div>
            <p className='text-[#2b3333] font-semibold'>{subject.teacher}</p>
          </div>

          <div className='p-4'>
            <div className='flex items-center mb-1.5'>
              <BuildingIcon className='h-4 w-4 text-[#003366] mr-2' />
              <h3 className='text-xs font-medium text-gray-500 uppercase'>Department</h3>
            </div>
            <p className='text-[#2b3333] font-semibold'>{subject.department || 'Not specified'}</p>
          </div>
        </div>

        {subject.about && (
          <div className='border-t border-[#e0e5ec] p-4'>
            <div className='flex items-center mb-2'>
              <BookOpenIcon className='h-4 w-4 text-[#003366] mr-2' />
              <h3 className='text-xs font-medium text-gray-500 uppercase'>About this Course</h3>
            </div>
            <p className='text-[#2b3333] text-sm leading-relaxed'>{subject.about}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectInfo;
