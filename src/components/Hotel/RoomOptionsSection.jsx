import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callFetchRoomQuery } from '../../config/api';

const RoomOptionsSection = ({ title, roomImage, roomDetails, cancellationPolicy, perks, price, bookingInfo, additionalInfo, hotelId, capacity, startDate, endDate }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hotelSlug } = useParams();

  const extractHotelIdFromSlug = (slug) => {
    if (!slug) return null;
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    return isNaN(lastPart) ? null : parseInt(lastPart);
  };

  const effectiveHotelId = hotelId || extractHotelIdFromSlug(hotelSlug);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!effectiveHotelId) {
          setError('Invalid hotel ID');
          setLoading(false);
          return;
        }

        let query = `hotel_id=${effectiveHotelId}`;
        if (capacity != null) query += `&capacity=${capacity}`;
        if (startDate != null) query += `&start_date=${startDate}`;
        if (endDate != null) query += `&end_date=${endDate}`;

        const response = await callFetchRoomQuery(query);

        if (response.data != null && response.data.length > 0) {
          setRooms(response.data);
        } else {
          setRooms([]);
        }
      } catch (err) {
        setError('An error occurred while fetching rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [effectiveHotelId, capacity, startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!rooms.length) return <div>No rooms available</div>;

  return (
    <div className="room-options bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      {rooms.map((room) => (
        <div key={room.id} className="room-option border border-gray-300 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">{room.room_type}</h2>
            <p className="text-sm text-gray-600">Giá không bao gồm thuế & phí</p>
          </div>
          <div className="grid grid-cols-[30%_40%_30%] gap-4">
            <div>
              <img
                src={room.images?.[0]?.image || roomImage}
                alt={room.room_type}
                className="rounded-lg mb-4"
              />
              <a href="#" className="text-blue-600 hover:underline text-sm">Xem ảnh và chi tiết</a>
              <ul className="text-sm text-gray-600 mt-2">
                {roomDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
                <li>Diện tích: {room.area_m2} m²</li>
                <li>Sức chứa: {room.capacity} người</li>
                <li>Số giường: {room.beds}</li>
              </ul>
              <a href="#" className="text-blue-600 hover:underline text-sm mt-2">Các tiện ích khác</a>
            </div>
            <div>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-green-600 font-bold text-sm">{cancellationPolicy}</p>
                <ul className="text-sm text-gray-600 mt-2">
                  {perks.map((perk, index) => (
                    <li key={index}>{perk}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-gray-600">
                <p>Chương trình thưởng và giảm giá khác:</p>
                <ul className="mt-2">
                  {additionalInfo.map((info, index) => (
                    <li key={index} className={info.highlight ? "font-bold" : ""}>{info.text}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center">
              <p className="text-red-600 text-lg font-bold">{parseFloat(room.price_per_night).toLocaleString('vi-VN')} VND</p>
              <p className="text-sm text-gray-600">Giá mỗi đêm chưa gồm thuế và phí</p>
              <button className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 mt-4">
                {bookingInfo}
              </button>
              <br />
              <button className="bg-blue-500 text-white font-bold rounded-lg px-6 py-3 hover:bg-blue-600 shadow-md transition duration-300 ease-in-out mt-4">
                Thêm vào giỏ hàng
              </button>
              <p className="text-green-600 text-sm mt-2">{room.available ? 'Còn phòng' : 'Hết phòng'}</p>
              <p className="text-sm text-gray-600">Còn ít phòng</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomOptionsSection;