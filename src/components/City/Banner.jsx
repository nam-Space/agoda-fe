import { useState } from "react";
import { SearchOutlined, CalendarOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { Popover, DatePicker } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const Banner = () => {
    const [activeInput, setActiveInput] = useState(null); // 'destination' | 'checkin' | 'checkout' | 'occupancy' | null
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [destination, setDestination] = useState("");

    // Đóng dropdown khi click backdrop
    const handleBackdropClick = () => setActiveInput(null);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('//pix6.agoda.net/geo/city/16440/1_16440_02.jpg?ca=6&ce=1&s=1920x822')" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            {/* Backdrop */}
            {activeInput && (
                <div
                    className="fixed inset-0 bg-black opacity-35 z-10"
                    data-selenium="backdrop"
                    onClick={handleBackdropClick}
                />
            )}
            {/* Content */}
            <div className="relative z-20 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center text-white">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">Khách sạn và nơi để ở tại Đà Nẵng</h1>
                <h2 className="text-base md:text-xl font-medium mb-6 drop-shadow">Tìm kiếm để so sánh giá cả và khám phá ưu đãi tuyệt vời có miễn phí hủy</h2>

                <div className="w-full bg-white/90 rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center">
                    {/* Autocomplete Box */}
                    <Popover
                        content={
                            <div className="min-w-[220px] bg-white rounded shadow-lg p-2 text-gray-800">
                                <div className="text-sm text-gray-500 mb-2">Gợi ý điểm đến (demo)</div>
                                <div className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Đà Nẵng</div>
                                <div className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Hà Nội</div>
                                <div className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Hồ Chí Minh</div>
                            </div>
                        }
                        open={activeInput === 'destination'}
                        placement="bottomLeft"
                        trigger="click"
                        overlayStyle={{ zIndex: 1100 }}
                        onOpenChange={(open) => {
                            if (!open) {
                                handleBackdropClick();
                            }
                        }}
                    >
                        <div
                            className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full md:w-auto ${activeInput === 'destination' ? 'cursor-text z-[1100]' : 'cursor-pointer'} relative`}
                            onClick={() => setActiveInput('destination')}
                        >
                            <span className="text-gray-400">
                                <SearchOutlined />
                            </span>
                            <input
                                aria-label="Nhập điểm du lịch hoặc tên khách sạn"
                                type="text"
                                className={`outline-none bg-transparent text-gray-800 placeholder-gray-400 w-full min-w-[120px] ${activeInput === 'destination' ? 'cursor-text' : 'cursor-pointer'}`}
                                placeholder="Nhập điểm du lịch hoặc tên khách sạn"
                                readOnly={activeInput !== 'destination'}
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                            />
                        </div>
                    </Popover>
                    <RangePicker
                        value={checkIn && checkOut ? [checkIn, checkOut] : []}
                        onChange={dates => {
                            if (dates) {
                                setCheckIn(dates[0]);
                                setCheckOut(dates[1]);
                            } else {
                                setCheckIn(null);
                                setCheckOut(null);
                            }
                        }}
                        disabledDate={current => current && current < dayjs().startOf('day')}
                        placeholder={['Chọn ngày nhận phòng', 'Chọn ngày trả phòng']}
                        style={{ width: 280 }}
                    />
                    {/* Occupancy Box */}
                    <Popover
                        content={
                            <div className="bg-white rounded shadow-lg p-4 min-w-[220px] text-gray-800">
                                <div className="font-semibold mb-2">Chọn số người/phòng</div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span>Người lớn</span>
                                        <span>2</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Phòng</span>
                                        <span>1</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">(Demo, có thể thêm logic chọn số lượng)</div>
                            </div>
                        }
                        open={activeInput === 'occupancy'}
                        placement="bottomLeft"
                        trigger="click"
                        overlayStyle={{ zIndex: 1100 }}
                        onOpenChange={(open) => {
                            if (!open) {
                                handleBackdropClick();
                            }
                        }}
                    >
                        <div
                            className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-white w-full md:w-auto min-w-[120px] cursor-pointer relative ${activeInput === 'occupancy' ? 'z-[1100]' : ''}`}
                            onClick={() => setActiveInput('occupancy')}
                        >
                            <span className="text-gray-400">
                                <UserOutlined />
                            </span>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500">2&nbsp;người lớn</span>
                                <span className="text-xs text-gray-400">1&nbsp;phòng</span>
                            </div>
                            <span className="ml-2 text-gray-400">
                                <DownOutlined />
                            </span>
                        </div>
                    </Popover>
                    {/* Search Button */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 shadow transition-all w-full md:w-auto">
                        TÌM
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;