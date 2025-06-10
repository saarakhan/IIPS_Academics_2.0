import { useEffect, useState } from "react";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon } from "../../../Icons";
import noData from "../../../assets/noData.svg";
import { DownloadIcon } from "../../../Icons";
import { MdArrowOutward } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";

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
  }, [session?.user?.id]);

  if (loading) {
    return <div className="text-center py-8">Loading your download history...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed height */}
      <div className="pb-4">
        <p className="text-3xl font-bold">Your Downloads</p>
        <p className="text-base text-gray-600">Resources you've downloaded.</p>
      </div>
      
      {/* Scrollable Downloads List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {downloadHistory.length > 0 ? (
          <div className="space-y-3">
            {downloadHistory.map((log) => (
              <div 
                key={log.id}
                className="bg-white shadow-sm rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="p-4">
                  {/* Top section */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                      <CiFileOn className="w-5 h-5" />
                    </div>

                    {/* Resource details */}
                    <div className="flex-grow">
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {log.resource?.title || "Resource Title Unavailable"}
                        </h3>
                        {log.resource?.subject?.name && (
                          <p className="text-sm text-gray-500 mt-1">
                            {log.resource.subject.name}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          <span>
                            Downloaded {formatDistanceToNow(new Date(log.downloaded_at))} ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3 ml-12">
                    <button className="flex items-center text-sm text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">
                      <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
                      Download again
                    </button>
                    <button className="flex items-center text-sm text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MdArrowOutward className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center py-8">
            <img
              src={noData}
              className="w-[200px] md:w-[250px]"
              alt="No downloads yet"
            />
            <p className="mt-4 text-lg text-gray-700">You haven't downloaded any resources yet.</p>
            <p className="text-sm text-gray-500">
              Explore and download resources from the Academics section!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
