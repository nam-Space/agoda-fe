import React from 'react';

const PlanYourTripSection = () => {
    const tripOptions = [
        {
            image: 'https://cdn6.agoda.net/images/TripSaving/cross-sell-airport-transfer-v2-3x.png',
            title: 'Đặt dịch vụ đưa đón sân bay',
            description: 'Đến khách sạn nhanh chóng và an toàn',
            date: '22 tháng 7',
            people: '2 Người lớn',
            link: '#',
        },
        {
            image: 'https://cdn6.agoda.net/images/TripSaving/cross-sell-car-3x.png',
            title: 'Thuê xe hơi',
            description: 'Tìm xe phù hợp cho chuyến đi',
            date: '22 tháng 7 - 22 tháng 7',
            link: '#',
        },
    ];

    return (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Lên kế hoạch đến khách sạn</h2>
            <p className="text-sm text-gray-600 mb-4">Đặt trước xe để có chuyến đi thoải mái</p>
            <div className="grid grid-cols-2 gap-6">
                {tripOptions.map((option, index) => (
                    <div key={index} className="border rounded-lg shadow-sm overflow-hidden flex flex-col">
                        {/* Image Section */}
                        <img
                            src={option.image}
                            alt={option.title}
                            className="w-1/4 h-auto object-cover"
                        />
                        {/* Content Section */}
                        <div className="p-4 flex-grow">
                            <h3 className="text-base font-bold text-gray-800">{option.title}</h3> {/* Made title smaller */}
                            <p className="text-xs text-gray-600">{option.description}</p> {/* Made description smaller */}
                            {/* Date and Button Row */}
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-600"> {/* Made date and people text smaller */}
                                    {option.date} • {option.people}
                                </p>
                                <a
                                    href={option.link}
                                    className="text-blue-600 font-bold text-xs border border-blue-600 rounded-full px-4 py-2 hover:bg-blue-600 hover:text-white transition"
                                >
                                    Tìm
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanYourTripSection;