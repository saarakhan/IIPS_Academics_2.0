import React from 'react';
import { Link } from 'react-router-dom';
const EmptyState = () => {
  return (
    <div>
      <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8] flex items-center justify-center p-4'>
        <div className='bg-white p-6 rounded-xl shadow-lg text-center max-w-md border border-[#e0e5ec]'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-[#2b3333] mb-2'>Subject Not Found</h2>
          <p className='text-gray-500 mb-5'>The subject you're looking for doesn't exist or has been removed.</p>
          <Link to='/academics'>
            <button className='bg-[#2B3333] hover:bg-[#002855] text-white py-2 px-6 rounded-lg transition duration-200 font-medium shadow-sm'>Back to Subjects</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
