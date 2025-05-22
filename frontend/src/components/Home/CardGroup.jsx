
import { Link } from "react-router-dom";

function InfoCard({ title, description, content, link, buttonText }) {
  return (
    <div className="p-4 border border-yellow-500 rounded-md shadow-md hover:shadow-lg transition w-full max-w-md">
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <p className="text-sm text-gray-700">{description}</p>
      <p className="text-sm text-gray-600 mt-2">{content}</p>
      <Link to={link} className="mt-4 inline-block bg-gray-800 text-white px-4 py-2 rounded">
        {buttonText} →
      </Link>
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
      description: "Course Structure and Cirriculum",
      content: "Detailed syllabus for all courses and semesters at IIPS",
      link: "/syllabus",
      buttonText: "View Materials",
    },
  ];

export default function CardGroup() {
  return (
    <section className="py-10 px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center max-w-7xl mx-auto">
        {infoData.map((item, idx) => (
          <InfoCard key={idx} {...item} />
        ))}
    </section>
  );
}
