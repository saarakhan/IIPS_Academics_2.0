import { SiBookstack } from "react-icons/si";
import { FaAngleRight } from "react-icons/fa6";
import noData from "../../../assets/noData.svg";

const contributions = [
  {
    title: "Data Structures and Algorithms",
    semester: "MCA III Semester",
    date: "2021",
    reward: "+1 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "2022",
    reward: "+1 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "2025",
    reward: "+1 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "2025",
    reward: "+1 Gold",
  },
  {
    title: "Calculus II: Integration Techniques",
    semester: "MCA II Semester",
    date: "2025",
    reward: "+1 Gold",
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
export default function Syllabus() {
  return (
    <div className="mt-3 flex flex-col gap-2 h-[350px] overflow-y-auto pr-2">
      {contributions?.length > 0 ? (
        contributions.map((item, index) => (
          <Card key={index}>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-gray-200 rounded-full shrink-0">
                    <SiBookstack className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm sm:text-base break-words">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#3B3838]">{item.semester}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6  sm:mt-0 self-start sm:self-center ml-12">
                  <span className="px-3 py-1 text-xs sm:text-sm rounded-full font-medium bg-[#C79745]">
                    {item.reward}
                  </span>
                  <FaAngleRight className="bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] rounded-full w-5 h-5 sm:w-6 sm:h-6 " />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="w-full justify-center flex flex-col items-center">
          <img src={noData} className="w-[300px]" />
          <p className="mt-2 text-xl">you haven't uploaded any resource</p>
        </div>
      )}
    </div>
  );
}
