import { BookIcon, CalendarIcon, StarIcon } from "../../Icons";
import { FaAngleRight } from "react-icons/fa6";
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
    <div className="bg-white shadow-sm border-b-2  cursor-pointer">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return (
    <div className="p-4 flex items-center justify-between  ">{children}</div>
  );
}
export default function Notes() {
  return (
    <div className="mt-3 flex flex-col gap-2 h-[400px] overflow-y-auto pr-2">
      {contributions.map((item, index) => (
        <Card key={index}>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-gray-200 rounded-full shrink-0">
                  <BookIcon className="w-5 h-5" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm sm:text-base break-words">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#3B3838]">{item.semester}</p>

                  <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{item.date}</span>
                    </span>
                    <span className="flex items-center gap-1 sm:ml-4">
                      <span>
                        <StarIcon className="w-4 h-4 text-[#C79745]" />
                      </span>
                      <span className="text-xs sm:text-sm">
                        {item.rating}/5.0
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6  sm:mt-0 self-start sm:self-center ml-12">
                <span className="px-3 py-1 text-xs sm:text-sm rounded-full font-medium bg-[#C79745]">
                  {item.reward}
                </span>
                <FaAngleRight className="bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] rounded-full w-5 h-5 sm:w-6 sm:h-6 "  />
              </div>

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
