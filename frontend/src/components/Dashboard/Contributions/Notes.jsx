import React, { useEffect, useState } from "react";
import { BookIcon, CalendarIcon, StarIcon } from "../../../Icons";
import { FaAngleRight } from "react-icons/fa6";
import noData from "../../../assets/noData.svg";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import PreviewModal from "../../Admin/PreviewModal";
import { MdVisibility } from "react-icons/md";

function Card({ children }) {
  return (
    <div className="bg-white border-b-2 cursor-pointer">{children}</div>
  );
}

function CardContent({ children }) {
  return (
    <div className="p-4 flex items-center justify-between">{children}</div>
  );
}

export default function Notes({ canUpload, fetchTrigger }) {
  const { session } = UserAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select(
            `
            id, title, uploaded_at, rating_average, status, file_path
            subject:subject_id (
              semester_number,
              course:course_id (name)
            )
          `
          )
          .eq("uploader_profile_id", session.user.id)
          .eq("resource_type", "NOTE")
          .order("uploaded_at", { ascending: false });

        if (fetchError) throw fetchError;

        setNotes(
          data.map((note) => ({
            id: note.id,
            title: note.title,
            file_path: note.file_path, 
            semester: `${note.subject?.course?.name || ""} Semester ${
              note.subject?.semester_number || ""
            }`,
            date: note.uploaded_at
              ? new Date(note.uploaded_at).toLocaleDateString()
              : "N/A",
            rating: note.rating_average || 0,
            status: note.status,
          }))
        );
      } catch (err) {
        console.error("Error fetching user notes:", err);
        setError(err.message || "Failed to fetch notes.");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotes();
  }, [session?.user?.id, fetchTrigger]);

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

  if (loading) {
    return <div className="text-center py-8">Loading your notes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2">
        {notes.length > 0 ? (
          notes.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                  <div className="flex gap-3 items-start flex-grow">
                    <div className="p-2 bg-gray-200 rounded-full shrink-0">
                      <BookIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base break-words max-w-full overflow-hidden text-ellipsis whitespace-normal">
                          {item.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#3B3838]">{item.semester} </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{item.date}</span>
                        </span>
                        <span className="flex items-center gap-1 sm:ml-4">
                          {item?.rating > 0 ? (
                            <>
                              <span>
                                <StarIcon className="w-4 h-4 text-[#C79745]" />
                              </span>
                              <span className="text-xs sm:text-sm">
                                {item?.rating}/5.0
                              </span>
                            </>
                          ) : (
                            " no ratings"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 sm:mt-0 self-start ml-10 sm:ml-12">
                    <button
                      onClick={() => {
                        setSelectedFile(item.file_path);
                        setShowPreview(true);
                      }}
                      className="inline-flex items-center text-sm font-medium text-[#2B3333] border border-[#2B3333] hover:bg-[#2B3333] hover:text-white transition px-3 py-1 rounded"
                    >
                      <MdVisibility className="w-4 h-4 mr-1" />
                      Preview
                    </button>

                    {/* <FaAngleRight className="border-2 rounded-full w-5 h-5 sm:w-6 sm:h-6 shadow-[3px_4px_4px_rgba(0,0,0,0.25)] " /> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full justify-center flex flex-col items-center text-center ">
            <img
              src={noData}
              className="w-[200px] md:w-[250px]"
              alt="No notes uploaded"
            />
            <p className="mt-4 text-lg text-gray-700">
              You haven't uploaded any notes yet.
            </p>
            <p className="text-sm text-gray-500">
              Click "Upload New Note" to share your first one!
            </p>
          </div>
        )}
      </div>

      {showPreview && selectedFile && (
        <PreviewModal
          filePath={selectedFile}
          onClose={() => {
            setShowPreview(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
}
