
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callBook, callFetchAmenities, callFetchRoomQuery } from '../../config/api';

const RoomOptionsSection = ({
  title,
  room_type,
  roomImage,
  roomDetails = [],
  cancellationPolicy,
  perks,
  price,
  bookingInfo,
  additionalInfo,
  hotelId,
  capacity,
  startDate,
  endDate,
  setRooms,
}) => {
  const [rooms, setLocalRooms] = useState([]);
  const [amenitiesMap, setAmenitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hotelSlug } = useParams();
  const BASE_URL = process.env.REACT_APP_BE_URL || "http://localhost:8000";

  const [payload, setPayload] = useState({
    service_type: 1,
    service_ref_id: 2,
    total_price: "500.00",
    hotel_detail: {
      room: 2,
      check_in: startDate || "2025-10-10",
      check_out: endDate || "2025-10-12",
      num_guests: capacity || 2
    }
  });

  // const extractHotelIdFromSlug = (slug) => {
  //   if (!slug) return null;
  //   const parts = slug.split('-');
  //   const lastPart = parts[parts.length - 1];
  //   return isNaN(lastPart) ? null : parseInt(lastPart);
  // };

  // const effectiveHotelId = hotelId || extractHotelIdFromSlug(hotelSlug);

  
  // 🔹 Xác định hotelId
  const effectiveHotelId =
    hotelId ||
    (() => {
      if (!hotelSlug) return null;
      const parts = hotelSlug.split("-");
      const lastPart = parts[parts.length - 1];
      return isNaN(lastPart) ? null : parseInt(lastPart);
    })();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!effectiveHotelId) {
        setError("Invalid hotel ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let query = `hotel_id=${effectiveHotelId}`;
        if (capacity != null) query += `&capacity=${capacity}`;
        if (startDate != null) query += `&start_date=${startDate}`;
        if (endDate != null) query += `&end_date=${endDate}`;

        console.log("🌐 Fetching rooms with query:", query);

        const response = await callFetchRoomQuery(query);

        if (response?.data && Array.isArray(response.data)) {
          setLocalRooms(response.data);
          if (setRooms) setRooms(response.data);

          // 🔹 Fetch amenities cho từng phòng
          const amenitiesData = {};
          await Promise.all(
            response.data.map(async (room) => {
              const resAmen = await callFetchAmenities(room.id);

              // 🔧 Xử lý linh hoạt nhiều dạng dữ liệu API
              const raw = resAmen?.data || resAmen;
              let amenList = [];

              if (Array.isArray(raw?.results)) {
                amenList = raw.results;
              } else if (Array.isArray(raw)) {
                amenList = raw;
              } else if (raw && typeof raw === "object" && raw.id) {
                amenList = [raw];
              } else {
                amenList = [];
              }

              amenitiesData[room.id] = amenList;
            })
          );

          setAmenitiesMap(amenitiesData);
        } else {
          setLocalRooms([]);
          if (setRooms) setRooms([]);
        }
      } catch (err) {
        setError("Lỗi khi tải phòng");
        setLocalRooms([]);
        if (setRooms) setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [effectiveHotelId, capacity, startDate, endDate]);

  const handleBookNow = async (roomId, roomPrice) => {
    try {
      const updatedPayload = {
        ...payload,
        service_ref_id: roomId,
        total_price: roomPrice.toString()
      };
      const res = await callBook(updatedPayload);
      window.open(`/book?booking_id=${res.booking_id}&type=${updatedPayload.service_type}&ref=${updatedPayload.service_ref_id}`, '_blank');
    } catch (err) {
      alert('Đã có lỗi xảy ra!');
    }
  };

  if (loading) return <div>Đang tải dữ liệu phòng...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!rooms.length) return <div>No rooms available</div>;

  return (
    <div className="room-options bg-white border border-gray-300 rounded-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

      {rooms.map((room) => {
        const displayRoomType = room.room_type || room_type || "Phòng tiêu chuẩn";
        const imageUrl =
          room.images?.[0]?.image && typeof room.images[0].image === "string"
            ? `${BASE_URL}${room.images[0].image}`
            : roomImage;

        // const priceVND = !isNaN(parseFloat(room.price_per_night))
        //   ? parseFloat(room.price_per_night).toLocaleString("vi-VN")
        //   : "Liên hệ";
        const priceVND = !isNaN(parseFloat(room.price_per_night))
  ? parseFloat(room.price_per_night).toLocaleString("vi-VN") 
  
  : "Liên hệ";


        const roomAmenities = amenitiesMap[room.id] || [];

        return (
          <div
            key={room.id}
            className="room-option border border-gray-300 rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Loại phòng: {displayRoomType}
              </h3>
              <p className="text-sm text-gray-600">Giá chưa bao gồm thuế & phí</p>
            </div>

            <div className="grid grid-cols-[30%_40%_30%] gap-4">
              {/* Ảnh & chi tiết */}
              <div>
                <img
                  src={imageUrl}
                  alt={displayRoomType}
                  className="rounded-lg mb-4"
                />
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Xem ảnh và chi tiết
                </a>
                <ul className="text-sm text-gray-600 mt-2">
                  <li>Diện tích: {room.area_m2 || "N/A"} m²</li>
                  <li>
                    Sức chứa:{" "}
                    {(room.adults_capacity || 0) + (room.children_capacity || 0)}{" "}
                    người
                  </li>
                  <li>Số giường: {room.beds || "N/A"}</li>
                </ul>

                {/* Tiện nghi */}
                {roomAmenities.length > 0 ? (
                  <div className="mt-3">
                    <h4 className="font-bold text-gray-700 mb-1">Tiện nghi:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {roomAmenities.map((amenity) => (
                        <li key={amenity.id}>{amenity.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-2">
                    Không có thông tin tiện nghi
                  </p>
                )}
              </div>

              {/* Chính sách & perks */}
              <div>
                {cancellationPolicy && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                    <p className="text-green-600 font-bold text-sm">
                      {cancellationPolicy}
                    </p>
                    <ul className="text-sm text-gray-600 mt-2">
                      {perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {additionalInfo.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p>Chương trình thưởng & giảm giá:</p>
                    <ul className="mt-2">
                      {additionalInfo.map((info, index) => (
                        <li
                          key={index}
                          className={info.highlight ? "font-bold" : ""}
                        >
                          {info.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Giá & nút */}
              <div className="text-center">
                <p className="text-red-600 text-lg font-bold">{priceVND} VND</p>
                <p className="text-sm text-gray-600">
                  Mỗi đêm chưa gồm thuế & phí
                </p>
              <button
                className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 mt-4"
                onClick={() => handleBookNow(room.id, room.price_per_night)}
              >
                Đặt ngay
              </button>
              <p className="text-green-600 text-sm mt-2">{room.available ? 'Còn phòng' : 'Hết phòng'}</p>
             </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomOptionsSection;