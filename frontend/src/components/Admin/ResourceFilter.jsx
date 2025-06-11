import { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  FilterOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
const { Option } = Select;

export default function ResourceFilter({ filters, onChange }) {
  const [status, setStatus] = useState(filters.status || "");
  const [subject, setSubject] = useState(filters.subject || "");
  const [contributor, setContributor] = useState(filters.contributor || "");
  const [course, setCourse] = useState(filters.course || "");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ status, subject, contributor, course });
    }, 300);
    return () => clearTimeout(timeout);
  }, [status, subject, contributor, course]);

  const resetFilters = () => {
    setStatus("");
    setSubject("");
    setContributor("");
    setCourse("");
    onChange({
      status: "",
      subject: "",
      contributor: "",
      course: "",
    });
  };

  const activeFiltersCount = [status, subject, contributor, course].filter(
    Boolean
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Filter Resources</h3>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-gray-500">
                {activeFiltersCount} active filter
                {activeFiltersCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Dropdown */}
          <div className="space-y-1.5 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              value={status || undefined}
              onChange={(value) => setStatus(value)}
              allowClear
              placeholder="All Statuses"
              className="w-full custom-select"
              size="middle"
              popupMatchSelectWidth={false}
            >
              <Option value="PENDING">Pending</Option>
              <Option value="APPROVED">Approved</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>
          </div>

          {/* Subject Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              allowClear
              placeholder="Search subjects..."
              prefix={<SearchOutlined className="text-gray-400" />}
              size="middle"
              className="w-full custom-input"
            />
          </div>

          {/* Contributor Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Contributor
            </label>
            <Input
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              allowClear
              placeholder="Contributor name"
              prefix={<UserOutlined className="text-gray-400" />}
              size="middle"
              className="w-full custom-input"
            />
          </div>

          {/* Course Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <Input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              allowClear
              placeholder="Search by course..."
              prefix={<FilterOutlined className="text-gray-400" />}
              size="middle"
              className="w-full custom-input"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-end gap-2">
          <button
            onClick={resetFilters}
            className="w-full sm:w-auto px-4 py-2 bg-white text-gray-700 hover:text-[#C28C36] md:border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C28C36] transition-colors shadow-sm flex items-center justify-center gap-2 border-none "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>

      {!isExpanded && activeFiltersCount > 0 && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100">
          <div className="flex items-center gap-2 text-sm text-indigo-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Showing results with {activeFiltersCount} active filter
              {activeFiltersCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
