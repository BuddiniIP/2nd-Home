export default function FilterBar({ onFilter }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
      
      <input
        type="text"
        placeholder="Search location"
        className="border rounded px-4 py-2 flex-1 min-w-[200px]"
        onChange={(e) => onFilter("location", e.target.value)}
      />

      <select
        className="border rounded px-4 py-2"
        onChange={(e) => onFilter("type", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>
        <option value="mixed">Mixed</option>
      </select>

      <select
        className="border rounded px-4 py-2"
        onChange={(e) => onFilter("price", e.target.value)}
      >
        <option value="">Any Price</option>
        <option value="low">Below 10,000</option>
        <option value="mid">10,000 – 15,000</option>
        <option value="high">Above 15,000</option>
      </select>
    </div>
  );
}
