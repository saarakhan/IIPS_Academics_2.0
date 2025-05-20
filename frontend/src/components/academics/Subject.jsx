'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subjects from '../../Subject';
import { BookOpenIcon, SearchIcon, FilterIcon, XIcon, CalendarIcon, UserIcon, BuildingIcon, ChevronDownIcon } from '../../Icons';

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

  const handleCardClick = id => {
    navigate(`/subject/${id}`);
  };

  const clearFilters = () => {
    setNameFilter('');
    setTeacherFilter('');
    setSemesterFilter('');
    setDepartmentFilter('');
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (departmentDropdownOpen && !event.target.closest('#department-dropdown')) {
        setDepartmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [departmentDropdownOpen]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <div className='container mx-auto py-8 px-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-[#2b3333]'>Available Resources</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-300 border border-[#e0e5ec]'>
            {showFilters ? (
              <>
                <XIcon className='h-4 w-4' />
                Hide Filters
              </>
            ) : (
              <>
                <FilterIcon className='h-4 w-4' />
                Show Filters
              </>
            )}
          </button>
        </div>

        {showFilters && (
          <div className='bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#e0e5ec] animate-fadeIn'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h2 className='text-lg font-bold text-[#2b3333] flex items-center'>
                  <FilterIcon className='h-5 w-5 mr-2 text-[#003366]' />
                  Filter Resources
                </h2>
                <p className='text-gray-500 text-sm mt-1'>Find the right resources for your courses</p>
              </div>
              <button onClick={clearFilters} className='text-xs bg-[#f0f4f8] hover:bg-[#e0e5ec] text-[#003366] px-3 py-1.5 rounded-full transition-colors flex items-center'>
                <XIcon className='h-3 w-3 mr-1' />
                Clear All
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='space-y-2'>
                <label htmlFor='name-filter' className='text-sm font-medium text-[#2b3333] block'>
                  Subject Name
                </label>
                <div className='relative'>
                  <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    id='name-filter'
                    type='text'
                    placeholder='Filter by subject name'
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                    className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='department-dropdown' className='text-sm font-medium text-[#2b3333] block'>
                  Department
                </label>
                <div className='relative' id='department-dropdown'>
                  <button
                    onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
                    className='w-full flex items-center justify-between pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all text-left'>
                    <span className={departmentFilter ? 'text-[#2b3333]' : 'text-gray-400'}>{departmentFilter || 'Select department'}</span>
                    <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                  </button>
                  <BuildingIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />

                  {departmentDropdownOpen && (
                    <div className='absolute z-10 mt-1 w-full bg-white border border-[#e0e5ec] rounded-lg shadow-lg py-1 max-h-60 overflow-auto'>
                      <div
                        className='px-3 py-2 hover:bg-[#f0f4f8] cursor-pointer text-sm'
                        onClick={() => {
                          setDepartmentFilter('');
                          setDepartmentDropdownOpen(false);
                        }}>
                        All Departments
                      </div>
                      {departments.map(dept => (
                        <div
                          key={dept}
                          className='px-3 py-2 hover:bg-[#f0f4f8] cursor-pointer text-sm'
                          onClick={() => {
                            setDepartmentFilter(dept);
                            setDepartmentDropdownOpen(false);
                          }}>
                          {dept}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='teacher-filter' className='text-sm font-medium text-[#2b3333] block'>
                  Instructor
                </label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    id='teacher-filter'
                    type='text'
                    placeholder='Filter by instructor'
                    value={teacherFilter}
                    onChange={e => setTeacherFilter(e.target.value)}
                    className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='semester-filter' className='text-sm font-medium text-[#2b3333] block'>
                  Semester
                </label>
                <div className='relative'>
                  <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    id='semester-filter'
                    type='text'
                    placeholder='Filter by semester'
                    value={semesterFilter}
                    onChange={e => setSemesterFilter(e.target.value)}
                    className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {departmentFilter && (
          <div className='flex flex-wrap gap-2 mb-4'>
            <div className='inline-flex items-center bg-[#e9f0f8] text-[#003366] text-xs px-3 py-1 rounded-full'>
              Department: {departmentFilter}
              <button onClick={() => setDepartmentFilter('')} className='ml-2 hover:text-[#002855]'>
                <XIcon className='h-3 w-3' />
              </button>
            </div>
          </div>
        )}

        <div className='flex justify-between items-center mb-6'>
          <div>
            <p className='text-sm text-gray-500'>
              Showing <span className='font-medium text-[#003366]'>{filteredSubjects.length}</span> {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
            </p>
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow-sm border border-[#e0e5ec]'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0f4f8] mb-4'>
              <SearchIcon className='h-8 w-8 text-[#003366]/50' />
            </div>
            <h3 className='text-lg font-bold text-[#2b3333] mb-2'>No subjects match your filters</h3>
            <p className='text-gray-500 mb-6 max-w-md mx-auto'>Try adjusting your filter criteria or clearing all filters to see more results</p>
            <button onClick={clearFilters} className='px-6 py-2 bg-[#003366] hover:bg-[#002855] text-white rounded-lg transition-colors shadow-sm'>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredSubjects.map(subject => (
              <div
                key={subject.id}
                onClick={() => handleCardClick(subject.id)}
                className='group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-[#e0e5ec] transform hover:-translate-y-1'>
                <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] to-[#0056b3]'></div>

                <div className='p-5 pb-3'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1 pr-4'>
                      <h3 className='text-[#003366] text-lg font-bold group-hover:text-[#0056b3] transition-colors line-clamp-2'>
                        {subject.code ? `${subject.code}: ` : ''}
                        {subject.name}
                      </h3>
                      <div className='flex items-center mt-1'>
                        <BuildingIcon className='h-3.5 w-3.5 text-gray-400 mr-1.5' />
                        <p className='text-sm text-gray-600'>{subject.department || 'Department'}</p>
                      </div>
                    </div>
                    <div className='bg-[#f0f4f8] p-2 rounded-full flex-shrink-0 group-hover:bg-[#003366] transition-all duration-300'>
                      <BookOpenIcon className='h-5 w-5 text-[#003366] group-hover:text-white transition-colors' />
                    </div>
                  </div>
                </div>

                <div className='px-5 py-3'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-[#f8f9fa] p-3 rounded-lg'>
                      <p className='text-xs text-gray-500 uppercase font-medium mb-1'>Year</p>
                      <div className='text-sm font-bold text-[#2b3333]'>{subject.year || 'Not specified'}</div>
                    </div>
                    <div className='bg-[#f8f9fa] p-3 rounded-lg'>
                      <p className='text-xs text-gray-500 uppercase font-medium mb-1'>Semester</p>
                      <div className='text-sm font-bold text-[#2b3333]'>{subject.semester}</div>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center'>
                    <UserIcon className='h-4 w-4 text-gray-400 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Instructor: <span className='font-medium text-[#2b3333]'>{subject.teacher}</span>
                    </span>
                  </div>
                </div>

                <div className='p-5 pt-3'>
                  <button className='w-full bg-[#003366] hover:bg-[#002855] text-white py-2.5 rounded-lg transition-colors shadow-sm group-hover:shadow font-medium'>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Subject;
