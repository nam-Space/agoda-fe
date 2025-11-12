// // SearchBar.jsx
import { CalendarToday, People, Search } from '@mui/icons-material';
import { useState } from 'react';
import { callSearchRoomQuery } from '../../config/api';

// const SearchBar = ({ onSearch = () => console.log('onSearch not provided') }) => {
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [activeButton, setActiveButton] = useState(null);
//   const [selectedDate1, setSelectedDate1] = useState('2025-10-10');
//   const [selectedDate2, setSelectedDate2] = useState('2025-10-12');
//   const [currentMonth, setCurrentMonth] = useState(10);
//   const currentYear = 2025;
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [rooms, setRooms] = useState(1);
//   const [adults, setAdults] = useState(2);
//   const [children, setChildren] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('The Song House Vung Tau');

//   const toggleDatePicker = (button) => {
//     setActiveButton(button);
//     setIsDatePickerOpen(!isDatePickerOpen);
//   };

//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   const increment = (setter) => setter((prev) => prev + 1);
//   const decrement = (setter, min = 0) => setter((prev) => (prev > min ? prev - 1 : min));

//   const handleDateSelect = (day) => {
//     const newDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     if (activeButton === 'button1') setSelectedDate1(newDate);
//     else if (activeButton === 'button2') setSelectedDate2(newDate);
//     setIsDatePickerOpen(false);
//   };

//   const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

//   const isDateDisabled = (day) => {
//     if (activeButton === 'button2') {
//       const [year1, month1, day1] = selectedDate1.split('-').map(Number);
//       const date1 = new Date(year1, month1 - 1, day1);
//       const date2 = new Date(currentYear, currentMonth - 1, day);
//       return date2 <= date1;
//     }
//     return false;
//   };

//   const handleSearch = async () => {
//     try {
//       const query = `hotel_name=${encodeURIComponent(searchQuery)}&adults=${adults}&children=${children}&start_date=${selectedDate1}&end_date=${selectedDate2}`;
//       const response = await callSearchRoomQuery(query);

//       console.log("API raw response:", response);

//       const hotelInfo = response.data?.data || null;
//       const roomsData = hotelInfo?.rooms || [];

//       onSearch({
//         hotelId: hotelInfo?.id || 'default-id',
//         hotel: hotelInfo,
//         rooms: roomsData,
//         startDate: selectedDate1,
//         endDate: selectedDate2,
//         adults,
//         children,
//         roomsCount: rooms,
//       });
//     } catch (err) {
//       console.error('Search failed:', err);
//       onSearch({
//         hotelId: 'default-id',
//         hotel: null,
//         rooms: [],
//         startDate: selectedDate1,
//         endDate: selectedDate2,
//         adults,
//         children,
//         roomsCount: rooms,
//       });
//     }
//   };

//   return (
//     <div className="search-bar bg-blue-900 shadow p-4 flex justify-center items-center text-white relative">
//       {/* Search input */}
//       <div className="flex items-center bg-white text-black rounded px-4 py-2 w-full max-w-md">
//         <Search className="text-gray-600 mr-2" />
//         <input
//           type="text"
//           placeholder="Nhập tên khách sạn..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border-none outline-none w-full"
//         />
//       </div>

//       {/* Filters */}
//       <div className="filters flex space-x-4 items-center px-4 py-2">
//         <button
//           onClick={() => toggleDatePicker('button1')}
//           className="flex items-center bg-white text-black rounded px-4 py-2"
//         >
//           <CalendarToday className="mr-2 text-gray-600" />
//           <span>{selectedDate1}</span>
//         </button>
//         <button
//           onClick={() => toggleDatePicker('button2')}
//           className="flex items-center bg-white text-black rounded px-4 py-2"
//         >
//           <CalendarToday className="mr-2 text-gray-600" />
//           <span>{selectedDate2}</span>
//         </button>

//         <div className="relative">
//           <button
//             onClick={toggleDropdown}
//             className="flex items-center bg-white text-black rounded px-4 py-2"
//           >
//             <People className="mr-2 text-gray-600" />
//             <span>{adults} người lớn, {rooms} phòng</span>
//           </button>
//         </div>
//       </div>

