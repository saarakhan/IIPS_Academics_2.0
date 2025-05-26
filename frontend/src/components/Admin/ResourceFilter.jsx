'use client';

import { useEffect, useState } from 'react';

export default function ResourceFilter({ filters, onChange }) {
  const [status, setStatus] = useState(filters.status || '');
  const [subject, setSubject] = useState(filters.subject || '');
  const [contributor, setContributor] = useState(filters.contributor || '');
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');

  // Auto-apply filters with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ status, subject, contributor, startDate, endDate });
    }, 300);
    return () => clearTimeout(timeout);
  }, [status, subject, contributor, startDate, endDate]);
  const resetFilters = () => {
    setStatus('');
    setSubject('');
    setContributor('');
    setStartDate('');
    setEndDate('');
    onChange({
      status: '',
      subject: '',
      contributor: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className='flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded-lg shadow mb-4'>
      {/* Status Dropdown */}
      <div>
        <label className='text-sm font-medium text-gray-700 mr-2'>Status:</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className='px-3 py-1 border rounded-md text-sm'>
          <option value=''>All</option>
          <option value='PENDING'>Pending</option>
          <option value='APPROVED'>Approved</option>
          <option value='REJECTED'>Rejected</option>
        </select>
      </div>

      {/* Subject Input */}
      <div>
        <label className='text-sm font-medium text-gray-700 mr-2'>Subject:</label>
        <input type='text' value={subject} onChange={e => setSubject(e.target.value)} placeholder='Enter subject' className='px-3 py-1 border rounded-md text-sm' />
      </div>

      {/* Contributor Input */}
      <div>
        <label className='text-sm font-medium text-gray-700 mr-2'>Contributor:</label>
        <input type='text' value={contributor} onChange={e => setContributor(e.target.value)} placeholder='Contributor name' className='px-3 py-1 border rounded-md text-sm' />
      </div>

      {/* Start Date */}
      <div>
        <label className='text-sm font-medium text-gray-700 mr-2'>Start Date:</label>
        <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} className='px-3 py-1 border rounded-md text-sm' />
      </div>

      {/* End Date */}
      <div>
        <label className='text-sm font-medium text-gray-700 mr-2'>End Date:</label>
        <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} className='px-3 py-1 border rounded-md text-sm' />
      </div>
      <button onClick={resetFilters} className='px-4 py-1.5 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 transition'>
        Reset Filters
      </button>
    </div>
  );
}
