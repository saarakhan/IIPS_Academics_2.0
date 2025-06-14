// frontend/src/components/Auth/UpdatePassword.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { UserAuth } from '../../Context/AuthContext';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');     
  const { session, loadingAuth } = UserAuth(); 
  const [isRecoverySessionActive, setIsRecoverySessionActive] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);


  useEffect(() => {
    
    if (!loadingAuth && !initialCheckDone) {
      setInitialCheckDone(true); 
      if (session && session.user) {
      
        console.log("UpdatePassword.jsx: Session detected on mount, User ID:", session.user.id);
        toast.success("Valid recovery link. You can now set your new password.");
        setIsRecoverySessionActive(true);
        setError(''); 
      } else {
        
        console.warn("UpdatePassword.jsx: No active session after auth loading. Link might be invalid or expired.");
        setError("Invalid or expired password reset link. Please request a new one if needed.");
        toast.error("Invalid or expired link. Please try the password reset process again.");
        setIsRecoverySessionActive(false);
      }
    }
  }, [session, loadingAuth, initialCheckDone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setMessage(''); 
    setLoading(true);

    if (!password || !confirmPassword) {
      const errText = 'Please enter and confirm your new password.';
      setError(errText);
      toast.error(errText);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      const errText = 'Passwords do not match.';
      setError(errText);
      toast.error(errText);
      setLoading(false);
      return;
    }
   

    if (!isRecoverySessionActive) {
      const errText = "Cannot update password. Session is not valid or link expired. Please try the reset process again.";
      setError(errText);
      toast.error(errText);
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: password });

      if (updateError) {
        throw updateError; 
      }

      const successMsg = 'Your password has been updated successfully! You can now sign in with your new password.';
      setMessage(successMsg);
      toast.success(successMsg);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/signin'); 
      }, 3000); 
    } catch (err) { 
      console.error('Error updating password:', err);
      const errMsg = err.message || 'Failed to update password. The link may have expired or been used already.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingAuth && !initialCheckDone) {
   
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Verifying reset link...</p>
        {}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#C79745]">
            Set Your New Password
          </h2>
          {!isRecoverySessionActive && !error && !loadingAuth && ( // Show if initial check failed but no specific error yet
             <p className="mt-2 text-center text-sm text-red-500">
                Could not validate password reset link. Please try requesting a new one.
             </p>
          )}
           {isRecoverySessionActive && (
             <p className="mt-2 text-center text-sm text-gray-600">
                Enter your new password below.
             </p>
           )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">New Password</label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                disabled={!isRecoverySessionActive || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] focus:z-10 sm:text-sm disabled:bg-gray-200"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                disabled={!isRecoverySessionActive || loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] focus:z-10 sm:text-sm disabled:bg-gray-200"
                placeholder="Confirm New Password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center py-2">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center py-2">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={loading || !isRecoverySessionActive}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                (loading || !isRecoverySessionActive) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C79745] hover:bg-[#b3863c]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b3863c] transition-colors`}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
