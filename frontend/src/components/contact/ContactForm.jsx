import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast"; 

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "", 
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccessMessage(null);

    if (!formData.name || !formData.email || !formData.message) {
      const errorMessage = "Please fill in all required fields: Name, Email, and Message.";
      setFormError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        const errorMessage = "Please enter a valid email address.";
        setFormError(errorMessage);
        toast.error(errorMessage);
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://nfjegiigftyhlbfkbdho.supabase.co/functions/v1/send-contact-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, 
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorDetail = result.error || result.details || `Failed with status ${response.status}`;
        throw new Error(errorDetail);
      }

      const successMsg = result.message || "Message sent successfully!";
      setFormSuccessMessage(successMsg);
      toast.success(successMsg);
      setFormData({ name: "", email: "", subject: "", message: "" }); 
    } catch (error) {
      console.error("Contact form submission error:", error);
      const clientErrorMessage = error.message || "Failed to send message. Please try again later.";
      setFormError(clientErrorMessage);
      toast.error(clientErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>}
      {formSuccessMessage && <p className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">{formSuccessMessage}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[#2b3333] font-semibold">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#c79745] focus:ring-1 focus:ring-[#c79745]"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[#2b3333] font-semibold">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#c79745] focus:ring-1 focus:ring-[#c79745]"
            placeholder="Enter your email address"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-[#2b3333] font-semibold">
          Subject (Optional)
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-[#c79745] focus:ring-1 focus:ring-[#c79745]"
          placeholder="Enter the subject of your message"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-[#2b3333] font-semibold">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:border-[#c79745] focus:ring-1 focus:ring-[#c79745]"
          placeholder="Tell us how we can help you..."
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#2b3333] hover:bg-black text-white h-12 text-lg font-semibold rounded-md transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <FaPaperPlane className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
