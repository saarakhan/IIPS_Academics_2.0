import { useState, useEffect } from "react"; 
import { UserAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import { XMarkIcon } from "@heroicons/react/24/outline";

function OtpVerificationPage() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation(); 

    const { verifySignupOtp, resendSignupOtp } = UserAuth();

    const [emailForOtp, setEmailForOtp] = useState('');
    const [otpType, setOtpType] = useState('');

    useEffect(() => {
        if (location.state?.email && location.state?.type) {
            setEmailForOtp(location.state.email);
            setOtpType(location.state.type); 
        } else {
            
            toast.error("Invalid navigation to OTP page. Please start over.");
            navigate("/signup"); // Or /signin depending on flow
        }
    }, [location.state, navigate]);


    const handleOtpVerify = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError("Please enter the OTP.");
            toast.error("Please enter the OTP.");
            return;
        }
        setLoading(true);
        setError(null);

      
        const { success, data, error: otpError } = await verifySignupOtp(emailForOtp, otp);
        setLoading(false);

        if (!success) {
            setError(otpError || "OTP verification failed. Please check the OTP and try again.");
            toast.error(otpError || "OTP verification failed.");
           
        } else {
            
            toast.success("Email verified successfully! You are now logged in.");
           
            setTimeout(() => {
                navigate("/"); 
            }, 1500);
        }
    };

    const handleResendOtp = async () => {
        if (!emailForOtp) {
            toast.error("Email address not available to resend OTP.");
            return;
        }
        setResendLoading(true);
        setError(null);
        const { success, message, error: resendError } = await resendSignupOtp(emailForOtp);
        setResendLoading(false);

        if (success) {
            toast.success(message || "A new OTP has been sent.");
        } else {
            setError(resendError || "Failed to resend OTP.");
            toast.error(resendError || "Failed to resend OTP.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
            <form
                onSubmit={handleOtpVerify}
                className="w-full max-w-md bg-[#F3F6F2] bg-opacity-50 backdrop-blur-lg shadow-xl rounded-lg p-8 sm:p-10 transform scale-95 animate-[popIn_0.3s_ease-out_forwards]"
            >
                <div className="relative flex items-center justify-center mb-4">
                    <h2 className="text-2xl font-bold pb-2 text-[#C79745] text-center">
                        Verify Your Email
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate("/signup")} // Go back to signup if they want to cancel/restart
                        className="absolute right-0 top-0 p-1"
                    >
                        <XMarkIcon className="h-8 w-8 p-1 text-[#2B3333] hover:bg-[#C79745] rounded-full" />
                    </button>
                </div>
                
                <p className="text-center text-sm text-gray-700 mb-2">
                    An OTP has been sent to <strong>{emailForOtp}</strong>.
                </p>
                <p className="text-center text-xs text-gray-500 mb-4">
                    Please enter it below to complete your registration. (Check your spam/junk folder if you don't see it.)
                </p>

                {error && <p className="text-red-600 text-center text-sm mb-3">{error}</p>}

                <div className="flex flex-col py-2">
                    <input
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79745] text-center tracking-widest"
                        type="text" // Changed to text to allow easier input, can be number with more styling
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        required
                        maxLength={6} // Assuming 6-digit OTP
                    />
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendLoading}
                            className="text-sm text-[#C79745] hover:text-[#b3863c] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? "Sending..." : "Resend OTP"}
                        </button>
                    </div>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className={`w-full mt-4 py-3 rounded-lg text-white transition duration-300 ${loading
                        ? "bg-[#2B3333]/70 cursor-not-allowed"
                        : "bg-[#2B3333] hover:shadow-lg shadow-[#2B3333]"
                        }`}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    )
}

export default OtpVerificationPage;
