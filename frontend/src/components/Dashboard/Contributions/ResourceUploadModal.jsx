import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { UserAuth } from '../../../Context/AuthContext';
import { XIcon } from '../../../Icons';

const ResourceUploadModal = ({ isOpen, onClose, onUploadSuccess, defaultResourceType }) => {
  const { session } = UserAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [resourceType, setResourceType] = useState(defaultResourceType || 'NOTE');
  const [file, setFile] = useState(null);

  const [coursesList, setCoursesList] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      setError(null);
      setTitle('');
      setDescription('');
      setSelectedCourseId('');
      setSelectedSemester('');
      setSubjectId('');
      setResourceType(defaultResourceType || 'NOTE');
      setFile(null);
      setAvailableSemesters([]);
      setSubjectsList([]);
      setSuccessMessage(null);
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) {
        fileInput.value = '';
      }

      try {
        const { data, error: coursesError } = await supabase.from('courses').select('id, name, duration_years').order('name', { ascending: true });
        if (coursesError) throw coursesError;
        setCoursesList(data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [isOpen, defaultResourceType]);

  useEffect(() => {
    if (selectedCourseId) {
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
    setSubjectId('');
  }, [selectedCourseId, coursesList]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedCourseId && selectedSemester) {
        setIsLoading(true);
        setError(null);
        try {
          const { data, error: subjectsError } = await supabase
            .from('subjects')
            .select('id, name')
            .eq('course_id', selectedCourseId)
            .eq('semester_number', parseInt(selectedSemester, 10))
            .order('name', { ascending: true });
          if (subjectsError) throw subjectsError;
          setSubjectsList(data || []);
        } catch (err) {
          console.error('Error fetching subjects:', err);
          setError('Failed to load subjects for the selected course/semester.');
          setSubjectsList([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSubjectsList([]);
      }
    };
    fetchSubjects();
    setSubjectId('');
  }, [selectedCourseId, selectedSemester]);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    setError(null);
    setFile(null);

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Invalid file type. Only PDF files are allowed.');
        e.target.value = null;
        return;
      }
      if (selectedFile.size > MAX_PDF_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_PDF_SIZE_BYTES / 1024 / 1024}MB.`);
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    if (!title || !subjectId || !resourceType || !session?.user?.id) {
      setError('Please fill all required fields (Title, Resource Type, Course, Semester, Subject).');
      return;
    }

    setIsLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${session.user.id}/${resourceType.toUpperCase()}_${subjectId}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage.from('uploads').upload(uniqueFileName, file, {
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
        file_path: uploadData.path,
        file_size_bytes: file.size,
        mime_type: file.type,
        status: 'PENDING',
      };

      const { error: insertError } = await supabase.from('resources').insert([resourceData]);

      if (insertError) {
        await supabase.storage.from('uploads').remove([uploadData.path]);
        throw insertError;
      }

      const { data: profileData, error: fetchError } = await supabase.from('profiles').select('total_uploads').eq('id', session.user.id).single();

      if (fetchError) {
        console.error('Failed to fetch total_uploads:', fetchError.message);
      } else {
        const currentUploads = profileData?.total_uploads || 0;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ total_uploads: currentUploads + 1 })
          .eq('id', session.user.id);

        if (updateError) {
          console.error('Failed to update total_uploads:', updateError.message);
        }
      }

      setSuccessMessage('File uploaded successfully! It is now pending approval.');

      setTitle('');
      setDescription('');

      setSubjectId('');

      setFile(null);
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) {
        fileInput.value = '';
      }

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4'> {/* Adjusted background */}
      <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Upload New Resource</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
            <XIcon className="w-6 h-6" /> {/* Ensure XIcon is imported and sized */}
          </button>
        </div>

        {error && <p className='text-red-600 bg-red-100 p-3 rounded mb-4 text-sm'>{error}</p>}
        {successMessage && <p className='text-green-600 bg-green-100 p-3 rounded mb-4 text-sm'>{successMessage}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          
          <div>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
              Title <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm'
            />
          </div>

          <div>
            <label htmlFor='resourceType' className='block text-sm font-medium text-gray-700'>
              Resource Type <span className='text-red-500'>*</span>
            </label>
            <select
              id='resourceType'
              value={resourceType}
              onChange={e => setResourceType(e.target.value)}
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm'>
              <option value='NOTE'>Note</option>
              <option value='PYQ'>PYQ (Previous Year Question)</option>
              <option value='SYLLABUS'>Syllabus</option>
              
            </select>
          </div>

          <div>
            <label htmlFor='courseId' className='block text-sm font-medium text-gray-700'>
              Course/Department <span className='text-red-500'>*</span>
            </label>
            <select
              id='courseId'
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm'>
              <option value=''>Select a course/department</option>
              {coursesList.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='semester' className='block text-sm font-medium text-gray-700'>
              Semester <span className='text-red-500'>*</span>
            </label>
            <select
              id='semester'
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              required
              disabled={!selectedCourseId || availableSemesters.length === 0}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm disabled:bg-gray-50'>
              <option value=''>Select a semester</option>
              {availableSemesters.map(sem => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='subjectId' className='block text-sm font-medium text-gray-700'>
              Subject <span className='text-red-500'>*</span>
            </label>
            <select
              id='subjectId'
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              required
              disabled={!selectedSemester || subjectsList.length === 0}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm disabled:bg-gray-50'>
              <option value=''>Select a subject</option>
              {subjectsList.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
              Description (Optional)
            </label>
            <textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows='3'
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] sm:text-sm'></textarea>
          </div>

          {/* Instructions Panel */}
          <div className='p-3 mb-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700'>
            <h4 className='font-semibold mb-1'>Upload Guidelines:</h4>
            <ul className='list-disc list-inside space-y-1'>
              <li>Accepted file type: PDF only.</li>
              <li>Maximum file size: {MAX_PDF_SIZE_BYTES / 1024 / 1024}MB.</li>
              <li>Tip: For larger files, please optimize your PDF before uploading (e.g., use "Save As Reduced Size" in your PDF software or an online compressor like <a href='https://www.ilovepdf.com/compress_pdf' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>iLovePDF</a>).</li>
            </ul>
          </div>

          <div>
            <label htmlFor='file-upload-input' className='block text-sm font-medium text-gray-700'>
              Upload PDF <span className='text-red-500'>*</span>
            </label>
            <input
              id='file-upload-input'
              type='file'
              accept='.pdf'
              onChange={handleFileChange}
              className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EADDC5] file:text-[#C79745] hover:file:bg-[#F0E6D5]'
            />
            {file && (
              <p className='text-xs text-gray-500 mt-1'>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C79745] disabled:opacity-50'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading || !file}
              className='px-4 py-2 text-sm font-medium text-white bg-[#C79745] border border-transparent rounded-md shadow-sm hover:bg-[#b3863c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b3863c] disabled:opacity-50'>
              {isLoading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceUploadModal;
