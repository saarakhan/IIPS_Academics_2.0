import { BookOpenIcon, UserIcon, BuildingIcon } from '../../../Icons';

function SubjectCard({ subject, onClick }) {
  return (
    <div className='group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all  border border-[#e0e5ec] transform hover:-translate-y-1'>
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] to-[#0056b3]'></div>
      <div className='p-5 pb-3'>
        <div className='flex justify-between items-start'>
          <div className='flex-1 pr-4'>
            <h3 className='text-[#003366] text-lg font-bold group-hover:text-[#0056b3] line-clamp-2'>
              {subject.code ? `${subject.code}: ` : ''}
              {subject.name}
            </h3>
            <div className='flex items-center mt-1'>
              <BuildingIcon className='h-3.5 w-3.5 text-gray-400 mr-1.5' />
              <p className='text-sm text-gray-600'>{subject.department || 'Department'}</p>
            </div>
          </div>
          <div className='bg-[#f0f4f8] p-2 rounded-full flex-shrink-0 group-hover:bg-[#003366]'>
            <BookOpenIcon className='h-5 w-5 text-[#003366] group-hover:text-white' />
          </div>
        </div>
      </div>
      <div className='px-5 py-3'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-[#f8f9fa] p-3 rounded-lg'>
            <p className='text-xs text-gray-500 uppercase mb-1'>Year</p>
            <div className='text-sm font-bold text-[#2b3333]'>{subject.year || 'Not specified'}</div>
          </div>
          <div className='bg-[#f8f9fa] p-3 rounded-lg'>
            <p className='text-xs text-gray-500 uppercase mb-1'>Semester</p>
            <div className='text-sm font-bold text-[#2b3333]'>{subject.semester}</div>
          </div>
        </div>
        <div className='mt-4 flex items-center'>
          <UserIcon className='h-4 w-4 text-gray-400 mr-2' />
          <span className='text-sm text-gray-600'>
            Instructor: <span className='font-medium text-[#2b3333]'>{subject.teacher}</span>
          </span>
        </div>
      </div>
      <div className='p-5 pt-3'>
        <button onClick={() => onClick(subject.id)} className='w-full bg-[#003366] hover:bg-[#002855] text-white py-2.5 rounded-lg transition-colors shadow-sm font-medium cursor-pointer'>
          View Details
        </button>
      </div>
    </div>
  );
}

export default SubjectCard;
