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

const ProfileCompletionModal = ({ isOpen, onClose, initialData }) => {
  const [loading, setLoading] = useState(false);
  const { session } = UserAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    course: "",
    semester: "",
    enrollment_number: "",
  });

  console.log(initialData);

  const courses = [
    "M.Tech Integrated",
    "MCA Integrated",
    "MBA (MS) 5 Years Integrated",
    "MBA (Management Science) 2 Years",
    "MBA (Tourism Management) Integrated",
    "B.Com",
    "B.Com (Hons)",
  ];

  const semesters = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        course: initialData.course || "",
        semester: initialData.semester || "",
        enrollment_number: initialData.enrollment_number || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user?.id);

      if (error) throw error;

      // onSave?.(formData);
      toast.success("Profile Updated Successfully!");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
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
            onSubmit={(e) => {
              handleSubmit(e);
            }}
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
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select your course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
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
                    <option key={sem} value={sem}>
                      {sem} Semester
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
              onClick={(e) => {
                handleSubmit(e);
              }}
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
