import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; 

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email) {
      toast.error('Please enter your email address.');
      setMessage('Please enter your email address.');
      setLoading(false);
      return;
    }


    const redirectTo = `${window.location.origin}/update-password`;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) {
        throw error;
      }
      setMessage('If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).');
      toast.success('Password reset link sent (if account exists).');
      setEmail(''); 
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setMessage(error.message || 'Failed to send password reset email. Please try again.');
      toast.error(error.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#C79745]">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            No worries! Enter your email address below and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#C79745] focus:border-[#C79745] focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.startsWith('If an account exists') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-[#b3863c]/80 cursor-not-allowed' : 'bg-[#C79745] hover:bg-[#b3863c]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b3863c] transition-colors`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Password Reset Link'
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center mt-4">
          <Link to="/signin" className="font-medium text-[#C79745] hover:text-[#b3863c] hover:underline flex items-center justify-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
