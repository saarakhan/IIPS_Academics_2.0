import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import subjects from "../../../Subject";
import FilterPanel from "./FilterPanel";
import SubjectCard from "./SubjectCard";
import EmptyState from "./EmptyState";
import Header from "../Header/Header";
import Footer from "../../Home/Footer"; // Import the Footer component

function Subject() {
  const navigate = useNavigate();

  const [searchFilter, setSearchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  const departments = ["MBA", "MCA", "MTech"];
  const semesters = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const filtered = subjects.filter(
      (subject) =>
        (subject.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          subject.teacher.toLowerCase().includes(searchFilter.toLowerCase())) &&
        (semesterFilter === "" || subject.semester === semesterFilter) &&
        (departmentFilter === "" || subject.department === departmentFilter)
    );
    setFilteredSubjects(filtered);
  }, [searchFilter, semesterFilter, departmentFilter]);

  const clearFilters = () => {
    setSearchFilter("");
    setSemesterFilter("");
    setDepartmentFilter("");
  };

  const handleCardClick = (id) => {
    navigate(`/subject/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE]">
      <Header />
      
      {/* Full-width filter panel with centered content after bashing my head in the wall */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <FilterPanel
            {...{
              searchFilter,
              setSearchFilter,
              semesterFilter,
              setSemesterFilter,
              departmentFilter,
              setDepartmentFilter,
              departmentDropdownOpen,
              setDepartmentDropdownOpen,
              departments,
              semesters,
              clearFilters,
            }}
          />
        </div>
      </div>

      {/* Main content container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-[#003366]">
              {filteredSubjects.length}
            </span>{" "}
            {filteredSubjects.length === 1 ? "subject" : "subjects"}
          </p>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="w-full max-w-md mx-auto">
            <EmptyState onClear={clearFilters} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-16">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Subject;
