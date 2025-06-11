import Skeleton from '@mui/material/Skeleton';

function Loader() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fa] to-[#f0f4f8]'>
      {/* Subject Header */}
      <div className='shadow-sm bg-white py-4 px-6'>
        <Skeleton variant='rounded' animation='wave' sx={{ borderRadius: 5 }} width={200} height={30} />
        <Skeleton variant='text' animation='wave' width={200} height={30} />
        <div className='flex gap-2'>
          <Skeleton variant='text' animation='wave' width={100} height={30} />
          <Skeleton variant='text' animation='wave' width={100} height={30} />
        </div>
      </div>

      <div className='container mx-auto py-6 px-6 flex-grow'>
        {/* Detail */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-1'>
          <div className='flex gap-2'>
            <Skeleton variant='text' width='40%' height={80} />
            <Skeleton variant='text' width='40%' height={80} />
            <Skeleton variant='text' width='40%' height={80} />
          </div>
          <Skeleton variant='text' width='100%' height={80} />
        </div>

        {/* Heading n Count */}
        <div className='mb-4 flex justify-between items-center mt-6'>
          <Skeleton variant='text' width='30%' height={25} />
          <Skeleton variant='rounded' width={60} height={24} />
        </div>

        {/* Resource Card Skeletons */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='bg-white rounded-lg shadow-sm p-4 border border-[#e0e5ec]'>
              <div className='flex  '>
                <Skeleton variant='circular' width={40} height={40} className='mr-3' />
                <Skeleton variant='text' width='80%' height={30} />
              </div>
              <Skeleton variant='rectangular' height={100} className='mt-4' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loader;
