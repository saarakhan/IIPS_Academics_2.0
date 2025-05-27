import { FiSearch } from 'react-icons/fi';


const SearchAndSortBar = ({ query, onQueryChange }) => {
  return (
    <div className='flex items-center space-x-3'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search resource ...'
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className='border border-gray-300 rounded-full px-4 py-1.5 pr-10 text-sm'
        />
        <FiSearch size={16} className='absolute right-3 top-2.5 text-gray-400' />
      </div>

      <select className='border border-gray-300 rounded px-2 py-1 text-sm'>
        <option>Recent</option>
        <option>Most Downloaded</option>
        <option>Rating</option>
      </select>
    </div>
  );
};

export default SearchAndSortBar;
