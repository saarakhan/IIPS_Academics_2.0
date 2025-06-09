import { useRef } from "react";
import {
  FaFileAlt,
  FaBook,
  FaUpload,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
    {...props}
  >
    {children}
  </button>
);

const RoadMap = () => {
  const svgRef = useRef();

  const roadmapSteps = [
    {
      id: 1,
      title: "Upload",
      description:
        "Select notes, assignments, or study materials from your device",
      icon: FaFileAlt,
      color: "bg-blue-500",
      position: { x: 10, y: 50 },
    },
    {
      id: 2,
      title: "Notes",
      description:
        "Fill in subject, year, and relevant tags for easy discovery",
      icon: FaBook,
      color: "bg-green-500",
      position: { x: 35, y: 50 },
    },
    {
      id: 3,
      title: "Review",
      description: "Preview your submission and upload to share with peers",
      icon: FaUpload,
      color: "bg-purple-500",
      position: { x: 60, y: 50 },
    },
    {
      id: 4,
      title: "Share",
      description: "Your contribution helps fellow students succeed",
      icon: FaUsers,
      color: "bg-orange-500",
      position: { x: 85, y: 50 },
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8 m-6">
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Your Journey to{" "}
          <span className="italic font-serif text-[#C79745]">Contribution</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Follow this simple roadmap to share your knowledge and help fellow
          students succeed in their academic journey.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl p-4 md:p-8 overflow-hidden border-2 border-blue-100 shadow-lg">
          {/* SVG for animated lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="25%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {svgRef.current &&
              roadmapSteps.map((step, index) => {
                const nextStep = roadmapSteps[index + 1];
                if (!nextStep) return null;

                const svgWidth = svgRef.current.clientWidth;
                const svgHeight = svgRef.current.clientHeight;

                const x1 = (step.position.x / 100) * svgWidth;
                const y1 = (step.position.y / 100) * svgHeight;
                const x2 = (nextStep.position.x / 100) * svgWidth;
                const y2 = (nextStep.position.y / 100) * svgHeight;
                const midX = (x1 + x2) / 2;

                const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

                return (
                  <path
                    key={`path-${step.id}-${nextStep.id}`}
                    d={path}
                    stroke="url(#pathGradient)"
                    strokeWidth="4"
                    fill="none"
                    filter="url(#glow)"
                    strokeDasharray="6,6"
                  />
                );
              })}
          </svg>

          {/* Roadmap Steps */}
          {roadmapSteps.map((step, index) => (
            <div
              key={step.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: `${step.position.x}%`,
                top: `${step.position.y}%`,
                zIndex: 10,
              }}
            >
              <div
                className={`relative w-12 h-12 md:w-16 md:h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-4 border-white`}
              >
                <div
                  className={`absolute inset-0 ${step.color} rounded-full animate-ping opacity-20`}
                ></div>
                <step.icon className="text-white text-xl md:text-2xl relative z-10" />
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {step.id}
                </div>
              </div>

              <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 ml-2 md:ml-0">
                <div
                  className={`px-3 py-1 rounded-full text-white text-xs md:text-sm font-medium ${step.color} shadow-md mt-6`}
                >
                  {step.title}
                </div>
              </div>

              <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2">
                <FaMapMarkerAlt className="text-blue-600 opacity-60 animate-bounce text-base md:text-xl" />
              </div>

              <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 ">
                <div className="flex space-x-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300  ${
                        i <= index
                          ? step.color.replace("bg-", "bg-")
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute top-4 right-4 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
          <div
            className="absolute bottom-4 left-4 w-6 h-6 bg-purple-200 rounded-full opacity-40 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-8 w-3 h-3 bg-green-200 rounded-full opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Join 500+ students already sharing knowledge
          </p>

          <div className="flex justify-center space-x-6 md:space-x-8 mt-6">
            {roadmapSteps.map((step) => (
              <div key={step.id} className="text-center">
                <div
                  className={`text-xl md:text-2xl font-bold text-${
                    step.color.split("-")[1]
                  }-600`}
                >
                  {step.id}
                </div>
                <div className="text-xs text-gray-500">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
