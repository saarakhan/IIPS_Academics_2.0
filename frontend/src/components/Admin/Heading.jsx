const Heading = () => {
  return (
    <div className='mb-8 relative'>
      <div className='absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-70 blur-2xl'></div>
      <div className='absolute top-10 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-70 blur-xl'></div>
      <h1 className='text-4xl font-bold text-gray-900 relative z-10 bg-black inline-block  bg-clip-text'>Admin Panel</h1>
      <p className='text-gray-600 mt-2 text-lg max-w-2xl'>Review and manage resources submitted by users across your platform</p>
      <div className='mt-4 flex gap-2'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800'>Admin Dashboard</span>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800'>Content Review</span>
      </div>
    </div>
  );
};

export default Heading;
