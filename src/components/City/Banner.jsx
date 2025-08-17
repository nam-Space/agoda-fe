import { useState } from "react";
import SearchBar from '../Search/SearchBar';

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
                    <SearchBar
                        activeInput={activeInput}
                        setActiveInput={setActiveInput}
                        checkIn={checkIn}
                        setCheckIn={setCheckIn}
                        checkOut={checkOut}
                        setCheckOut={setCheckOut}
                        destination={destination}
                        setDestination={setDestination}
                        handleBackdropClick={handleBackdropClick}
                    />
            </div>
        </div>
    );
};

export default Banner;