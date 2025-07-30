
// Component con để hiển thị thẻ phòng
const RoomCard = ({ room }) => {
    // Hiển thị thẻ phòng với thông tin chi tiết
    return (
        <div className="border rounded-lg overflow-hidden shadow-md bg-white mb-4">
            <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{room.title}</h3>
                <div className="flex items-center mt-1">
                    <span className="text-green-600">@</span>
                    <span className="text-gray-500 ml-1">{room.platform}</span>
                </div>
                <div className="flex items-center mt-1">
                    <span className="text-pink-600">★</span>
                    <span className="text-gray-700 ml-1">{room.location}</span>
                </div>
                <p className="text-gray-700 mt-1">{room.rating} · {room.reviews} reviews</p>
            </div>
        </div>
    );
};

// Component chính để hiển thị danh sách phòng
const RoomListForHost = () => {
    // Danh sách các phòng với dữ liệu mẫu
    const rooms = [
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg',
            title: 'DREAM HOUSE',
            platform: 'agodaHomes',
            location: 'Tân Bình, Ho Chi Minh City',
            rating: '8.8 Excellent',
            reviews: '17',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg',
            title: 'May Studio',
            platform: 'agodaHomes',
            location: 'Dalat City Center, Dalat',
            rating: '8.1 Excellent',
            reviews: '91',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg',
            title: 'DREAM HOUSE',
            platform: 'agodaHomes',
            location: 'Tây Hồ, Hà Nội',
            rating: '8.8 Excellent',
            reviews: '17',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg',
            title: 'DREAM HOUSE',
            platform: 'agodaHomes',
            location: 'Quận 1, Ho Chi Minh City',
            rating: '8.8 Excellent',
            reviews: '17',
        },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Phòng còn trống</h2>
            <div className="space-y-4">
                {rooms.map((room, index) => (
                    <RoomCard key={index} room={room} />
                ))}
            </div>
        </div>
    );
};

export default RoomListForHost;