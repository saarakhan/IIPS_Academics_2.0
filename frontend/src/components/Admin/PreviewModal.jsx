import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function PreviewModal({ filePath, onClose }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Disable page scroll when modal is open
    document.body.style.overflow = 'hidden';

    async function fetchSignedUrl() {
      const { data, error } = await supabase.storage
        .from('uploads')
        .createSignedUrl(filePath, 1000);

      if (error) {
        console.error('Error fetching signed URL:', error);
        setError('Failed to load preview');
      } else {
        setUrl(data.signedUrl);
      }
    }

    fetchSignedUrl();

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [filePath]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full h-full bg-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full shadow-md"
        >
          ✕
        </button>

        {/* Status Messages */}
        {error && (
          <p className="text-red-600 text-center mt-20 text-lg">{error}</p>
        )}
        {!url && !error && (
          <p className="text-gray-600 text-center mt-20 text-lg">
            Loading preview...
          </p>
        )}

        {/* PDF Iframe */}
        {url && (
          <iframe
            src={url}
            title="PDF Preview"
            className="w-full h-full"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
}
