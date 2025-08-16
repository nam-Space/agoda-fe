
// SortBar component
const SortBar = ({ sorts, activeSort, onSort }) => (
  <div className="flex gap-2 mb-4">
    {sorts.map((sort, idx) => (
      <button
        key={idx}
        className={`px-3 py-2 rounded ${activeSort === idx ? "bg-blue-100 text-blue-600 font-semibold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        onClick={() => onSort(idx)}
      >
        {sort}
      </button>
    ))}
  </div>
);

export default SortBar;