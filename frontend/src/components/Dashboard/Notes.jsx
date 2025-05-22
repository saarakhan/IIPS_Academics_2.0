import { BookIcon, CalendarIcon, StarIcon } from "../../Icons"; 

const contributions = [
  {
    title: "Data Structures and Algorithms",
    semester: "MCA III Semester",
    date: "May 10, 2025",
    rating: 4.5,
    reward: "+2 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "April 15, 2025",
    rating: 4.1,
    reward: "+2 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "April 15, 2025",
    rating: 4.1,
    reward: "+2 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "April 15, 2025",
    rating: 4.1,
    reward: "+2 Gold",
  },
  
];

function Card({ children }) {
  return (
    <div className="bg-white shadow-sm border-b-2 rounded-xl ">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return (
    <div className="p-4 flex items-center justify-between">{children}</div>
  );
}
export default function Notes() {
  return (
    <div className="mt-3 flex flex-col gap-2 h-[400px] overflow-y-auto pr-2">
      {contributions.map((item, index) => (
        <Card key={index}>
          <CardContent>
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-200 rounded-full">
                <BookIcon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.semester}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{item.date}</span>
                  <span className="text-yellow-600 flex items-center ml-4">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {item.rating}/5.0
                  </span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 text-sm rounded-full font-medium bg-yellow-600 text-white">
              {item.reward}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
  
