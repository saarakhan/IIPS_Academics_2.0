import React, { useState, useEffect } from 'react';
import { DownloadIcon, EyeIcon, XIcon } from '../../../Icons';
import { supabase } from '../../../supabaseClient'; // Make sure this path is correct

// Props for this component, based on what SubjectDetail prepares:
// { id (resource_id), title, file (file_path from storage), originalFileName }
function ResourceItem({ title, file, originalFileName }) { 
  const [showPreview, setShowPreview] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(true); // To show loading state for URL generation

  useEffect(() => {
    const generateFileAccessUrl = async () => {
      if (file) { // 'file' is the file_path from the 'resources' table
        setIsLoadingUrl(true);
        setFileUrl(''); // Reset while fetching/generating new URL

        // OPTION A: If your bucket ('academic_resources') is PUBLIC
        const BUCKET_NAME = 'academic_resources'; // Your actual bucket name
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file);
        if (publicUrlData?.publicUrl) {
          setFileUrl(publicUrlData.publicUrl);
        } else {
          console.error('Could not get public URL for:', file);
          setFileUrl(''); // Indicate URL is not available
        }
        setIsLoadingUrl(false);

        // OPTION B: If your bucket is PRIVATE and you need SIGNED URLs (as in your original bbc24d68 commit)
        // const BUCKET_NAME = 'uploads'; // YOUR ACTUAL PRIVATE BUCKET NAME
        // try {
        //   const { data, error } = await supabase.storage
        //     .from(BUCKET_NAME) 
        //     .createSignedUrl(file, 3600); // 3600 seconds = 1 hour validity

        //   if (error) {
        //     console.error('Error creating signed URL:', error);
        //     throw error; 
        //   }
          
        //   if (data && data.signedUrl) {
        //     setFileUrl(data.signedUrl);
        //   } else {
        //     console.error('No signed URL returned for:', file);
        //     setFileUrl('');
        //   }
        // } catch (err) {
        //   console.error('Failed to get signed URL:', err);
        //   setFileUrl(''); 
        // } finally {
        //   setIsLoadingUrl(false);
        // }

      } else {
        // console.warn('No file path provided to ResourceItem.');
        setFileUrl('');
        setIsLoadingUrl(false);
      }
    };
    generateFileAccessUrl();
  }, [file]); // Re-run if the file prop changes

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      // Use the originalFileName prop for the download attribute
      link.setAttribute('download', originalFileName || `${title}.pdf`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("File URL is not available for download.");
    }
  };

  return (
    <>
      <li className='bg-[#f8f9fa] p-3 rounded hover:bg-[#e9f0f8] transition flex justify-between items-center'>
        <span className='text-sm text-[#2b3333] truncate' title={title}>{title}</span>
        <div className='flex items-center gap-3 flex-shrink-0'>
          {isLoadingUrl ? (
            <span className="text-xs text-gray-400">Loading link...</span>
          ) : fileUrl ? (
            <>
              <button 
                onClick={() => setShowPreview(true)} 
                className='text-sm text-[#0077cc] hover:underline flex items-center cursor-pointer'
                title="Preview File"
              >
                <EyeIcon className='h-4 w-4 mr-1' />
                Preview
              </button>
              <button 
                onClick={handleDownload} 
                className='text-sm text-[#003366] hover:underline flex items-center'
                title="Download File"
              >
                <DownloadIcon className='h-4 w-4 mr-1' />
                Download
              </button>
            </>
          ) : (
            <span className="text-xs text-red-500">File Link Not Available</span>
          )}
        </div>
      </li>

      {showPreview && fileUrl && (
        <div onClick={() => setShowPreview(false)} className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4'>
          <div onClick={e => e.stopPropagation()} className='relative w-full max-w-5xl max-h-full rounded-lg shadow-lg bg-white overflow-hidden flex flex-col'>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h5 className="text-lg font-semibold text-gray-700 truncate" title={title}>{title}</h5>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-red-600 bg-transparent hover:bg-gray-200 rounded-full p-1.5"
                title="Close Preview"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            {/* Iframe for PDF preview */}
            <iframe src={fileUrl} title={`PDF Preview: ${title}`} className='w-full flex-grow rounded-b-lg' frameBorder='0' />
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceItem;