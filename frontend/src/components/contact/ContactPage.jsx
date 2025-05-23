import ContactForm from "./ContactForm"
import DevelopersSection from "./DeveloperSection"
import Image from "../../assets/ContactusImage.jpg";
import Footer from "../Home/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fffefe]">
      {/* Header */}
      <header className="bg-[#2b3333] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-semibold text-[#2b3333] mb-6">Get in Touch</h2>
            <p className="text-gray-700 mb-8">
              Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back
              to you as soon as possible.
            </p>
            <ContactForm />
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-full max-w-md aspect-square">
              <img
                src={Image}
                alt="Customer support representative with headset"
                // fill
                className="object-contain"
                // priority
              />
            </div>
          </div>
        </div>
      </section>

      <Footer/>

      {/* Contact Info */}
      {/* <section className="py-10 bg-[#2b3333] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#c79745]">Address</h3>
              <p>123 Business Avenue</p>
              <p>Tech District, CA 90210</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#c79745]">Contact</h3>
              <p>Email: info@example.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-[#c79745]">Hours</h3>
              <p>Monday - Friday: 9AM - 5PM</p>
              <p>Weekend: Closed</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Developers Section */}
      <DevelopersSection />
    </main>
  )
}