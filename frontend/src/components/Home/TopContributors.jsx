import { useState } from "react";
import { FaUpload, FaStar, FaAward, FaMedal, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const mockContributors = [
  {
    name: "Alex Johnson",
    course: "B.Tech Computer Science",
    uploads: 32,
    rating: "4.8",
    avatar: "/avatars/avatar-1.png",
  },
  {
    name: "Priya Sharma",
    course: "MCA",
    uploads: 28,
    rating: "4.9",
    avatar: "/avatars/avatar-2.png",
  },
  {
    name: "Rahul Verma",
    course: "B.Tech IT",
    uploads: 25,
    rating: "4.7",
    avatar: "/avatars/avatar-3.png",
  },
];

const badges = [FaTrophy, FaMedal, FaAward];

export default function TopContributors() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="w-full px-4 py-24 bg-gradient-to-b from-[#F4F9FF] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#C79745]/10 to-orange-100 opacity-70 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block mb-4 text-sm font-medium px-4 py-2 bg-[#C79745]/10 text-[#C79745] rounded-full">
            Hall of Fame
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top Contributors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recognizing our amazing student contributors who make this platform
            valuable
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mockContributors.map((contributor, i) => {
            const BadgeIcon = badges[i];

            return (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                data-aos="fade-up"
                data-aos-delay={i * 150}
              >
                <div
                  className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                    activeIndex === i
                      ? "shadow-xl transform -translate-y-2"
                      : "shadow-md"
                  }`}
                >
                  {/* Rank badge */}
                  <div
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, #C79745, ${
                        i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32"
                      })`,
                    }}
                  >
                    <BadgeIcon className="text-xl" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#C79745]/20 to-blue-100 flex items-center justify-center text-gray-400 text-5xl overflow-hidden border-4 border-white shadow-md">
                      👤
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {contributor.name}
                    </h3>

                    <p className="text-[#C79745] font-medium mb-4">
                      {contributor.course}
                    </p>

                    <div className="flex justify-center gap-6 text-sm text-gray-600 mb-6 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FaUpload />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {contributor.uploads}
                          </p>
                          <p className="text-xs text-gray-500">Uploads</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <FaStar />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {contributor.rating}
                          </p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
