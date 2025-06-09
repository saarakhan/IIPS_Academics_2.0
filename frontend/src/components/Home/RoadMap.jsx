import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
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
    <div className="py-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block mb-4 text-sm font-medium px-3 py-1 border border-gray-300 rounded-full text-gray-700">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Journey to{" "}
          <span className="text-[#C79745] italic relative">
            Contribution
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#C79745] to-[#E6B366] rounded-full opacity-30"></div>
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Follow our simple 4-step process to share your knowledge and help
          build a stronger academic community.
        </p>
      </div>

      {/* Timeline */}

      <div className="relative">
        <div
          className="hidden lg:block absolute left-1/2 top-0 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b z-0 pointer-events-none"
          style={{
            background: `linear-gradient(
            to bottom, 
            #3b82f6 0%,       
            #10b981 40%,     
            #8b5cf6 70%,      
            #f59e0b 100%    
          )`,
          }}
        />

        {/* Timeline */}
        <VerticalTimeline className="relative z-10 !w-full">
          {steps.map((step, index) => (
            <VerticalTimelineElement
              key={index}
              contentStyle={{
                background: `${step.color}1A`,
                borderTop: `4px solid ${step.color}`,
                color: "#1f2937",
              }}
              contentArrowStyle={{ borderRight: `7px solid ${step.color}` }}
              iconStyle={{ background: step.color, color: "#fff" }}
              icon={<step.icon />}
            >
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-gray-700">{step.desc}</p>
              <span className="text-xs font-semibold text-gray-600 mt-2 inline-block">
                Step {step.step}
              </span>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
}
