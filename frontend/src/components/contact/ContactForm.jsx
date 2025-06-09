import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // simulate send
    setTimeout(() => {
      alert("Message sent!");
      setFormData({ name: "", email: "", message: "" });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-[#2b3333] font-semibold">
            Full Name
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
            Email Address
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
        <label htmlFor="message" className="text-[#2b3333] font-semibold">
          Message
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
        className="w-full bg-[#2b3333] hover:bg-black text-white h-12 text-lg font-semibold rounded-md transition-all duration-200 flex justify-center items-center gap-2"
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
