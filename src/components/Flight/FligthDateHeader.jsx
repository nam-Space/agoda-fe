import { useState } from "react";

const dates = [
  { date: "8 thg 8", price: "9.744.071 ₫" },
  { date: "9 thg 8", price: "4.265.036 ₫" },
  { date: "10 thg 8", price: "6.098.467 ₫" },
  { date: "11 thg 8", price: "3.048.050 ₫" },
  { date: "12 thg 8", price: "5.120.000 ₫" },
  { date: "13 thg 8", price: "4.500.000 ₫" },
  { date: "14 thg 8", price: "6.000.000 ₫" },
  { date: "15 thg 8", price: "3.800.000 ₫" },
  { date: "16 thg 8", price: "5.300.000 ₫" },
  { date: "17 thg 8", price: "4.900.000 ₫" },
];

const FlightDateHeader = ({ initialSelectedIndex = 0 }) => {
  const maxStartIndex = dates.length - 5;

  const clampStartIndex = (index) => {
    const middleOffset = 2;
    const proposedStart = index - middleOffset;
    return Math.min(Math.max(proposedStart, 0), maxStartIndex);
  };

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [startIndex, setStartIndex] = useState(clampStartIndex(initialSelectedIndex));

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setStartIndex(clampStartIndex(index));
  };

  return (
    <div className="flex gap-2 p-2 w-full">
  {dates.slice(startIndex, startIndex + 5).map((item, i) => {
    const realIndex = startIndex + i;
    return (
      <button
        key={realIndex}
        onClick={() => handleSelect(realIndex)}
        className={`flex-1 px-3 py-3 rounded border text-center w-full
          ${
            selectedIndex === realIndex
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
      >
        <div className="text-base font-medium">{item.date}</div>
        <div className="text-sm text-gray-700 mt-1">
          {selectedIndex === realIndex
            ? `Từ ${item.price}`
            : <span className="text-blue-600">Xem giá</span>}
        </div>
      </button>
    );
  })}
</div>

  );
};


export default FlightDateHeader;
