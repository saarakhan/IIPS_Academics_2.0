import { useState, useEffect } from "react";
import demo from "../../assets/demo.png";

const developers = [
  { name: "Ayush Sharma", role: "Mentor", image: demo, github: "https://github.com/AyushSharma72" },
  { name: "Saara Khan", role: "Developer", image: demo, github: "https://github.com/saarakhan" },
  { name: "Shivi Tiwari", role: "Developer", image: demo, github: "https://github.com/shivi028" },
  { name: "Anirudh", role: "Mentor", image: demo, github: "https://github.com/A-Knee09" },
  { name: "Animesh", role: "Developer", image: demo, github: "https://github.com/aniismess" },
  { name: "Ram", role: "Developer", image: demo, github: "https://github.com/ram40803" },
  { name: "Aarti", role: "Developer", image: demo, github: "https://github.com/ram40803" },
];

export default function DevelopersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null); // 'left' or 'right'

  const total = developers.length;
  const slideDuration = 500; // Increased duration for smoother transition

  const prevSlide = () => {
    if (animating) return;
    setDirection("left");
    setAnimating(true);
  };

  const nextSlide = () => {
    if (animating) return;
    setDirection("right");
    setAnimating(true);
  };

  useEffect(() => {
    if (!animating) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === "right") return (prev + 1) % total;
        if (direction === "left") return (prev - 1 + total) % total;
        return prev;
      });
      setAnimating(false);
      setDirection(null);
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [animating, direction, total]);

  // Calculate next and previous indexes for smooth transitions
  const nextIndex = (currentIndex + 1) % total;
  const prevIndex = (currentIndex - 1 + total) % total;

  return (
    <section className="">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2b3333]">Meet Our Developers</h2>
          <div className="w-24 h-1 bg-[#c79745] mx-auto mt-4 mb-4 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Our talented team of developers works tirelessly to create amazing experiences for our IIPS Community.
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          {/* Left arrow - positioned outside the card */}
          <button
            onClick={prevSlide}
            aria-label="Previous Developer"
            className="absolute -left-4 md:-left-12 top-1/2 transform -translate-y-1/2 bg-[#2b3333] hover:bg-[#c79745] text-white p-2 md:p-3 rounded-full z-10 transition-colors duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider container */}
          <div className="relative h-80 md:h-96 overflow-hidden">
            {/* Previous card (for exit animation) */}
            {animating && direction && (
              <div
                className={`absolute inset-0 transition-all duration-${slideDuration} ease-in-out ${
                  direction === "right" ? "-translate-x-full" : "translate-x-full"
                }`}
              >
                <DeveloperCard developer={developers[direction === "right" ? currentIndex : prevIndex]} />
              </div>
            )}

            {/* Current card */}
            <div
              className={`absolute inset-0 transition-all duration-${slideDuration} ease-in-out ${
                animating
                  ? direction === "right"
                    ? "translate-x-full"
                    : "-translate-x-full"
                  : "translate-x-0"
              }`}
            >
              <DeveloperCard developer={developers[currentIndex]} />
            </div>

            {/* Next card (for enter animation) */}
            {!animating && (
              <div
                className={`absolute inset-0 transition-all duration-${slideDuration} ease-in-out ${
                  direction === "right" ? "translate-x-full" : "-translate-x-full"
                }`}
              >
                <DeveloperCard developer={developers[direction === "right" ? nextIndex : currentIndex]} />
              </div>
            )}
          </div>

          {/* Right arrow - positioned outside the card */}
          <button
            onClick={nextSlide}
            aria-label="Next Developer"
            className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 bg-[#2b3333] hover:bg-[#c79745] text-white p-2 md:p-3 rounded-full z-10 transition-colors duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {developers.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentIndex) {
                  setDirection(index > currentIndex ? "right" : "left");
                  setCurrentIndex(index);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#c79745] w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to developer ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeveloperCard({ developer }) {
  return (
    <div className="group bg-[#f9ead2] rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="bg-gradient-to-tr from-[#2b3333] to-[#444f4f] p-4 flex-grow-0 flex justify-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-md">
          <img
            src={developer.image}
            alt={developer.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="p-4 text-center flex-grow flex flex-col justify-center">
        <h3 className="text-lg font-bold text-[#2b3333] group-hover:text-[#c79745] transition-colors">
          {developer.name}
        </h3>
        <p className="text-[#c79745] text-sm font-medium mb-2">{developer.role}</p>
        <div className="flex justify-center">
          <a
            href={developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2b3333] hover:text-[#c79745] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.5 2.3 1.1 2.9.9.1-.7.3-1.1.5-1.3-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 6 18.3 6.3 18.3 6.3c.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.2 0 4.7-2.7 5.6-5.3 5.9.3.3.6.8.6 1.6v2.3c0 .3.2.7.8.6A10.9 10.9 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}