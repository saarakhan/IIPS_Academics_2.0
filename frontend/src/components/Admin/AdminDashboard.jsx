import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ResourceCard from "./ResourceCard";
import StatusSummary from "./StatusSummary";
import Heading from "./Heading";
import ResourceFilter from "./ResourceFilter";

export default function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [filters, setFilters] = useState({
    status: "PENDING",
    subject: "",
    contributor: "",
    course: "",
  });
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [activeStatus, setActiveStatus] = useState("PENDING");

  const numberResourceDisplay = 5;

  useEffect(() => {
  updateCounts();
}, []);


  useEffect(() => {
    fetchResources(page);
  }, [page]);

  useEffect(() => {
    applyFilters(resources, filters);
  }, [resources, filters]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name")
        .order("name", { ascending: true });

      if (!error) setDepartments(data || []);
    };

    fetchCourses();
  }, []);

  const fetchResources = async (status = "PENDING", page = 0) => {
    setLoading(true);
    const from = page * numberResourceDisplay;
    const to = from + numberResourceDisplay - 1;

    let query = supabase
      .from("resources")
      .select(
        `*, profiles!resources_uploader_profile_id_fkey(first_name, last_name, course, semester), subjects(name)`
      )
      .range(from, to);

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching resources:", error);
    } else {
      // Reset or append based on page
      setResources((prev) => (page === 0 ? data : [...prev, ...data]));
      applyFilters(page === 0 ? data : [...resources, ...data], filters);

      if (data.length < numberResourceDisplay) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }

    setLoading(false);
  };

  const updateCounts = async () => {
    try {
      const [total, approved, rejected, pending] = await Promise.all([
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase
          .from("resources")
          .select("*", { count: "exact", head: true })
          .eq("status", "APPROVED"),
        supabase
          .from("resources")
          .select("*", { count: "exact", head: true })
          .eq("status", "REJECTED"),
        supabase
          .from("resources")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING"),
      ]);

      setCounts({
        total: total.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
        pending: pending.count || 0,
      });
    } catch (err) {
      console.error("Error updating resource counts:", err);
    }
  };

  const applyFilters = (data, { status, subject, contributor, course }) => {
    const filtered = data.filter((r) => {
      const matchesStatus = !status || status === "ALL" || r.status === status;
      const matchesSubject =
        !subject ||
        r.subjects?.name.toLowerCase().includes(subject.toLowerCase());
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

  // const handleFilterChange = (newFilters) => {
  //   setFilters(newFilters);
  //   applyFilters(resources, newFilters);
  // };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setPage(0);
    setResources([]);
    fetchResources(status, 0);
  };

  const handleAction = async () => {
    setPage(0);
    setResources([]);
    await fetchResources(activeStatus, 0);
    await updateCounts();
  };

  const loadMoreResources = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResources(activeStatus, nextPage);
  };

  return (
    <div className="min-h-screen bg-[#FFFEFE] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Heading />
        <StatusSummary counts={counts} onStatusClick={handleStatusChange} />

        <div className="bg-white rounded-md border-2 border-gray-300 shadow-[7px_8px_4.8px_rgba(0,0,0,0.1)] mt-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m2 0a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2m10 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">
              Submitted Resources
            </h2>
          </div>

          <div className="p-6">
            <ResourceFilter
              filters={{ ...filters, status: activeStatus }}
              onChange={(newFilters) => {
                setFilters(newFilters);
                applyFilters(resources, newFilters);
              }}
              onStatusChange={handleStatusChange}
              departments={departments}
            />
          </div>

          {/* Results */}
          <div>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="border border-gray-200 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow animate-pulse" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-6">
                <div className="border border-dashed border-gray-300 p-10 rounded-xl text-center bg-white/90 backdrop-blur-sm shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No resources found
                  </p>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try changing the filters or check back later when new
                    resources are submitted.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 pt-4 space-y-4">
                  {filtered
                    .sort((a, b) => {
                      const priority = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
                      return priority[a.status] - priority[b.status];
                    })
                    .map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onAction={handleAction}
                      />
                    ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center px-6 pt-4 pb-6">
                    <button
                      onClick={loadMoreResources}
                      disabled={loading}
                      className="px-6 py-2 bg-[#2B3333] text-white rounded-md hover:bg-black transition disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
