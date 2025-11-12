import { useEffect, useState } from "react";
import {
    ChevronDown,
    Star,
    Calendar,
    Zap,
    CheckCircle,
    Info,
    Lock,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CreditCardForm from "components/Payment/CreditCardForm";
import { formatCurrency } from "utils/formatCurrency";
import {
    ServiceType,
    ServiceTypeLabel,
    PaymentMethod,
    PaymentMethodLabel,
} from "../../constants/serviceType";
import {
    getBookingDetail,
    getRoomDetail,
    createPayment,
    payWithStripe,
    confirmCashPayment,
    getPayment,
    callFetchDetailActivityDateBooking,
    callFetchDetailCarBooking,
    callFetchDetailRoomBooking,
} from "../../config/api";
import dayjs from "dayjs";
import { haversine } from "utils/googleMap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";
import markerImg from "../../images/booking-vehicles/google-map/marker.webp";
import { Button, Divider } from "antd";
import { CarOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";

export default function BookingContactActivityStep2() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const [booking, setBooking] = useState(null);
    const service_type = Number(searchParams.get("type"));
    const ref_id = searchParams.get("ref");
    const [room, setRoom] = useState(null);
    const [activityDateBooking, setActivityDateBooking] = useState(null);
    const [carBooking, setCarBooking] = useState(null);
    const [center, setCenter] = useState([0, 0]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.ONLINE);
    const [paymentId, setPaymentId] = useState(null);
    const [isCardValidated, setIsCardValidated] = useState(false);
    const [cardInfo, setCardInfo] = useState(null);

    // Reset card validation when switching payment method
    useEffect(() => {
        if (paymentMethod !== PaymentMethod.ONLINE) {
            setIsCardValidated(false);
            setCardInfo(null);
        }
    }, [paymentMethod]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy thông tin booking
                const bookingResponse = await getBookingDetail(bookingId);
                setBooking(bookingResponse);

                // Lấy thông tin phòng
                if (bookingResponse.service_type === ServiceType.HOTEL) {
                    const res = await callFetchDetailRoomBooking(
                        bookingResponse.service_ref_id
                    );
                    if (res.isSuccess) {
                        setRoom(res.data?.room);
                    }
                }

                if (bookingResponse.service_type === ServiceType.ACTIVITY) {
                    const res = await callFetchDetailActivityDateBooking(
                        bookingResponse.service_ref_id
                    );
                    if (res.isSuccess) {
                        setActivityDateBooking(res.data);
                    }
                }

                if (bookingResponse.service_type === ServiceType.CAR) {
                    const res = await callFetchDetailCarBooking(
                        bookingResponse.service_ref_id
                    );
                    if (res.isSuccess) {
                        const carBookingData = res.data;
                        setCarBooking(carBookingData);
                        setCenter([
                            (carBookingData.lat1 + carBookingData.lat2) / 2,
                            (carBookingData.lng1 + carBookingData.lng2) / 2,
                        ]);
                        const dist = haversine(
                            carBookingData.lat1,
                            carBookingData.lng1,
                            carBookingData.lat2,
                            carBookingData.lng2
                        );
                        setDistance(dist);
                        if (dist < 100) {
                            setZoomLevel(10);
                        } else if (dist < 500) {
                            setZoomLevel(8); // Khoảng cách vừa
                        } else if (dist < 1500) {
                            setZoomLevel(5); // Xa nhau, zoom thấp
                        } else {
                            setZoomLevel(3); // Cách xa nhau nhiều, zoom thấp
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                alert("Không thể tải thông tin đặt chỗ hoặc tạo thanh toán!");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchData();
        }
        window.scrollTo(0, 0);
    }, [bookingId]);

    const handleCardValidated = (cardData) => {
        setIsCardValidated(true);
        setCardInfo(cardData);
    };

    const handlePayment = async () => {
        if (!booking) {
            alert("Không tìm thấy thông tin booking!");
            return;
        }

        // Check card validation for online payment
        if (paymentMethod === PaymentMethod.ONLINE && !isCardValidated) {
            alert("Vui lòng xác thực thẻ trước khi thanh toán!");
            return;
        }

        const successUrl = `${window.location.origin}/book/confirmation?isSuccess=true&booking_id=${bookingId}&type=${service_type}&ref=${ref_id}`;
        const cancelUrl = `${window.location.origin}/book/confirmation?isSuccess=false&booking_id=${bookingId}&type=${service_type}&ref=${ref_id}`;

        try {
            //Tạo payment nếu chưa có
            let payment = null;
            // 🟢 Kiểm tra xem đã có payment cho booking này chưa
            const existingPayments = await getPayment(bookingId);
            if (existingPayments.count > 0) {
                payment = existingPayments.results[0];
            } else {
                // 🟢 Nếu chưa có => tạo mới
                const paymentResponse = await createPayment({
                    booking_id: bookingId,
                    method: paymentMethod, // 1 = Online, 2 = Cash
                    amount: booking.total_price,
                });
                payment = paymentResponse;
            }

            const paymentId = payment.id; // cập nhật id

            if (paymentMethod === PaymentMethod.ONLINE) {
                // Stripe
                const response = await payWithStripe(paymentId, {
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                });

                const checkout_url = response.checkout_url;
                if (checkout_url) {
                    window.location.href = checkout_url;
                } else {
                    alert("Không thể khởi tạo thanh toán Stripe!");
                }
            } else if (paymentMethod === PaymentMethod.CASH) {
                // Thanh toán tiền mặt
                const result = await confirmCashPayment(paymentId);
                // Giả sử API confirmCashPayment trả về { success: true/false }
                if (result.success) {
                    window.location.href = successUrl;
                } else {
                    window.location.href = cancelUrl;
                }
            }
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            alert("Thanh toán thất bại! Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Đang tải...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Không tìm thấy thông tin đặt chỗ
            </div>
        );
    }

    const getPrice = () => Number(booking.total_price) || 0;

    const getGuestSummary = () => {
        const numGuests = booking.hotel_detail?.num_guests || 0;
        return numGuests > 0
            ? `${numGuests} khách`
            : "Không có thông tin số lượng khách";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="hidden md:flex items-center gap-8 flex-1 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                    1
                                </div>
                                <span className="text-sm font-medium text-blue-600">
                                    Thông tin khách hàng
                                </span>
                            </div>
                            <div className="flex-1 h-0.5 bg-blue-600"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-medium text-blue-600">
                                    Chi tiết thanh toán
                                </span>
                            </div>
                            <div className="flex-1 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="text-sm text-gray-500">
                                    Đã xác nhận đặt chỗ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Payment Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Method: Online */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={
                                            paymentMethod ===
                                            PaymentMethod.ONLINE
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                PaymentMethod.ONLINE
                                            )
                                        }
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <span className="text-white font-semibold">
                                        {
                                            PaymentMethodLabel[
                                                PaymentMethod.ONLINE
                                            ]
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded px-2 py-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            Stripe
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {paymentMethod === PaymentMethod.ONLINE && (
                                <div className="p-6">
                                    <CreditCardForm onCardValidated={handleCardValidated} />
                                </div>
                            )}
                        </div>

                        {/* Payment Method: Cash */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={
                                            paymentMethod === PaymentMethod.CASH
                                        }
                                        onChange={() =>
                                            setPaymentMethod(PaymentMethod.CASH)
                                        }
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <span className="text-white font-semibold">
                                        {PaymentMethodLabel[PaymentMethod.CASH]}
                                    </span>
                                </div>
                            </div>
                            {paymentMethod === PaymentMethod.CASH && (
                                <div className="p-6">
                                    <p className="text-sm text-gray-600">
                                        Quý khách sẽ thanh toán trực tiếp với
                                        nhà cung cấp.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirmation Email */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-blue-900">
                                Chúng tôi sẽ gửi xác nhận đặt phòng đến{" "}
                                <span className="font-semibold">
                                    {booking.guest_info?.email || "email khách hàng"}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <span>
                                {paymentMethod === PaymentMethod.ONLINE
                                    ? "THANH TOÁN NGAY"
                                    : "XÁC NHẬN ĐẶT PHÒNG"}
                            </span>
                        </button>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Tóm tắt đơn đặt
                                </h3>

                                {/* Service Type Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                                        <span className="text-white text-xs">
                                            🏨
                                        </span>
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {ServiceTypeLabel[
                                            service_type
                                        ].toUpperCase()}
                                    </span>
                                </div>

                                <div className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded inline-block mb-3">
                                    0% giảm giá
                                </div>

                                {/* Room Card */}
                                {service_type === ServiceType.HOTEL && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                        <div className="flex gap-3 p-3">
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={`${process.env.REACT_APP_BE_URL}${room?.images?.[0]?.image}`}
                                                    className="w-full h-full object-cover"
                                                    alt={room?.room_type}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                    {room?.room_type || "Phòng"}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                                                    <span className="font-semibold">
                                                        {room?.hotel?.avg_star}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {
                                                            room?.hotel
                                                                ?.review_count
                                                        }{" "}
                                                        lượt đánh giá
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 p-3 space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span>
                                                    {
                                                        booking.hotel_detail
                                                            ?.check_in
                                                    }{" "}
                                                    &rarr;{" "}
                                                    {
                                                        booking.hotel_detail
                                                            ?.check_out
                                                    }
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900 mb-1">
                                                    {room?.room_type || "Phòng"}
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    {getGuestSummary()}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-xs pt-2">
                                                <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">
                                                    Xác nhận ngay lập tức
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 text-xs">
                                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">
                                                        Đơn đặt hoàn đồng này
                                                        không được hoàn tiền
                                                    </span>
                                                    <Info className="w-3 h-3 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {service_type === ServiceType.ACTIVITY && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                        <div className="flex gap-3 p-3">
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={`${process.env.REACT_APP_BE_URL}${activityDateBooking?.activity_image}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                    {
                                                        activityDateBooking?.activity_name
                                                    }
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />

                                                    <span className="font-semibold">
                                                        {
                                                            activityDateBooking?.avg_star
                                                        }
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {activityDateBooking
                                                            ?.activity_date
                                                            ?.activity_package
                                                            ?.activity
                                                            ?.review_count ||
                                                            0}{" "}
                                                        lượt đánh giá
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 p-3 space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span>
                                                    {dayjs(
                                                        activityDateBooking?.date_launch
                                                    ).format("YYYY-MM-DD")}
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900 mb-1">
                                                    {
                                                        activityDateBooking?.activity_package_name
                                                    }
                                                </div>
                                                {activityDateBooking?.adult_quantity_booking >
                                                    0 && (
                                                    <div className="text-gray-600 text-xs">
                                                        {
                                                            activityDateBooking?.adult_quantity_booking
                                                        }{" "}
                                                        người lớn
                                                    </div>
                                                )}

                                                {activityDateBooking?.child_quantity_booking >
                                                    0 && (
                                                    <div className="text-gray-600 text-xs">
                                                        {
                                                            activityDateBooking?.child_quantity_booking
                                                        }{" "}
                                                        trẻ em
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-start gap-2 text-xs pt-2">
                                                <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">
                                                    Xác nhận ngay lập tức
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 text-xs">
                                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600">
                                                        Đơn đặt hoàn đồng này
                                                        không được hoàn tiền
                                                    </span>
                                                    <Info className="w-3 h-3 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {service_type === ServiceType.CAR && (
                                    <div>
                                        {/* Map */}
                                        <div className="mb-4">
                                            <MapContainer
                                                center={center}
                                                zoom={zoomLevel}
                                                className="w-full h-[300px]"
                                                scrollWheelZoom={true}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                <MarkerClusterGroup
                                                    chunkedLoading
                                                >
                                                    <Marker
                                                        position={[
                                                            carBooking?.lat1 ||
                                                                0,
                                                            carBooking?.lng1 ||
                                                                0,
                                                        ]}
                                                        icon={
                                                            new Icon({
                                                                iconUrl:
                                                                    markerImg,
                                                                iconSize: [
                                                                    38, 38,
                                                                ],
                                                            })
                                                        }
                                                        title={
                                                            carBooking?.pickup_location
                                                        }
                                                    >
                                                        <Popup>
                                                            {
                                                                carBooking?.pickup_location
                                                            }
                                                        </Popup>
                                                    </Marker>
                                                    <Marker
                                                        position={[
                                                            carBooking?.lat2 ||
                                                                0,
                                                            carBooking?.lng2 ||
                                                                0,
                                                        ]}
                                                        icon={
                                                            new Icon({
                                                                iconUrl:
                                                                    markerImg,
                                                                iconSize: [
                                                                    38, 38,
                                                                ],
                                                            })
                                                        }
                                                        title={
                                                            carBooking?.dropoff_location
                                                        }
                                                    >
                                                        <Popup>
                                                            {
                                                                carBooking?.dropoff_location
                                                            }
                                                        </Popup>
                                                    </Marker>
                                                </MarkerClusterGroup>
                                            </MapContainer>
                                        </div>

                                        {/* Trip Details */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold">
                                                    Chuyến đi của bạn
                                                </h3>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    className="text-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            carBooking?.pickup_location
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {dayjs(
                                                            carBooking?.pickup_datetime
                                                        ).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Khoảng cách:{" "}
                                                        {distance.toFixed(2)} km
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Thời gian đi lấy: 3 phút
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Thời gian ước lượng:{" "}
                                                        {(
                                                            carBooking?.total_time_estimate ||
                                                            0
                                                        ).toFixed(1)}{" "}
                                                        giờ
                                                    </div>
                                                </div>

                                                <div className="text-sm">
                                                    {
                                                        carBooking?.dropoff_location
                                                    }
                                                </div>

                                                <Divider className="my-2" />

                                                <div className="flex items-center space-x-4 text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <UserOutlined />
                                                        <span>
                                                            {
                                                                carBooking?.passenger_quantity_booking
                                                            }{" "}
                                                            Hành khách
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CarOutlined />
                                                        <span>
                                                            Tối đa{" "}
                                                            {
                                                                carBooking?.car
                                                                    ?.luggage
                                                            }{" "}
                                                            vali
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                                                    <img
                                                        src={`${process.env.REACT_APP_BE_URL}${carBooking?.car?.image}`}
                                                        alt={
                                                            carBooking?.car
                                                                ?.name
                                                        }
                                                        width={60}
                                                        height={40}
                                                        className="object-contain"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {
                                                                carBooking?.car
                                                                    ?.name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                carBooking?.car
                                                                    ?.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extras */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold">
                                                    Extras
                                                </h3>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    className="text-blue-500"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                Chào đón và đưa đón
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">
                                        Tổng quý khách trả
                                    </span>
                                    <span className="text-2xl font-bold text-red-600">
                                        {formatCurrency(getPrice())} ₫
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
