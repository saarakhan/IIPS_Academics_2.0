import { useEffect, useState } from 'react';
import { UserAuth } from '../../../Context/AuthContext';
import { supabase } from '../../../supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon } from '../../../Icons';
import noData from '../../../assets/noData.svg';
import { DownloadIcon } from '../../../Icons';
import { MdArrowOutward } from 'react-icons/md';
import { CiFileOn } from 'react-icons/ci';
import { saveAs } from 'file-saver';

const Downloads = () => {
  const { session } = UserAuth();
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchDownloads = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('user_download_log')
          .select(`
            id, downloaded_at, 
            resource:resource_id (
              title, 
              file_path,
              subject:subject_id (name)
            )
          `)
          .eq('profile_id', session.user.id)
          .order('downloaded_at', { ascending: false });

        if (fetchError) throw fetchError;
        setDownloadHistory(data || []);
      } catch (err) {
        console.error('Error fetching download history:', err);
        setError(err.message || 'Failed to fetch download history.');
        setDownloadHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [session?.user?.id]);

  const downloadFile = async (filePath, title) => {
    const { data, error } = await supabase.storage.from('uploads').download(filePath);

    if (error) {
      console.error('Download error:', error.message);
      return;
    }

    const blob = data;
    saveAs(blob, `iips_academics_${title}.pdf`);
  };

  if (loading) {
    return <div className='text-center py-8'>Loading your download history...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-500'>Error: {error}</div>;
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header Section */}
      <div className='pb-4'>
        <p className='text-3xl font-bold'>Your Downloads</p>
        <p className='text-base text-gray-600'>Resources you've downloaded.</p>
      </div>

      {/* Scrollable Downloads List */}
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        {downloadHistory.length > 0 ? (
          <div className='space-y-3'>
            {downloadHistory.map(log => (
              <div
                key={log.id}
                className='bg-white shadow-sm rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors'
              >
                <div className='p-4'>
                  {/* Top Section */}
                  <div className='flex gap-4'>
                    <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full shrink-0'>
                      <CiFileOn className='w-5 h-5 text-gray-600' />
                    </div>

                    <div className='flex-grow min-w-0'>
                      <div className='flex flex-col'>
                        <h3 className='font-semibold text-lg text-gray-800 break-words whitespace-normal overflow-hidden'>
                          {log.resource?.title || 'Resource Title Unavailable'}
                        </h3>
                        {log.resource?.subject?.name && (
                          <p className='text-sm text-gray-500 mt-1 break-words whitespace-normal overflow-hidden'>
                            {log.resource.subject.name}
                          </p>
                        )}
                        <div className='flex items-center text-xs text-gray-500 mt-2'>
                          <CalendarIcon className='w-3 h-3 mr-1 shrink-0' />
                          <span className='truncate'>
                            Downloaded {formatDistanceToNow(new Date(log.downloaded_at))} ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className='flex gap-2 mt-3 ml-12'>
                    <button
                      onClick={() => downloadFile(log.resource?.file_path, log.resource?.title)}
                      className='flex items-center text-sm text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-200 transition-colors'
                    >
                      <DownloadIcon className='w-3.5 h-3.5 mr-1.5' />
                      Download again
                    </button>

                    <button
                      onClick={async () => {
                        const { data, error } = await supabase.storage
                          .from('uploads')
                          .createSignedUrl(log.resource?.file_path, 60 * 60);

                        if (error) {
                          console.error('Preview error:', error.message);
                          return;
                        }

                        setPreviewUrl(data.signedUrl);
                        setShowPreview(true);
                      }}
                      className='flex items-center text-sm text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-200 transition-colors'
                    >
                      <MdArrowOutward className='w-3.5 h-3.5 mr-1.5' />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='h-full flex flex-col justify-center items-center text-center py-8'>
            <img src={noData} className='w-[200px] md:w-[250px]' alt='No downloads yet' />
            <p className='mt-4 text-lg text-gray-700'>You haven't downloaded any resources yet.</p>
            <p className='text-sm text-gray-500'>Explore and download resources from the Academics section!</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='relative w-full max-w-5xl rounded-lg shadow-lg bg-white'>
            <button
              onClick={() => setShowPreview(false)}
              className='absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:text-red-500'
            >
              ✕
            </button>
            <iframe src={previewUrl} title='Preview' className='w-full h-[80vh] border rounded' />
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloads;

