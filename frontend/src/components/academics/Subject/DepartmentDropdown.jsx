import { ChevronDownIcon, BuildingIcon } from '../../../Icons'

function DepartmentDropdown({ departmentFilter, setDepartmentFilter, departmentDropdownOpen, setDepartmentDropdownOpen, departments }) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-[#2b3333] block'>Department</label>
      <div className='relative' id='department-dropdown'>
        <button
          onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
          className='w-full flex items-center justify-between pl-10 pr-3 py-2.5 bg-[#f8f9fa] border border-[#e0e5ec] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-left'>
          <span className={departmentFilter ? 'text-[#2b3333]' : 'text-gray-400'}>
            {departmentFilter || 'Select department'}
          </span>
          <ChevronDownIcon className='h-4 w-4 text-gray-400' />
        </button>
        <BuildingIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />

        {departmentDropdownOpen && (
          <div className='absolute z-10 mt-1 w-full bg-white border border-[#e0e5ec] rounded-lg shadow-lg py-1 max-h-60 overflow-auto'>
            <div className='px-3 py-2 hover:bg-[#f0f4f8] cursor-pointer text-sm' onClick={() => {
              setDepartmentFilter('');
              setDepartmentDropdownOpen(false);
            }}>
              All Departments
            </div>
            {departments.map(dept => (
              <div key={dept} className='px-3 py-2 hover:bg-[#f0f4f8] cursor-pointer text-sm' onClick={() => {
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
  );
}

export default DepartmentDropdown;