//       {/* Search button */}
//       <button
//         onClick={handleSearch}
//         className="bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Cập nhật
//       </button>

//       {/* Date picker */}
//       {/* {isDatePickerOpen && (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-full max-w-md z-50">
//           <div className="flex justify-between border-b mb-4">
//             <h3 className="text-blue-600 font-bold">Tháng {currentMonth} {currentYear}</h3>
//           </div>
//           <div className="grid grid-cols-7 gap-2 text-center">
//             {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, index) => { */}
//         {isDatePickerOpen && (
//   <div
//     className="absolute mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-full max-w-md z-50"
//     style={{ left: '50%', transform: 'translateX(-50%)' }}
//   >
//     <div className="flex justify-between border-b mb-4">
//       <h3 className="text-blue-600 font-bold">Tháng {currentMonth} {currentYear}</h3>
//     </div>
//     <div className="grid grid-cols-7 gap-2 text-center">
//       {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, index) => {
//               const day = index + 1;
//               const isSelected =
//                 (activeButton === 'button1' && day === parseInt(selectedDate1.split('-')[2]) && currentMonth === parseInt(selectedDate1.split('-')[1])) ||
//                 (activeButton === 'button2' && day === parseInt(selectedDate2.split('-')[2]) && currentMonth === parseInt(selectedDate2.split('-')[1]));

//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleDateSelect(day)}
//                   disabled={isDateDisabled(day)}
//                   className={`py-2 px-4 rounded ${
//                     isDateDisabled(day) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
//                     isSelected ? 'bg-blue-600 text-white' :
//                     'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {day}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Overlay */}
//       {(isDropdownOpen || isDatePickerOpen) && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => {
//             setIsDatePickerOpen(false);
//             setIsDropdownOpen(false);
//           }}
//         ></div>
//       )}

//       {/* Dropdown rooms/adults/children */}
//       {isDropdownOpen && (
//         // <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-gray-800 shadow-lg rounded-lg p-4 w-64 z-50">

//           <div className="flex justify-between items-center mb-2">
//             <span>Phòng</span>
//             <div className="flex items-center space-x-2">
//               <button onClick={() => decrement(setRooms, 1)} className="border rounded px-2 py-1">-</button>
//               <span>{rooms}</span>
//               <button onClick={() => increment(setRooms)} className="border rounded px-2 py-1">+</button>
//             </div>
//           </div>
//           <div className="flex justify-between items-center mb-2">
//             <span>Người lớn</span>
//             <div className="flex items-center space-x-2">
//               <button onClick={() => decrement(setAdults, 1)} className="border rounded px-2 py-1">-</button>
//               <span>{adults}</span>
//               <button onClick={() => increment(setAdults)} className="border rounded px-2 py-1">+</button>
//             </div>
//           </div>
//           <div className="flex justify-between items-center">
//             <span>Trẻ em</span>
//             <div className="flex items-center space-x-2">
//               <button onClick={() => decrement(setChildren, 0)} className="border rounded px-2 py-1">-</button>
//               <span>{children}</span>
//               <button onClick={() => increment(setChildren)} className="border rounded px-2 py-1">+</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;
// SearchBar.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { callGetSearchSuggestions } from '../../config/api';

