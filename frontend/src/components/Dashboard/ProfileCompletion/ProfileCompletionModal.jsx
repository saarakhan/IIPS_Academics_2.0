import { useState, useEffect } from 'react';
import { FaUser, FaGraduationCap, FaCalendarAlt, FaHashtag, FaSave, FaTimes, FaStar, FaSun } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import './ProfileCompletionModal.css';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';

const ProfileCompletionModal = ({ isOpen, onClose, userId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    course: '',
    semester: '',
    enrollment_number: '',
  });

  const courses = ['MTech Integrated', 'MCA Integrated', 'MBA MS (5years) Integrated', 'MBA MS (2years)', 'MBA  (Tourism Managment) Integrated  ', 'Bcom', 'BCom(Hons)', ''];
  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('first_name, last_name, course, semester, enrollment_number').eq('id', userId).single();

      if (error) throw error;
      if (data) {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          course: data.course || '',
          semester: data.semester || '',
          enrollment_number: data.enrollment_number || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      onSave?.(formData);
      toast.success('Profile Updated Successfully! ✨');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <button className='close-button' onClick={onClose}>
          <FaTimes />
        </button>

        <div className='modal-content'>
          <div className='modal-header'>
            <div className='header-icon'>
              <div className='icon-background'>
                <FaSun className='sun-icon' />
                <div className='icon-badge'>
                  <HiSparkles />
                </div>
              </div>
            </div>
            <h2 className='modal-title'>Complete Your Profile</h2>
            <p className='modal-description'>✨ Let's create something amazing together!</p>
          </div>

          <form
            onSubmit={e => {
              handleSubmit(e);
            }}
            className='profile-form'>
            <div className='form-row'>
              <div className='form-group'>
                <label className='form-label'>
                  <FaUser className='label-icon golden' /> First Name
                </label>
                <input type='text' value={formData.first_name} onChange={e => handleInputChange('first_name', e.target.value)} placeholder='Enter your first name' className='form-input' required />
              </div>
              <div className='form-group'>
                <label className='form-label'>
                  <FaUser className='label-icon amber' /> Last Name
                </label>
                <input type='text' value={formData.last_name} onChange={e => handleInputChange('last_name', e.target.value)} placeholder='Enter your last name' className='form-input' required />
              </div>
            </div>

            <div className='form-group'>
              <label className='form-label'>
                <FaGraduationCap className='label-icon golden' /> Course
              </label>
              <select value={formData.course} onChange={e => handleInputChange('course', e.target.value)} className='form-select' required>
                <option value=''>Select your course</option>
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label className='form-label'>
                  <FaCalendarAlt className='label-icon yellow' /> Semester
                </label>
                <select value={formData.semester} onChange={e => handleInputChange('semester', e.target.value)} className='form-select' required>
                  <option value=''>Select semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>
                      {sem} Semester
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label className='form-label'>
                  <FaHashtag className='label-icon golden' /> Enrollment Number
                </label>
                <input
                  type='text'
                  value={formData.enrollment_number}
                  onChange={e => handleInputChange('enrollment_number', e.target.value)}
                  placeholder='Enter enrollment number'
                  className='form-input'
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='submit-button'
              onClick={e => {
                handleSubmit(e);
              }}>
              <div className='button-shimmer'></div>
              {loading ? (
                <div className='loading-content'>
                  <div className='spinner'></div>
                  <span>Saving Profile...</span>
                  <div className='loading-dots'>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                </div>
              ) : (
                <div className='button-content'>
                  <span>Save Profile</span>
                </div>
              )}
            </button>
          </form>

          <div className='progress-indicator'>
            <div className='progress-badge'>
              <FaStar className='progress-icon' />
              <span>Almost there! Complete your profile</span>
              <HiSparkles className='progress-sparkle' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
