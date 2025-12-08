// SearchBar.jsx
import { People, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { callSearchRoomQuery } from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import dayjs from "dayjs";

const SearchBar = ({
    onSearch = () => console.log("onSearch not provided"),
    searchParams,
    setSearchParams,
    focusDatePicker,
    setFocusDatePicker,
}) => {
    const { hotelDetail } = useAppSelector((state) => state.hotel);
    const [selectedDate1, setSelectedDate1] = useState(null);
    const [selectedDate2, setSelectedDate2] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    console.log("selectedDate1", selectedDate1);
    console.log("selectedDate2", selectedDate2);

    const increment = (setter) => setter((prev) => prev + 1);
    const decrement = (setter, min = 0) =>
        setter((prev) => (prev > min ? prev - 1 : min));

    // Handler cho RangePicker
    const handleRangeChange = (dates, dateStrings) => {
        setSelectedDate1(dateStrings[0] || null);
        setSelectedDate2(dateStrings[1] || null);
        if (dateStrings[0] && dateStrings[1]) {
            setFocusDatePicker(false);
        }
    };

    useEffect(() => {
        setSearchQuery(hotelDetail.name);
    }, [hotelDetail]);

    const handleSearch = async () => {
        try {
            const query = `hotel_name=${encodeURIComponent(
                searchQuery
            )}&adults=${adults}&children=${children}&start_date=${selectedDate1}&end_date=${selectedDate2}`;
            const response = await callSearchRoomQuery(query);

            console.log("API raw response:", response);

            const hotelInfo = response.data?.data || null;
            const roomsData = hotelInfo?.rooms || [];

            onSearch({
                hotelId: hotelInfo?.id || "default-id",
                hotel: hotelInfo,
                rooms: roomsData,
                startDate: selectedDate1,
                endDate: selectedDate2,
                capacity: adults + children,
                adults,
                children,
                roomsCount: rooms,
            });
        } catch (err) {
            console.error("Search failed:", err);
            onSearch({
                hotelId: "default-id",
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

    return (
        <div className="search-bar sticky z-[5] top-0 left-0 bg-blue-900 shadow p-4 flex justify-center items-center text-white">
            {/* Search input */}
            <div className="flex items-center bg-white text-black rounded px-4 py-2 w-full max-w-md">
                <Search className="text-gray-600 mr-2" />
                <input
                    type="text"
                    placeholder="Nhập tên khách sạn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none outline-none w-full"
                />
            </div>

            {/* Filters */}
            <div className="filters flex space-x-4 items-center px-4 py-2">
                <DatePicker.RangePicker
                    format="YYYY-MM-DD"
                    value={
                        selectedDate1 && selectedDate2
                            ? [dayjs(selectedDate1), dayjs(selectedDate2)]
                            : null
                    }
                    autoFocus={focusDatePicker}
                    open={focusDatePicker}
                    onFocus={() => setFocusDatePicker(true)}
                    onChange={handleRangeChange}
                    placeholder={[
                        "Chọn ngày nhận phòng",
                        "Chọn ngày trả phòng",
                    ]}
                    className="bg-white text-black rounded px-4 py-2"
                    allowClear
                />
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center bg-white text-black rounded px-4 py-2"
                    >
                        <People className="mr-2 text-gray-600" />
                        <span>
                            {adults} người lớn, {rooms} phòng
                        </span>
                    </button>
                </div>
            </div>

            {/* Search button */}
            <button
                onClick={handleSearch}
                className="bg-blue-700 text-white px-4 py-2 rounded"
            >
                Cập nhật
            </button>

            {/* Dropdown rooms/adults/children */}
            {isDropdownOpen && (
                // <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-gray-800 shadow-lg rounded-lg p-4 w-64 z-50">
                    <div className="flex justify-between items-center mb-2">
                        <span>Phòng</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => decrement(setRooms, 1)}
                                className="border rounded px-2 py-1"
                            >
                                -
                            </button>
                            <span>{rooms}</span>
                            <button
                                onClick={() => increment(setRooms)}
                                className="border rounded px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span>Người lớn</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => decrement(setAdults, 1)}
                                className="border rounded px-2 py-1"
                            >
                                -
                            </button>
                            <span>{adults}</span>
                            <button
                                onClick={() => increment(setAdults)}
                                className="border rounded px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Trẻ em</span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => decrement(setChildren, 0)}
                                className="border rounded px-2 py-1"
                            >
                                -
                            </button>
                            <span>{children}</span>
                            <button
                                onClick={() => increment(setChildren)}
                                className="border rounded px-2 py-1"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
