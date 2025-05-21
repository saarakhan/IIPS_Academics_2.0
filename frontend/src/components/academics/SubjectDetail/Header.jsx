import { ArrowLeftIcon, BuildingIcon } from '../../../Icons';
import { Link } from 'react-router-dom';
const Header = ({ subject }) => {
  return (
    <div>
      <header className='bg-gradient-to-r from-[#002855] to-[#004080] text-white shadow-md'>
        <div className='container mx-auto py-5 px-6'>
          <div className='flex justify-between items-center mb-1'>
            <Link to='/' className='inline-flex items-center text-white/90 hover:text-white transition text-sm bg-white/10 px-3 py-1 rounded-full'>
              <ArrowLeftIcon className='h-4 w-4 mr-1' />
              Back
            </Link>
          </div>
          <h1 className='text-2xl font-bold'>{subject.name}</h1>
          <div className='flex items-center mt-1 text-sm text-white/80'>
            <BuildingIcon className='h-3.5 w-3.5 mr-1.5' />
            {subject.department || 'Department'}
            {subject.code && (
              <>
                <span className='mx-2'>•</span>
                <span className='font-medium'>{subject.code}</span>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
