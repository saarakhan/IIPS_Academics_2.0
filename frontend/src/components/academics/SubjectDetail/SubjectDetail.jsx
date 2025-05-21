import { useParams } from 'react-router-dom';
import subjects from '../../../Subject';
import { BookOpenIcon, DocumentTextIcon, ClipboardListIcon } from '../../../Icons';
import Header from './Header';
import EmptyState from './EmptyState';
import SubjectInfo from './SubjectInfo';
import resources from '../../../Resources';
import ResourceSection from './ResourceSection';

function SubjectDetail() {
  const { id } = useParams();
  const subject = subjects.find(sub => sub.id === Number.parseInt(id));
  const resourceSet = resources.find(res => res.subjectCode === subject.code && res.semester === subject.semester && res.instructor === subject.teacher);

  if (!resourceSet) return <EmptyState />;

  const totalItems = (resourceSet.notes?.length || 0) + (resourceSet.pyqs?.length || 0) + (resourceSet.syllabus?.length || 0);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      <Header subject={subject} />
      <div className='container mx-auto py-6 px-6'>
        <SubjectInfo subject={subject} />
        <div className='mb-4 flex justify-between items-center'>
          <h2 className='text-lg font-bold text-[#2b3333]'>Course Resources</h2>
          <span className='text-xs bg-[#e9f0f8] text-[#003366] px-2 py-1 rounded-full'>{totalItems} items</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <ResourceSection title='Lecture Notes' IconComponent={BookOpenIcon} resources={resourceSet.notes} folder='notes' />
          <ResourceSection title='Previous Year Questions' IconComponent={ClipboardListIcon} resources={resourceSet.pyqs} folder='pyqs' />
          <ResourceSection title='Course Syllabus' IconComponent={DocumentTextIcon} resources={resourceSet.syllabus} folder='syllabus' />
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
