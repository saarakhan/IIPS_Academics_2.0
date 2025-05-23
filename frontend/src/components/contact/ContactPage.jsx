import ContactForm from "./ContactForm";
import DevelopersSection from "./DeveloperSection";
import Image from "../../assets/ContactusImage.jpg";
import Footer from "../Home/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fffefe]\ text-[#2b3333]">
      <h1 className="text-4xl mt-5 w-full text-center font-bold">Contact Us</h1>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-1 md:order-2">
            <img
              src={Image}
              alt="Customer support representative"
              className="rounded-xl shadow-xl w-full max-w-md object-cover"
            />
          </div>
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-6">
              Have questions or feedback? We'd love to hear from you. Fill out
              the form below and our team will get back to you shortly.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="bg-gray-50 py-12">
        <DevelopersSection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
