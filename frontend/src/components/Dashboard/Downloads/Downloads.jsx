import { useEffect, useState } from "react";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { BookIcon, CalendarIcon } from "../../../Icons"; // Assuming you'll use these
import noData from "../../../assets/noData.svg"; // For empty state
import { DownloadIcon } from "../../../Icons";
import { MdArrowOutward } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";

const Downloads = () => {
  const { session } = UserAuth();
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const downloadHistory = [
  //   {
  //     id: 1,
  //     downloaded_at: "2025-05-20T10:30:00Z",
  //     resource: {
  //       title: "Data Structures Notes",
  //       subject: {
  //         name: "Computer Science",
  //       },
  //     },
  //   },
  //   {
  //     id: 2,
  //     downloaded_at: "2025-05-18T14:45:00Z",
  //     resource: {
  //       title: "Microeconomics Slides",
  //       subject: {
  //         name: "Economics",
  //       },
  //     },
  //   },
  //   {
  //     id: 3,
  //     downloaded_at: "2025-05-15T09:10:00Z",
  //     resource: {
  //       title: "Organic Chemistry Lab Manual",
  //       subject: {
  //         name: "Chemistry",
  //       },
  //     },
  //   },
  //   {
  //     id: 4,
  //     downloaded_at: "2025-05-10T17:00:00Z",
  //     resource: {
  //       title: null, // Title unavailable
  //       subject: {
  //         name: "Physics",
  //       },
  //     },
  //   },
  //   {
  //     id: 5,
  //     downloaded_at: "2025-05-08T12:00:00Z",
  //     resource: {
  //       title: "World History Summary",
  //       subject: null, // Subject unavailable
  //     },
  //   },
  // ];

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
    return (
      <div className="text-center py-8">Loading your download history...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-[450px] overflow-y-auto pr-2 custom-scrollbar">
      <p className="text-3xl font-bold ">Your Downloads</p>
      <p className="text-base ">Resources you've downloaded.</p>
      {downloadHistory.length > 0 ? (
        downloadHistory.map((log) => (
          <div className="bg-white shadow-sm border-b-2 cursor-pointer">
            <div className="p-4 flex flex-col gap-4">
              {/* top section  */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full">
                <div className="h-fit p-2 bg-gray-200 rounded-full w-fit">
                  <CiFileOn className="w-6 h-6" />
                </div>

                {/* Resource details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-xl text-gray-800">
                      {log.resource?.title || "Resource Title Unavailable"}
                    </h3>
                  </div>
                  {log.resource?.subject?.name && (
                    <p className="text-sm text-gray-500">
                      {log.resource.subject.name}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>
                      about {formatDistanceToNow(new Date(log.downloaded_at))}{" "}
                      ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:ml-12">
                <button className="flex items-center text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100">
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  Download again
                </button>
                <button className="flex items-center text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100">
                  <MdArrowOutward className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full justify-center flex flex-col items-center text-center ">
          <img
            src={noData}
            className="w-[250px] md:w-[300px]"
            alt="No downloads yet"
          />
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
