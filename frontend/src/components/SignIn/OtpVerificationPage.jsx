import { useState } from "react";
import { UserAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

function OtpVerificationPage() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { SignOut } = UserAuth();

    // Fake API function – replace with actual service
    const verifyOtp = async (otp) => {
        // Mock example
        if (otp === "123456") return { success: true };
        return { success: false, error: "Invalid OTP" };
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { success, error: otpError } = await verifyOtp(otp);
        setLoading(false);

        if (!success) {
            setError(otpError);
            toast.error(otpError || "OTP verification failed");

            setTimeout(() => setError(null), 3000);
        } else {
            toast.success("Logged in successfully!");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        }
    };

    const resend = () => {
        console.log("resend otp");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-transparent backdrop-blur-sm">
            <form
                onSubmit={handleOtpVerify}
                className="w-full max-w-md bg-[#F3F6F2] bg-opacity-50 backdrop-blur-lg shadow-xl rounded-lg p-8 sm:p-10 transform scale-95 animate-[popIn_0.3s_ease-out_forwards]"
            >
                <div className="relative flex items-center justify-center">
                    <h2 className="text-2xl font-bold pb-2 text-[#C79745] text-center">
                        OTP Verification
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="absolute right-0 top-0 p-1"
                    >
                        <XMarkIcon className="h-8 w-8 p-1 text-[#2B3333] hover:bg-[#C79745] rounded-full" />
                    </button>
                </div>

                {/* OTP UI */}
                <div className="flex flex-col py-2">
                    <input
                        onChange={(e) => setOtp(e.target.value)}
                        className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79745]"
                        type="Number"
                        name="otp"
                        placeholder="Enter OTP"
                        required
                    />
                    <div
                        className="text-right mt-1 text-sm text-[#C79745] hover:text-[#b3863c] hover:underline"
                        onClick={resend}
                    >
                        resent otp
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