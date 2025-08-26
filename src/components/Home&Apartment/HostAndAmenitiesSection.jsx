
const HostAndAmenitiesSection = () => {
    const amenities = [
        {
            category: "Ngôn ngữ được sử dụng",
            items: [
                { icon: "🇻🇳", text: "tiếng Việt" },
                { icon: "🇬🇧", text: "Tiếng Anh" },
            ],
        },
        {
            category: "Truy cập Internet",
            items: [
                { icon: "📶", text: "Dịch vụ Internet" },
                { icon: "📡", text: "Internet" },
                { icon: "📱", text: "Wi-Fi miễn phí trong tất cả các phòng!" },
                { icon: "📱", text: "Wi-Fi ở nơi công cộng" },
            ],
        },
        {
            category: "Thư giãn & Vui chơi giải trí",
            items: [
                { icon: "🏊", text: "Bể bơi" },
                { icon: "🏊‍♂️", text: "Bể bơi [ngoài trời]" },
                { icon: "🛁", text: "Bồn tắm nước nóng" },
                { icon: "🚶", text: "Đi bộ đường dài" },
                { icon: "🎤", text: "Karaoke" },
                // { icon: "🏋️", text: "Phòng tập" },
                // { icon: "🧖", text: "Phòng xông ướt" },
                // { icon: "🧖‍♂️", text: "Spa/xông khô" },
                { icon: "🌳", text: "Vườn" },
                { icon: "🎮", text: "Phòng chơi game" },
                // { icon: "🎲", text: "Khu vực chơi board game" },
            ],
        },
        {
            category: "Ăn uống",
            items: [
                { icon: "✔", text: "Bếp chung" },
                { icon: "🛎️", text: "Dịch vụ phòng" },
                { icon: "✔", text: "Giờ giảm giá đồ uống" },
            ],
        },
        {
            category: "Dịch vụ & Tiện nghi",
            items: [
                { icon: "🛍️", text: "Cửa hàng tiện lợi" },
                { icon: "🧹", text: "Dịch vụ dọn phòng hàng ngày" },
                { icon: "🛎️", text: "Máy điều hòa ở khu vực chung" },
                { icon: "🚬", text: "Khu vực hút thuốc" },
                { icon: "🚭", text: "Khu vực không hút thuốc" },
                { icon: "🛏️", text: "Dịch vụ giặt là" },
                { icon: "🛒", text: "Giao hàng tạp hóa" },
                { icon: "🧑‍🍳", text: "Dịch vụ nấu ăn riêng" },
            ],
        },
        {
            category: "Dễ dàng tiếp cận",
            items: [
                { icon: "🛡️", text: "Bảo vệ [24 giờ]" },
                { icon: "🧯", text: "Bình chữa cháy" },
                { icon: "🚭", text: "Phòng không hút thuốc" },
                { icon: "✔", text: "Thiết bị báo cháy" },
            ],
        },
        {
            category: "Có trong tất cả các phòng",
            items: [
                { icon: "☕", text: "Ấm nước điện" },
                { icon: "🍽️", text: "Bàn ăn" },
                { icon: "🏖️", text: "Ban công/sân hiên" },
                { icon: "🛋️", text: "Bàn làm việc" },
                { icon: "🧺", text: "Bàn là quần" },
                { icon: "🏊", text: "Bể bơi riêng" },
                { icon: "🍳", text: "Bếp đầy đủ" },
                { icon: "🍳", text: "Bếp nhỏ" },
                { icon: "🧯", text: "Bình chữa cháy" },
                { icon: "🔇", text: "Cách âm" },
                { icon: "🛏️", text: "Giường cỡ lớn" },
                { icon: "📺", text: "TV màn hình phẳng" },
                { icon: "🧴", text: "Đồ dùng vệ sinh cá nhân miễn phí" },
            ],
        },
    ];

    return (
        <div className="host-and-amenities-section bg-white rounded-lg shadow-md p-6">
            {/* Host Information */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">Chủ nhà</h3>
                <div className="flex items-center mt-4">
                    <img
                        src="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                        alt="Host Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="text-sm font-bold text-gray-800">Uyen Tran</p>
                        <p className="text-sm text-gray-600">Tham gia từ Tháng 2 năm 2025</p>
                        <p className="text-sm text-green-600">Phản hồi nhanh - trong vòng 2 tiếng</p>
                    </div>
                </div>
            </div>

            {/* Amenities Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tiện nghi và cơ sở vật chất</h3>
                <div className="grid grid-cols-3 gap-6">
                    {amenities.map((amenity, index) => (
                        <div key={index}>
                            <h4 className="text-md font-bold text-gray-800 mb-2">{amenity.category}</h4>
                            <ul className="space-y-2">
                                {amenity.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">{item.icon}</span>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HostAndAmenitiesSection;