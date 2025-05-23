// import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"

const developers = [
  {
    name: "Ayush Sharma",
    role: "Lead Developer",
    image: "/placeholder.svg?height=300&width=300",
    github: "https://github.com/AyushSharma72",
  },
  {
    name: "Saara Khan",
    role: "Developer",
    image: "/placeholder.svg?height=300&width=300",
    github: "https://github.com/saarakhan",
  },
  {
    name: "Shivi Tiwari",
    role: "Developer",
    image: "/placeholder.svg?height=300&width=300",
    github: "https://github.com/shivi028",
  },
]

export default function DevelopersSection() {
    
  return (
    <section className="py-16 bg-[#fffefe]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2b3333]">Meet Our Developers</h2>
          <div className="w-24 h-1 bg-[#c79745] mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our talented team of developers works tirelessly to create amazing experiences for our users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 transition-transform hover:transform hover:scale-105"
            >
              <div className="bg-[#2b3333] p-6 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#fffefe]">
                  <img src={dev.image || "/placeholder.svg"} alt={dev.name} className="object-cover" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2b3333] text-center">{dev.name}</h3>
                <p className="text-[#c79745] text-center mb-4">{dev.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2b3333] hover:text-[#c79745] transition-colors"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

}