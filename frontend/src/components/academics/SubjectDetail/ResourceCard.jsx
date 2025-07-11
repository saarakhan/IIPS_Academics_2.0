import {
  FiEye,
  FiDownload,
  FiShare2,
  FiBookmark,
  FiThumbsUp
} from 'react-icons/fi';
import { BookOpenIcon } from '../../../Icons';

const ResourceCard = ({ resource }) => {
  return (
    <div className='bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-2'>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
            <BookOpenIcon/>
          <div className='text-lg font-semibold'>{resource.title}</div>
        </div>
        <div className='flex items-center gap-2'>
          <button className='flex items-center gap-1 bg-yellow-300 px-3 py-1 rounded hover:bg-yellow-400'>
            <FiEye className='text-gray-700' />
            Preview
          </button>
          <button className='flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500'>
            <FiDownload className='text-gray-700' />
            Download
          </button>
        </div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {resource.tags?.map((tag, i) => (
          <span key={i} className='bg-gray-200 text-xs px-2 py-1 rounded-full'>
            {tag} 
          </span>
        ))}
      </div>
      {/* <div className='text-sm text-gray-600 flex flex-wrap gap-3 '>
          👤 {resource.uploadedBy}
          📅 {resource.date}
          📄 {resource.size}
          📥 {resource.downloads} Downloads
          ⭐ {resource.rating}/5.0
          👩‍🏫 {resource.instructor}
        </div> */}

      {/* Footer Icons */}
      {/* <div className='flex gap-4 justify-end text-gray-500'>
        <FiThumbsUp />
        <FiBookmark />
        <FiShare2 />
      </div> */}
    </div>
  );
};

export default ResourceCard;
