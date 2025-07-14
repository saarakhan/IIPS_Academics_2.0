// src/components/Teacher/TeacherDashboardPage.jsx
import { useState, useEffect } from "react";
import { UserAuth } from "../../Context/AuthContext";
import TeacherResourceUploadModal from "./TeacherResourceUploadModal";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { supabase } from "../../supabaseClient";
import { BookIcon, CalendarIcon, StarIcon } from "../../Icons";
import noData from "../../assets/noData.svg";
import ResourceCard from "../Admin/ResourceCard";
import StatusSummary from "../Admin/StatusSummary";
import ResourceFilter from "../Admin/ResourceFilter";
import PreviewModal from "../Admin/PreviewModal";
import { MdVisibility } from "react-icons/md";
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

function Card({ children }) {
  return <div className="bg-white border-b-2 cursor-pointer">{children}</div>;
}

function CardContent({ children }) {
  return (
    <div className="p-4 flex items-center justify-between">{children}</div>
  );
}

const TeacherDashboardPage = () => {
  const { session, user, profile } = UserAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [view, setView] = useState("ALL");
  const [uploadedResources, setUploadedResources] = useState([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [counts, setCounts] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [filters, setFilters] = useState({ status: "PENDING", subject: "", contributor: "", course: "" });
  const [departments, setDepartments] = useState([]);
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const numberResourceDisplay = 5;
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState("Notes");
  const tabs = ["Notes", "PYQs", "Syllabus"];

  let teacherName = "Teacher";
  if (profile) {
    if (profile.first_name || profile.last_name) {
      teacherName = `${profile.first_name || ""} ${
        profile.last_name || ""
      }`.trim();
    } else if (profile.full_name) {
      teacherName = profile.full_name;
    }
  }

  // Helper: fetch subject IDs for this teacher
  const fetchTeacherSubjectIds = async (teacherId) => {
    const { data, error } = await supabase
      .from("subjects")
      .select("id")
      .eq("teacher_id", teacherId);
    if (error) {
      console.error("Error fetching teacher's subjects:", error);
      return [];
    }
    return data.map((s) => s.id);
  };

  // Fetch resources for teacher's subjects (ALL view)
  const fetchTeacherSubjectResources = async (status = "PENDING", page = 0, currentFilters = filters) => {
    setLoading(true);
    if (!profile?.id) {
      setResources([]);
      setFiltered([]);
      setLoading(false);
      return;
    }
    const subjectIds = await fetchTeacherSubjectIds(profile.id);
    if (!subjectIds.length) {
      setResources([]);
      setFiltered([]);
      setLoading(false);
      return;
    }
    const from = page * numberResourceDisplay;
    const to = from + numberResourceDisplay - 1;
    let query = supabase
      .from("resources")
      .select(`*, profiles!resources_uploader_profile_id_fkey(first_name, last_name, course, semester), subjects(name)`)
      .in("subject_id", subjectIds)
      .order("updated_at", { ascending: false })
      .range(from, to);
    if (status && status !== "ALL") query = query.eq("status", status);
    const { data, error } = await query;
    if (!error) {
      const all = page === 0 ? data : [...resources, ...data];
      setResources(all);
      applyFilters(all, currentFilters);
      setHasMore(data.length >= numberResourceDisplay);
    }
    setLoading(false);
  };

  // Fetch teacher resources
  const fetchTeacherResources = async () => {
    const userId = session?.user?.id || user?.id;
    if (!userId) return;
    setIsLoadingResources(true);
    // setFetchError(null);
    try {
      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          id,
          title,
          resource_type,
          status,
          uploaded_at,
          file_path,
          subject:subject_id ( name, code, semester_number),
          course:subject_id ( course:course_id ( name ) )
        `
        )
        .eq("uploader_profile_id", userId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setUploadedResources(data || []);
    } catch (err) {
      console.error("Error fetching teacher resources:", err);
      setFetchError("Could not load your resources.");
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Update counts for teacher's subjects
  const updateCounts = async () => {
    if (!profile?.id) {
      setCounts({ total: 0, approved: 0, rejected: 0, pending: 0 });
      return;
    }
    const subjectIds = await fetchTeacherSubjectIds(profile.id);
    if (!subjectIds.length) {
      setCounts({ total: 0, approved: 0, rejected: 0, pending: 0 });
      return;
    }
    const [total, approved, rejected, pending] = await Promise.all([
      supabase.from("resources").select("*", { count: "exact", head: true }).in("subject_id", subjectIds),
      supabase.from("resources").select("*", { count: "exact", head: true }).in("subject_id", subjectIds).eq("status", "APPROVED"),
      supabase.from("resources").select("*", { count: "exact", head: true }).in("subject_id", subjectIds).eq("status", "REJECTED"),
      supabase.from("resources").select("*", { count: "exact", head: true }).in("subject_id", subjectIds).eq("status", "PENDING"),
    ]);
    setCounts({
      total: total.count || 0,
      approved: approved.count || 0,
      rejected: rejected.count || 0,
      pending: pending.count || 0,
    });
  };

  const applyFilters = (data, { status, subject, contributor, course }) => {
    const filtered = data.filter((r) => {
      const matchesStatus = !status || status === "ALL" || r.status === status;
      const matchesSubject =
        !subject ||
        r.subjects?.name?.toLowerCase().includes(subject.toLowerCase());
      const fullName = `${r.profiles?.first_name || ""} ${
        r.profiles?.last_name || ""
      }`.toLowerCase();
      const matchesContributor =
        !contributor || fullName.includes(contributor.toLowerCase());
      const matchesCourse =
        !course ||
        r.profiles?.course?.toLowerCase().includes(course.toLowerCase());
      return (
        matchesStatus && matchesSubject && matchesContributor && matchesCourse
      );
    });

    setFiltered(filtered);
  };

  const handleStatusChange = (status) => {
    const resetFilters = { status, subject: "", contributor: "", course: "" };
    setFilters(resetFilters);
    setActiveStatus(status);
    setPage(0);
    fetchTeacherSubjectResources(status, 0, resetFilters);
  };

  const handleAction = async () => {
    setPage(0);
    setResources([]);
    await fetchTeacherSubjectResources(activeStatus, 0);
    await updateCounts();
  };

  const loadMoreResources = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTeacherSubjectResources(activeStatus, nextPage);
  };

  useEffect(() => {
    fetchTeacherResources(); // for 'MINE' view
    updateCounts();
    fetchTeacherSubjectResources(activeStatus, 0, filters); // for 'ALL' view
    supabase
      .from("courses")
      .select("id, name")
      .order("name", { ascending: false })
      .then(({ data }) => {
        setDepartments(data || []);
      });
  }, [session?.user?.id, isUploadModalOpen]);

  const handleResourceUploaded = () => {
    fetchTeacherResources();
    setIsUploadModalOpen(false); // close modal after upload
  };

  const notes = uploadedResources.filter((r) => r.resource_type === "NOTE");
  const pyqs = uploadedResources.filter((r) => r.resource_type === "PYQ");
  const syllabus = uploadedResources.filter(
    (r) => r.resource_type === "SYLLABUS"
  );

  return (
    <div className="min-h-screen bg-[#F4F9FF] p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Teacher Dashboard
        </h1>
        <p className="text-lg text-gray-600">Welcome, {teacherName}!</p>
      </header>

      <div className="mb-6">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 bg-[#C79745] text-white font-semibold rounded-md shadow hover:bg-[#b3863c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C79745] focus:ring-offset-2 w-[100%] md:w-[20%]"
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Upload New Resource
        </button>
      </div>

      <TeacherResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onResourceUploaded={handleResourceUploaded}
      />

      <div className="flex gap-4 mb-6 justify-center items-center md:justify-start">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            view === "ALL" ? "bg-[#2B3333] text-white" : "bg-white border"
          }`}
          onClick={() => setView("ALL")}
        >
          All Resources
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            view === "MINE" ? "bg-[#2B3333] text-white" : "bg-white border"
          }`}
          onClick={() => setView("MINE")}
        >
          My Uploads
        </button>
      </div>

      {view === "ALL" ? (
        <div className="bg-white rounded-md shadow p-6">
          <StatusSummary counts={counts} onStatusClick={handleStatusChange} />
          <ResourceFilter
            filters={{ ...filters, status: activeStatus }}
            onChange={(newFilters) => {
              setFilters(newFilters);
              applyFilters(resources, newFilters);
            }}
            onStatusChange={handleStatusChange}
            departments={departments}
          />
          {loading ? (
            <p className="mt-4">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="mt-4 text-center text-gray-500">
              No resources found.
            </p>
          ) : (
            <>
              <div className="space-y-4 mt-4">
                {filtered.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onAction={handleAction}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreResources}
                    className="px-6 py-2 bg-[#2B3333] text-white rounded-md hover:bg-black"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <section className="mt-8 bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Upload History
          </h2>
          <div className="grid grid-cols-3 gap-2 p-1 mb-6 border-2 rounded-sm w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full px-4 py-2 rounded-sm font-medium text-center transition-colors ${
                  activeTab === tab
                    ? "bg-[#2B3333] text-white"
                    : "bg-gray-[#FEFEFE] text-black hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === "Notes" &&
              (notes.length > 0 ? (
                <>
                  {notes.map((item) => (
                    <Card key={item.id}>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                          {/* Left Content */}
                          <div className="flex items-start gap-3 flex-grow w-full">
                            <div className="p-2 bg-gray-200 rounded-full shrink-0">
                              <BookIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm sm:text-base break-words">
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

                              <div className="flex gap-4 flex-wrap">
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.course?.name || ""}{" "}
                                  {item.subject?.name
                                    ? `- ${item.subject.name}`
                                    : ""}
                                </p>
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.semester_number
                                    ? `Semester - ${item.subject.semester_number}`
                                    : ""}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-2 text-sm text-[#3B3838]">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span className="text-xs sm:text-sm">
                                    {item.uploaded_at
                                      ? new Date(
                                          item.uploaded_at
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Preview Button */}
                          <div className="mt-4 sm:mt-0 ml-10 sm:ml-0">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Modal (only rendered once outside the loop) */}
                  {showPreview && selectedFile && (
                    <PreviewModal
                      filePath={selectedFile}
                      onClose={() => {
                        setShowPreview(false);
                        setSelectedFile(null);
                      }}
                    />
                  )}
                </>
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
                </div>
              ))}
            {activeTab === "PYQs" &&
              (pyqs.length > 0 ? (
                <>
                  {pyqs.map((item) => (
                    <Card key={item.id}>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                          {/* Left Content */}
                          <div className="flex items-start gap-3 flex-grow w-full">
                            <div className="p-2 bg-gray-200 rounded-full shrink-0">
                              <BookIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm sm:text-base break-words">
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

                              <div className="flex gap-4 flex-wrap">
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.course?.name || ""}{" "}
                                  {item.subject?.name
                                    ? `- ${item.subject.name}`
                                    : ""}
                                </p>
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.semester_number
                                    ? `Semester - ${item.subject.semester_number}`
                                    : ""}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-2 text-sm text-[#3B3838]">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span className="text-xs sm:text-sm">
                                    {item.uploaded_at
                                      ? new Date(
                                          item.uploaded_at
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Preview Button */}
                          <div className="mt-4 sm:mt-0 ml-10 sm:ml-0">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {showPreview && selectedFile && (
                    <PreviewModal
                      filePath={selectedFile}
                      onClose={() => {
                        setShowPreview(false);
                        setSelectedFile(null);
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full justify-center flex flex-col items-center text-center ">
                  <img
                    src={noData}
                    className="w-[200px] md:w-[250px]"
                    alt="No PYQs uploaded"
                  />
                  <p className="mt-4 text-lg text-gray-700">
                    You haven't uploaded any PYQs yet.
                  </p>
                </div>
              ))}
            {activeTab === "Syllabus" &&
              (syllabus.length > 0 ? (
                <>
                  {syllabus.map((item) => (
                    <Card key={item.id}>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                          {/* Left Content */}
                          <div className="flex items-start gap-3 flex-grow w-full">
                            <div className="p-2 bg-gray-200 rounded-full shrink-0">
                              <BookIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm sm:text-base break-words">
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

                              <div className="flex gap-4 flex-wrap">
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.course?.name || ""}{" "}
                                  {item.subject?.name
                                    ? `- ${item.subject.name}`
                                    : ""}
                                </p>
                                <p className="text-sm text-[#3B3838]">
                                  {item.subject?.semester_number
                                    ? `Semester - ${item.subject.semester_number}`
                                    : ""}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-2 text-sm text-[#3B3838]">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span className="text-xs sm:text-sm">
                                    {item.uploaded_at
                                      ? new Date(
                                          item.uploaded_at
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Preview Button */}
                          <div className="mt-4 sm:mt-0 ml-10 sm:ml-0">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {showPreview && selectedFile && (
                    <PreviewModal
                      filePath={selectedFile}
                      onClose={() => {
                        setShowPreview(false);
                        setSelectedFile(null);
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="w-full justify-center flex flex-col items-center text-center ">
                  <img
                    src={noData}
                    className="w-[200px] md:w-[250px]"
                    alt="No syllabus uploaded"
                  />
                  <p className="mt-4 text-lg text-gray-700">
                    You haven't uploaded any syllabus files yet.
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
