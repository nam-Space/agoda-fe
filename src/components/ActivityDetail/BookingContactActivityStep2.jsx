import { useEffect, useState } from "react";
import { Star, Calendar, Zap, CheckCircle, Info, Lock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import {
    ServiceType,
    PaymentMethod,
    PaymentMethodLabel,
    ServiceTypeLabelIcon,
    ServiceTypeLabelVi,
} from "../../constants/serviceType";
import {
    getBookingDetail,
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
import { Button, Divider, Spin } from "antd";
import { CarOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { SEAT_CLASS_VI } from "constants/airline";
import { getImage } from "utils/imageUrl";

export default function BookingContactActivityStep2() {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const [booking, setBooking] = useState(null);
    const service_type = Number(searchParams.get("type"));
    const ref_id = searchParams.get("ref");
    const [roomBooking, setRoomBooking] = useState(null);
    const [activityDateBooking, setActivityDateBooking] = useState(null);
    const [carBooking, setCarBooking] = useState(null);
    const [flightDetails, setFlightDetails] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.ONLINE);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const formatDateTime = (dt) => {
        if (!dt) return "";
        // Nếu đã là object Date
        if (dt instanceof Date) {
            return dt.toLocaleDateString("vi-VN");
        }
        // Nếu là string ISO
        const d = new Date(dt);
        if (!isNaN(d)) {
            return d.toLocaleDateString("vi-VN");
        }
        return dt;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy thông tin booking
                const bookingResponse = await getBookingDetail(bookingId);
                setBooking(bookingResponse);

                if (service_type === ServiceType.FLIGHT) {
                    setFlightDetails(bookingResponse?.flight_detail || []);
                }

                // Lấy thông tin phòng
                if (bookingResponse.service_type === ServiceType.HOTEL) {
                    const res = await callFetchDetailRoomBooking(
                        bookingResponse.service_ref_ids?.[0]
                    );
                    if (res.isSuccess) {
                        setRoomBooking(res.data);
                    }
                }

                if (bookingResponse.service_type === ServiceType.ACTIVITY) {
                    const res = await callFetchDetailActivityDateBooking(
                        bookingResponse.service_ref_ids?.[0]
                    );
                    if (res.isSuccess) {
                        setActivityDateBooking(res.data);
                    }
                }

                if (bookingResponse.service_type === ServiceType.CAR) {
                    const res = await callFetchDetailCarBooking(
                        bookingResponse.service_ref_ids?.[0]
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

    const handleNextStep = async () => {
        if (loadingSubmit) return;

        const successUrl = `${window.location.origin}/book/confirmation?isSuccess=true&booking_id=${bookingId}&type=${service_type}&ref=${ref_id}`;
        const cancelUrl = `${window.location.origin}/book/confirmation?isSuccess=false&booking_id=${bookingId}&type=${service_type}&ref=${ref_id}`;
        if (!bookingId) {
            alert("Không tìm thấy booking!");
            return;
        }

        try {
            //Tạo payment nếu chưa có
            let payment = null;
            // 🟢 Kiểm tra xem đã có payment cho booking này chưa
            setLoadingSubmit(true);
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
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spin size="large" />
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

    const getGuestSummary = () => {
        if (service_type === ServiceType.HOTEL) {
            const numGuests = booking.room_details?.[0]?.num_guests || 0;
            if (numGuests > 0) {
                return `${numGuests} khách`;
            }
        } else if (service_type === ServiceType.ACTIVITY) {
            const adult_guest =
                booking.activity_date_detail?.[0]?.adult_quantity_booking || 0;
            const child_guest =
                booking.activity_date_detail?.[0]?.child_quantity_booking || 0;
            if (adult_guest > 0 || child_guest > 0) {
                return `${adult_guest} người lớn, ${child_guest} trẻ em`;
            }
        } else if (service_type === ServiceType.CAR) {
            const numGuests =
                booking.car_detail?.[0]?.passenger_quantity_booking || 0;
            if (numGuests > 0) {
                return `${numGuests} khách`;
            }
        }

        return "Không có thông tin số lượng khách";
    };

    const getDiscountPercent = () => {
        if (service_type === ServiceType.HOTEL) {
            const discountPercent =
                booking.room_details?.[0]?.room?.promotion?.discount_percent ||
                0;
            return discountPercent;
        } else if (service_type === ServiceType.ACTIVITY) {
            const discountPercent =
                booking.activity_date_detail?.[0]?.activity_date?.promotion
                    ?.discount_percent || 0;
            return discountPercent;
        } else if (service_type === ServiceType.CAR) {
            const discountPercent =
                booking.car_detail?.[0]?.car?.promotion?.discount_percent || 0;
            return discountPercent;
        } else if (service_type === ServiceType.FLIGHT) {
            const discountPercent =
                booking.flight_detail?.[0]?.flight?.promotion
                    ?.discount_percent || 0;

            return discountPercent;
        }

        return 0;
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
                                    <p className="text-sm text-gray-600">
                                        Quý khách sẽ sớm hoàn tất thanh toán an
                                        toàn bằng Stripe.
                                    </p>
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
                                    {booking.guest_info?.email ||
                                        "email khách hàng"}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={handleNextStep}
                            className={`${
                                loadingSubmit ? "opacity-50" : "cursor-pointer"
                            } w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2`}
                        >
                            <span>
                                {paymentMethod === PaymentMethod.ONLINE
                                    ? "THANH TOÁN NGAY"
                                    : "XÁC NHẬN ĐẶT PHÒNG"}
                            </span>
                            {loadingSubmit ? (
                                <Spin className="w-5 h-5" />
                            ) : (
                                <Lock className="w-5 h-5" />
                            )}
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
                                    <div className="rounded flex items-center justify-center">
                                        <span className="text-white text-[20px]">
                                            {ServiceTypeLabelIcon[service_type]}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {ServiceTypeLabelVi[service_type]}
                                    </span>
                                </div>

                                <div className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded inline-block mb-3">
                                    {getDiscountPercent()}% giảm giá
                                </div>

                                {/* Room Card */}
                                {service_type === ServiceType.HOTEL && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                        <div className="flex gap-3 p-3">
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={`${process.env.REACT_APP_BE_URL}${roomBooking?.room?.images?.[0]?.image}`}
                                                    className="w-full h-full object-cover"
                                                    alt={
                                                        roomBooking?.room
                                                            ?.room_type
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                    {roomBooking?.room
                                                        ?.room_type || "Phòng"}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                                                    <span className="font-semibold">
                                                        {roomBooking?.room?.hotel?.avg_star?.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {
                                                            roomBooking?.room
                                                                ?.hotel
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
                                                    {dayjs(
                                                        booking
                                                            ?.room_details?.[0]
                                                            ?.check_in
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}{" "}
                                                    &rarr;{" "}
                                                    {dayjs(
                                                        booking
                                                            ?.room_details?.[0]
                                                            ?.check_out
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900 mb-1">
                                                    {roomBooking?.room
                                                        ?.room_type || "Phòng"}
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
                                                    alt={
                                                        activityDateBooking?.activity_name
                                                    }
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
                                                        {activityDateBooking?.avg_star?.toFixed(
                                                            1
                                                        )}
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
                                {service_type === ServiceType.FLIGHT && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                        {flightDetails.map(
                                            (flightDetail, index) => {
                                                const flightLegsSorted =
                                                    flightDetail?.flight?.legs
                                                        ?.length
                                                        ? [
                                                              ...flightDetail
                                                                  ?.flight.legs,
                                                          ].sort(
                                                              (a, b) =>
                                                                  new Date(
                                                                      a.departure_time
                                                                  ).getTime() -
                                                                  new Date(
                                                                      b.departure_time
                                                                  ).getTime() // giảm dần
                                                          )
                                                        : [];

                                                const firstLeg =
                                                    flightLegsSorted[0];
                                                const lastLeg =
                                                    flightLegsSorted[
                                                        flightLegsSorted.length -
                                                            1
                                                    ];

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`flex gap-3 p-3 ${
                                                            index !== 0
                                                                ? "border-t-[1px] border-gray-200"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            {index === 0 ? (
                                                                <h2 class="font-semibold text-[16px] text-blue-700">
                                                                    {" "}
                                                                    Chiều đi
                                                                    (→):
                                                                </h2>
                                                            ) : (
                                                                <h2 class="font-semibold text-[16px] text-red-700">
                                                                    Chiều về
                                                                    (←):
                                                                </h2>
                                                            )}

                                                            <div class="flex items-center gap-[10px] mt-[3px]">
                                                                <img
                                                                    src={`${process.env.REACT_APP_BE_URL}${flightDetail?.flight?.airline?.logo}`}
                                                                    alt={
                                                                        flightDetail
                                                                            ?.flight
                                                                            ?.airline
                                                                            ?.name
                                                                    }
                                                                    class="w-12 object-cover rounded-lg"
                                                                />
                                                                <h3 class="text-lg text-gray-900">
                                                                    <span class="font-bold">
                                                                        {
                                                                            flightDetail
                                                                                ?.flight
                                                                                ?.airline
                                                                                ?.name
                                                                        }
                                                                    </span>
                                                                </h3>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    Chuyến bay
                                                                    từ:{" "}
                                                                    <strong>
                                                                        {
                                                                            firstLeg
                                                                                ?.departure_airport
                                                                                ?.name
                                                                        }
                                                                    </strong>{" "}
                                                                    <strong>
                                                                        →
                                                                    </strong>{" "}
                                                                    <strong>
                                                                        {
                                                                            lastLeg
                                                                                ?.arrival_airport
                                                                                ?.name
                                                                        }
                                                                    </strong>
                                                                </div>
                                                                <div class="flex gap-8 mt-[6px]">
                                                                    <div>
                                                                        <p class="text-gray-600 text-sm mb-1">
                                                                            Thời
                                                                            gian
                                                                            cất
                                                                            cánh
                                                                        </p>
                                                                        <p class="font-semibold text-gray-900">
                                                                            {dayjs(
                                                                                firstLeg.arrival_time
                                                                            ).format(
                                                                                "YYYY-MM-DD HH:mm:ss"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p class="text-gray-600 text-sm mb-1">
                                                                            Thời
                                                                            gian
                                                                            hạ
                                                                            cánh
                                                                        </p>
                                                                        <p class="font-semibold text-gray-900">
                                                                            {dayjs(
                                                                                lastLeg.arrival_time
                                                                            ).format(
                                                                                "YYYY-MM-DD HH:mm:ss"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                                {/* <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-semibold text-gray-900">
                                        Tổng quý khách trả
                                    </span>
                                    <span className="text-2xl font-bold text-red-600">
                                        {formatCurrency(getPrice())} ₫
                                    </span>
                                </div> */}
                            </div>
                            {/* Price Summary Card: chỉ hiện nếu không phải flight */}
                            {service_type !== ServiceType.FLIGHT && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        Chi Tiết Giá
                                    </h3>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <div>
                                                <div className="text-gray-900">
                                                    {ServiceTypeLabelVi[
                                                        service_type
                                                    ] || "Phòng"}
                                                </div>
                                                {service_type ===
                                                    ServiceType.HOTEL && (
                                                    <div className="text-gray-500 text-xs">
                                                        {formatDateTime(
                                                            booking
                                                                .room_details?.[0]
                                                                ?.check_in
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDateTime(
                                                            booking
                                                                .room_details?.[0]
                                                                ?.check_out
                                                        )}{" "}
                                                        | {getGuestSummary()}
                                                    </div>
                                                )}
                                                {service_type ===
                                                    ServiceType.ACTIVITY && (
                                                    <div className="text-gray-500 text-xs">
                                                        {formatDateTime(
                                                            booking
                                                                .activity_date_detail?.[0]
                                                                ?.date_launch
                                                        )}{" "}
                                                        | {getGuestSummary()}
                                                    </div>
                                                )}
                                                {service_type ===
                                                    ServiceType.CAR && (
                                                    <div className="text-gray-500 text-xs">
                                                        {formatDateTime(
                                                            booking
                                                                .car_detail?.[0]
                                                                ?.pickup_datetime
                                                        )}{" "}
                                                        | {getGuestSummary()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-semibold text-gray-900 whitespace-nowrap ml-4">
                                                {formatCurrency(
                                                    booking.total_price
                                                )}{" "}
                                                ₫
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mb-3">
                                        <div className="flex justify-between text-sm mb-2">
                                            <div>
                                                <div className="text-gray-900">
                                                    Giảm giá
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    Nếu có
                                                </div>
                                            </div>
                                            <div className="text-gray-500 line-through">
                                                {formatCurrency(
                                                    booking.discount_amount || 0
                                                )}{" "}
                                                ₫
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">
                                                Tổng quý khách trả
                                            </span>
                                            <span className="text-2xl font-bold text-red-600">
                                                {formatCurrency(
                                                    booking.final_price ||
                                                        booking.total_price
                                                )}{" "}
                                                ₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Price Summary Card - chỉ hiện nếu là flight */}
                            {service_type === ServiceType.FLIGHT && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        Chi tiết giá
                                    </h3>
                                    <div className="space-y-3">
                                        {flightDetails.map((detail, index) => {
                                            const isReturn = index === 1;
                                            return (
                                                <div
                                                    key={detail.id}
                                                    className={`pb-3 ${
                                                        index !== 0
                                                            ? "border-b border-gray-100"
                                                            : ""
                                                    } last:border-0`}
                                                >
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {isReturn
                                                                    ? "Chiều về"
                                                                    : "Chiều đi"}
                                                            </p>
                                                            <div className="flex items-center gap-[6px]">
                                                                <p className="text-gray-500 text-xs">
                                                                    {
                                                                        SEAT_CLASS_VI[
                                                                            detail
                                                                                .seat_class
                                                                        ]
                                                                    }
                                                                </p>
                                                                <p className="text-gray-500 text-xs">
                                                                    |
                                                                </p>
                                                                <p className="text-gray-500 text-xs">
                                                                    {
                                                                        detail.num_passengers
                                                                    }{" "}
                                                                    khách
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="font-semibold">
                                                            {formatCurrency(
                                                                detail.total_price
                                                            )}{" "}
                                                            ₫
                                                        </p>
                                                    </div>
                                                    {detail.discount_amount >
                                                        0 && (
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>
                                                                Giảm giá khuyến
                                                                mãi
                                                            </span>
                                                            <span>
                                                                -
                                                                {formatCurrency(
                                                                    detail.discount_amount
                                                                )}{" "}
                                                                ₫
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Tổng cộng</span>
                                                <span className="text-2xl text-red-600">
                                                    {formatCurrency(
                                                        booking.total_price
                                                    )}{" "}
                                                    ₫
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Đã bao gồm thuế và phí • Thanh
                                                toán an toàn
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Flight Summary - NEW */}
                {service_type === ServiceType.FLIGHT &&
                    flightDetails.length > 0 && (
                        <div className="space-y-6 mt-8">
                            {flightDetails.map((detail, index) => {
                                const isReturn = index === 1;
                                const legs = detail.flight.legs || [];

                                const flightLegsSorted = detail?.flight?.legs
                                    ?.length
                                    ? [...detail?.flight.legs].sort(
                                          (a, b) =>
                                              new Date(
                                                  a.departure_time
                                              ).getTime() -
                                              new Date(
                                                  b.departure_time
                                              ).getTime() // giảm dần
                                      )
                                    : [];
                                const lastLeg =
                                    flightLegsSorted[
                                        flightLegsSorted.length - 1
                                    ];

                                return (
                                    <div
                                        key={detail.id}
                                        className="border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        {/* Header: Chiều đi / Chiều về */}
                                        <div
                                            className={`bg-gradient-to-r ${
                                                index === 0
                                                    ? "from-blue-600 to-blue-700"
                                                    : "from-red-600 to-red-700"
                                            } text-white px-50 px-4 py-3`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {/* <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"></div> */}
                                                    <div>
                                                        <div className="font-bold text-lg">
                                                            {isReturn
                                                                ? "Chiều về"
                                                                : "Chiều đi"}
                                                        </div>
                                                        <div className="text-sm opacity-90">
                                                            {dayjs(
                                                                detail.flight
                                                                    .departure_time
                                                            ).format(
                                                                "ddd, DD/MM/YYYY"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg">
                                                        Hạng ghế
                                                    </div>
                                                    <div className="text-sm opacity-90">
                                                        {
                                                            SEAT_CLASS_VI[
                                                                detail
                                                                    .seat_class
                                                            ]
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flight Info */}
                                        <div className="p-4 space-y-4">
                                            {/* Airline Logo + Flight Info */}
                                            <div className="flex items-center justify-between">
                                                {/* ${process.env.REACT_APP_BE_URL} */}
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`${getImage(
                                                            detail.flight
                                                                .airline.logo
                                                        )}`}
                                                        alt={
                                                            detail.flight
                                                                .airline.name
                                                        }
                                                        className="w-12"
                                                    />
                                                    <div>
                                                        <div className="font-semibold">
                                                            {
                                                                detail.flight
                                                                    .airline
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {
                                                                detail.flight
                                                                    .aircraft
                                                                    .model
                                                            }{" "}
                                                            •{" "}
                                                            {legs
                                                                .map(
                                                                    (l) =>
                                                                        l.flight_code
                                                                )
                                                                .join(", ")}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">
                                                        Thời gian bay
                                                    </div>
                                                    <div className="font-bold">
                                                        {
                                                            detail.flight
                                                                .total_duration
                                                        }{" "}
                                                        phút
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Route Timeline */}
                                            <div className="flex gap-4 relative">
                                                {flightLegsSorted.map(
                                                    (leg, i) => (
                                                        <div
                                                            key={leg.id}
                                                            className="flex gap-4 relative"
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-4 h-4 bg-blue-600 rounded-full z-10"></div>
                                                                {i <
                                                                    flightLegsSorted.length -
                                                                        1 && (
                                                                    <div className="w-0.5 h-16 bg-gray-300 absolute top-4 left-2"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 pb-8">
                                                                <div className="font-medium">
                                                                    {dayjs(
                                                                        leg.departure_time
                                                                    ).format(
                                                                        "HH:mm"
                                                                    )}
                                                                </div>
                                                                <div className="text-[12px] text-gray-500">
                                                                    {dayjs(
                                                                        leg.departure_time
                                                                    ).format(
                                                                        "DD-MM-YYYY"
                                                                    )}
                                                                </div>
                                                                <div className="text-sm font-semibold">
                                                                    {
                                                                        leg
                                                                            .departure_airport
                                                                            .code
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {leg
                                                                        .departure_airport
                                                                        .city
                                                                        ?.name ||
                                                                        leg
                                                                            .departure_airport
                                                                            .name}
                                                                </div>

                                                                {i <
                                                                    flightLegsSorted.length -
                                                                        1 && (
                                                                    <div className="mt-2 text-xs text-gray-500 border-l-2 border-dashed border-gray-300 pl-4 py-1">
                                                                        Quá cảnh{" "}
                                                                        {
                                                                            leg
                                                                                .arrival_airport
                                                                                .code
                                                                        }{" "}
                                                                        •{" "}
                                                                        {Math.floor(
                                                                            (new Date(
                                                                                flightLegsSorted[
                                                                                    i +
                                                                                        1
                                                                                ].departure_time
                                                                            ) -
                                                                                new Date(
                                                                                    leg.arrival_time
                                                                                )) /
                                                                                60000
                                                                        )}{" "}
                                                                        phút
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                                {/* Final Arrival */}
                                                <div className="flex gap-4">
                                                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {dayjs(
                                                                lastLeg.arrival_time
                                                            ).format("HH:mm")}
                                                        </div>
                                                        <div className="text-[12px] text-gray-500">
                                                            {dayjs(
                                                                lastLeg.arrival_time
                                                            ).format(
                                                                "DD-MM-YYYY"
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-semibold">
                                                            {
                                                                lastLeg
                                                                    .arrival_airport
                                                                    .code
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {lastLeg
                                                                .arrival_airport
                                                                .city?.name ||
                                                                lastLeg
                                                                    .arrival_airport
                                                                    .name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stops Info */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                                        {legs.length - 1 === 0
                                                            ? "Bay thẳng"
                                                            : `${
                                                                  legs.length -
                                                                  1
                                                              } điểm dừng`}
                                                    </span>
                                                    {detail.baggage_included && (
                                                        <span className="flex items-center gap-1">
                                                            Checked baggage •
                                                            Hành lý xách tay
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">
                                                        Số hành khách
                                                    </div>
                                                    <div className="font-bold">
                                                        {detail.num_passengers}{" "}
                                                        người
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Passenger & Baggage Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <div className="flex justify-between">
                                    <span>Hành lý ký gửi</span>
                                    <span className="font-medium text-green-600">
                                        Đã bao gồm
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
            </main>
        </div>
    );
}
