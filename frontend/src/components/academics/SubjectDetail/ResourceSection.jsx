import ResourceItem from './ResourceItem';

function ResourceSection({ title, IconComponent, resources, folder }) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className='bg-white border border-[#e0e5ec] rounded-lg p-4'>
      <div className='flex items-center mb-2'>
        <IconComponent className='h-5 w-5 text-[#003366] mr-2' />
        <h3 className='font-semibold text-[#2b3333]'>{title}</h3>
      </div>
      <ul className='space-y-2'>
        {resources.map((item, index) => (
          <ResourceItem key={index} title={item.title} file={item.file} folder={folder} />
        ))}
      </ul>
    </div>
  );
}

export default ResourceSection;
