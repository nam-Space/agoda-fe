import { useRef } from 'react';

const ActivitySlider = () => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const activities = [
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Default image
            title: 'Vé Tropicana Park Hồ Tràm',
            category: 'Hoạt động giải trí',
            price: '150.043 ₫',
            originalPrice: '191.137 ₫',
            rating: '4.5',
            reviews: '43',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Default image
            title: 'Vé Công Viên Hồ Mây Ở Vũng Tàu',
            category: 'Hoạt động giải trí',
            price: '178.358 ₫',
            originalPrice: '201.535 ₫',
            rating: '4.7',
            reviews: '52',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Default image
            title: 'Tour Tham Quan Vũng Tàu Trong Ngày',
            category: 'Chuyến tham quan',
            price: '828.568 ₫',
            originalPrice: '904.550 ₫',
            rating: '4.7',
            reviews: '26',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Default image
            title: 'Vé Bảo Tàng Vũ Khí Cổ Robert Taylor',
            category: 'Hoạt động giải trí',
            price: '63.304 ₫',
            originalPrice: '70.338 ₫',
            rating: '4.0',
            reviews: '1',
        },
        {
            image: 'https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg', // Default image
            title: 'Vung Tau To Ho Chi Minh Private Car Transfer',
            category: 'Di chuyển',
            price: '1.508.237 ₫',
            originalPrice: '1.961.297 ₫',
            rating: '',
            reviews: '',
        },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoạt động không thể bỏ qua ở Vũng Tàu</h2>
            <div className="relative">
                {/* Scroll Buttons */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
                >
                    ◀
                </button>
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
                >
                    ▶
                </button>

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-4 scrollbar-hide"
                >
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="min-w-[300px] border rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800">{activity.title}</h3>
                                <p className="text-sm text-gray-600">{activity.category}</p>
                                {activity.rating && (
                                    <p className="text-sm text-yellow-500">
                                        ⭐ {activity.rating} ({activity.reviews} reviews)
                                    </p>
                                )}
                                <p className="text-sm text-gray-600 line-through">{activity.originalPrice}</p>
                                <p className="text-lg font-bold text-red-600">{activity.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivitySlider;