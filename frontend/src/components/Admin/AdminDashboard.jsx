'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import ResourceCard from './ResourceCard';
import StatusSummary from './StatusSummary';
import Heading from './Heading';
import ResourceFilter from './ResourceFilter';

export default function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [counts, setCounts] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [filters, setFilters] = useState({ status: '', subject: '', contributor: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters(resources, filters);
  }, [filters, resources]);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('resources').select(`
        *,
        profiles!resources_uploader_profile_id_fkey(first_name, last_name, course, semester),
        subjects(name)
      `);

    if (error) {
      console.error('Error fetching resources:', error);
    } else {
      setResources(data);
      updateCounts(data);
      applyFilters(data, filters);
    }
    setLoading(false);
  };

  const updateCounts = data => {
    const total = data.length;
    const approved = data.filter(r => r.status === 'APPROVED').length;
    const rejected = data.filter(r => r.status === 'REJECTED').length;
    const pending = data.filter(r => r.status === 'PENDING').length;
    setCounts({ total, approved, rejected, pending });
  };

  const applyFilters = (data, { status, subject, contributor, startDate, endDate }) => {
    const filtered = data.filter(r => {
      const matchesStatus = !status || r.status === status;
      const matchesSubject = !subject || r.subjects?.name.toLowerCase().includes(subject.toLowerCase());
      const fullName = `${r.profiles?.first_name || ''} ${r.profiles?.last_name || ''}`.toLowerCase();
      const matchesContributor = !contributor || fullName.includes(contributor.toLowerCase());

      const uploadedDate = new Date(r.uploaded_at);
      const afterStart = !startDate || uploadedDate >= new Date(startDate);
      const beforeEnd = !endDate || uploadedDate <= new Date(endDate);

      return matchesStatus && matchesSubject && matchesContributor && afterStart && beforeEnd;
    });

    setFiltered(filtered);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  const handleAction = async () => {
    await fetchResources();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <Heading />
        <StatusSummary counts={counts} />
        <ResourceFilter filters={filters} onChange={handleFilterChange} />

        <div className='mt-8 space-y-6'>
          {loading ? (
            <div className='grid gap-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='border border-gray-200 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-sm animate-pulse'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex gap-3 md:gap-4'>
                      <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                      <div className='flex-1'>
                        <div className='h-5 bg-gray-300 rounded w-3/4 mb-2'></div>
                        <div className='flex flex-wrap gap-2'>
                          <div className='h-4 bg-gray-200 rounded w-24'></div>
                          <div className='h-4 bg-gray-200 rounded w-32'></div>
                          <div className='h-4 bg-gray-200 rounded w-20'></div>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div className='h-8 w-8 bg-gray-300 rounded'></div>
                      <div className='h-8 w-8 bg-gray-300 rounded'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className='border-2 border-dashed border-gray-300 p-10 rounded-xl text-center bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <p className='text-xl font-medium text-gray-700 mb-2'>No resources found</p>
              <p className='text-gray-500 max-w-md mx-auto'>Try changing the filters or check back later when new resources have been submitted.</p>
            </div>
          ) : (
            <div className='grid gap-6'>
              {filtered
                .sort((a, b) => {
                  const priority = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
                  return priority[a.status] - priority[b.status];
                })
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} onAction={handleAction} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
