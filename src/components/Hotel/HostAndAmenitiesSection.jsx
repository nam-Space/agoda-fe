
const HostAndAmenitiesSection = ({ hotel }) => {
    if (!hotel) return null;

    // Tách tiện nghi chung và phòng
    const commonFacilities = hotel.facilities?.split(',').map(f => f.trim()) || [];
    const roomAmenities = hotel.amenitiesAndFacilities?.split(',').map(f => f.trim()) || [];

    return (
        <div className="host-and-amenities-section bg-white rounded-lg shadow-md p-6">
            {/* Host Information */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">Chủ nhà</h3>
                <div className="flex items-center mt-4">
                    <img
                        src="/default-host.jpg" // có thể dùng ảnh mặc định nếu API chưa có avatar
                        alt="Host Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="text-sm font-bold text-gray-800">{hotel.withUs || 'Host cá nhân'}</p>
                        <p className="text-sm text-gray-600">Được quản lý từ khi khách sạn mở</p>
                        <p className="text-sm text-green-600">Phản hồi nhanh</p>
                    </div>
                </div>
            </div>

            {/* Amenities Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tiện nghi và cơ sở vật chất</h3>
                <div className="grid grid-cols-2 gap-6">
                    {/* Tiện nghi chung */}
                    <div>
                        <h4 className="text-md font-bold text-gray-800 mb-2">Tiện nghi chung</h4>
                        <ul className="space-y-2">
                            {commonFacilities.map((item, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">✅</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tiện nghi phòng */}
                    <div>
                        <h4 className="text-md font-bold text-gray-800 mb-2">Tiện nghi trong phòng</h4>
                        <ul className="space-y-2">
                            {roomAmenities.map((item, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">🛏️</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostAndAmenitiesSection;
