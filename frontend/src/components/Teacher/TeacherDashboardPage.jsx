// src/components/Teacher/TeacherDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../Context/AuthContext';
import TeacherResourceUploadModal from './TeacherResourceUploadModal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../supabaseClient'; 
import { BookIcon, CalendarIcon, StarIcon } from '../../Icons';
import { SiBookstack } from 'react-icons/si';
import { IoNewspaperOutline } from 'react-icons/io5';
import noData from '../../assets/noData.svg';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function Card({ children }) {
  return <div className="bg-white border-b-2 cursor-pointer">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-4 flex items-center justify-between">{children}</div>;
}

const TeacherDashboardPage = () => {
  const { session, user, profile } = UserAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedResources, setUploadedResources] = useState([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('Notes');
  const tabs = ['Notes', 'PYQs', 'Syllabus'];

 
  let teacherName = 'Teacher';
  if (profile) {
    if (profile.first_name || profile.last_name) {
      teacherName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    } else if (profile.full_name) {
      teacherName = profile.full_name;
    }
  }

  const fetchTeacherResources = async () => {
    const userId = session?.user?.id || user?.id;
    if (!userId) return;
    setIsLoadingResources(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          id,
          title,
          resource_type,
          status,
          uploaded_at,
          subject:subject_id ( name, code ),
          course:subject_id ( course:course_id ( name ) )
        `)
        .eq('uploader_profile_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setUploadedResources(data || []);
    } catch (err) {
      console.error("Error fetching teacher resources:", err);
      setFetchError("Could not load your resources.");
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchTeacherResources();
    // Always refetch when modal closes (after upload or cancel)
  }, [session?.user?.id, isUploadModalOpen]);

  const handleResourceUploaded = () => {
    fetchTeacherResources();
    setIsUploadModalOpen(false); // close modal after upload
  };

  const notes = uploadedResources.filter(r => r.resource_type === 'NOTE');
  const pyqs = uploadedResources.filter(r => r.resource_type === 'PYQ');
  const syllabus = uploadedResources.filter(r => r.resource_type === 'SYLLABUS');

  return (
    <div className="min-h-screen bg-[#F4F9FF] p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, {teacherName}!</p>
      </header>

      <div className="mb-6">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 bg-[#C79745] text-white font-semibold rounded-md shadow hover:bg-[#b3863c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C79745] focus:ring-offset-2"
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Upload New Resource
        </button>
      </div>

      <TeacherResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onResourceUploaded={handleResourceUploaded}
      />

      {/* History Section */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Upload History</h2>
        <div className="grid grid-cols-3 gap-2 p-1 mb-6 border-2 rounded-sm w-full">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full px-4 py-2 rounded-sm font-medium text-center transition-colors ${activeTab === tab ? 'bg-[#2B3333] text-white' : 'bg-gray-[#FEFEFE] text-black hover:bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'Notes' && (
            notes.length > 0 ? notes.map(item => (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-gray-200 rounded-full shrink-0">
                        <BookIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base break-words">{item.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                        </div>
                        <p className="text-sm text-[#3B3838]">{item.subject?.course?.name || ''} {item.subject?.name ? `- ${item.subject.name}` : ''}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">{item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'N/A'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="w-full justify-center flex flex-col items-center text-center ">
                <img src={noData} className="w-[200px] md:w-[250px]" alt="No notes uploaded" />
                <p className="mt-4 text-lg text-gray-700">You haven't uploaded any notes yet.</p>
              </div>
            )
          )}
          {activeTab === 'PYQs' && (
            pyqs.length > 0 ? pyqs.map(item => (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-gray-200 rounded-full shrink-0">
                        <IoNewspaperOutline className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base break-words">{item.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                        </div>
                        <p className="text-sm text-[#3B3838]">{item.subject?.course?.name || ''} {item.subject?.name ? `- ${item.subject.name}` : ''}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">{item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'N/A'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="w-full justify-center flex flex-col items-center text-center ">
                <img src={noData} className="w-[200px] md:w-[250px]" alt="No PYQs uploaded" />
                <p className="mt-4 text-lg text-gray-700">You haven't uploaded any PYQs yet.</p>
              </div>
            )
          )}
          {activeTab === 'Syllabus' && (
            syllabus.length > 0 ? syllabus.map(item => (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-gray-200 rounded-full shrink-0">
                        <SiBookstack className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base break-words">{item.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                        </div>
                        <p className="text-sm text-[#3B3838]">{item.subject?.course?.name || ''} {item.subject?.name ? `- ${item.subject.name}` : ''}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">{item.uploaded_at ? new Date(item.uploaded_at).toLocaleDateString() : 'N/A'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="w-full justify-center flex flex-col items-center text-center ">
                <img src={noData} className="w-[200px] md:w-[250px]" alt="No syllabus uploaded" />
                <p className="mt-4 text-lg text-gray-700">You haven't uploaded any syllabus files yet.</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboardPage;
