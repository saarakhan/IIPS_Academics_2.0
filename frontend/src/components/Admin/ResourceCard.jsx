import { useState } from 'react';
import PreviewModal from './PreviewModal';
import RejectModal from './RejectModal';
import { supabase } from '../../supabaseClient';

export default function ResourceCard({ resource, onAction }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const showPopup = msg => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  const approve = async () => {
    const { error } = await supabase
      .from('resources')
      .update({
        status: 'APPROVED',
        approved_at: new Date().toISOString(),
        approved_by_admin_id: '0b5648d6-7f4f-43b6-88cb-7bbc9ff226a4', // admin id (.env)
      })
      .eq('id', resource.id);

    if (!error) {
      showPopup('Resource approved!');
      onAction();
    } else {
      showPopup('Failed to approve resource.');
    }
  };

  return (
    <div className='p-4 border rounded-lg shadow-sm bg-white space-y-2 relative'>
      <div className='font-bold'>{resource.title}</div>
      <div className='text-sm text-gray-600'>Subject: {resource.subjects?.name}</div>
      <p>
        Uploader: {resource.profiles?.first_name} {resource.profiles?.last_name}
      </p>

      <div className='flex gap-2 mt-2'>
        <button className='btn' onClick={() => setShowPreview(true)}>
          Preview
        </button>

        {resource.status === 'PENDING' && (
          <button className='btn bg-green-600 text-white' onClick={approve}>
            Approve
          </button>
        )}
        {resource.status !== 'REJECTED' && (
          <button className='btn bg-red-600 text-white' onClick={() => setShowReject(true)}>
            Reject
          </button>
        )}
      </div>

      {showPreview && <PreviewModal filePath={resource.file_path} onClose={() => setShowPreview(false)} />}
      {showReject && <RejectModal resourceId={resource.id} onClose={() => setShowReject(false)} onAction={onAction} />}

      {popupMessage && (
        <div className='absolute top-2 right-2 bg-black text-white px-3 py-1 rounded shadow' role='alert'>
          {popupMessage}
        </div>
      )}
    </div>             
  );
}
