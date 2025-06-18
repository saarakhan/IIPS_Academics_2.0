import { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
const { Option } = Select;

const statusTabs = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function ResourceFilter({ filters, onChange, departments }) {
  const [subject, setSubject] = useState(filters.subject || "");
  const [contributor, setContributor] = useState(filters.contributor || "");
  const [course, setCourse] = useState(filters.course || "");
  const [isExpanded, setIsExpanded] = useState(true);

  const activeFiltersCount = [filters.status, subject, contributor, course].filter(Boolean).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        ...filters,
        subject,
        contributor,
        course,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [subject, contributor, course]);

  const resetFilters = () => {
    onChange({
      status: "",
      subject: "",
      contributor: "",
      course: "",
    });
    setSubject("");
    setContributor("");
    setCourse("");
  };

  const handleTabClick = (status) => {
    onChange({
      ...filters,
      status: status === "ALL" ? "" : status,
    });
  };

  return (
    <div className="bg-white rounded-md border-2 border-gray-300 shadow-[4px_4px_8px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Filter Resources</h3>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-gray-500">{activeFiltersCount} active filter{activeFiltersCount > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        
        {/* Tabs */}
        <div className="px-4 pt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`w-full sm:w-auto px-4 py-1.5 text-sm rounded-full border-2 font-semibold text-center transition-all ${
                (filters.status || "ALL") === tab || (tab === "ALL" && !filters.status)
                  ? "bg-[#2B3333] text-white border-[#2B3333]"
                  : "border-gray-300 text-gray-700 hover:border-[#C79745]"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              allowClear
              placeholder="Search subjects..."
              prefix={<SearchOutlined className="text-gray-400" />}
              size="middle"
              className="w-full"
            />
          </div>

          {/* Contributor */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Contributor</label>
            <Input
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              allowClear
              placeholder="Contributor name"
              prefix={<UserOutlined className="text-gray-400" />}
              size="middle"
              className="w-full"
            />
          </div>

          {/* Program */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <Select
              value={course || undefined}
              onChange={(value) => setCourse(value)}
              allowClear
              placeholder="All Programs"
              className="w-full"
              size="middle"
              popupMatchSelectWidth={false}
              showSearch
              optionFilterProp="children"
            >
              {departments?.map((course) => (
                <Option key={course.id} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Reset */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-white text-gray-700 border-2 border-[#2B3333] rounded-xl text-sm font-medium hover:border-[#C79745] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C28C36] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Collapsed Summary */}
      {!isExpanded && activeFiltersCount > 0 && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100">
          <div className="flex items-center gap-2 text-sm text-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Showing results with {activeFiltersCount} active filter{activeFiltersCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}

