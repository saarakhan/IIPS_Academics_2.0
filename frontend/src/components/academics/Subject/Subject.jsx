import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subjects from '../../../Subject';
import FilterPanel from './FilterPanel';
import SubjectCard from './SubjectCard';
import EmptyState from './EmptyState';

import Header from '../Header/Header';

function Subject() {
  const navigate = useNavigate();

  const [searchFilter, setSearchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  const departments = ['MBA', 'MCA', 'MTech'];
  const semesters = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    const filtered = subjects.filter(
      subject =>
        (subject.name.toLowerCase().includes(searchFilter.toLowerCase()) || subject.teacher.toLowerCase().includes(searchFilter.toLowerCase())) &&
        (semesterFilter === '' || subject.semester === semesterFilter) &&
        (departmentFilter === '' || subject.department === departmentFilter)
    );
    setFilteredSubjects(filtered);
  }, [searchFilter, semesterFilter, departmentFilter]);

  const clearFilters = () => {
    setSearchFilter('');
    setSemesterFilter('');
    setDepartmentFilter('');
  };

  const handleCardClick = id => {
    navigate(`/subject/${id}`);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <div className='container'>
        <Header />

        {showFilters && (
          <FilterPanel
            {...{
              searchFilter,
              setSearchFilter,
              semesterFilter,
              setSemesterFilter,
              departmentFilter,
              setDepartmentFilter,
              departmentDropdownOpen,
              setDepartmentDropdownOpen,
              departments,
              semesters,
              clearFilters,
            }}
          />
        )}

        <div className='mb-6 ml-4'>
          <p className='text-sm text-gray-500'>
            Showing <span className='font-medium text-[#003366]'>{filteredSubjects.length}</span> {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
          </p>
        </div>

        {filteredSubjects.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4   '>
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
