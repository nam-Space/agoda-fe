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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import dayjs from "dayjs";

const RoomOptionsSection = ({
    title,
    room_type,
    stay_type,
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
    setFocusDatePicker,
}) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.account.user);
    const [rooms, setLocalRooms] = useState([]);
    const [amenitiesMap, setAmenitiesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [selectedCheckInTime, setSelectedCheckInTime] = useState(
        dayjs("06:00", "HH:mm")
    );
    const [checkOutTime, setCheckOutTime] = useState(dayjs("10:00", "HH:mm"));

    useEffect(() => {
        if (selectedRoomForBooking && selectedCheckInTime) {
            const duration = selectedRoomForBooking.dayuse_duration_hours || 4;
            const newCheckOut = selectedCheckInTime.add(duration, "hour");
            setCheckOutTime(newCheckOut);
        }
    }, [selectedCheckInTime, selectedRoomForBooking]);
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
                let query = `current=1&pageSize=50&hotel_id=${effectiveHotelId}`;
                if (capacity != null) query += `&capacity=${capacity}`;
                if (startDate != null) query += `&start_date=${startDate}`;
                if (endDate != null) query += `&end_date=${endDate}`;
                if (stay_type != null) query += `&stay_type=${stay_type}`;

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

    const proceedWithBooking = async (
        roomId,
        roomPrice,
        checkInDate,
        checkOutDate
    ) => {
        // Lấy ngày nhận/trả phòng, số người, số phòng
        // Đảm bảo gửi dạng datetime ISO (YYYY-MM-DDT00:00:00)
        const toISODateTime = (dateStr) => {
            if (!dateStr) return null;
            if (dateStr.includes("T")) return dateStr;
            return dateStr + "T00:00:00";
        };
        const checkIn = toISODateTime(checkInDate);
        const checkOut = toISODateTime(checkOutDate);
        const numGuests = capacity || 1;
        if (!checkIn || !checkOut) {
            // window.scrollTo({ top: 0, behavior: "smooth" });
            // toast.warn("Vui lòng chọn ngày nhận phòng và trả phòng!", {
            //   position: "bottom-right",
            // });
            // return;
            setFocusDatePicker(true);
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

    const confirmBookingWithTime = async () => {
        if (!selectedRoomForBooking || !startDate) return;

        // Tạo checkIn với giờ đã chọn, giả sử local time
        const checkInDateTime = `${startDate}T${selectedCheckInTime.format(
            "HH:mm"
        )}:00`;

        // Tính checkOut = checkIn + dayuse_duration_hours
        const checkOutDateTime = `${startDate}T${checkOutTime.format(
            "HH:mm"
        )}:00`;

        await proceedWithBooking(
            selectedRoomForBooking.id,
            selectedRoomForBooking.price_per_day,
            checkInDateTime,
            checkOutDateTime
        );
        setShowTimePicker(false);
        setSelectedRoomForBooking(null);
    };

    const handleBookNow = async (roomId, roomPrice) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;

        if (room.stay_type === "dayuse") {
            setSelectedRoomForBooking(room);
            setShowTimePicker(true);
            return;
        }

        // For overnight, proceed as before
        await proceedWithBooking(roomId, roomPrice, startDate, endDate);
    };

    if (loading) return <div>Đang tải dữ liệu phòng...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!rooms.length) return <div>No rooms available</div>;

    return (
        <>
            <div className="room-options bg-white border border-gray-300 rounded-lg p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {title}
                </h2>

                {rooms.map((room) => {
                    const displayRoomType =
                        room.room_type || room_type || "Phòng tiêu chuẩn";

                    // 🔹 Xác định giá và đơn vị hiển thị dựa trên stay_type
                    let displayPrice = "Liên hệ";
                    let priceUnit = "";
                    let originalPrice = 0;
                    let discountedPrice = 0;
                    if (room.stay_type === "dayuse") {
                        originalPrice = parseFloat(room.price_per_day) || 0;
                        if (!isNaN(originalPrice)) {
                            displayPrice =
                                originalPrice.toLocaleString("vi-VN");
                            priceUnit = `Mỗi giờ tối đa ${
                                room.dayuse_duration_hours || 4
                            } giờ chưa gồm thuế & phí`;
                        }
                    } else {
                        originalPrice = parseFloat(room.price_per_night) || 0;
                        if (!isNaN(originalPrice)) {
                            displayPrice =
                                originalPrice.toLocaleString("vi-VN");
                            priceUnit = "Mỗi đêm chưa gồm thuế & phí";
                        }
                    }

                    // Tính giá sau khuyến mãi nếu có
                    if (
                        room.has_promotion &&
                        room.promotion &&
                        room.promotion.discount_percent
                    ) {
                        discountedPrice =
                            originalPrice *
                            (1 - room.promotion.discount_percent / 100);
                    }

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
                                            {room.promotion.end_date?.slice(
                                                0,
                                                10
                                            )}
                                            )
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
                                            Diện tích: {room.area_m2 || "N/A"}{" "}
                                            m²
                                        </li>
                                        <li>
                                            Sức chứa:{" "}
                                            {(room.adults_capacity || 0) +
                                                (room.children_capacity ||
                                                    0)}{" "}
                                            người
                                        </li>
                                        <li>Số giường: {room.beds || "N/A"}</li>
                                    </ul>
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
                                            <p>
                                                Chương trình thưởng & giảm giá:
                                            </p>
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
                                    originalPrice > 0 &&
                                    room.promotion.discount_percent ? (
                                        <>
                                            <span className="text-sm text-gray-500 line-through block">
                                                đ{" "}
                                                {originalPrice.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </span>
                                            <span className="text-red-600 text-lg font-bold block">
                                                đ{" "}
                                                {discountedPrice.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-red-600 text-lg font-bold block">
                                            {displayPrice} VND
                                        </span>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {priceUnit}
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
                                        {room.available
                                            ? "Còn phòng"
                                            : "Hết phòng"}
                                    </p>
                                </div>
                            </div>
                            {/* Tiện nghi */}
                            {roomAmenities.length > 0 ? (
                                <div className="mt-3">
                                    <h4 className="font-bold text-gray-700 mb-1">
                                        Tiện nghi:
                                    </h4>
                                    <div className="text-sm text-gray-600 grid grid-cols-4 gap-3">
                                        {roomAmenities.map((amenity) => (
                                            <div key={amenity.id}>
                                                ✔ {amenity.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic mt-2">
                                    Không có thông tin tiện nghi
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <TimePickerModal
                isOpen={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                onConfirm={confirmBookingWithTime}
                selectedTime={selectedCheckInTime}
                setSelectedTime={setSelectedCheckInTime}
                room={selectedRoomForBooking}
                checkOutTime={checkOutTime}
            />
        </>
    );
};

export default RoomOptionsSection;

// Modal chọn giờ check-in cho dayuse
const TimePickerModal = ({
    isOpen,
    onClose,
    onConfirm,
    selectedTime,
    setSelectedTime,
    room,
    checkOutTime,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">
                    Chọn giờ check-in cho {room?.room_type}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Thời gian sử dụng: {room?.dayuse_duration_hours || 4} giờ
                </p>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Giờ check-in:
                    </label>
                    <input
                        type="time"
                        value={selectedTime.format("HH:mm")}
                        onChange={(e) =>
                            setSelectedTime(dayjs(e.target.value, "HH:mm"))
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Giờ check-out:
                    </label>
                    <span className="text-lg font-bold">
                        {checkOutTime.format("HH:mm")}
                    </span>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};
