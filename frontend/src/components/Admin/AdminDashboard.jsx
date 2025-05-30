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

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters(resources, filters);
  }, [filters, resources]);

  const fetchResources = async () => {
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

      const uploadedDate = new Date(r.uploaded_at); // assuming created_at is the upload date
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
    <div className='p-6 space-y-4 mx-auto'>
      <Heading />
      <StatusSummary counts={counts} />
      <ResourceFilter filters={filters} onChange={handleFilterChange} />
      <div className='grid gap-4'>
        {filtered.length === 0 ? (
          <div className='border border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500 bg-white shadow-sm'>
            <p className='text-lg font-medium mb-2'>No resources found</p>
            <p className='text-sm'>Try changing the filters or check back later.</p>
          </div>
        ) : (
          filtered
            .sort((a, b) => {
              const priority = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
              return priority[a.status] - priority[b.status];
            })
            .map(resource => <ResourceCard key={resource.id} resource={resource} onAction={handleAction} />)
        )}
      </div>
    </div>
  );
}
