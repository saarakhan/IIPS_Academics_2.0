import { SearchIcon } from '../../../Icons';

function EmptyState({ onClear }) {
  return (
    <div className='text-center py-16 bg-white rounded-xl shadow-sm border border-[#e0e5ec]'>
      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0f4f8] mb-4'>
        <SearchIcon className='h-8 w-8 text-[#003366]/50' />
      </div>
      <h3 className='text-lg font-bold text-[#2b3333] mb-2'>No subjects match your filters</h3>
      <p className='text-gray-500 mb-6 max-w-md mx-auto'>Try adjusting your filter criteria or clearing all filters to see more results</p>
      <button onClick={onClear} className='px-6 py-2 bg-[#003366] hover:bg-[#002855] text-white rounded-lg transition-colors shadow-sm'>
        Clear All Filters
      </button>
    </div>
  );
}

export default EmptyState;
