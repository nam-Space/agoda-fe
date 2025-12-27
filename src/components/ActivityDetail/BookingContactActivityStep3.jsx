import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Download,
    Printer,
    Mail,
    Calendar,
    MapPin,
    Users,
    CreditCard,
    Phone,
    ChevronRight,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import { ServiceType, PaymentMethodLabel } from "../../constants/serviceType";
import {
    getBookingDetail,
    getPayment,
    capturePayment,
    callFetchDetailActivityDateBooking,
    callFetchDetailCarBooking,
    callFetchDetailRoomBooking,
} from "../../config/api";
import { SERVICE_TYPE } from "constants/booking";
import dayjs from "dayjs";
import { haversine } from "utils/googleMap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";
import markerImg from "../../images/booking-vehicles/google-map/marker.webp";
import { Spin } from "antd";
import { getImage } from "utils/imageUrl";
import { SEAT_CLASS_VI } from "constants/airline";

export default function BookingContactActivityStep3() {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const isSuccess = searchParams.get("isSuccess") === "true";
    const service_type = Number(searchParams.get("type"));
    const ref_id = searchParams.get("ref");
    const [booking, setBooking] = useState(null);
    const [roomBooking, setRoomBooking] = useState(null);
    const [activityDateBooking, setActivityDateBooking] = useState(null);
    const [carBooking, setCarBooking] = useState(null);
    const [flightDetails, setFlightDetails] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [payment, setPayment] = useState(null);
    const [captureStatus, setCaptureStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Lấy thông tin thanh toán
                const paymentResponse = await getPayment(bookingId);
                if (paymentResponse.results.length > 0) {
                    setPayment(paymentResponse.results[0]);
                }

                // Nếu isSuccess=true, gọi API capture
                if (isSuccess && paymentResponse.results.length > 0) {
                    const paymentId = paymentResponse.results[0].id;
                    try {
                        const captureResponse = await capturePayment(paymentId);
                        setCaptureStatus(captureResponse.detail);
                    } catch (error) {
                        console.error("Lỗi khi capture thanh toán:", error);
                        setCaptureStatus("Payment not completed");
                    }
                }

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
                alert("Không thể tải thông tin đặt chỗ hoặc thanh toán!");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchData();
        }
        window.scrollTo(0, 0);
    }, [bookingId, isSuccess]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }
    if (!booking || !payment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Không tìm thấy thông tin đặt chỗ, phòng hoặc thanh toán
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
                            <div className="flex-1 h-0.5 bg-blue-600"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="text-sm text-blue-600">
                                    Đã xác nhận đặt chỗ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Confirmation Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Success Message */}
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2
                                    className={`w-20 h-20 ${
                                        isSuccess
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {isSuccess
                                    ? "Đặt chỗ thành công!"
                                    : "Thanh toán thất bại!"}
                            </h1>
                            <p className="text-gray-600 mb-6">
                                {isSuccess
                                    ? `Cảm ơn bạn đã đặt chỗ. Chúng tôi đã gửi email xác nhận đến`
                                    : "Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
                            </p>
                            {isSuccess && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-blue-900">
                                        {booking.guest_info?.email ||
                                            "email khách hàng"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Booking Reference */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Mã đặt chỗ của bạn
                            </h2>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-dashed border-blue-300">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Mã xác nhận
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {booking.booking_code}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                Tải xuống
                                            </span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Printer className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                In
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        {service_type === ServiceType.HOTEL && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Chi tiết đặt chỗ
                                </h2>

                                {/* Hotel Info */}
                                <div className="flex gap-4 mb-6 pb-6 border-b">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${process.env.REACT_APP_BE_URL}${roomBooking?.room?.images?.[0]?.image}`}
                                            alt={roomBooking?.room?.room_type}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {roomBooking?.room?.room_type} -{" "}
                                            {roomBooking?.room?.hotel?.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm mb-2">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {roomBooking?.room?.hotel?.avg_star?.toFixed(
                                                    1
                                                )}
                                            </span>
                                            <span className="text-gray-500">
                                                (
                                                {
                                                    roomBooking?.room?.hotel
                                                        ?.review_count
                                                }{" "}
                                                lượt đánh giá)
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            {roomBooking?.room?.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Visit Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Ngày nhận phòng - trả phòng
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {dayjs(
                                                    booking?.room_details?.[0]
                                                        ?.check_in
                                                ).format(
                                                    "YYYY-MM-DD HH:mm:ss"
                                                )}{" "}
                                                -{" "}
                                                {dayjs(
                                                    booking?.room_details?.[0]
                                                        ?.check_out
                                                ).format("YYYY-MM-DD HH:mm:ss")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Số lượng khách
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {getGuestSummary()}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {roomBooking?.room?.room_type} |{" "}
                                                {roomBooking?.room?.beds} phòng
                                                | {roomBooking?.room?.capacity}{" "}
                                                người
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Phương thức thanh toán
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {PaymentMethodLabel[
                                                    payment.method
                                                ] || "Không xác định"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {service_type === ServiceType.ACTIVITY && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Chi tiết đặt chỗ
                                </h2>

                                {/* Attraction Info */}
                                <div className="flex gap-4 mb-6 pb-6 border-b">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${process.env.REACT_APP_BE_URL}${activityDateBooking?.activity_image}`}
                                            alt={`${activityDateBooking?.activity_name}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded mb-2">
                                            {getDiscountPercent()}% giảm giá
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {activityDateBooking?.activity_name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm mb-2">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {activityDateBooking?.avg_star?.toFixed(
                                                    1
                                                )}
                                            </span>
                                            <span className="text-gray-500">
                                                {activityDateBooking
                                                    ?.activity_date
                                                    ?.activity_package?.activity
                                                    ?.review_count || 0}{" "}
                                                lượt đánh giá
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            {activityDateBooking?.city_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Visit Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Ngày tham quan
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {dayjs(
                                                    activityDateBooking?.date_launch
                                                ).format("YYYY-MM-DD")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Số lượng khách
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {
                                                    activityDateBooking?.adult_quantity_booking
                                                }{" "}
                                                người lớn |{" "}
                                                {
                                                    activityDateBooking?.children_quantity_booking
                                                }{" "}
                                                trẻ em
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {
                                                    activityDateBooking?.activity_package_name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Phương thức thanh toán
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {PaymentMethodLabel[
                                                    payment.method
                                                ] || "Không xác định"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {service_type === ServiceType.CAR && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Chi tiết đặt chỗ
                                </h2>

                                {/* Attraction Info */}
                                <div className="flex gap-4 mb-6 pb-6 border-b">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${process.env.REACT_APP_BE_URL}${carBooking?.car?.image}`}
                                            alt={carBooking?.car?.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded mb-2">
                                            {getDiscountPercent()}% giảm giá
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {carBooking?.pickup_location} -{">"}{" "}
                                            {carBooking?.dropoff_location}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm mb-2">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {carBooking?.car?.avg_star || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Visit Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Thời gian khởi hành
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {dayjs(
                                                    carBooking?.pickup_datetime
                                                ).format("YYYY-MM-DD HH:mm:ss")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Số lượng khách
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {carBooking?.passenger_quantity_booking ||
                                                    0}{" "}
                                                người lớn, tối đa{" "}
                                                {carBooking?.car?.luggage || 0}{" "}
                                                hành lý
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Tổng thời gian ước tính:{" "}
                                                {(
                                                    carBooking?.total_time_estimate ||
                                                    0
                                                ).toFixed(1)}{" "}
                                                giờ
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Phương thức thanh toán
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {PaymentMethodLabel[
                                                    payment.method
                                                ] || "Không xác định"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Flight Summary - NEW */}
                        {service_type === ServiceType.FLIGHT &&
                            flightDetails.length > 0 && (
                                <div className="space-y-6 mt-8">
                                    {flightDetails.map((detail, index) => {
                                        const isReturn = index === 1;
                                        const legs = detail.flight.legs || [];

                                        const flightLegsSorted = detail?.flight
                                            ?.legs?.length
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
                                                                        detail
                                                                            .flight
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
                                                                    detail
                                                                        .flight
                                                                        .airline
                                                                        .logo
                                                                )}`}
                                                                alt={
                                                                    detail
                                                                        .flight
                                                                        .airline
                                                                        .name
                                                                }
                                                                className="w-12"
                                                            />
                                                            <div>
                                                                <div className="font-semibold">
                                                                    {
                                                                        detail
                                                                            .flight
                                                                            .airline
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {
                                                                        detail
                                                                            .flight
                                                                            .aircraft
                                                                            .model
                                                                    }{" "}
                                                                    •{" "}
                                                                    {legs
                                                                        .map(
                                                                            (
                                                                                l
                                                                            ) =>
                                                                                l.flight_code
                                                                        )
                                                                        .join(
                                                                            ", "
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500">
                                                                Thời gian bay
                                                            </div>
                                                            <div className="font-bold">
                                                                {
                                                                    detail
                                                                        .flight
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
                                                                                Quá
                                                                                cảnh{" "}
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
                                                                    ).format(
                                                                        "HH:mm"
                                                                    )}
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
                                                                        .city
                                                                        ?.name ||
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
                                                                {legs.length -
                                                                    1 ===
                                                                0
                                                                    ? "Bay thẳng"
                                                                    : `${
                                                                          legs.length -
                                                                          1
                                                                      } điểm dừng`}
                                                            </span>
                                                            {detail.baggage_included && (
                                                                <span className="flex items-center gap-1">
                                                                    Checked
                                                                    baggage •
                                                                    Hành lý xách
                                                                    tay
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500">
                                                                Số hành khách
                                                            </div>
                                                            <div className="font-bold">
                                                                {
                                                                    detail.num_passengers
                                                                }{" "}
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

                        {/* Guest Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Thông tin khách hàng
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Họ và tên
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {booking.guest_info?.full_name ||
                                            "Không xác định"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Email
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {booking.guest_info?.email ||
                                            "Không xác định"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Số điện thoại
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {booking.guest_info?.phone ||
                                            "Không xác định"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Quốc gia
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {booking.guest_info?.country ||
                                            "Không xác định"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What's Next */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Tiếp theo là gì?
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Kiểm tra email của bạn
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Chúng tôi đã gửi xác nhận đặt chỗ
                                            đến email của bạn
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Chuẩn bị nhận phòng
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Mang theo mã đặt chỗ và giấy tờ tùy
                                            thân đến khách sạn
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Tận hưởng kỳ nghỉ
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Đến khách sạn vào ngày nhận phòng và
                                            tận hưởng!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Cần hỗ trợ?
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1">
                                    <Phone className="w-5 h-5" />
                                    <span className="font-medium">
                                        Liên hệ hỗ trợ
                                    </span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1">
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">
                                        Gửi email
                                    </span>
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 text-center mt-4">
                                Thời gian hỗ trợ: 24/7 | Hotline: 1900-1234
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Chi Tiết Giá
                            </h2>

                            {service_type === SERVICE_TYPE.HOTEL && (
                                <div className="space-y-3 mb-4 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-900 mb-1">
                                            {roomBooking?.room?.room_type} -{" "}
                                            {roomBooking?.room?.hotel?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {dayjs(
                                                booking?.room_details?.[0]
                                                    ?.check_in
                                            ).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            )}{" "}
                                            -{" "}
                                            {dayjs(
                                                booking?.room_details?.[0]
                                                    ?.check_out
                                            ).format(
                                                "YYYY-MM-DD HH:mm:ss"
                                            )}{" "}
                                            | {getGuestSummary()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {service_type === SERVICE_TYPE.ACTIVITY && (
                                <div className="space-y-3 mb-4 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-900 mb-1">
                                            {activityDateBooking?.activity_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {dayjs(
                                                activityDateBooking?.date_launch
                                            ).format("YYYY-MM-DD")}{" "}
                                            |{" "}
                                            {
                                                activityDateBooking?.adult_quantity_booking
                                            }{" "}
                                            người lớn,{" "}
                                            {
                                                activityDateBooking?.children_quantity_booking
                                            }{" "}
                                            trẻ em
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Giá gốc
                                        </span>
                                        <span className="text-sm text-gray-900 line-through">
                                            {formatCurrency(
                                                booking?.total_price?.toFixed(0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Giảm giá (
                                            {activityDateBooking?.activity_date
                                                ?.promotion?.discount_percent ||
                                                0}
                                            %)
                                        </span>
                                        <span className="text-sm text-green-600 font-semibold line-through">
                                            {formatCurrency(
                                                (
                                                    (activityDateBooking?.total_price *
                                                        (activityDateBooking
                                                            ?.activity_date
                                                            ?.promotion
                                                            ?.discount_percent ||
                                                            0)) /
                                                    100
                                                )?.toFixed(0)
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </div>
                            )}

                            {service_type === SERVICE_TYPE.CAR && (
                                <div className="space-y-3 mb-4 pb-4 border-b">
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

                                            <MarkerClusterGroup chunkedLoading>
                                                <Marker
                                                    position={[
                                                        carBooking?.lat1 || 0,
                                                        carBooking?.lng1 || 0,
                                                    ]}
                                                    icon={
                                                        new Icon({
                                                            iconUrl: markerImg,
                                                            iconSize: [38, 38],
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
                                                        carBooking?.lat2 || 0,
                                                        carBooking?.lng2 || 0,
                                                    ]}
                                                    icon={
                                                        new Icon({
                                                            iconUrl: markerImg,
                                                            iconSize: [38, 38],
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
                                    <div>
                                        <p className="text-sm text-gray-900 mb-1">
                                            {carBooking?.pickup_location} -{">"}{" "}
                                            {carBooking?.dropoff_location}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {dayjs(
                                                carBooking?.pickup_datetime
                                            ).format("YYYY-MM-DD")}{" "}
                                            |{" "}
                                            {
                                                carBooking?.passenger_quantity_booking
                                            }{" "}
                                            hành khách
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Giá gốc
                                        </span>
                                        <span className="text-sm text-gray-900 line-through">
                                            {formatCurrency(
                                                booking?.total_price?.toFixed(0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Giảm giá (
                                            {carBooking?.car?.promotion
                                                ?.discount_percent || 0}
                                            %)
                                        </span>
                                        <span className="text-sm text-green-600 font-semibold line-through">
                                            {formatCurrency(
                                                (
                                                    (carBooking?.total_price *
                                                        (carBooking?.car
                                                            ?.promotion
                                                            ?.discount_percent ||
                                                            0)) /
                                                    100
                                                )?.toFixed(0)
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </div>
                            )}

                            {service_type === SERVICE_TYPE.FLIGHT &&
                                flightDetails.map((flightDetail, index) => {
                                    const flightLegsSorted = flightDetail
                                        ?.flight?.legs?.length
                                        ? [...flightDetail?.flight.legs].sort(
                                              (a, b) =>
                                                  new Date(
                                                      a.departure_time
                                                  ).getTime() -
                                                  new Date(
                                                      b.departure_time
                                                  ).getTime() // giảm dần
                                          )
                                        : [];

                                    const firstLeg = flightLegsSorted[0];
                                    const lastLeg =
                                        flightLegsSorted[
                                            flightLegsSorted.length - 1
                                        ];

                                    return (
                                        <div
                                            key={index}
                                            className={`flex gap-3 mb-4 pb-4 border-b-[1px] border-gray-200`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                {index === 0 ? (
                                                    <h2 class="font-semibold text-[16px] text-blue-700">
                                                        {" "}
                                                        Chiều đi (→):
                                                    </h2>
                                                ) : (
                                                    <h2 class="font-semibold text-[16px] text-red-700">
                                                        Chiều về (←):
                                                    </h2>
                                                )}

                                                <div class="flex items-center gap-[10px] mt-[3px]">
                                                    <img
                                                        src={`${process.env.REACT_APP_BE_URL}${flightDetail?.flight?.airline?.logo}`}
                                                        alt={
                                                            flightDetail?.flight
                                                                ?.airline?.name
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
                                                        Chuyến bay từ:{" "}
                                                        <strong>
                                                            {
                                                                firstLeg
                                                                    ?.departure_airport
                                                                    ?.name
                                                            }
                                                        </strong>{" "}
                                                        <strong>→</strong>{" "}
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
                                                                Thời gian cất
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
                                                                Thời gian hạ
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
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-sm text-gray-600">
                                                        Giá gốc
                                                    </span>
                                                    <span className="text-sm text-gray-900 line-through">
                                                        {formatCurrency(
                                                            flightDetail?.total_price?.toFixed(
                                                                0
                                                            )
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-sm text-gray-600">
                                                        Giảm giá (
                                                        {flightDetail?.flight
                                                            ?.promotion
                                                            ?.discount_percent ||
                                                            0}
                                                        %)
                                                    </span>
                                                    <span className="text-sm text-green-600 font-semibold line-through">
                                                        {formatCurrency(
                                                            (
                                                                (flightDetail?.total_price *
                                                                    (flightDetail
                                                                        ?.flight
                                                                        ?.promotion
                                                                        ?.discount_percent ||
                                                                        0)) /
                                                                100
                                                            )?.toFixed(0)
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            <div className="space-y-3 mb-4 pb-4 border-b">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Tổng cộng
                                        <br />
                                        <span className="text-xs">
                                            cộng thuế và phí
                                        </span>
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {formatCurrency(
                                            booking.total_price?.toFixed(0)
                                        )}{" "}
                                        ₫
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">
                                    Tổng quý khách trả
                                </span>
                                <span className="text-2xl font-bold text-red-600">
                                    {formatCurrency(
                                        booking.total_price?.toFixed(0)
                                    )}{" "}
                                    ₫
                                </span>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2
                                        className={`w-5 h-5 ${
                                            captureStatus ===
                                            "Payment completed successfully"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        } flex-shrink-0 mt-0.5`}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-green-900 mb-1">
                                            {captureStatus ===
                                            "Payment completed successfully"
                                                ? "Thanh toán thành công"
                                                : "Thanh toán thất bại"}
                                        </p>
                                        <p className="text-xs text-green-700">
                                            Đơn đặt này không được hoàn tiền
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/"
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Quay về trang chủ
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
