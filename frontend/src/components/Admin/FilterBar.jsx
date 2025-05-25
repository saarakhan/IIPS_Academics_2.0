export default function FilterBar({ filters, onChange }) {
  const handleInput = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select name="status" value={filters.status} onChange={handleInput} className="p-2 rounded border">
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
      <input
        type="text"
        name="subject"
        placeholder="Filter by subject"
        value={filters.subject}
        onChange={handleInput}
        className="p-2 rounded border"
      />
    </div>
  );
}
