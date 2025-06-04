import { useState, useEffect } from "react";
import {
  FaUser,
  FaGraduationCap,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";
import "./ProfileCompletionModal.css";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";
import { RxCross1 } from "react-icons/rx";
import { UserAuth } from "../../../Context/AuthContext";

const ProfileCompletionModal = ({ isOpen, onClose, initialData, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { session } = UserAuth();
  const [coursesList, setCoursesList] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    course_id: "", // Changed from course to course_id
    semester: "",    // Will store as number
    enrollment_number: "",
  });

  // Fetch courses from Supabase
  useEffect(() => {
    if (isOpen) {
      const fetchCourses = async () => {
        try {
          const { data, error } = await supabase.from("courses").select("id, name");
          if (error) throw error;
          setCoursesList(data || []);
        } catch (error) {
          console.error("Error fetching courses:", error);
          toast.error("Could not load courses.");
        }
      };
      fetchCourses();
    }
  }, [isOpen]);

  // Static semesters list (can be dynamic if needed in future)
  const semesters = Array.from({ length: 10 }, (_, i) => i + 1); // Generates [1, 2, ..., 10]

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        course_id: initialData.course_id || "", // Expecting course_id (UUID) from initialData
        semester: initialData.semester ? parseInt(initialData.semester, 10) : "", // Ensure semester is a number
        enrollment_number: initialData.enrollment_number || "",
      });
    } else { // Reset form if no initial data (e.g., new profile)
      setFormData({
        first_name: "",
        last_name: "",
        course_id: "",
        semester: "",
        enrollment_number: "",
      });
    }
  }, [initialData, isOpen]); // Re-run if isOpen changes to reset form if needed

  const handleInputChange = (field, value) => {
    if (field === "semester") {
      setFormData((prev) => ({ ...prev, [field]: value ? parseInt(value, 10) : "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure semester is a number before sending
    const dataToUpdate = {
      ...formData,
      semester: formData.semester ? parseInt(formData.semester, 10) : null,
      updated_at: new Date().toISOString(),
    };
     // Remove course if it was a string, ensure course_id is used
    if (dataToUpdate.course) delete dataToUpdate.course;


    try {
      const { error } = await supabase
        .from("profiles")
        .update(dataToUpdate)
        .eq("id", session?.user?.id);

      if (error) throw error;

      toast.success("Profile Updated Successfully!");
      onProfileUpdate?.(); // Call the callback to refresh dashboard data
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error); // Log the actual error
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <RxCross1
          className="absolute right-5 top-3 cursor-pointer z-10"
          onClick={() => {
            onClose();
          }}
        />
        <div className="modal-content">
          <div className="modal-header">
            <div className="header-icon"></div>
            <h2 className="modal-title">Complete Your Profile</h2>
            <p className="modal-description">
              This enables you to upload resources !
            </p>
          </div>

          <form
            onSubmit={handleSubmit} // Simplified onSubmit
            className="profile-form"
          >
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon golden" /> First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon amber" /> Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaGraduationCap className="label-icon golden" /> Course
              </label>
              <select
                value={formData.course_id} // Bind to course_id
                onChange={(e) => handleInputChange("course_id", e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select your course</option>
                {coursesList.map((course) => (
                  <option key={course.id} value={course.id}> {/* Use course.id as value */}
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt className="label-icon yellow" /> Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) =>
                    handleInputChange("semester", e.target.value)
                  }
                  className="form-select"
                  required
                >
                  <option value="">Select semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}> {/* Value is number */}
                      {sem}{sem === 1 ? "st" : sem === 2 ? "nd" : sem === 3 ? "rd" : "th"} Semester {/* Display ordinal */}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaHashtag className="label-icon golden" /> Enrollment Number
                </label>
                <input
                  type="text"
                  value={formData.enrollment_number}
                  onChange={(e) =>
                    handleInputChange("enrollment_number", e.target.value)
                  }
                  placeholder="Enter enrollment number"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
              // onClick removed as onSubmit is on form
            >
              <div className="button-shimmer"></div>
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Saving Profile...</span>
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              ) : (
                <div className="button-content">
                  <span>Save Profile</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
