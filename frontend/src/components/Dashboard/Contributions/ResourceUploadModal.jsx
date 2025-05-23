import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { UserAuth } from "../../../Context/AuthContext";
import { XIcon, PlusIcon } from "../../../Icons"; // Changed UploadCloudIcon to PlusIcon, assuming XIcon is for closing

const ResourceUploadModal = ({ isOpen, onClose, onUploadSuccess, defaultResourceType }) => { // Added defaultResourceType
  const { session } = UserAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(""); // New state for selected course
  const [subjectId, setSubjectId] = useState("");
  const [resourceType, setResourceType] = useState(defaultResourceType || "NOTE");
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]); // New state for courses
  const [subjects, setSubjects] = useState([]); // Will be filtered by course
  const [filteredSubjects, setFilteredSubjects] = useState([]); // Subjects for the dropdown
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Hardcoded department and subject lists for testing
  useEffect(() => {
    if (isOpen) {
      // Hardcoded departments
      const departmentOptions = [
        { id: "MCA Integrated", name: "MCA Integrated" },
        { id: "MTech Integrated", name: "MTech Integrated" },
        { id: "MBA MS Integrated", name: "MBA MS Integrated" },
        { id: "MBA MS 2 Years", name: "MBA MS 2 Years" },
        { id: "BCom", name: "BCom" },
        { id: "BCom Hons", name: "BCom Hons" },
        { id: "MBA Tourism", name: "MBA Tourism" },
      ];
      setCourses(departmentOptions);

      // Hardcoded subjects - IMPORTANT: Replace 'placeholder-uuid-...' with actual subject IDs from your DB
      const testSubjectOptions = [
        { id: "09da954e-b2bb-4ed6-aabd-bc384e15b1d1", name: "DSA" },
        { id: "placeholder-uuid-subject-2", name: "Test Subject Two (Replace ID)" }
      ];
      setFilteredSubjects(testSubjectOptions); // Using filteredSubjects directly for the subject dropdown

      // Reset form fields
      setResourceType(defaultResourceType || "NOTE");
      setTitle("");
      setDescription("");
      setSelectedCourseId(""); // Reset selected course
      setSubjectId("");    // Reset selected subject
      setFile(null);
      setError(null);
      setSuccessMessage(null);
      if (document.getElementById('file-upload-input')) {
        document.getElementById('file-upload-input').value = "";
      }
    }
  }, [isOpen, defaultResourceType]);

  // Removed the useEffect that filters subjects based on selectedCourseId as subjects are now hardcoded

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Invalid file type. Only PDF files are allowed.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        setError("File is too large. Maximum size is 5MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !subjectId || !resourceType || !session?.user?.id) {
      setError("Please fill all required fields and select a file.");
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const uniqueFileName = `${session.user.id}/${resourceType}/${Date.now()}.${fileExt}`; // More unique path
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads") // Your bucket name
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type, 
        });

      if (uploadError) throw uploadError;
      
     
      const resourceData = {
        title,
        description,
        resource_type: resourceType,
        subject_id: subjectId,
        uploader_profile_id: session.user.id,
        file_name: file.name,
        file_path: uploadData.path, // Path from storage upload response
        file_size_bytes: file.size,
        mime_type: file.type,
        status: "PENDING", 
      };

      const { error: insertError } = await supabase
        .from("resources")
        .insert([resourceData]);

      if (insertError) {
        
        await supabase.storage.from("uploads").remove([uploadData.path]);
        throw insertError;
      }

      setSuccessMessage("File uploaded successfully! It is now pending approval.");
      setTitle("");
      setDescription("");
      setSubjectId("");
      setResourceType("NOTE");
      setFile(null);
      if (document.getElementById('file-upload-input')) {
        document.getElementById('file-upload-input').value = ""; // Reset file input
      }
      if (onUploadSuccess) onUploadSuccess();
      // setTimeout(onClose, 2000); // Optionally close modal after a delay

    } catch (err) {
      console.error("Upload failed:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Upload New Resource</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={24} />
          </button>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">Resource Type <span className="text-red-500">*</span></label>
            <select
              id="resourceType"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm"
            >
              <option value="NOTE">Note</option>
              <option value="PYQ">PYQ (Previous Year Question)</option>
              <option value="SYLLABUS">Syllabus</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course/Department <span className="text-red-500">*</span></label>
            <select
              id="courseId"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm"
            >
              <option value="">Select a course/department</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
            <select
              id="subjectId"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              disabled={!selectedCourseId || filteredSubjects.length === 0} // Disable if no course selected or no subjects for course
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm disabled:bg-gray-50"
            >
              <option value="">Select a subject</option>
              {filteredSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="file-upload-input" className="block text-sm font-medium text-gray-700">Upload PDF (Max 5MB) <span className="text-red-500">*</span></label>
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EADDC5] file:text-[#C79745] hover:file:bg-[#F0E6D5]" // Adjusted file input style
            />
            {file && <p className="text-xs text-gray-500 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C79745] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !file}
              className="px-4 py-2 text-sm font-medium text-white bg-[#C79745] border border-transparent rounded-md shadow-sm hover:bg-[#b3863c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b3863c] disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceUploadModal;
