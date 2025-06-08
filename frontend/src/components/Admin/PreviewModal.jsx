import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function PreviewModal({ filePath, onClose }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    async function fetchSignedUrl() {
      const { data, error } = await supabase.storage
        .from("uploads")
        .createSignedUrl(filePath, 1000);

      if (error) {
        console.error("Error fetching signed URL:", error);
        setError("Failed to load preview");
      } else {
        setUrl(data.signedUrl);
      }
    }
    fetchSignedUrl();
    return () => {
      document.body.style.overflow = "";
    };
  }, [filePath]);

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded font-bold"
        >
          ✕
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {!url && !error && <p>Loading preview...</p>}
        {url && (
          <iframe
            src={url}
            className="w-full h-full"
            title="PDF Preview"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
}
