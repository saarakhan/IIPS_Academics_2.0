import React, { useEffect, useState } from "react";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { DownloadIcon, CalendarIcon } from "../../../Icons"; // Assuming you'll use these
import noData from "../../../assets/noData.svg"; // For empty state

const Downloads = () => {
  const { session } = UserAuth();
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          .from("user_download_log")
          .select(
            `
            id, downloaded_at, 
            resource:resource_id (
              title, 
              subject:subject_id (name)
            )
          `
          )
          .eq("profile_id", session.user.id)
          .order("downloaded_at", { ascending: false });

        if (fetchError) throw fetchError;
        setDownloadHistory(data || []);
      } catch (err) {
        console.error("Error fetching download history:", err);
        setError(err.message || "Failed to fetch download history.");
        setDownloadHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [session]);

  if (loading) {
    return <div className="text-center py-8">Loading your download history...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-3 flex flex-col gap-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar p-4">
      {downloadHistory.length > 0 ? (
        downloadHistory.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">
                {log.resource?.title || "Resource Title Unavailable"}
              </h3>
              {/* You could add a download button again here if needed */}
            </div>
            {log.resource?.subject?.name && (
              <p className="text-sm text-gray-600 mb-1">
                Subject: <span className="font-medium">{log.resource.subject.name}</span>
              </p>
            )}
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>
                Downloaded on: {new Date(log.downloaded_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full justify-center flex flex-col items-center text-center py-10">
          <img src={noData} className="w-[250px] md:w-[300px]" alt="No downloads yet" />
          <p className="mt-4 text-xl text-gray-700">
            You haven't downloaded any resources yet.
          </p>
          <p className="text-sm text-gray-500">
            Explore and download resources from the Academics section!
          </p>
        </div>
      )}
    </div>
  );
};

export default Downloads;
