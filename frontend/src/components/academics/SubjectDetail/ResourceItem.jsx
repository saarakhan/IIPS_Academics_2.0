import React, { useState } from 'react';
import { DownloadIcon, EyeIcon, XIcon } from '../../../Icons';

function ResourceItem({ title, file, folder }) {
  const [showPreview, setShowPreview] = useState(false);
  const fileUrl = `/${folder}/${file}`;

  return (
    <>
      <li className='bg-[#f8f9fa] p-3 rounded hover:bg-[#e9f0f8] transition flex justify-between items-center'>
        <span className='text-sm text-[#2b3333]'>{title}</span>
        <div className='flex items-center gap-3'>
          <button onClick={() => setShowPreview(true)} className='text-sm text-[#0077cc] hover:underline flex items-center cursor-pointer'>
            <EyeIcon className='h-4 w-4 mr-1' />
            Preview
          </button>
          <a href={fileUrl} download className='text-sm text-[#003366] hover:underline flex items-center'>
            <DownloadIcon className='h-4 w-4 mr-1' />
            Download
          </a>
        </div>
      </li>

      {showPreview && (
        <div onClick={() => setShowPreview(false)} className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4'>
          <div onClick={e => e.stopPropagation()} className='relative w-full max-w-5xl max-h-full rounded-lg shadow-lg bg-white overflow-hidden'>
            <button
              onClick={() => setShowPreview(false)}
              className='absolute top-2 right-2 text-gray-600 hover:text-red-600 bg-white rounded-full p-1 shadow-md z-50 cursor-pointer '
              title='Close Preview'>
              <XIcon className='w-6 h-6' />
            </button>

            <iframe src={fileUrl} title='PDF Preview' className='w-full h-[80vh] rounded-b-lg' frameBorder='0' />
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceItem;
