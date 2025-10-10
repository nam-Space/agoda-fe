import { useEffect, useState } from "react";
import {
    ChevronDown,
    Star,
    Calendar,
    Zap,
    CheckCircle,
    Info,
    Lock,
    CreditCard,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";

export default function BookingContactActivityStep2() {
    const { state } = useLocation();
    const {
        activity,
        activity_date,
        adult_quantity_booking,
        child_quantity_booking,
        date_launch,
        user_information,
    } = state;
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardData, setCardData] = useState({
        cardType: "Visa / Mastercard / Amex / JCB",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
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
        navigate(`/booking-contact-activity-step-3`, {
            state: {
                activity,
                activity_date,
                adult_quantity_booking,
                child_quantity_booking,
                date_launch,
                user_information,
                cardData,
            },
        });
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "card"}
                                        onChange={() =>
                                            setPaymentMethod("card")
                                        }
                                        className="w-5 h-5 accent-white"
                                    />
                                    <span className="text-white font-semibold">
                                        THẺ TÍN DỤNG/GHI NỢ
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded px-2 py-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            VISA
                                        </span>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1">
                                        <div className="flex gap-0.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-orange-500 -ml-1"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            AMEX
                                        </span>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            JCB
                                        </span>
                                    </div>
                                    <div className="bg-white rounded px-2 py-1">
                                        <span className="text-blue-600 font-bold text-xs">
                                            UnionPay
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="p-6 space-y-4">
                                    {/* Card Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hình thức thanh toán *
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                value={cardData.cardType}
                                                onChange={(e) =>
                                                    setCardData({
                                                        ...cardData,
                                                        cardType:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                                            >
                                                <option>
                                                    Visa / Mastercard / Amex /
                                                    JCB
                                                </option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        </div>
                                    </div>

                                    {/* Card Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên trên thẻ *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tên trên Thẻ"
                                            value={cardData.cardName}
                                            onChange={(e) =>
                                                setCardData({
                                                    ...cardData,
                                                    cardName: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số thẻ tín dụng/thẻ ghi nợ *
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Số thẻ"
                                                value={cardData.cardNumber}
                                                onChange={(e) =>
                                                    setCardData({
                                                        ...cardData,
                                                        cardNumber:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Expiry and CVC */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày hết hạn *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="TT/NN"
                                                value={cardData.expiryDate}
                                                onChange={(e) =>
                                                    setCardData({
                                                        ...cardData,
                                                        expiryDate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mã bảo mật CVC *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Mã bảo mật CVC"
                                                value={cardData.cvc}
                                                onChange={(e) =>
                                                    setCardData({
                                                        ...cardData,
                                                        cvc: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "paypal"}
                                        onChange={() =>
                                            setPaymentMethod("paypal")
                                        }
                                        className="w-5 h-5 accent-blue-600"
                                    />
                                    <span className="text-blue-900 font-semibold">
                                        THANH TOÁN ĐIỆN TỬ
                                    </span>
                                </div>
                                <div className="bg-white rounded px-3 py-1.5">
                                    <span className="text-blue-600 font-bold">
                                        PayPal
                                    </span>
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
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <span>TRẢ TIỀN NGAY</span>
                                <Lock className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-blue-900">
                                Chúng tôi sẽ gửi xác nhận đặt phòng của quý
                                khách đến{" "}
                                <span className="font-semibold">
                                    namhello2003@gmail.com
                                </span>
                            </p>
                        </div>

                        <div className="text-center">
                            <span
                                className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                                onClick={() => navigate(-1)}
                            >
                                Trở lại chi tiết đặt phòng
                            </span>
                        </div>
                    </div>

                    {/* Right Column - Summary (same as before) */}
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
