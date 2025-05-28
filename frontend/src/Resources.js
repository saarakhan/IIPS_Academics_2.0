// SAMPLE RESOURCES DATA
const resources = [
    {
        subjectCode: "IC-2K22",
        semester: "6",
        instructor: "Yasmin",
        notes: [
            { title: "Unit 1 - Signals",type: "Subject Notes", tags: ["Synchronization", "Semaphores", "Critical Section"], file: "unit1.pdf" },
            { title: "Unit 2 - Circuits", file: "ic-circuits.pdf" }
        ],
        pyqs: [
            { title: "2023 Midterm", type: "PYQ", file: "ic-midterm-2023.pdf" }
        ],
        syllabus: [
            { title: "IC Syllabus", type: "Syllabus", tags: ["Learning Outcome", "syllabus"], file: "ic-syllabus.pdf" }
        ]
    },
    {
        subjectCode: "IT-2K23",
        semester: "5",
        instructor: "Kirti Mathur",
        notes: [
            { title: "Unit 1 - Internet Basics", file: "it-unit1.pdf" },
            { title: "Unit 2 - Networking", file: "it-unit2.pdf" }
        ],
        pyqs: [
            { title: "2023 Endterm", file: "it-endterm-2023.pdf" }
        ],
        syllabus: [
            { title: "IT Syllabus", file: "it-syllabus.pdf" }
        ]
    }
];

export default resources;
