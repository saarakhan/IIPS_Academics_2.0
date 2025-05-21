import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subjects from '../../../Subject';
import FilterPanel from './FilterPanel';
import SubjectCard from './SubjectCard';
import EmptyState from './EmptyState';
import { FilterIcon, XIcon } from '../../../Icons';

function Subject() {
  const navigate = useNavigate();

  const [nameFilter, setNameFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  const departments = [...new Set(subjects.map(subject => subject.department).filter(Boolean))];

  useEffect(() => {
    const filtered = subjects.filter(
      subject =>
        subject.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        subject.teacher.toLowerCase().includes(teacherFilter.toLowerCase()) &&
        subject.semester.toLowerCase().includes(semesterFilter.toLowerCase()) &&
        (departmentFilter === '' || subject.department === departmentFilter)
    );
    setFilteredSubjects(filtered);
  }, [nameFilter, teacherFilter, semesterFilter, departmentFilter]);

  const clearFilters = () => {
    setNameFilter('');
    setTeacherFilter('');
    setSemesterFilter('');
    setDepartmentFilter('');
  };

  const handleCardClick = id => {
    navigate(`/subject/${id}`);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <div className='container mx-auto py-8 px-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-[#2b3333]'>Available Resources</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-[#003366] hover:bg-[#003366] hover:text-white transition-all border border-[#e0e5ec] cursor-pointer'>
            {showFilters ? (
              <div className='flex items-center'>
                <XIcon className='h-3 w-3 mr-1' /> Hide Filter
              </div>
            ) : (
              <div className='flex items-center'>
                <FilterIcon className='h-3 w-3 mr-1' /> Show Filter
              </div>
            )}
          </button>
        </div>

        {showFilters && (
          <FilterPanel
            {...{
              nameFilter,
              setNameFilter,
              teacherFilter,
              setTeacherFilter,
              semesterFilter,
              setSemesterFilter,
              departmentFilter,
              setDepartmentFilter,
              departmentDropdownOpen,
              setDepartmentDropdownOpen,
              departments,
              clearFilters,
            }}
          />
        )}

        <div className='mb-6'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-medium text-[#003366]'>{filteredSubjects.length}</span> {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
          </p>
        </div>

        {filteredSubjects.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredSubjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Subject;
