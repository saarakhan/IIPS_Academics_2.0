import React, { useEffect, useState } from 'react';
import { DownloadIcon, EyeIcon, XIcon } from '../../../Icons';
import { supabase } from '../../../supabaseClient';

function ResourceItem({ id, title, file, uploaded_at, file_size_bytes }) {
  const [fileUrl, setFileUrl] = useState('');
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  // const [ratingCount, setRatingCount] = useState(0);
  const [hover, setHover] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Generate signed file URL
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage.from('uploads').createSignedUrl(file, 60 * 60, { download: false });

      if (data?.signedUrl) setFileUrl(data.signedUrl);
    })();
  }, [file]);

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Load user rating and resource average rating
  useEffect(() => {
    if (!user) return;

    (async () => {
      // Check if user has rated
      const { data: existingRating } = await supabase.from('ratings').select('rating_value').eq('profile_id', user.id).eq('resource_id', id).single();

      if (existingRating) {
        setUserRating(existingRating.rating_value);
        setHasRated(true);
      }

      // Load current avg and count from resource
      const { data: resourceData } = await supabase.from('resources').select('rating_average, rating_count').eq('id', id).single();

      if (resourceData) {
        setAvgRating(resourceData.rating_average || 0);
        // setRatingCount(resourceData.rating_count || 0);
      }
    })();
  }, [user, id]);

  // Submit a new rating
  const handleRating = async newRating => {
    if (!user || hasRated) return;

    const { error: insertError } = await supabase.from('ratings').upsert({
      profile_id: user.id,
      resource_id: id,
      rating_value: newRating,
    });

    if (insertError) {
      console.error('Rating insert error:', insertError.message);
      return;
    }

    // Get updated list of ratings for this resource
    const { data: allRatings, error: fetchError } = await supabase.from('ratings').select('rating_value').eq('resource_id', id);

    if (fetchError) {
      console.error('Fetch ratings error:', fetchError.message);
      return;
    }

    const count = allRatings.length;
    const total = allRatings.reduce((acc, r) => acc + r.rating_value, 0);
    const avg = parseFloat((total / count).toFixed(2));

    // Update the resource table with new avg/count
    const { error: updateError } = await supabase
      .from('resources')
      .update({
        rating_average: avg,
        rating_count: count,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Update resource error:', updateError.message);
      return;
    }

    // Update state
    setUserRating(newRating);
    setAvgRating(avg);
    // setRatingCount(count);
    setHasRated(true);
  };

  return (
    <>
      <li className='bg-white p-4 rounded-xl shadow-sm border hover:shadow-md'>
        <div className='flex justify-between'>
          <h4 className='font-semibold text-lg text-gray-800'>{title}</h4>

          <div className='flex gap-2'>
            <button onClick={() => setShowPreview(true)} className='flex items-center px-3 py-1.5 text-sm border rounded shadow-sm hover:text-blue-600'>
              <EyeIcon className='w-4 h-4 mr-1' /> Preview
            </button>
            <a href={fileUrl} download className='flex items-center px-3 py-1.5 text-sm bg-yellow-400 hover:bg-yellow-500 rounded shadow-sm'>
              <DownloadIcon className='w-4 h-4 mr-1' /> Download
            </a>
          </div>
        </div>

        <div className='flex gap-1 mt-2'>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              disabled={hasRated}
              className={`text-lg ${hover > 0 ? (star <= hover ? 'text-yellow-400' : 'text-gray-300') : star <= userRating ? 'text-yellow-400' : 'text-gray-300'} ${
                hasRated ? 'cursor-not-allowed' : ''
              }`}>
              ★
            </button>
          ))}
        </div>

        <div className='flex gap-4 text-xs text-gray-600 mt-3'>
          <span>📅 {uploaded_at ? new Date(uploaded_at).toLocaleDateString() : 'N/A'}</span>
          <span>📄 {(file_size_bytes / 1024 / 1024).toFixed(1)} MB</span>
          <span>⭐ {avgRating.toFixed(2)}</span>
        </div>
      </li>

      {showPreview && (
        <div onClick={() => setShowPreview(false)} className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div onClick={e => e.stopPropagation()} className='relative w-full max-w-5xl rounded-lg shadow-lg bg-white'>
            <button onClick={() => setShowPreview(false)} className='absolute top-3 right-3 bg-white rounded-full p-1 shadow-md'>
              <XIcon className='w-6 h-6 text-gray-600' />
            </button>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title='PDF Preview' className='w-full h-[80vh] rounded-b-lg' />
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceItem;
