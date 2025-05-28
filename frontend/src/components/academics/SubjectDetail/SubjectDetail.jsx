import React, { useEffect, useState } from 'react'; // Combined useState import
import { useParams } from 'react-router-dom'; // Removed useNavigate as it wasn't used in the chosen block
import { supabase } from '../../../supabaseClient';
import { BookOpenIcon, DocumentTextIcon, ClipboardListIcon } from '../../../Icons';
import Header from './Header';
import EmptyState from './EmptyState';
import SubjectInfo from './SubjectInfo';
import ResourceSection from './ResourceSection';
import Footer from '../../Home/Footer'; // Assuming this path is correct

function SubjectDetail() {
  const { id: subjectId } = useParams(); // Renamed for clarity based on your new code
  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!subjectId) {
        setError("Subject ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch subject details
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select(`
            id,
            name,
            code,
            description,
            semester_number,
            teacher_name,
            course:course_id (name) 
          `)
          .eq('id', subjectId)
          .single(); // Changed from maybeSingle() to single() as per your version; ensure subjectId is always valid or handle error

        if (subjectError) {
            if (subjectError.code === 'PGRST116') { // specific error code for "0 rows" with .single()
                setError("Subject not found.");
            } else {
                throw subjectError;
            }
            setLoading(false);
            return;
        }
        // No need to check !subjectData if .single() is used and doesn't throw for 0 rows (it does)

        const mappedSubject = {
          id: subjectData.id,
          name: subjectData.name,
          code: subjectData.code || "N/A",
          description: subjectData.description || "No description available.",
          about: subjectData.description || "No description available.", // For SubjectInfo
          semester: `Semester ${subjectData.semester_number}`,
          department: subjectData.course?.name || "N/A", // Department becomes course name
          teacher: subjectData.teacher_name || "To Be Announced",
        };
        setSubject(mappedSubject);

        // Fetch resources for this subject
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('id, title, resource_type, file_path, file_name')
          .eq('subject_id', subjectData.id) // Use the actual subjectData.id
          .eq('status', 'APPROVED');

        if (resourcesError) throw resourcesError;

        const notesArray = [];
        const pyqsArray = [];
        const syllabusArray = [];
        // Consider an 'otherArray' if you have 'OTHER' resource_type

        (resourcesData || []).forEach(res => {
          const resourceItemData = {
            id: res.id,
            title: res.title,
            file: res.file_path, // This is the full path in storage
            originalFileName: res.file_name 
          };
          if (res.resource_type === 'NOTE') notesArray.push(resourceItemData);
          else if (res.resource_type === 'PYQ') pyqsArray.push(resourceItemData);
          else if (res.resource_type === 'SYLLABUS') syllabusArray.push(resourceItemData);
          // else if (res.resource_type === 'OTHER') otherArray.push(resourceItemData);
        });

        setNotes(notesArray);
        setPyqs(pyqsArray);
        setSyllabus(syllabusArray);
        // setOther(otherArray);

      } catch (err) {
        console.error('Error fetching subject details:', err);
        if (!error && err.message !== "Subject not found.") { // Avoid overwriting specific "Subject not found"
            setError(err.message || 'Failed to load subject details.');
        }
        setSubject(null); // Clear subject on error
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [subjectId, error]); // Added error to dependency array to potentially clear error if subjectId changes and new fetch is successful

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
        {/* Replace with your LoadingSpinner component if you have one */}
        <p className="text-gray-500">Loading subject details...</p>
      </div>
    );
  }

  // If there was an error and subject couldn't be loaded, show EmptyState
  if (error || !subject) {
    // You could pass a specific message to EmptyState based on the error
    return <EmptyState />;
  }
  
  const totalItems = notes.length + pyqs.length + syllabus.length; // + other.length

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <Header subject={subject} />
      <div className='container mx-auto py-6 px-6 flex-grow'>
        <SubjectInfo subject={subject} />
        
        {totalItems > 0 ? (
          <>
            <div className='mb-4 flex justify-between items-center mt-6'>
              <h2 className='text-lg font-bold text-[#2b3333]'>Course Resources</h2>
              <span className='text-xs bg-[#e9f0f8] text-[#003366] px-2 py-1 rounded-full'>{totalItems} items</span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Pass the bucket name as the folder prop for ResourceItem to construct URL */}
              <ResourceSection title='Lecture Notes' IconComponent={BookOpenIcon} resources={notes} folder='academic_resources' />
              <ResourceSection title='Previous Year Questions' IconComponent={ClipboardListIcon} resources={pyqs} folder='academic_resources' />
              <ResourceSection title='Course Syllabus' IconComponent={DocumentTextIcon} resources={syllabus} folder='academic_resources' />
              {/* <ResourceSection title='Other Materials' IconComponent={SomeOtherIcon} resources={other} folder='academic_resources' /> */}
            </div>
          </>
        ) : (
          <div className="text-center py-10 mt-6 bg-white rounded-lg shadow-sm border border-[#e0e5ec]">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" /> {/* Or a more generic "no content" icon */}
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Resources Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no approved resources (Notes, PYQs, Syllabus) for this subject.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SubjectDetail;