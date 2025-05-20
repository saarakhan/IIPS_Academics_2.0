'use client';

import { useParams, Link } from 'react-router-dom';
import subjects from '../../Subject';
import { ArrowLeftIcon, BookOpenIcon, DocumentTextIcon, ClipboardListIcon, CalendarIcon, UserIcon, BuildingIcon, DownloadIcon, ShareIcon } from '../../Icons';

function SubjectDetail() {
  // SUPABASE API FOR RESOURCES
  const { id } = useParams();
  const subject = subjects.find(sub => sub.id === Number.parseInt(id));

  if (!subject) {
    return (
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
          <Link to='/'>
            <button className='bg-[#003366] hover:bg-[#002855] text-white py-2 px-6 rounded-lg transition duration-200 font-medium shadow-sm'>Back to Subjects</button>
          </Link>
        </div>
      </div>
    );
  }

  const baseName = subject.name.toLowerCase();

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <header className='bg-gradient-to-r from-[#002855] to-[#004080] text-white shadow-md'>
        <div className='container mx-auto py-5 px-6'>
          <div className='flex justify-between items-center mb-1'>
            <Link to='/' className='inline-flex items-center text-white/90 hover:text-white transition text-sm bg-white/10 px-3 py-1 rounded-full'>
              <ArrowLeftIcon className='h-4 w-4 mr-1' />
              Back
            </Link>
          </div>
          <h1 className='text-2xl font-bold'>{subject.name}</h1>
          <div className='flex items-center mt-1 text-sm text-white/80'>
            <BuildingIcon className='h-3.5 w-3.5 mr-1.5' />
            {subject.department || 'Department'}
            {subject.code && (
              <>
                <span className='mx-2'>•</span>
                <span className='font-medium'>{subject.code}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className='container mx-auto py-6 px-6'>
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
        <div className='mb-4 flex justify-between items-center'>
          <h2 className='text-lg font-bold text-[#2b3333]'>Course Resources</h2>
          <span className='text-xs bg-[#e9f0f8] text-[#003366] px-2 py-1 rounded-full'>3 items</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white border border-[#e0e5ec] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group'>
            <div className='flex items-center p-4 border-b border-[#e0e5ec]'>
              <div className='bg-[#e9f0f8] p-2 rounded-full mr-3 group-hover:bg-[#003366] transition-colors'>
                <BookOpenIcon className='h-4 w-4 text-[#003366] group-hover:text-white transition-colors' />
              </div>
              <div>
                <h3 className='font-semibold text-[#2b3333] group-hover:text-[#003366] transition-colors'>Lecture Notes</h3>
                <p className='text-xs text-gray-500'>Complete course notes</p>
              </div>
            </div>
            <div className='p-4 bg-[#f8f9fa]'>
              <a
                href={`/notes/${baseName}.pdf`}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-center w-full bg-[#003366] hover:bg-[#002855] text-white py-2 px-4 rounded-md transition duration-200 shadow-sm group-hover:shadow text-sm font-medium'>
                <DownloadIcon className='h-4 w-4 mr-2' />
                Download Notes
              </a>
            </div>
          </div>

          <div className='bg-white border border-[#e0e5ec] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group'>
            <div className='flex items-center p-4 border-b border-[#e0e5ec]'>
              <div className='bg-[#e9f0f8] p-2 rounded-full mr-3 group-hover:bg-[#003366] transition-colors'>
                <ClipboardListIcon className='h-4 w-4 text-[#003366] group-hover:text-white transition-colors' />
              </div>
              <div>
                <h3 className='font-semibold text-[#2b3333] group-hover:text-[#003366] transition-colors'>Previous Year Questions</h3>
                <p className='text-xs text-gray-500'>Exam preparation</p>
              </div>
            </div>
            <div className='p-4 bg-[#f8f9fa]'>
              <a
                href={`/pyqs/${baseName}.pdf`}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-center w-full bg-[#003366] hover:bg-[#002855] text-white py-2 px-4 rounded-md transition duration-200 shadow-sm group-hover:shadow text-sm font-medium'>
                <DownloadIcon className='h-4 w-4 mr-2' />
                Download PYQs
              </a>
            </div>
          </div>

          <div className='bg-white border border-[#e0e5ec] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group'>
            <div className='flex items-center p-4 border-b border-[#e0e5ec]'>
              <div className='bg-[#e9f0f8] p-2 rounded-full mr-3 group-hover:bg-[#003366] transition-colors'>
                <DocumentTextIcon className='h-4 w-4 text-[#003366] group-hover:text-white transition-colors' />
              </div>
              <div>
                <h3 className='font-semibold text-[#2b3333] group-hover:text-[#003366] transition-colors'>Course Syllabus</h3>
                <p className='text-xs text-gray-500'>Learning objectives</p>
              </div>
            </div>
            <div className='p-4 bg-[#f8f9fa]'>
              <a
                href={`/syllabus/${baseName}.pdf`}
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-center w-full bg-[#003366] hover:bg-[#002855] text-white py-2 px-4 rounded-md transition duration-200 shadow-sm group-hover:shadow text-sm font-medium'>
                <DownloadIcon className='h-4 w-4 mr-2' />
                Download Syllabus
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
