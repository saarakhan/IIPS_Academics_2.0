import { ArrowLeftIcon, BuildingIcon } from '../../../Icons';
import { Link, useNavigate } from 'react-router-dom';
const Header = ({ subject }) => {
  const navigate = useNavigate();
  return (
    <div>
      <header className='bg-gradient-to-r from-[#5a9db7] to-[#4a8da7]   text-white shadow-md'>
        <div className='container mx-auto py-5 px-6'>
          <div className='flex justify-between items-center mb-1'>
            <button onClick={() => navigate(-1)} className='cursor-pointer inline-flex items-center text-white/90 hover:text-white transition text-sm bg-white/10 px-3 py-1 rounded-full'>
              <ArrowLeftIcon className='h-4 w-4 mr-1' />
              Back
            </button>
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
