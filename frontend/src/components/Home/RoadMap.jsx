import { FaFileAlt, FaUpload, FaUserCheck, FaUsers } from "react-icons/fa";

const steps = [
  {
    title: "Fill the Form",
    desc: "Select notes or materials and provide basic information about your content",
    icon: FaFileAlt,
    color: "#3B82F6", // blue-500
    step: "01",
  },
  {
    title: "Upload Notes",
    desc: "Add subject tags and upload your study materials to help fellow students",
    icon: FaUpload,
    color: "#10B981", // emerald-500
    step: "02",
  },
  {
    title: "Admin Review",
    desc: "Our team reviews your content to ensure quality and relevance",
    icon: FaUserCheck,
    color: "#8B5CF6", // purple-500
    step: "03",
  },
  {
    title: "Community Access",
    desc: "Your materials become available to help other students succeed and you get points",
    icon: FaUsers,
    color: "#F59E0B", // amber-500
    step: "04",
  },
];

export default function RoadMap() {
  return (
    <div className="py-24 px-4 bg-gradient-to-b from-white to-[#F4F9FF]">
      {/* Header */}
      <div className="text-center mb-20">
        <span className="inline-block mb-4 text-sm font-medium px-4 py-2 bg-[#C79745]/10 text-[#C79745] rounded-full">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Journey to{" "}
          <span className="text-[#C79745] italic relative">
            Contribution
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#C79745] to-[#E6B366] rounded-full"></div>
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Follow our simple 4-step process to share your knowledge and help
          build a stronger academic community.
        </p>
      </div>

      {/* Timeline - Desktop */}
      <div className="hidden md:block max-w-6xl mx-auto relative ">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6] to-[#F59E0B] rounded-full"></div>

        <div className="relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center mb-24 last:mb-0 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                }`}
              >
                <div
                  className="p-6 rounded-2xl shadow-lg bg-white border-t-4"
                  style={{ borderColor: step.color }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: step.color }}
                    >
                      <step.icon size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: step.color }}
                      >
                        Step {step.step}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-left">{step.desc}</p>
                </div>
              </div>

              <div
                className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md"
                style={{
                  backgroundColor: step.color,
                  top: `${index * 17 + 3}rem`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline - Mobile */}
      <div className="md:hidden flex justify-center">
        <div className="relative md:border-l-2 -ml-4 md:ml-0 border-gray-200 pl-8 max-w-md w-full">
          {steps.map((step, index) => (
            <div key={index} className="mb-12 relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white absolute -left-5 top-0 shadow-lg"
                style={{ backgroundColor: step.color }}
              >
                <step.icon size={18} />
              </div>
              <div
                className="p-6 rounded-xl shadow-md bg-white border-t-4"
                style={{ borderColor: step.color }}
              >
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-gray-700">{step.desc}</p>
                <span
                  className="text-xs font-semibold mt-2 inline-block"
                  style={{ color: step.color }}
                >
                  Step {step.step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
