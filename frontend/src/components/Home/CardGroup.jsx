import { Link } from "react-router-dom";

function InfoCard({ title, description, content, link, buttonText }) {
  return (
    <div className="p-6 border-2 border-[#C79745] rounded-lg bg-white shadow-[23px_16px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[15px_10px_4px_0px_rgba(0,0,0,0.25)] transition-all">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-1">{description}</p>
      <p className="text-gray-600 mb-6">{content}</p>
      <div className="text-center">
        <Link 
          to={link} 
          className="inline-block w-full max-w-xs bg-[#2B3333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a1f1f] transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

const infoData = [
  {
    title: "Course Materials",
    description: "Access study material for all courses",
    content: "Find lecture notes, presentations, and reference notes for all subjects",
    link: "/materials",
    buttonText: "View Materials",
  },
  {
    title: "Previous Year Papers",
    description: "Practice with past exams ;)",
    content: "Access previous years question papers and solutions for better preparation",
    link: "/papers",
    buttonText: "View Papers",
  },
  {
    title: "Syllabus",
    description: "Course Structure and Curriculum",
    content: "Detailed syllabus for all courses and semesters at IIPS",
    link: "/syllabus",
    buttonText: "View Syllabus",
  },
];

export default function CardGroup() {
  return (
    <section className="py-12 px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoData.map((item, idx) => (
            <InfoCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
