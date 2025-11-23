
import { useEffect, useState } from "react";
import {
    ChevronDown,
    Star,
    Calendar,
    Zap,
    CheckCircle,
    Info,
} from "lucide-react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import { useSearchParams } from "react-router-dom";
import {
    ServiceType,
    ServiceTypeLabel,
    ServiceTypeLabelVi,
} from "../../constants/serviceType";
import {
    getCountries,
    addBookingContact,
    getBookingDetail,
    getRoomDetail,
    callFetchDetailActivityDateBooking,
    callFetchDetailCarBooking,
    callFetchDetailRoomBooking,
} from "../../config/api";
import dayjs from "dayjs";
import { Button, Card, Divider, Spin } from "antd";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";
import { CarOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { haversine } from "utils/googleMap";
import markerImg from "../../images/booking-vehicles/google-map/marker.webp";

export default function BookingContactActivity() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = useAppSelector((state) => state.account.user);
    const bookingId = searchParams.get("booking_id");
    const service_type = Number(searchParams.get("type"));
    const ref_id = searchParams.get("ref");
    const [countries, setCountries] = useState([]);
    const [booking, setBooking] = useState(null);
    const [room, setRoom] = useState(null);
    const [activityDateBooking, setActivityDateBooking] = useState(null);
    const [carBooking, setCarBooking] = useState(null);
    const [flightDetails, setFlightDetails] = useState([]);
    const [center, setCenter] = useState([0, 0]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(0);

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        countryCode: "+84",
        phone_number: user?.phone_number || "",
        special_request: "",
    });
    // Format datetime string to 'DD/MM/YYYY' (hoặc định dạng bạn muốn)
    const formatDateTime = (dt) => {
        if (!dt) return '';
        // Nếu đã là object Date
        if (dt instanceof Date) {
            return dt.toLocaleDateString('vi-VN');
        }
        // Nếu là string ISO
        const d = new Date(dt);
        if (!isNaN(d)) {
            return d.toLocaleDateString('vi-VN');
        }
        return dt;
    };
    // const center = [(carBooking?.lat1 || 0 + carBooking?.lat2 || 0) / 2, (carBooking?.lng1 + carBooking?.lng2) / 2];
    // const distance = haversine(lat1, long1, lat2, long2);
    console.log("carBooking", carBooking);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch booking details
                const bookingResponse = await getBookingDetail(bookingId);
                setBooking(bookingResponse);

                if (service_type === ServiceType.FLIGHT) {
                    setFlightDetails(bookingResponse?.flight_detail || []);
                }

                // Fetch room details if service_type is HOTEL
                if (service_type === ServiceType.HOTEL && ref_id) {
                    const res = await callFetchDetailRoomBooking(ref_id);
                    if (res.isSuccess) {
                        setRoom(res.data?.room);
                    }
                }

                if (service_type === ServiceType.ACTIVITY && ref_id) {
                    const res = await callFetchDetailActivityDateBooking(
                        ref_id
                    );
                    if (res.isSuccess) {
                        setActivityDateBooking(res.data);
                    }
                }

                if (service_type === ServiceType.CAR && ref_id) {
                    const res = await callFetchDetailCarBooking(ref_id);
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

                // Fetch countries
                const countriesResponse = await getCountries();
                setCountries(countriesResponse.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Không thể tải thông tin!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [bookingId, ref_id, service_type]);

    const handleNextStep = async () => {
        // Nối countryCode và phone_number thành số điện thoại chuẩn quốc tế
        let rawPhone = formData.phone_number.trim();
        // Xóa số 0 đầu nếu có
        if (rawPhone.startsWith("0")) rawPhone = rawPhone.replace(/^0+/, "");
        const fullPhoneNumber = `${formData.countryCode}${rawPhone}`;
        const guest_info = {
            full_name: `${formData.last_name} ${formData.first_name}`,
            email: formData.email,
            phone: fullPhoneNumber,
            country:
                countries.find((c) => c.calling_code === formData.countryCode)
                    ?.name || "",
            special_request: formData.special_request,
        };
        try {
            await addBookingContact(bookingId, { guest_info });
            navigate(
                `/book/payment?booking_id=${bookingId}&type=${service_type}&ref=${ref_id}`
            );
        } catch (err) {
            alert("Gửi thông tin liên lạc thất bại!");
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

    const getPrice = () => {
        return Number(booking.total_price) || 0;
    };

    const getGuestSummary = () => {
        const numGuests = booking.room_details[0]?.num_guests || 0;
        if (numGuests > 0) {
            return `${numGuests} khách`;
        }
        return "Không có thông tin số lượng khách";
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
                            <div className="flex-1 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <span className="text-sm text-gray-500">
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
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Details Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    Cho mọi đơn đặt chỗ
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                    Chi tiết liên lạc
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Xác nhận của quý khách sẽ được gửi đến đây
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                first_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ (vd: Nguyễn) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                last_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email ID *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="relative">
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Mã quốc gia/vùng *
                                            </label>
                                            <select
                                                value={formData.countryCode}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        countryCode:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                                            >
                                                {countries.map((country) => (
                                                    <option
                                                        key={country.id}
                                                        value={
                                                            country.calling_code
                                                        }
                                                    >
                                                        {country.name} (
                                                        {country.calling_code})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone_number}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone_number:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Special Request */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yêu cầu đặc biệt
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.special_request}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                special_request: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Ví dụ: Giường đôi, tầng cao, v.v."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Thực hiện bước tiếp theo đồng nghĩa với việc quý
                                khách chấp nhận tuân thủ theo:{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    Điều khoản Sử dụng
                                </a>{" "}
                                và{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline"
                                >
                                    Chính sách Quyền riêng tư
                                </a>{" "}
                                của Agoda.
                            </p>

                            <button
                                onClick={handleNextStep}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm"
                            >
                                Tiếp tục đến thanh toán
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Booking Summary Card */}
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

                                {/* <div className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded inline-block mb-3">
                                    0% giảm giá
                                </div> */}

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
                                                        title="Noi Bai International Airport (HAN)"
                                                    >
                                                        <Popup>
                                                            Noi Bai
                                                            International
                                                            Airport (HAN)
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
                                                        title="BT Homestay 120 Phu My - My Dinh"
                                                    >
                                                        <Popup>
                                                            BT Homestay 120 Phu
                                                            My - My Dinh
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
                                                        alt="Economy sedan"
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

                                <button className="text-blue-600 text-sm font-semibold hover:underline">
                                    Xem thêm
                                </button>
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
                                                    {ServiceTypeLabelVi[service_type] || "Phòng"}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {formatDateTime(booking.room_details[0]?.check_in)} - {formatDateTime(booking.room_details[0]?.check_out)} | {getGuestSummary()}
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-900 whitespace-nowrap ml-4">
                                                {formatCurrency(booking.total_price)} ₫
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mb-3">
                                        <div className="flex justify-between text-sm mb-2">
                                            <div>
                                                <div className="text-gray-900">Giảm giá</div>
                                                <div className="text-gray-500 text-xs">Nếu có</div>
                                            </div>
                                            <div className="text-gray-500 line-through">
                                                {formatCurrency(booking.discount_amount || 0)} ₫
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">Tổng quý khách trả</span>
                                            <span className="text-2xl font-bold text-red-600">
                                                {formatCurrency(booking.final_price || booking.total_price)} ₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Price Summary Card - chỉ hiện nếu là flight */}
                            {service_type === ServiceType.FLIGHT && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Chi tiết giá</h3>
                                    <div className="space-y-3">
                                        {flightDetails.map((detail, index) => {
                                            const isReturn = index === 1;
                                            return (
                                                <div key={detail.id} className="pb-3 border-b border-gray-100 last:border-0">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>{isReturn ? "Chiều về" : "Chiều đi"} • {detail.seat_class}</span>
                                                        <span>{formatCurrency(detail.total_price)} ₫</span>
                                                    </div>
                                                    {detail.discount_amount > 0 && (
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>Giảm giá khuyến mãi</span>
                                                            <span>-{formatCurrency(detail.discount_amount)} ₫</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Tổng cộng</span>
                                                <span className="text-2xl text-red-600">
                                                    {formatCurrency(booking.total_price)} ₫
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Đã bao gồm thuế và phí • Thanh toán an toàn
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Flight Summary - NEW */}
                {service_type === ServiceType.FLIGHT && flightDetails.length > 0 && (
                <div className="space-y-6 mt-8">
                    {flightDetails.map((detail, index) => {
                    const isReturn = index === 1;
                    const legs = detail.flight.legs || [];
                    const firstLeg = legs[0];
                    const lastLeg = legs[legs.length - 1];

                    return (
                        <div
                        key={detail.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                        {/* Header: Chiều đi / Chiều về */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-50 px-4 py-3">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                </div>
                                <div>
                                <div className="font-bold text-lg">
                                    {isReturn ? "Chiều về" : "Chiều đi"}
                                </div>
                                <div className="text-sm opacity-90">
                                    {dayjs(detail.flight.departure_time).format("ddd, DD/MM/YYYY")}
                                </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs opacity-90">Hạng ghế</div>
                                <div className="font-bold uppercase">{detail.seat_class}</div>
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
                                src={`${detail.flight.airline.logo}`}
                                alt={detail.flight.airline.name}
                                className="w-10 h-10 rounded"
                                />
                                <div>
                                <div className="font-semibold">{detail.flight.airline.name}</div>
                                <div className="text-sm text-gray-600">
                                    {detail.flight.aircraft.model} • {legs.map(l => l.flight_code).join(", ")}
                                </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Thời gian bay</div>
                                <div className="font-bold">{detail.flight.total_duration} phút</div>
                            </div>
                            </div>

                            {/* Route Timeline */}
                            <div className="flex gap-4 relative">
                            {legs.map((leg, i) => (
                                <div key={leg.id} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full z-10"></div>
                                    {i < legs.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gray-300 absolute top-4 left-2"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="font-medium">
                                    {dayjs(leg.departure_time).format("HH:mm")}
                                    </div>
                                    <div className="text-sm font-semibold">
                                    {leg.departure_airport.code}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                    {leg.departure_airport.city?.name || leg.departure_airport.name}
                                    </div>

                                    {i < legs.length - 1 && (
                                    <div className="mt-2 text-xs text-gray-500 border-l-2 border-dashed border-gray-300 pl-4 py-1">
                                        Quá cảnh {leg.arrival_airport.code} •{" "}
                                        {Math.floor((new Date(legs[i + 1].departure_time) - new Date(leg.arrival_time)) / 60000)} phút
                                    </div>
                                    )}
                                </div>
                                </div>
                            ))}

                            {/* Final Arrival */}
                            <div className="flex gap-4">
                                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                                <div>
                                <div className="font-medium">
                                    {dayjs(lastLeg.arrival_time).format("HH:mm")}
                                </div>
                                <div className="text-sm font-semibold">
                                    {lastLeg.arrival_airport.code}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {lastLeg.arrival_airport.city?.name || lastLeg.arrival_airport.name}
                                </div>
                                </div>
                            </div>
                            </div>

                            {/* Stops Info */}
                            <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                {legs.length - 1 === 0 ? "Bay thẳng" : `${legs.length - 1} điểm dừng`}
                                </span>
                                {detail.baggage_included && (
                                <span className="flex items-center gap-1">
                                    Checked baggage • Hành lý xách tay
                                </span>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Số hành khách</div>
                                <div className="font-bold">{detail.num_passengers} người</div>
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
                        <span className="font-medium text-green-600">Đã bao gồm</span>
                    </div>
                    </div>
                </div>
                )}

            </main>
        </div>
    );
}
