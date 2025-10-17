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
import {
    ServiceType,
    ServiceTypeLabel,
    PaymentMethod,
    PaymentMethodLabel,
} from "../../constants/serviceType";
import {
    getBookingDetail,
    getRoomDetail,
    getPayment,
    capturePayment,
    callFetchDetailActivityDateBooking,
} from "../../config/api";
import { SERVICE_TYPE } from "constants/booking";
import dayjs from "dayjs";

export default function BookingContactActivityStep3() {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const isSuccess = searchParams.get("isSuccess") === "true";
    const service_type = Number(searchParams.get("type"));
    const ref_id = searchParams.get("ref");
    const [booking, setBooking] = useState(null);
    const [room, setRoom] = useState(null);
    const [activityDateBooking, setActivityDateBooking] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [captureStatus, setCaptureStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Lấy thông tin booking
                const bookingResponse = await getBookingDetail(bookingId);
                setBooking(bookingResponse);

                // Lấy thông tin phòng
                if (bookingResponse.service_type === ServiceType.HOTEL) {
                    const roomResponse = await getRoomDetail(
                        bookingResponse.service_ref_id
                    );
                    if (roomResponse.isSuccess) {
                        setRoom(roomResponse.data);
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
                Đang tải...
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
                                            src={`${process.env.REACT_APP_BE_URL}${room?.images?.[0]?.image}`}
                                            alt={room?.room_type}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {room?.room_type} -{" "}
                                            {room?.hotel?.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm mb-2">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {room?.hotel?.avg_star}
                                            </span>
                                            <span className="text-gray-500">
                                                (1,128 bài đánh giá)
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            {room?.description}
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
                                                {booking.hotel_detail?.check_in}{" "}
                                                -{" "}
                                                {
                                                    booking.hotel_detail
                                                        ?.check_out
                                                }
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
                                                {room.room_type} | {room.beds}{" "}
                                                phòng | {room.capacity} người
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
                                            0% giảm giá
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {activityDateBooking?.activity_name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm mb-2">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="font-semibold">
                                                {activityDateBooking?.avg_star}
                                            </span>
                                            <span className="text-gray-500">
                                                1,130 bài đánh giá
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
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Chi Tiết Giá
                            </h2>

                            {service_type === SERVICE_TYPE.HOTEL && (
                                <div className="space-y-3 mb-4 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-900 mb-1">
                                            {room?.room_type} -{" "}
                                            {room?.hotel?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {booking.hotel_detail?.check_in} -{" "}
                                            {booking.hotel_detail?.check_out} |{" "}
                                            {getGuestSummary()}
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
                                                activityDateBooking?.total_price
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Giảm giá (0%)
                                        </span>
                                        <span className="text-sm text-green-600 font-semibold line-through">
                                            0 ₫
                                        </span>
                                    </div>
                                </div>
                            )}

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
                                        {formatCurrency(booking.total_price)} ₫
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">
                                    Tổng quý khách trả
                                </span>
                                <span className="text-2xl font-bold text-red-600">
                                    {formatCurrency(booking.total_price)} ₫
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
