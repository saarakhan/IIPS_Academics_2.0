import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { UserAuth } from '../../Context/AuthContext';
import { XIcon, UploadIcon, CheckCircleIcon } from '../../Icons';
import LoadingSpinner from '../LoadingSpinner';
import toast from "react-hot-toast";

const TeacherResourceUploadModal = ({ isOpen, onClose, onResourceUploaded }) => {
  const { session, profile, loadingAuth } = UserAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('NOTE');
  const [file, setFile] = useState(null);
  const [fileNameDisplay, setFileNameDisplay] = useState('');

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const [coursesList, setCoursesList] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const fileInputRef = useRef(null);
  const teacherDisplayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || session?.user?.email : 'Teacher';

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setResourceType('NOTE');
    setSelectedCourseId(''); 
    setFile(null);
    setFileNameDisplay('');
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
    setSuccessMessage('');
    setFormTouched(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIsLoadingData(true);
      const fetchCourses = async () => {
        try {
          const { data, error: coursesError } = await supabase
            .from('courses')
            .select('id, name, duration_years')
            .eq('is_active', true)
            .order('name', { ascending: true });
          if (coursesError) throw coursesError;
          setCoursesList(data || []);
        } catch (err) {
          console.error("Modal: Failed to load courses", err);
          setError('Failed to load courses. Please try reopening the modal.');
          setCoursesList([]);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCourses();
    } else {
      setCoursesList([]); 
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
   
    if (selectedCourseId && coursesList.length > 0) {
      const course = coursesList.find(c => c.id === selectedCourseId);
      if (course && course.duration_years) {
        const numSemesters = course.duration_years * 2;
        setAvailableSemesters(Array.from({ length: numSemesters }, (_, i) => i + 1));
      } else {
        setAvailableSemesters([]);
      }
    } else {
      setAvailableSemesters([]);
    }
    setSelectedSemester('');   
    setSubjectsList([]);       
    setSelectedSubjectId('');  
  }, [selectedCourseId, coursesList]);

  useEffect(() => {
   
    setSelectedSubjectId(''); 

    if (selectedCourseId && selectedSemester) {
      setIsLoadingData(true);
      setError(null); 
      (async () => { 
        try {
          const { data, error: subjectsError } = await supabase
            .from('subjects')
            .select('id, name, code')
            .eq('course_id', selectedCourseId)
            .eq('semester_number', parseInt(selectedSemester, 10))
            .order('name', { ascending: true });

          if (subjectsError) throw subjectsError;
          setSubjectsList(data || []);
        } catch (err) {
          console.error("Modal: Failed to load subjects using IIFE", err);
          setError('Failed to load subjects for the selected course/semester.');
          setSubjectsList([]);
        } finally {
          setIsLoadingData(false);
        }
      })(); 
    } else {
      setSubjectsList([]); 
      if (isLoadingData) { 
        setIsLoadingData(false);
      }
    }
  }, [selectedCourseId, selectedSemester]);

  const handleFileChange = (e) => { 
    const selectedFile = e.target.files[0];
    setFile(null);
    setFileNameDisplay('');
    setError(null); 
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Invalid file type. Please upload a PDF.");
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { 
        setError("File is too large. Maximum size is 10MB.");
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setFileNameDisplay(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    
    console.log("--- SUBMIT VALIDATION CHECK ---");
    console.log("Title:", `"${title}"`, !title.trim());
    console.log("Selected Subject ID:", `"${selectedSubjectId}"`, !selectedSubjectId); 
    console.log("File Object:", file, !file);
    console.log("User Object:", session?.user, !session?.user?.id);
    console.log("-------------------------------");


    if (!session?.user || !session.user.id) {
      setError('User session not found. Please log out and log in again.');
      return;
    }
    if (!title.trim() || !selectedSubjectId || !file) {
      let missingFields = [];
      if (!title.trim()) missingFields.push("Title");
      if (!selectedSubjectId) missingFields.push("Subject Selection");
      if (!file) missingFields.push("File");
      setError(`Required fields missing: ${missingFields.join(', ')}.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const userId = session.user.id;
      const uniqueFileName = `${userId}_${Date.now()}_${title.trim().replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `teacher_uploads/${selectedCourseId}/${selectedSubjectId}/${uniqueFileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, { upsert: false });
      if (uploadError) throw uploadError;
      const currentTime = new Date().toISOString();
      const resourcePayload = {
        title: title.trim(),
        description: description.trim() || null,
        resource_type: resourceType,
        subject_id: selectedSubjectId,
        uploader_profile_id: userId,
        file_name: file.name,
        file_path: uploadData.path,
        file_size_bytes: file.size,
        mime_type: file.type,
        status: 'APPROVED',
        uploaded_at: currentTime,
        approved_at: currentTime,
        // approved_by_admin_id: userId,
      };
      
      const { error: insertError } = await supabase
        .from('resources')
        .insert([resourcePayload])
        .select(); 

      if (insertError) {
        
        console.error("DB insert failed, attempting to remove uploaded file from storage:", uploadData.path);
        await supabase.storage.from('uploads').remove([uploadData.path]); 
        throw insertError;
      }
      
    
      const { data: profileData, error: fetchProfileError } = await supabase
        .from('profiles')
        .select('total_uploads')
        .eq('id', userId)
        .single();

      if (fetchProfileError) {
        console.error('Failed to fetch total_uploads for teacher:', fetchProfileError.message);
        
      } else {
        const currentUploads = profileData?.total_uploads || 0;
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ total_uploads: currentUploads + 1 })
          .eq('id', userId);

        if (updateProfileError) {
          console.error('Failed to update total_uploads for teacher:', updateProfileError.message);
        }
      }

      setSuccessMessage('Resource uploaded and approved successfully!');
      toast.success('Resource uploaded and approved!');
      if (onResourceUploaded) onResourceUploaded();
      resetForm();
      onClose();
    
    } catch (err) {
      console.error("Modal: Error uploading resource:", err);
      setError(err.message || "Failed to upload resource. Check console for details.");
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Upload New Resource</h2>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 bg-green-100 p-3 rounded mb-4 text-sm">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title-teacher-modal" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input type="text" id="title-teacher-modal" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm" />
            {formTouched && !title.trim() && <p className="text-xs text-red-500 mt-1">Title is required.</p>}
          </div>

          <div>
            <label htmlFor="resourceType-teacher-modal" className="block text-sm font-medium text-gray-700">Resource Type <span className="text-red-500">*</span></label>
            <select id="resourceType-teacher-modal" value={resourceType} onChange={e => setResourceType(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm bg-white cursor-pointer">
              <option value="NOTE">Note</option>
              <option value="PYQ">PYQ (Previous Year Question)</option>
              <option value="SYLLABUS">Syllabus</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="teacherNameDisplay-modal" className="block text-sm font-medium text-gray-700">Uploading As</label>
            <input type="text" id="teacherNameDisplay-modal" value={teacherDisplayName} readOnly disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="courseId-teacher-modal" className="block text-sm font-medium text-gray-700">Course <span className="text-red-500">*</span></label>
              <select id="courseId-teacher-modal" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required disabled={isLoadingData && coursesList.length === 0} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm bg-white cursor-pointer disabled:bg-gray-50">
                <option value="">{isLoadingData && coursesList.length === 0 ? "Loading Courses..." : "Select Course"}</option>
                {coursesList.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="semester-teacher-modal" className="block text-sm font-medium text-gray-700">Semester <span className="text-red-500">*</span></label>
              <select id="semester-teacher-modal" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} required disabled={!selectedCourseId || (isLoadingData && availableSemesters.length === 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm bg-white disabled:bg-gray-50 cursor-pointer">
                <option value="">{isLoadingData && availableSemesters.length === 0 && selectedCourseId ? "Loading..." : "Select Semester"}</option>
                {availableSemesters.map(sem => <option key={sem} value={sem.toString()}>Semester {sem}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="subjectId-teacher-modal" className="block text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
            <select id="subjectId-teacher-modal" value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} required disabled={!selectedSemester || (isLoadingData && subjectsList.length === 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm bg-white disabled:bg-gray-50 cursor-pointer">
              <option value="">{isLoadingData && subjectsList.length === 0 && selectedSemester ? "Loading Subjects..." : "Select Subject"}</option>
              {subjectsList.map(sub => <option key={sub.id} value={sub.id}>{sub.name} ({sub.code || 'No Code'})</option>)}
            </select>
            {formTouched && !selectedSubjectId && <p className="text-xs text-red-500 mt-1">Subject is required.</p>}
          </div>

          <div>
            <label htmlFor="description-teacher-modal" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea id="description-teacher-modal" value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm"></textarea>
          </div>

          <div className="p-3 mb-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
            <h4 className="font-semibold mb-1">Upload Guidelines:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Accepted file type: PDF only.</li>
              <li>Maximum file size: 10MB.</li>
              <li>Tip: For larger files, please optimize your PDF before uploading (e.g., use "Save As Reduced Size" in your PDF software or an online compressor like <a href='https://www.ilovepdf.com/compress_pdf' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>iLovePDF</a>).</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload PDF File <span className="text-red-500">*</span></label>
            <input id="file-upload-teacher-modal" name="file-upload-teacher-modal" type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EADDC5] file:text-[#C79745] hover:file:bg-[#F0E6D5]"/>
            {fileNameDisplay && <p className="text-xs text-gray-500 mt-1">Selected: {fileNameDisplay} ({file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB)</p>}
            {formTouched && !file && <p className="text-xs text-red-500 mt-1">File is required.</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={handleCloseModal} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C79745] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting || isLoadingData || !file || !selectedSubjectId || !title.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#C79745] border border-transparent rounded-md shadow-sm hover:bg-[#b3863c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b3863c] disabled:opacity-50">{isSubmitting ? <LoadingSpinner small={true} /> : 'Upload & Approve'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherResourceUploadModal;
