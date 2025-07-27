import React from 'react';


const RoomEmptyList = () => {
    const rooms = [
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Replace with actual image URL
            title: 'Căn Hộ 2 Phòng Ngủ (Two-Bedroom Apartment)',
            size: '53 m²',
            view: 'Hướng Thành phố',
            bed: '1 giường đôi lớn & 1 giường đơn',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Replace with actual image URL
            title: 'Căn hộ Deluxe (DELUXE APARTMENT)',
            size: '122 m²',
            view: 'Hướng Biển',
            bed: '1 giường đôi lớn & 1 giường đơn',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Replace with actual image URL
            title: 'Căn Hộ 3 Phòng Ngủ (Three-Bedroom Apartment)',
            size: '75 m²',
            view: 'Hướng Biển',
            bed: '1 giường đôi lớn',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Replace with actual image URL
            title: 'Căn Hộ 1 Phòng Ngủ (One-Bedroom Apartment)',
            size: '48 m²',
            view: 'Hướng Thành phố',
            bed: '1 giường sofa',
        },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 overflow-hidden text-ellipsis whitespace-normal" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                Phòng còn trống tại The Song House Vung Tau
            </h2>
            <div className="grid grid-cols-2 gap-6">
                {rooms.map((room, index) => (
                    <div key={index} className="flex items-center border rounded-lg shadow-md overflow-hidden">
                        {/* Image Section */}
                        <div className="w-full relative h-full"> {/* Adjusted width and height */}
                            <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
                                📷 Xem ảnh và chi tiết
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="w-full p-4 h-full flex flex-col relative">
                            <div>
                                <h3 className="text-base font-bold text-gray-800">{room.title}</h3> {/* Made title smaller */}
                                <p className="text-xs text-gray-600">Diện tích phòng: {room.size}</p> {/* Made text smaller */}
                                <p className="text-xs text-gray-600">Hướng: {room.view}</p> {/* Made text smaller */}
                                <p className="text-xs text-gray-600">Giường: {room.bed}</p> {/* Made text smaller */}
                            </div>
                            <button className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-xs font-bold py-2 hover:bg-blue-700">
                                Nhập ngày để xem giá phòng
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomEmptyList;