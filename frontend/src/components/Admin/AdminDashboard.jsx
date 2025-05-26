import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import ResourceCard from './ResourceCard';
import StatusSummary from './StatusSummary';
import FilterBar from './FilterBar';
import Heading from './Heading';
export default function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [counts, setCounts] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [filters, setFilters] = useState({ status: 'PENDING', subject: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from('resources')
      .select(
        `*, profiles!resources_uploader_profile_id_fkey(first_name, last_name)
, subjects(name)`
      )
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return;
    }

    setResources(data);
    updateCounts(data);
    applyFilters(data, filters);
  };

  const updateCounts = data => {
    const total = data.length;
    const approved = data.filter(r => r.status === 'APPROVED').length;
    const rejected = data.filter(r => r.status === 'REJECTED').length;
    const pending = data.filter(r => r.status === 'PENDING').length;
    setCounts({ total, approved, rejected, pending });
  };

  const applyFilters = (data, { status, subject }) => {
    const filtered = data.filter(r => (!status || r.status === status) && (!subject || r.subjects?.name.toLowerCase().includes(subject.toLowerCase())));
    setFiltered(filtered);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
    applyFilters(resources, newFilters);
  };

  const handleAction = async () => {
    fetchResources();
  };
  return (
    <div className='p-6 space-y-4'>
      <Heading />
      <StatusSummary counts={counts} />
      <FilterBar filters={filters} onChange={handleFilterChange} />
      <div className='grid gap-4'>
        {filtered.map(resource => (
          <ResourceCard key={resource.id} resource={resource} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
}
