import ContactForm from "./ContactForm";
import DevelopersSection from "./DeveloperSection";
import Image from "../../assets/GetInTouch.jpg";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fefefe] to-[#f5f5f5] text-[#2b3333] font-arvo">
      <h1 className="text-5xl mt-8 w-full text-center font-bold text-[#222] drop-shadow-md">
        Contact Us
      </h1>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-1 md:order-2">
            <img
              src={Image}
              alt="Customer support representative"
              className="rounded-md -mt-3 shadow-2xl w-full max-w-[24rem] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="order-2 md:order-1 md:-mt-7">
            <h2 className="text-4xl font-bold py-2  text-[#333]">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Have questions or feedback? We'd love to hear from you. Fill out
              the form below and our team will get back to you shortly.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="bg-[#f7f7f7] py-16 border-t border-gray-200">
        <DevelopersSection />
      </section>
    </main>
  );
}
