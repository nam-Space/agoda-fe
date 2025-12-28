import { useEffect, useState } from "react";
import { callFetchRoomQuery } from "../../config/api";

const RoomCard = ({ room }) => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-md bg-white mb-4">
            <img
                src="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                alt={room.room_type}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">
                    {room.room_type}
                </h3>
                <div className="flex items-center mt-1">
                    <span className="text-green-600">@</span>
                    <span className="text-gray-500 ml-1">agodaHomes</span>
                </div>
                <div className="flex items-center mt-1">
                    <span className="text-pink-600">★</span>
                    <span className="text-gray-700 ml-1">
                        {room.description}
                    </span>
                </div>
                <p className="text-gray-700 mt-1">
                    Giá:{" "}
                    <span className="text-red-600 font-semibold">
                        {parseFloat(room.price_per_night).toLocaleString(
                            "vi-VN"
                        )}{" "}
                        VND
                    </span>{" "}
                    · {room.capacity} người
                </p>
            </div>
        </div>
    );
};

const RoomListForHost = ({ hotelId, capacity, startDate, endDate }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Khởi tạo object params
                const params = {};

                if (hotelId) params.hotel_id = hotelId;
                if (capacity) params.capacity = capacity;
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;

                // Chuyển object params thành query string
                const query = new URLSearchParams(params).toString();

                const response = await callFetchRoomQuery(query);
                console.log("Search response:", response.data);

                if (response.data != null && response.data.length > 0) {
                    setRooms(response.data);
                } else {
                    setRooms([]);
                }
            } catch (err) {
                setError("An error occurred while fetching rooms");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [hotelId, capacity, startDate, endDate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!rooms.length) return <div>No rooms available</div>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Phòng còn trống
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default RoomListForHost;
