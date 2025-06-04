import { SearchIcon, XIcon } from '../../../Icons';

import { Input, Select } from 'antd';
const { Option } = Select;

function FilterPanel({ searchFilter, setSearchFilter, semesterFilter, setSemesterFilter, departmentFilter, setDepartmentFilter, departments, semesters, clearFilters }) {
  const hasActiveFilters = searchFilter || semesterFilter || departmentFilter;

  return (
    <div className='py-6'>
      {' '}
      {}
      <div className='flex items-center justify-between mb-6'>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm cursor-pointer'
            title='Clear all filters'>
            <XIcon size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>
      {}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Search input */}
        <div className=''>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Search Subject</label>
          <Input
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            allowClear
            placeholder='Search subjects or instructors...'
            prefix={<SearchIcon className='text-gray-400' />}
            size='middle'
            className='w-full custom-input'
          />
        </div>

        {}
        {/* Semester Dropdown */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Semester</label>
          <Select
            value={semesterFilter || undefined}
            onChange={value => setSemesterFilter(value)}
            allowClear
            placeholder='All Semesters'
            className='w-full custom-select '
            size='middle'
            popupMatchSelectWidth={false}>
            {semesters.map(sem => (
              <Option
                key={sem}
                value={sem}>
                Semester {sem}
              </Option>
            ))}
          </Select>
        </div>

        {}
        {/* Programs Dropdown (Department) */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Programs</label>
          <Select
            value={departmentFilter || undefined}
            onChange={value => setDepartmentFilter(value)}
            allowClear
            placeholder='All Courses'
            className='w-full custom-select'
            size='middle'
            popupMatchSelectWidth={false}>
            {(departments || []).map(course => (
              <Option
                key={course.id}
                value={course.id}>
                {course.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <span className='font-medium'>Active filters:</span>
            <div className='flex flex-wrap gap-2'>
              {searchFilter && <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>Search: "{searchFilter}"</span>}
              {semesterFilter && <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>Semester {semesterFilter}</span>}
              {departmentFilter && (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                  {departments.find(dept => dept.id === departmentFilter)?.name || departmentFilter}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
