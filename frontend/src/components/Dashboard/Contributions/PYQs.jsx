import React, { useEffect, useState } from "react";
import noData from "../../../assets/noData.svg";
import { FaAngleRight } from "react-icons/fa6";
import { IoNewspaperOutline } from "react-icons/io5";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { CalendarIcon, StarIcon } from "../../../Icons";

function Card({ children }) {
  return <div className="bg-white border-b-2 cursor-pointer">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-4 flex items-center justify-between">{children}</div>;
}

export default function PYQs({ canUpload, fetchTrigger }) {
  const { session } = UserAuth();
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return setLoading(false);

    const fetchUserPYQs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select(`
            id, title, uploaded_at, rating_average, status,
            subject:subject_id (
              semester_number,
              course:course_id (name)
            )
          `)
          .eq("uploader_profile_id", session.user.id)
          .eq("resource_type", "PYQ")
          .order("uploaded_at", { ascending: false });

        if (fetchError) throw fetchError;

        setPyqs(
          data.map((pyq) => ({
            id: pyq.id,
            title: pyq.title,
            semester: `${pyq.subject?.course?.name || ""} Semester ${pyq.subject?.semester_number || ""}`,
            date: pyq.uploaded_at ? new Date(pyq.uploaded_at).toLocaleDateString() : "N/A",
            status: pyq.status,
            rating: pyq.rating_average || 0,
          }))
        );
      } catch (err) {
        console.error("Error fetching user PYQs:", err);
        setError(err.message || "Failed to fetch PYQs.");
        setPyqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPYQs();
  }, [fetchTrigger, session?.user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center py-8">Loading your PYQs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2">
        {pyqs.length > 0 ? (
          pyqs.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-gray-200 rounded-full shrink-0">
                      <IoNewspaperOutline className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base break-words">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#3B3838]">{item.semester}</p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{item.date}</span>
                        </span>
                        {item.rating > 0 && (
                          <span className="flex items-center gap-1 sm:ml-4">
                            <StarIcon className="w-4 h-4 text-[#C79745]" />
                            <span className="text-xs sm:text-sm">{item.rating}/5.0</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6 self-start sm:self-center ml-auto sm:ml-12">
                    <FaAngleRight className="border-2 rounded-full w-5 h-5 sm:w-6 sm:h-6 shadow-[3px_4px_4px_rgba(0,0,0,0.25)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full justify-center flex flex-col items-center text-center">
            <img src={noData} className="w-[200px] md:w-[250px]" alt="No PYQs uploaded" />
            <p className="mt-4 text-lg text-gray-700">You haven't uploaded any PYQs yet.</p>
            <p className="text-sm text-gray-500">Click "Upload New PYQ" to share your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

