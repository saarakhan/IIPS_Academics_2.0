import { useParams } from 'react-router-dom';
import subjects from '../../../Subject';
import { BookOpenIcon, DocumentTextIcon, ClipboardListIcon } from '../../../Icons';
import Header from './Header';
import EmptyState from './EmptyState';
import SubjectInfo from './SubjectInfo';
import resources from '../../../Resources';
import SearchAndSortBar from './SearchAndSortBar';
import FilterTabs from './FilterTabs';
import { useState } from 'react';
import ResourceSection from './ResourceSection';

function SubjectDetail() {
  const { id } = useParams();
  const subject = subjects.find(sub => sub.id === Number.parseInt(id));
  const resourceSet = resources.find(
    res =>
      res.subjectCode === subject.code &&
      res.semester === subject.semester &&
      res.instructor === subject.teacher
  );

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  if (!resourceSet) return <EmptyState />;

  const allResources = [
    ...(resourceSet.notes || []).map(res => ({ ...res, type: 'Notes', folder: 'notes' })),
    ...(resourceSet.pyqs || []).map(res => ({ ...res, type: 'Previous Year Papers', folder: 'pyqs' })),
    ...(resourceSet.syllabus || []).map(res => ({ ...res, type: 'Syllabus', folder: 'syllabus' }))
  ];

  const filteredResources = allResources.filter(resource => {
    const matchesQuery = resource.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || resource.type === filter;
    return matchesQuery && matchesFilter;
  });

  const filters = ['All', 'Notes', 'Assignments', 'Previous Year Papers', 'Syllabus'];

  // Group filtered resources by type
  const groupedResources = {
    notes: filteredResources.filter(res => res.type === 'Notes'),
    pyqs: filteredResources.filter(res => res.type === 'Previous Year Papers'),
    syllabus: filteredResources.filter(res => res.type === 'Syllabus'),
  };

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <div className='container mx-auto px-4 py-6'>
        {/* <button className='text-sm text-gray-500 mb-2'>&larr; Back to Academics</button> */}

        <div className='flex justify-between items-center mb-1'>
          <Header subject={subject} />
        </div>

        <div className='border border-gray-300 rounded-xl p-4 shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Course Resources</h2>

          <div className='flex flex-wrap justify-between items-center mb-4'>
            <FilterTabs filters={filters} current={filter} onChange={setFilter} />
            <SearchAndSortBar query={query} onQueryChange={setQuery} />
          </div>

          <ul className='space-y-4 overflow-y-auto max-h-[75vh] pr-2'>
            <ResourceSection
              title='Lecture Notes'
              IconComponent={BookOpenIcon}
              resources={groupedResources.notes}
              folder='notes'
            />
            <ResourceSection
              title='Previous Year Questions'
              IconComponent={ClipboardListIcon}
              resources={groupedResources.pyqs}
              folder='pyqs'
            />
            <ResourceSection
              title='Course Syllabus'
              IconComponent={DocumentTextIcon}
              resources={groupedResources.syllabus}
              folder='syllabus'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
