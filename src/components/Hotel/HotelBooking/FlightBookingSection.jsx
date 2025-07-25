import React, { useRef } from 'react';

const FlightBookingSection = () => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const flights = [
        {
            airline: 'VietJet Air',
            departure: '21:55',
            arrival: '00:05+1',
            duration: '2h 10ph',
            from: 'HAN',
            to: 'SGN',
            originalPrice: '1.538.888 ₫',
            price: '1.528.116 ₫',
        },
        {
            airline: 'VietJet Air',
            departure: '20:55',
            arrival: '23:05',
            duration: '2h 10ph',
            from: 'HAN',
            to: 'SGN',
            originalPrice: '1.538.888 ₫',
            price: '1.528.116 ₫',
        },
        {
            airline: 'VietJet Air',
            departure: '22:40',
            arrival: '00:50+1',
            duration: '2h 10ph',
            from: 'HAN',
            to: 'SGN',
            originalPrice: '1.538.888 ₫',
            price: '1.528.116 ₫',
        },
        {
            airline: 'Bamboo Airways',
            departure: '22:15',
            arrival: '01:55+1',
            duration: '2h 10ph',
            from: 'HAN',
            to: 'SGN',
            originalPrice: '1.640.407 ₫',
            price: '1.640.407 ₫',
        },
    ];

    return (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Cần vé máy bay cho chuyến đi của quý khách?</h2>
            <p className="text-sm text-gray-600 mb-4">28 tháng 7 • 2 Hành Khách • Một chiều • HAN đến SGN</p>
            <div className="relative">
                {/* Scroll Buttons */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
                >
                    ◀
                </button>
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
                >
                    ▶
                </button>

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-4 scrollbar-hide"
                >
                    {flights.map((flight, index) => (
                        <div
                            key={index}
                            className="min-w-[300px] border rounded-lg shadow-md overflow-hidden p-4 flex flex-col"
                        >
                            <p className="text-xs text-gray-600 font-bold">{flight.airline}</p> {/* Made airline text smaller */}
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-800">{flight.departure}</p> {/* Made departure text smaller */}
                                <span className="text-gray-400">→</span>
                                <p className="text-xs text-gray-800">{flight.arrival}</p> {/* Made arrival text smaller */}
                            </div>
                            {/* Align HAN, duration, and SGN in one line */}
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-800">{flight.from}</p> {/* Made HAN text smaller */}
                                <p className="text-xs text-gray-600">{flight.duration}</p> {/* Made duration text smaller */}
                                <p className="text-xs text-gray-800">{flight.to}</p> {/* Made SGN text smaller */}
                            </div>
                            <p className="text-xs text-gray-600 line-through mt-2">{flight.originalPrice}</p> {/* Made original price text smaller */}
                            <p className="text-base font-bold text-red-600">{flight.price}</p> {/* Made price text smaller */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlightBookingSection;