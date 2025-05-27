'use client';

import { useState } from 'react';
import { MdVisibility, MdCheck, MdClose, MdDelete, MdDescription, MdPerson, MdCalendarToday, MdKeyboardArrowDown } from 'react-icons/md';
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
        approved_by_admin_id: '0b5648d6-7f4f-43b6-88cb-7bbc9ff226a4',
      })
      .eq('id', resource.id);

    if (!error) {
      showPopup('Resource approved!');
      onAction();
    } else {
      showPopup('Failed to approve resource.');
    }
  };

  const getStatusBadge = status => {
    switch (status) {
      case 'PENDING':
        return <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white'>Pending</span>;
      case 'APPROVED':
        return <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white'>Approved</span>;
      case 'REJECTED':
        return <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white'>Rejected</span>;
      default:
        return <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white'>{status}</span>;
    }
  };

  const getActionButtons = status => {
    switch (status) {
      case 'PENDING':
        return (
          <div className='flex gap-2'>
            <button
              onClick={() => setShowPreview(true)}
              className='inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <MdVisibility className='w-4 h-4 mr-1' />
            </button>
            <button
              onClick={approve}
              className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
              <MdCheck className='w-4 h-4 mr-1' />
            </button>
            <button
              onClick={() => setShowReject(true)}
              className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <MdClose className='w-4 h-4 mr-1' />
            </button>
          </div>
        );
      case 'APPROVED':
        return (
          <div className='flex gap-2'>
            <button
              onClick={() => setShowPreview(true)}
              className='inline-flex items-center px-3 py-1.5  text-sm font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <MdVisibility className='w-4 h-4 mr-1' />
            </button>
            <button
              onClick={() => setShowReject(true)}
              className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
              <MdClose className='w-4 h-4 mr-1' />
            </button>
          </div>
        );
      case 'REJECTED':
        return (
          <button
            onClick={() => setShowPreview(true)}
            className='inline-flex items-center px-3 py-1.5   text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <MdVisibility className='w-4 h-4 mr-1' />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className='border border-gray-200 rounded-lg p-4 shadow-sm overflow-hidden'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex gap-3 md:gap-4'>
          <MdDescription className='w-6 h-6 text-gray-500 shrink-0' />
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1'>
              {/* Mobile view: Title + Actions inline */}
              <div className='flex justify-between md:hidden'>
                <h4 className='font-medium text-gray-900'>{resource.title}</h4>
                <div>{getActionButtons(resource.status)}</div>
              </div>

              {/* Desktop view: Title only */}
              <div className='hidden md:block'>
                <h4 className='font-medium text-gray-900'>{resource.title}</h4>
              </div>

              <span> {getStatusBadge(resource.status)}</span>
            </div>

            <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600'>
              <span className='flex items-center gap-1'>
                <MdPerson className='w-4 h-4' />
                {resource.profiles?.first_name} {resource.profiles?.last_name}
              </span>
              <span className='flex items-center gap-1'>
                <MdCalendarToday className='w-4 h-4' />
                {new Date(resource.uploaded_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span>
                {resource.profiles?.course || 'N/A'} | Semester: {resource.profiles?.semester || 'N/A'}
              </span>
              <span>Size: {(resource.file_size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
          </div>
        </div>
        <div className='hidden md:block'>
          <div className='flex justify-start md:justify-end h-[30px]'>{getActionButtons(resource.status)}</div>
        </div>
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
