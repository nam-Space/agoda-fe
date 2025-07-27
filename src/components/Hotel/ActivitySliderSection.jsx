import React, { useRef, useState, useEffect } from 'react';

const ActivitySlider = () => {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const activities = [
        {
            title: "Vé Tropicana Park Hồ Tràm",
            type: "Hoạt động giải trí",
            price: "150.164 đ",
            originalPrice: "191.292 đ",
            freeCancellation: true,
            badge: "Bán chạy nhất",
            image: "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
        },
        {
            title: "Vé Công Viên Hồ Mây Ở Vũng Tàu",
            type: "Hoạt động giải trí",
            price: "177.368 đ",
            originalPrice: "200.416 đ",
            freeCancellation: true,
            badge: "Bán chạy nhất",
            image: "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
            rating: "4.5",
            reviews: 43,
        },
        {
            title: "Vé Bảo Tàng Vũ Khí Cổ Robert Taylor Ở Vũng Tàu",
            type: "Hoạt động giải trí",
            price: "63.227 đ",
            originalPrice: "70.252 đ",
            freeCancellation: true,
            badge: "Bán chạy nhất",
            image: "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
            rating: "4",
            reviews: 1,
        },
        {
            title: "Tour Tham Quan Vũng Tàu Trong Ngày Khởi Hành Từ Thành Phố Hồ Chí Minh",
            type: "Chuyến tham quan",
            price: "828.785 đ",
            originalPrice: "904.787 đ",
            freeCancellation: true,
            badge: "Bán chạy nhất",
            image: "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
            rating: "4.7",
            reviews: 52,
        },
        {
            title: "Vung Tau To Ho Chi Minh Private Car Transfer",
            type: "Di chuyển",
            price: "1.508.632 đ",
            originalPrice: "1.961.810 đ",
            freeCancellation: true,
            badge: "Dẫn đầu về Di chuyển",
            image: "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg",
        },
    ];

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const handleScroll = () => {
        const scrollLeft = sliderRef.current.scrollLeft;
        const cardWidth = 300; // Width of each card
        const newSlide = Math.round(scrollLeft / cardWidth);
        setCurrentSlide(newSlide);
    };

    useEffect(() => {
        const slider = sliderRef.current;
        slider.addEventListener('scroll', handleScroll);
        return () => slider.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative activity-slider bg-white rounded-lg p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Hoạt động không thể bỏ qua ở Vũng Tàu</h2>
                <span className="text-green-600 font-bold text-sm">Giảm đến 5%</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4">
                <button className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm">Tất cả</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Chuyến tham quan</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Trải nghiệm</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Di chuyển</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Đồ ăn</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Hoạt động giải trí</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Hành trang cần thiết</button>
                <button className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm">Wi-Fi</button>
            </div>

            {/* Slider */}
            <div
                ref={sliderRef}
                className="flex space-x-4 overflow-x-auto whitespace-nowrap scroll-smooth"
            >
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="activity-card border border-gray-300 rounded-lg p-4 inline-block w-64"
                    >
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="rounded-lg mb-4"
                        />
                        {activity.badge && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                                {activity.badge}
                            </span>
                        )}
                        <h3 className="text-sm font-bold text-gray-800 truncate">{activity.title}</h3> {/* Updated */}
                        <p className="text-xs text-gray-600">{activity.type}</p>
                        {activity.rating && (
                            <p className="text-xs text-gray-600">
                                ⭐ {activity.rating} ({activity.reviews} đánh giá)
                            </p>
                        )}
                        {activity.freeCancellation && (
                            <span className="text-blue-600 text-xs font-bold">Hủy miễn phí</span>
                        )}
                        <p className="text-red-600 font-bold text-sm">{activity.price}</p>
                        <p className="text-xs text-gray-600 line-through">{activity.originalPrice}</p>
                    </div>
                ))}
            </div>

            {/* Floating Buttons */}
            <button
                onClick={scrollLeft}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
            >
                ◀
            </button>
            <button
                onClick={scrollRight}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
            >
                ▶
            </button>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
                {activities.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ActivitySlider;