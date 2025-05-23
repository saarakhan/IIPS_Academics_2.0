import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    console.log(formData);
    // You can send formData to Supabase or any backend here
  };

  return (
    <>
    { isSuccess ? (
        <div className="text-center py-8">
          <div className="text-[#c79745] text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-[#2b3333] mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">Your message has been sent successfully.</p>
          <Button onClick={() => setIsSuccess(false)} className="bg-[#2b3333] hover:bg-[#3a4747] text-white">
            Send Another Message
          </Button>
        </div>
      ) : (
    <form onSubmit={handleSubmit} className="grid gap-6 w-full max-w-xl mx-auto">
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-semibold mb-1">Message</label>
        <textarea
          name="message"
          id="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition text-sm font-semibold w-full sm:w-auto"
        onSubmit = {handleSubmit}
      >
        Send Message
      </button>
    </form>
  )
      }
    </>
  );
}
