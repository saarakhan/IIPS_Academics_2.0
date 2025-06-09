import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import ContactForm from "./ContactForm";
import DevelopersSection from "./DeveloperSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fefefe] via-[#f8f8f8] to-[#f5f5f5] text-[#2b3333]">
      <section className="pt-16 pb-8 bg-[#F4F9FF]">
        <div className="max-w-4xl mx-auto text-center px-4 ">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2b3333] mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help and answer any questions you might have. We look
            forward to hearing from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-[#2b3333] mb-6">
                  Get In Touch
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Have questions or feedback? We'd love to hear from you. Fill
                  out the form and our team will get back to you within 24
                  hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#c79745]/10 rounded-full flex items-center justify-center">
                    <FaEnvelope className="w-6 h-6 text-[#c79745]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2b3333]">Email Us</h3>
                    <p className="text-gray-600">contact@iips-academics.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#c79745]/10 rounded-full flex items-center justify-center">
                    <FaPhoneAlt className="w-6 h-6 text-[#c79745]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2b3333]">Call Us</h3>
                    <p className="text-gray-600">+91 (XXX) XXX-XXXX</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#c79745]/10 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="w-6 h-6 text-[#c79745]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2b3333]">Visit Us</h3>
                    <p className="text-gray-600">IIPS Campus, Indore</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#f7f7f7] to-[#f0f0f0] border-t border-gray-200">
        <DevelopersSection />
      </section>
    </main>
  );
}
