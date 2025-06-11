export default function StatusSummary({ counts, onStatusClick }) {
  const stats = [
    {
      key: "total",
      label: "Total Resources",
      value: counts.total,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      key: "pending",
      label: "Pending Review",
      value: counts.pending,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      key: "approved",
      label: "Approved",
      value: counts.approved,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected,
      color: "from-rose-500 to-red-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-rose-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8" >
      {stats.map((stat) => (
        <div
          key={stat.key}
          className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} ${stat.bgColor} p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
          onClick={() => {onStatusClick(stat.key)}}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out"></div>
          <div className="flex items-center">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${stat.borderColor}`}
            >
              {stat.icon}
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wider">
                {stat.label}
              </h3>
              <div
                className={`mt-1 text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-in-out`}
          ></div>
        </div>
      ))}
    </div>
  );
}
