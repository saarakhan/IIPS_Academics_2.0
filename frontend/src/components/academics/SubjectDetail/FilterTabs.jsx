const FilterTabs = ({ filters, current, onChange }) => {
  return (
    <div className='flex space-x-3'>
      {filters.map((type) => (
        <button
          key={type}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            current === type ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onChange(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