const SearchBar = ({ onSearch = () => console.log('onSearch not provided') }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 🔹 Khởi tạo giá trị từ URL hoặc mặc định
  const initialCheckIn = searchParams.get('check_in') || '2025-10-10';
  const initialCheckOut = searchParams.get('check_out') || '2025-10-12';
  const initialAdults = parseInt(searchParams.get('adults')) || 2;
  const initialRooms = parseInt(searchParams.get('rooms')) || 1;
  const initialHotel = searchParams.get('hotel_name') || '';

  // 🔹 State
  const [selectedDate1, setSelectedDate1] = useState(initialCheckIn);
  const [selectedDate2, setSelectedDate2] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [rooms, setRooms] = useState(initialRooms);
  const [children, setChildren] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔹 Search input + gợi ý
  const [searchQuery, setSearchQuery] = useState(initialHotel);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef();

  // 🔹 Lấy suggestions khi người dùng gõ
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) return setSuggestions([]);
      try {
        const response = await callGetSearchSuggestions(`q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(response.data.data.filtered_suggestions || []);
      } catch (err) {
        console.error('Fetch suggestions failed:', err);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
  };

  // 🔹 Đóng suggestions khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Search function
  const handleSearch = async () => {
    try {
      const query = `hotel_name=${encodeURIComponent(searchQuery)}&adults=${adults}&children=${children}&start_date=${selectedDate1}&end_date=${selectedDate2}`;
      const response = await callSearchRoomQuery(query);

      const hotelInfo = response.data?.data || null;
      const roomsData = hotelInfo?.rooms || [];

      onSearch({
        hotelId: hotelInfo?.id || 'default-id',
        hotel: hotelInfo,
        rooms: roomsData,
        startDate: selectedDate1,
        endDate: selectedDate2,
        adults,
        children,
        roomsCount: rooms,
      });
    } catch (err) {
      console.error('Search failed:', err);
      onSearch({
        hotelId: 'default-id',
        hotel: null,
        rooms: [],
        startDate: selectedDate1,
        endDate: selectedDate2,
        adults,
        children,
        roomsCount: rooms,
      });
    }
  };

  // 🔹 Các hàm tiện ích dropdown
  const toggleDatePicker = (button) => {
    setActiveButton(button);
    setIsDatePickerOpen(!isDatePickerOpen);
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const increment = (setter) => setter(prev => prev + 1);
  const decrement = (setter, min = 0) => setter(prev => (prev > min ? prev - 1 : min));

  return (
    <div className="search-bar bg-blue-900 shadow p-4 flex justify-center items-center text-white relative">
      {/* Search input với gợi ý */}
      <div className="relative w-full max-w-md" ref={suggestionsRef}>
        <div className="flex items-center bg-white text-black rounded px-4 py-2">
          <Search className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Nhập tên khách sạn..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            className="border-none outline-none w-full"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white text-black shadow-lg rounded-b z-50 max-h-64 overflow-auto">
            {suggestions.map((item, idx) => (
              <div key={idx} onClick={() => handleSelectSuggestion(item)} className="p-2 cursor-pointer hover:bg-gray-200">
                {item.type === 'city' ? `Thành phố: ${item.name}` : `Khách sạn: ${item.name}`}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters flex space-x-4 items-center px-4 py-2">
        {/* Ngày check-in/check-out */}
        <button onClick={() => toggleDatePicker('button1')} className="flex items-center bg-white text-black rounded px-4 py-2">
          <CalendarToday className="mr-2 text-gray-600" />
          <span>{selectedDate1}</span>
        </button>
        <button onClick={() => toggleDatePicker('button2')} className="flex items-center bg-white text-black rounded px-4 py-2">
          <CalendarToday className="mr-2 text-gray-600" />
          <span>{selectedDate2}</span>
        </button>

        {/* Số khách & phòng */}
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center bg-white text-black rounded px-4 py-2">
            <People className="mr-2 text-gray-600" />
            <span>{adults} người lớn, {rooms} phòng</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-gray-800 shadow-lg rounded-lg p-4 w-64 z-50">
              <div className="flex justify-between items-center mb-2">
                <span>Phòng</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => decrement(setRooms, 1)} className="border rounded px-2 py-1">-</button>
                  <span>{rooms}</span>
                  <button onClick={() => increment(setRooms)} className="border rounded px-2 py-1">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Người lớn</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => decrement(setAdults, 1)} className="border rounded px-2 py-1">-</button>
                  <span>{adults}</span>
                  <button onClick={() => increment(setAdults)} className="border rounded px-2 py-1">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Trẻ em</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => decrement(setChildren, 0)} className="border rounded px-2 py-1">-</button>
                  <span>{children}</span>
                  <button onClick={() => increment(setChildren)} className="border rounded px-2 py-1">+</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search button */}
      <button onClick={handleSearch} className="bg-blue-700 text-white px-4 py-2 rounded ml-4">
        Cập nhật
      </button>

      {/* Overlay */}
      {(isDropdownOpen || isDatePickerOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => { setIsDropdownOpen(false); setIsDatePickerOpen(false); }}></div>
      )}
    </div>
  );
};

export default SearchBar;

