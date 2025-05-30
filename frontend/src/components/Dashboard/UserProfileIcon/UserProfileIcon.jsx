import { useState, useEffect } from 'react';
import { FaCog, FaStar } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import './UserProfileIcon.css';
import { supabase } from '../../../supabaseClient';
import ProfileCompletionModal from '../ProfileCompletion/ProfileCompletionModal';

const UserProfileIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        return;
      }
      setUser(user);
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);

        const requiredFields = ['first_name', 'last_name', 'enrollment_number', 'course', 'semester'];
        const complete = requiredFields.every(field => profileData?.[field]);
        setIsProfileComplete(complete);
      }
    };

    fetchUserAndProfile();
  }, []);

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = updatedProfile => {
    setProfile(updatedProfile);

    const requiredFields = ['first_name', 'last_name', 'enrollment_number', 'course', 'semester'];
    const complete = requiredFields.every(field => updatedProfile?.[field]);
    setIsProfileComplete(complete);
  };

  if (!user) return null;

  return (
    <>
      <div className='user-profile-container'>
        <button className='profile-button' onClick={() => setIsModalOpen(true)}>
          <div className={`avatar ${isProfileComplete ? 'complete' : 'incomplete'}`}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'User'} className='avatar-image' />
            ) : (
              <div className='avatar-fallback'>{getInitials(profile?.full_name || user.email)}</div>
            )}

            <div className='avatar-ring'></div>

            <div className='settings-overlay'>
              <FaCog className='settings-icon' />
            </div>

            <div className={`status-indicator ${isProfileComplete ? 'complete' : 'incomplete'}`}>{isProfileComplete ? <FaStar className='status-icon' /> : <HiSparkles className='status-icon' />}</div>

            <div className='floating-sparkles'>
              <div className='sparkle-dot sparkle-1'></div>
              <div className='sparkle-dot sparkle-2'></div>
              <div className='sparkle-dot sparkle-3'></div>
              <div className='sparkle-dot sparkle-4'></div>
            </div>
          </div>
        </button>

        <div className='profile-tooltip'>
          {isProfileComplete ? (
            <span>
              <FaStar className='tooltip-icon' />
              Edit Profile
              <HiSparkles className='tooltip-icon' />
            </span>
          ) : (
            <span>
              <HiSparkles className='tooltip-icon' />
              Complete Profile
              <FaStar className='tooltip-icon' />
            </span>
          )}
        </div>
      </div>

      {isModalOpen && <ProfileCompletionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={user.id} userEmail={user.email} onSave={handleSaveProfile} initialProfile={profile} />}
    </>
  );
};

export default UserProfileIcon;
