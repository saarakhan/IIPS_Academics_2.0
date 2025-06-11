import ResourceItem from './ResourceItem';

function ResourceSection({ title, IconComponent, resources, folder }) {
  if (!resources || resources.length === 0) return null;
  return (
    <div className='bg-white border border-[#e0e5ec] rounded-lg p-4'>
      <div className='flex items-center mb-2'>
        <IconComponent className='h-5 w-5 text-[#C79745]/90 mr-2' />
        <h3 className='font-semibold text-gray-800'>{title}</h3>
      </div>
      <ul className='space-y-2'>
        {resources.map((item, index) => (
          <ResourceItem
            key={index}
            id={item.id}
            title={item.title}
            file={item.file}
            folder={folder}
            uploaded_at={item.uploaded_at}
            file_size_bytes={item.file_size_bytes}
            rating_average={item.rating_average}
          />
          // <ResourceItem
          // key={item.id || index}
          // title={item.title}
          // file={item.file}
          // folder={folder}
          // type={item.resource_type}
          // uploadedAt={item.uploaded_at}
          // fileSize={item.file_size_bytes}
          // ratingAverage={item.rating_average}
          // id={item.id}
          // />
        ))}
      </ul>
    </div>
  );
}

export default ResourceSection;
