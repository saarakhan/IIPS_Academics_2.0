
export default function StatusSummary({ counts }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(counts).map(([key, value]) => (
        <div key={key} className="p-4 bg-gray-100 rounded-xl shadow text-center">
          <div className="text-sm uppercase text-gray-500">{key}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      ))}
    </div>
  );
}
