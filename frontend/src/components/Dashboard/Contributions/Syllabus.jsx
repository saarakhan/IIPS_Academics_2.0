import React, { useEffect, useState } from "react";
import { SiBookstack } from "react-icons/si";
import { FaAngleRight } from "react-icons/fa6";
import noData from "../../../assets/noData.svg";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { CalendarIcon } from "../../../Icons";
import PreviewModal from "../../Admin/PreviewModal";
import { MdVisibility } from "react-icons/md";

function Card({ children }) {
  return <div className="bg-white border-b-2 cursor-pointer">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-4 flex items-center justify-between">{children}</div>;
}

export default function Syllabus({ fetchTrigger }) {
  const { session } = UserAuth();
  const [syllabusFiles, setSyllabusFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPreview, setShowPreview] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserSyllabus = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select(`
            id, title, uploaded_at, status, file_path,
            subject:subject_id (
              semester_number,
              course:course_id (name)
            )
          `)
          .eq("uploader_profile_id", session.user.id)
          .eq("resource_type", "SYLLABUS")
          .order("uploaded_at", { ascending: false });

        if (fetchError) throw fetchError;

        setSyllabusFiles(
          data.map((syllabus) => ({
            id: syllabus.id,
            title: syllabus.title,
            file_path: syllabus.file_path,
            semester: `${syllabus.subject?.course?.name || ""} Semester ${syllabus.subject?.semester_number || ""}`,
            date: syllabus.uploaded_at
              ? new Date(syllabus.uploaded_at).toLocaleDateString()
              : "N/A",
            status: syllabus.status,
          }))
        );
      } catch (err) {
        console.error("Error fetching syllabus:", err);
        setError(err.message || "Failed to fetch syllabus files.");
        setSyllabusFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSyllabus();
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

  if (loading) return <div className="text-center py-8">Loading your syllabus files...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2">
        {syllabusFiles.length > 0 ? (
          syllabusFiles.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                  <div className="flex gap-3 items-start flex-grow">
                    <div className="p-2 bg-gray-200 rounded-full shrink-0">
                      <SiBookstack className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base break-words">
                          {item.title}
                        </h3>
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 self-start ml-10 sm:ml-12">
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
                    {/* <FaAngleRight className="border-2 rounded-full w-5 h-5 sm:w-6 sm:h-6 shadow-[3px_4px_4px_rgba(0,0,0,0.25)]" /> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full justify-center flex flex-col items-center text-center">
            <img
              src={noData}
              className="w-[200px] md:w-[250px]"
              alt="No syllabus files uploaded"
            />
            <p className="mt-4 text-lg text-gray-700">
              You haven't uploaded any syllabus files yet.
            </p>
            <p className="text-sm text-gray-500">
              Click "Upload New Syllabus" to share your first one!
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
