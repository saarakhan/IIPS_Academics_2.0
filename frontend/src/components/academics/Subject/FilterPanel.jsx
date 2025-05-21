import { SearchIcon, FilterIcon, XIcon, CalendarIcon, UserIcon } from '../../../Icons';
import DepartmentDropdown from './DepartmentDropdown';

function FilterPanel({
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
}) {
  return (
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
          <label className='text-sm font-medium text-[#2b3333] block'>Subject Name</label>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Filter by subject name'
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]'
            />
          </div>
        </div>

        {/* Department Filter */}
        <DepartmentDropdown
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departmentDropdownOpen={departmentDropdownOpen}
          setDepartmentDropdownOpen={setDepartmentDropdownOpen}
          departments={departments}
        />

        {/* Teacher Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-[#2b3333] block'>Instructor</label>
          <div className='relative'>
            <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Filter by instructor'
              value={teacherFilter}
              onChange={e => setTeacherFilter(e.target.value)}
              className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]'
            />
          </div>
        </div>

        {/* Semester Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-[#2b3333] block'>Semester</label>
          <div className='relative'>
            <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='Filter by semester'
              value={semesterFilter}
              onChange={e => setSemesterFilter(e.target.value)}
              className='w-full pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
