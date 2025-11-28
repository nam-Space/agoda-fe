import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    callBook,
    callFetchAmenities,
    callFetchRoomQuery,
} from "../../config/api";
import { ServiceType } from "constants/serviceType";
import { SERVICE_TYPE } from "constants/booking";
import { useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

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
    roomsCount,
}) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.account.user);
    const [rooms, setLocalRooms] = useState([]);
    const [amenitiesMap, setAmenitiesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { hotelSlug } = useParams();
    const BASE_URL = process.env.REACT_APP_BE_URL || "http://localhost:8000";

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
                            const resAmen = await callFetchAmenities(
                                `current=1&pageSize=200&room_id=${room.id}`
                            );

                            // 🔧 Xử lý linh hoạt nhiều dạng dữ liệu API
                            const raw = resAmen?.data || resAmen;
                            let amenList = [];

                            if (Array.isArray(raw?.results)) {
                                amenList = raw.results;
                            } else if (Array.isArray(raw)) {
                                amenList = raw;
                            } else if (
                                raw &&
                                typeof raw === "object" &&
                                raw.id
                            ) {
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
        // Lấy ngày nhận/trả phòng, số người, số phòng
        // Đảm bảo gửi dạng datetime ISO (YYYY-MM-DDT00:00:00)
        const toISODateTime = (dateStr) => {
            if (!dateStr) return null;
            if (dateStr.includes("T")) return dateStr;
            return dateStr + "T00:00:00";
        };
        const checkIn = toISODateTime(startDate);
        const checkOut = toISODateTime(endDate);
        const numGuests = capacity || 1;
        if (!checkIn || !checkOut) {
            // alert("Vui lòng chọn ngày nhận phòng và trả phòng!");
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.warn("Vui lòng chọn ngày nhận phòng và trả phòng!", {
                position: "bottom-right",
            });
            return;
        }

        try {
            const updatedPayload = {
                service_type: ServiceType.HOTEL,
                user: user?.id,
                room_details: {
                    room: roomId,
                    check_in: checkIn,
                    check_out: checkOut,
                    num_guests: numGuests,
                    room_count: roomsCount || 1,
                },
            };
            const res = await callBook(updatedPayload);
            window.open(
                `/book?booking_id=${res.booking_id}&type=${SERVICE_TYPE.HOTEL}&ref=${res.data.id}`,
                "_blank"
            );
        } catch (err) {
            alert("Đã có lỗi xảy ra!");
        }
    };

    if (loading) return <div>Đang tải dữ liệu phòng...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!rooms.length) return <div>No rooms available</div>;

    return (
        <div className="room-options bg-white border border-gray-300 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

            {rooms.map((room) => {
                const displayRoomType =
                    room.room_type || room_type || "Phòng tiêu chuẩn";

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
                            <p className="text-sm text-gray-600">
                                Giá chưa bao gồm thuế & phí
                            </p>
                        </div>

                        {/* Hiển thị khuyến mãi nếu có */}
                        {room.has_promotion && room.promotion && (
                            <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <div className="font-bold text-yellow-700 flex items-center gap-2">
                                    🎁 Khuyến mãi: {room.promotion.title}
                                </div>
                                <div className="text-sm text-yellow-800 mt-1">
                                    {room.promotion.discount_percent
                                        ? `Giảm ${room.promotion.discount_percent}%`
                                        : ""}
                                    <span className="ml-2">
                                        (Từ{" "}
                                        {room.promotion.start_date?.slice(
                                            0,
                                            10
                                        )}{" "}
                                        đến{" "}
                                        {room.promotion.end_date?.slice(0, 10)})
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-[30%_40%_30%] gap-4">
                            {/* Ảnh & chi tiết */}
                            <div>
                                {/* <img
                                    src={imageUrl}
                                    alt={displayRoomType}
                                    className="rounded-lg mb-4"
                                /> */}
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={12}
                                    navigation={true}
                                    modules={[Navigation]}
                                    className="mt-[24px]"
                                >
                                    {room.images?.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="h-[187px]">
                                                <img
                                                    src={`${process.env.REACT_APP_BE_URL}${item.image}`}
                                                    alt={item.image}
                                                    className="rounded-lg h-full w-full object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Xem ảnh và chi tiết
                                </a>
                                <ul className="text-sm text-gray-600 mt-2">
                                    <li>
                                        Diện tích: {room.area_m2 || "N/A"} m²
                                    </li>
                                    <li>
                                        Sức chứa:{" "}
                                        {(room.adults_capacity || 0) +
                                            (room.children_capacity || 0)}{" "}
                                        người
                                    </li>
                                    <li>Số giường: {room.beds || "N/A"}</li>
                                </ul>

                                {/* Tiện nghi */}
                                {roomAmenities.length > 0 ? (
                                    <div className="mt-3">
                                        <h4 className="font-bold text-gray-700 mb-1">
                                            Tiện nghi:
                                        </h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside">
                                            {roomAmenities.map((amenity) => (
                                                <li key={amenity.id}>
                                                    {amenity.name}
                                                </li>
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
                                            {additionalInfo.map(
                                                (info, index) => (
                                                    <li
                                                        key={index}
                                                        className={
                                                            info.highlight
                                                                ? "font-bold"
                                                                : ""
                                                        }
                                                    >
                                                        {info.text}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Giá & nút */}
                            <div className="text-center">
                                {/* Hiển thị giá gốc và giá thật nếu có khuyến mãi */}
                                {room.has_promotion &&
                                room.promotion &&
                                room.price_per_night &&
                                room.promotion.discount_percent ? (
                                    <>
                                        <span className="text-sm text-gray-500 line-through block">
                                            đ{" "}
                                            {parseFloat(
                                                room.price_per_night
                                            ).toLocaleString("vi-VN")}
                                        </span>
                                        <span className="text-red-600 text-lg font-bold block">
                                            đ{" "}
                                            {(
                                                parseFloat(
                                                    room.price_per_night
                                                ) *
                                                (1 -
                                                    room.promotion
                                                        .discount_percent /
                                                        100)
                                            ).toLocaleString("vi-VN")}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-red-600 text-lg font-bold block">
                                        {priceVND} VND
                                    </span>
                                )}
                                <p className="text-sm text-gray-600">
                                    Mỗi đêm chưa gồm thuế & phí
                                </p>
                                <button
                                    className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 mt-4"
                                    onClick={() =>
                                        handleBookNow(
                                            room.id,
                                            room.price_per_night
                                        )
                                    }
                                >
                                    Đặt ngay
                                </button>
                                <p className="text-green-600 text-sm mt-2">
                                    {room.available ? "Còn phòng" : "Hết phòng"}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RoomOptionsSection;
