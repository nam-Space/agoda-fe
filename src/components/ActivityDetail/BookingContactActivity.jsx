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
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";

export default function BookingContactActivity() {
    const { state } = useLocation();
    const {
        activity,
        activity_date,
        adult_quantity_booking,
        child_quantity_booking,
        date_launch,
    } = state;
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.account.user);

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        countryCode: "+84",
        phone_number: user?.phone_number || "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getPrice = (item) => {
        const activity_date = item.activity_package.activities_dates.find(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) === date_launch
        );

        const price =
            (activity_date?.price_adult || 0) * adult_quantity_booking +
            (activity_date?.price_child || 0) * child_quantity_booking;

        return price;
    };

    const handleNextStep = () => {
        navigate(`/booking-contact-activity-step-2`, {
            state: {
                activity,
                activity_date,
                adult_quantity_booking,
                child_quantity_booking,
                date_launch,
                user_information: formData,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Progress Steps */}
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
                                        Họ (và tên) *
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

                                {/* Country */}

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
                                                <option>+84</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 bottom-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
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

                                {/* Attraction Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                                        <span className="text-white text-xs">
                                            🎢
                                        </span>
                                    </div>
                                    <span className="font-semibold text-sm">
                                        ĐIỂM THU HÚT
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({activity?.city?.name})
                                    </span>
                                </div>

                                <div className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded inline-block mb-3">
                                    0% giảm giá
                                </div>

                                {/* Attraction Card */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                    <div className="flex gap-3 p-3">
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                            <img
                                                src={`${process.env.REACT_APP_BE_URL}${activity?.images?.[0]?.image}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                                {activity?.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />

                                                <span className="font-semibold">
                                                    {activity?.avg_star}
                                                </span>
                                                <span className="text-gray-500">
                                                    1,128 bài đánh giá
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 p-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span>{date_launch}</span>
                                        </div>

                                        <div className="text-sm">
                                            <div className="font-semibold text-gray-900 mb-1">
                                                {
                                                    activity_date
                                                        ?.activity_package?.name
                                                }
                                            </div>
                                            {adult_quantity_booking > 0 && (
                                                <div className="text-gray-600 text-xs">
                                                    {adult_quantity_booking}{" "}
                                                    người lớn
                                                </div>
                                            )}

                                            {child_quantity_booking > 0 && (
                                                <div className="text-gray-600 text-xs">
                                                    {child_quantity_booking} trẻ
                                                    em
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
                                                    Đơn đặt hoàn đồng này không
                                                    được hoàn tiền
                                                </span>
                                                <Info className="w-3 h-3 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="text-blue-600 text-sm font-semibold hover:underline">
                                    Xem thêm
                                </button>
                            </div>

                            {/* Price Summary Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Chi Tiết Giá
                                </h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <div className="text-gray-900">
                                                {activity?.name}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {date_launch} |{" "}
                                                {adult_quantity_booking} người
                                                lớn, {child_quantity_booking}{" "}
                                                trẻ em
                                            </div>
                                        </div>
                                        <div className="font-semibold text-gray-900 whitespace-nowrap ml-4">
                                            {formatCurrency(
                                                getPrice(activity_date)
                                            )}{" "}
                                            ₫
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mb-3">
                                    <div className="flex justify-between text-sm mb-2">
                                        <div>
                                            <div className="text-gray-900">
                                                Tổng cộng
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                công thuế và phí
                                            </div>
                                        </div>
                                        <div className="text-gray-500 line-through">
                                            0 ₫
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
                                                getPrice(activity_date)
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Continue Button */}
                            {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm">
                                Tiếp tục đến thanh toán
                            </button> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
