export default function StatusSummary({ counts }) {
  const getColor = key => {
    switch (key.toLowerCase()) {
      case 'total resources':
        return 'text-black';
      case 'pending review':
        return 'text-yellow-600';
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-black';
    }
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 my-6 mr-2 sm:gap-6'>
      {Object.entries(counts).map(([key, value]) => (
        <div key={key} className='bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#00000030] p-4   flex flex-col items-center justify-center text-center'>
          <div className={`text-2xl font-bold ${getColor(key)}`}>{value}</div>
          <div className='text-md text-gray-600 uppercase tracking-wide'>{key}</div>
        </div>
      ))}
    </div>
  );
}
