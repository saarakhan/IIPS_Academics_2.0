import { DownloadIcon } from '../../../Icons';

function ResourceItem({ title, file, folder }) {
  return (
    <li className='flex justify-between items-center bg-[#f8f9fa] p-2 rounded hover:bg-[#e9f0f8] transition'>
      <span className='text-sm text-[#2b3333]'>{title}</span>
      <a href={`/${folder}/${file}`} target='_blank' rel='noreferrer' className='text-sm text-[#003366] hover:underline flex items-center'>
        <DownloadIcon className='h-4 w-4 mr-1' />
        Download
      </a>
    </li>
  );
}

export default ResourceItem;
