import React, { useEffect, useState } from 'react';
import { DownloadIcon, EyeIcon, XIcon } from '../../../Icons';
import { supabase } from '../../../supabaseClient';

// const badgeStyles = {
//   Syllabus: 'bg-orange-200 text-orange-800',
//   'Subject Notes': 'bg-blue-200 text-blue-800',
//   Assignment: 'bg-green-200 text-green-800',
//   Exam: 'bg-yellow-200 text-yellow-800',
// };

function ResourceItem({ id, title, file, folder, type, uploaded_at, file_size_bytes, rating_average }) {
  const [showPreview, setShowPreview] = useState(false);
  const [rating, setRating] = useState(rating_average || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  // let fileUrl = `${file}`;

  // id/resource_type/file
  // signed url for preview
  useEffect(() => {
    const getSignedUrl = async () => {
      const { data, error } = await supabase.storage.from('uploads').createSignedUrl(file, 60 * 60, { download: false });

      if (!error && data?.signedUrl) {
        setFileUrl(data.signedUrl);
      } else {
        console.error('Error creating signed URL:', error);
      }
    };

    getSignedUrl();
  }, [folder, file]);

  // check if user has already rated using local storage
  useEffect(() => {
    const ratedBefore = localStorage.getItem(`rated-${id}`);
    setHasRated(!!ratedBefore);
  }, [id]);

  const handleRating = async newRating => {
    if (hasRated) return;

    try {
      const { data: resource, error: fetchError } = await supabase.from('resources').select('rating_average, rating_count').eq('id', id).single();

      if (fetchError) throw fetchError;

      const prevTotal = (resource.rating_average || 0) * (resource.rating_count || 0);
      const updatedCount = (resource.rating_count || 0) + 1;
      const newAverage = (prevTotal + newRating) / updatedCount;

      const { error: updateError } = await supabase
        .from('resources')
        .update({
          rating_average: newAverage,
          rating_count: updatedCount,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setRating(newAverage);
      localStorage.setItem(`rated-${id}`, 'true');
      setHasRated(true);
    } catch (err) {
      console.error('Failed to update rating:', err.message);
    }
  };

  return (
    <>
      <li className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
        {/* Title and Tags */}
        <div className='flex justify-between items-start mb-2'>
          <div>
            <h4 className='font-semibold text-lg text-gray-800'>{title}</h4>
            {/* <div className="flex flex-wrap gap-2 mt-1 border">
              {type && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    badgeStyles[type] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  
                  {type}
                </span>
              )}
            </div> */}
          </div>

          <div className='flex flex-col '>
            <div className='flex gap-3'>
              <button onClick={() => setShowPreview(true)} className='flex items-center px-3 py-1.5 text-sm font-medium text-gray-800 hover:text-blue-600 border rounded shadow-sm'>
                <EyeIcon className='w-4 h-4 mr-1' />
                Preview
              </button>
              <a href={fileUrl} download className='flex items-center px-3 py-1.5 text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-black rounded shadow-sm'>
                <DownloadIcon className='w-4 h-4 mr-1' />
                Download
              </a>
            </div>

            <div className='flex gap-1 mt-2'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={hasRated}
                  className={`text-lg ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'} ${hasRated ? 'cursor-not-allowed' : ''}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        {/*dynamically aaega  */}
        <div className='flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2 -mt-2'>
          <span>📅 {uploaded_at ? new Date(uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
          {/* <span>{uploaded_at}</span> */}
          <span>📄 {(file_size_bytes / 1024 / 1024).toFixed(1)} MB</span>
          <span>⬇️ 19 Downloads</span>
          <span className='flex items-center'>⭐ {rating.toFixed(1)}/5.0</span>
        </div>
      </li>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div onClick={() => setShowPreview(false)} className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div onClick={e => e.stopPropagation()} className='relative w-full max-w-5xl max-h-full rounded-lg shadow-lg bg-white overflow-hidden'>
            <button onClick={() => setShowPreview(false)} className='absolute top-2 right-2 text-gray-600 hover:text-red-600 bg-white rounded-full p-1 shadow-md z-50 cursor-pointer'>
              <XIcon className='w-6 h-6' />
            </button>
            <iframe src={fileUrl} title='PDF Preview' className='w-full h-[100vh] rounded-b-lg' frameBorder='0' />
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceItem;
