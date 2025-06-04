import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { supabase } from '../../../supabaseClient';

import Header from '../Header/Header';
import Footer from '../../Home/Footer';
import FilterPanel from './FilterPanel';
import SubjectCard from './SubjectCard';
import EmptyState from './EmptyState';

function Subject() {
  const navigate = useNavigate();

  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courses, setCourses] = useState([]);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  // Data & Pagination
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const semesters = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  // Fetch departments
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('id, name').order('name', { ascending: true });

      if (!error) setCourses(data || []);
    };

    fetchCourses();
  }, []);

  // Fetch subjects
  const fetchSubjects = async (page = 0, search = '', department = '', semester = '') => {
    setLoading(true);
    const from = page * 20;
    const to = from + 19;

    let query = supabase.from('subjects').select('id, name, code, description, semester_number, teacher_name, course_id, course:course_id(name)').range(from, to).order('name', { ascending: true });
    if (search) {
      query = query.or(`name.ilike.%${search}%,teacher_name.ilike.%${search}%`);
    }

    if (department) query = query.eq('course_id', department);
    if (semester) query = query.eq('semester_number', parseInt(semester, 10));

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  };

  // Reset and fetch on filter change
  useEffect(() => {
    const resetAndFetch = async () => {
      setPage(0);
      setSubjects([]);
      setHasMore(true);
      setError(null);

      try {
        const initialData = await fetchSubjects(0, searchFilter, departmentFilter, semesterFilter);
        setSubjects(initialData);
        if (initialData.length < 20) setHasMore(false); // No more subjects
      } catch (err) {
        setError('Failed to fetch subjects: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    resetAndFetch();
  }, [searchFilter, departmentFilter, semesterFilter]);

  // Load more subjects
  const loadMoreSubjects = async () => {
    const nextPage = page + 1;
    try {
      const newSubjects = await fetchSubjects(nextPage, searchFilter, departmentFilter, semesterFilter);
      setSubjects(prev => [...prev, ...newSubjects]);
      setPage(nextPage);
      if (newSubjects.length < 20) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Error loading more subjects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = useCallback(() => {
    setSearchFilter('');
    setSemesterFilter('');
    setDepartmentFilter('');
  }, []);

  const handleCardClick = id => {
    navigate(`/subject/${id}`);
  };

  return (
    <div className='min-h-screen flex flex-col bg-[#FFFEFE]'>
      <Header />

      <div className='w-full bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4'>
          <FilterPanel
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            semesterFilter={semesterFilter}
            setSemesterFilter={setSemesterFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            departmentDropdownOpen={departmentDropdownOpen}
            setDepartmentDropdownOpen={setDepartmentDropdownOpen}
            departments={courses}
            semesters={semesters}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      <main className='flex-grow max-w-7xl w-full mx-auto px-4 py-8'>
        {error && <p className='text-center text-red-500'>Error: {error}</p>}

        {!error && (
          <>
            {loading && subjects.length === 0 ? (
              <p className='text-center text-gray-500'>Loading subjects...</p>
            ) : subjects.length === 0 ? (
              <div className='w-full max-w-md mx-auto'>
                <EmptyState onClear={clearFilters} />
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-6'>
                  {subjects.map(subject => {
                    const cardData = {
                      id: subject.id,
                      code: subject.code || 'N/A',
                      name: subject.name,
                      description: subject.description || 'No description available.',
                      semester: `Semester ${subject.semester_number}`,
                      department: subject.course?.name || 'N/A',
                      teacher: subject.teacher_name || 'To Be Announced',
                    };

                    return (
                      <SubjectCard
                        key={subject.id}
                        subject={cardData}
                        onClick={handleCardClick}
                      />
                    );
                  })}
                </div>

                {/* Load More Button rather than infinite scrolling */}
                {hasMore && (
                  <div className='flex justify-center'>
                    <button
                      onClick={loadMoreSubjects}
                      disabled={loading}
                      className='px-6 py-2 bg-[#C79745] text-white rounded-md hover:bg-[#b77f3a] transition disabled:opacity-50'>
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Subject;
