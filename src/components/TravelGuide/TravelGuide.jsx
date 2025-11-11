import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TravelGuide = () => {
    const [searchValue, setSearchValue] = useState("");

    const featuredGuides = [
        {
            id: 1,
            title: "Thời gian tốt nhất để đến thăm Đài Bắc - Hoạt động 6 điểm tham quan cho mỗi mùa",
            description:
                "Hãy tìm hiểu người ngoài quốc tế từ nước ngoài với các công cụ du lịch được cung cấp bởi Chúng tôi.",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Đọc Thêm",
        },
        {
            id: 2,
            title: "Điểm tham quan phù hợp với gia đình ở Chiang Mai, 7 điều thú vị để làm với trẻ em",
            description:
                "Điểm du lịch tuyệt vời của Bạn năm nay. Bạn có thể để tránh kỳ nghỉ, thư giãn với du lịch kỳ nghỉ yêu thích của chúng tôi",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Đọc Thêm",
        },
        {
            id: 3,
            title: "Chuyến đi trong ngày tại Fukuoka | 5 ý tưởng hành trình cho các tour du lịch...",
            description:
                "Fukuoka sẽ là địa điểm du lịch khoảng không gian này để hoàn thành các tour du lịch một cách tuyệt vời",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Đọc Thêm",
        },
    ];

    const destinations = [
        {
            id: 1,
            name: "A Tây Ba",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 2,
            name: "Ai Cập",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 3,
            name: "Ấn Độ",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 4,
            name: "Ấn Độ",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 5,
            name: "Áo",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 6,
            name: "Argentina",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 7,
            name: "Ba Lan",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 8,
            name: "Barcelona",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 9,
            name: "Bắc Kinh",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 10,
            name: "Bộ Đạo Nha",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 11,
            name: "Thắng phật Lạt",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 12,
            name: "Campuchia",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 13,
            name: "Canada",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 14,
            name: "Chiang Mai",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 15,
            name: "Croatia",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 16,
            name: "Đài Loan",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 17,
            name: "Dubai",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 18,
            name: "Đức",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 19,
            name: "Đà Nẵng",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 20,
            name: "Phần Lan",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 21,
            name: "Pháp",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 22,
            name: "Ghana",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 23,
            name: "Hy Lạp",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
        {
            id: 24,
            name: "Hungary",
            background:
                "https://www.agoda.com/wp-content/uploads/2025/07/experience_vietnam_hoi-an_hoi-an-riverbank-hero-image-535x521.jpg",
        },
    ];

    const destinationMostFeature = [
        {
            id: 1,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 2,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 3,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 4,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 5,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 6,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 7,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 8,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 9,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 10,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 11,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 12,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 13,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 14,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 15,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 16,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 17,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 18,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 19,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 20,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 21,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 22,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 23,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
        {
            id: 24,
            name: "Bangkok, Thailand",
            background:
                "https://www.agoda.com/wp-content/uploads/2019/11/Cruises-in-Bangkok-Dinner-cruise-at-sunset.jpg",
        },
    ];

    const recommendations = [
        {
            id: 1,
            title: "Chuyến đi trong ngày tốt nhất từ Tokyo | 8 địa điểm để nghỉ ngơi nhanh chóng bằng tàu",
            description:
                "Mang luôi tàu cao tốc của Tokyo giúp bạn dễ dàng thoát khỏi thành phố trong một ngày và khám phá những điểm mới lạ. Cho dù bạn chỉ có một, hai hoặc ba...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 2,
            title: "Đi vòng quanh Kyoto | Hướng dẫn về tàu cao tốc, xe buýt địa phương và cho thuê xe đạp",
            description:
                "Thủ đô cũ của Nhật Bản là Kyoto là một thành phố đầm đã truyền thống và trận ngắn những điều kỳ quặc hấp dẫn. Ngoài những ngôi đền mang tính biểu tượng và...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 3,
            title: "Hướng dẫn đến Công viên Maruyama | Ngắm hoa anh đào và khám phá Gion ở Kyoto",
            description:
                "Ân minh gặn suối của quận Higashiyama ở Kyoto, Công viên Maruyama là một ốc đảo tu nhiên tuyệt đẹp của vé đạp và su quyền rủ. Đây là nơi có hàng trăm c...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 4,
            title: "Chợ Chatuchak: Thăm quan khu chợ lớn nhất Bangkok",
            description:
                'Chợ Chatuchak là một khu chợ rộng lớn năm ở quận Chatuchak của Bangkok. Nó thường được gọi là "Chợ cuối tuần Chatuchak" với hữu hết các nhà cung cấp...',
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 5,
            title: "Chợ Nishiki | Các cửa hàng hàng đầu để ghé thăm và ăn ở tại phòng dùng thực ăn của Kyoto",
            description:
                "Cho dù bạn đang tìm kiếm những món ngon thú vị để kích thích vị giác của mình, một lịch sử phong phú, điều đó bạn sẽ phát hiện ở các nhà phân vân...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 6,
            title: "Cung điện Hoàng gia Kyoto - Tour có hương dẫn viên, Giờ và các điểm tham quan lân cận",
            description:
                "Cung điện Hoàng gia Kyoto là một cơ sở ý giáo lich sử Hoàng gia phòng phủ Nhật Bản, mang đến cho du khách một hình ảnh trực tiếp của cuộc sống ở...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 7,
            title: "Quán bar trên tầng thương ở Bangkok | Điểm giải trí về đêm với tầm nhìn tuyệt vời",
            description:
                "Cho dù bạn nhân nhờ một ly cocktail đặc trưng hay thưởng thức một ly rượu vang hảo hạng, tầm nhìn toàn cảnh từ trên cao trên những con phố nhộn nhịp...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
        {
            id: 8,
            title: "Hành trình 5 ngày ở Bali | Hướng dẫn danh cho những người lần đầu tiên để có một k...",
            description:
                "Bali là thiên đương du lịch thực sự, nơi bạn sẽ không bao giờ thấy lâm. Thách thức duy nhất là tìm ra những điều quan va hoạt động nào để...",
            image: "https://www.agoda.com/wp-content/uploads/2020/02/Maruyama-park-Featured-Photo-1200x350-Picturesque-view-of-Maruyama-park.jpg",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div
                className="relative h-[500px] bg-cover bg-center flex flex-col justify-start pt-12"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-7xl w-full mx-auto">
                    {/* Title */}
                    <h1 className="text-white text-4xl font-bold px-6 mb-8">
                        Cẩm nang du lịch
                    </h1>

                    {/* Breadcrumb */}
                    <div className="px-6 mb-6">
                        <span className="text-white text-sm">
                            <a href="#" className="hover:underline">
                                Hộ
                            </a>
                            {" > "}
                            <a href="#" className="hover:underline">
                                Chi tiết quy định
                            </a>
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="px-6 flex justify-start">
                        <div className="w-full max-w-2xl">
                            <Input
                                placeholder="Khám phá cẩm nang về quốc gia, Thành phố"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                suffix={
                                    <SearchOutlined className="text-blue-500 cursor-pointer text-lg" />
                                }
                                className="h-12 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Guides Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-8">
                    Cẩm nang du lịch nổi bật
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredGuides.map((guide) => (
                        <Card
                            key={guide.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow"
                            cover={
                                <Link
                                    to={`/travel-guide/${guide.id}/${guide.id}/${guide.id}`}
                                >
                                    <div
                                        className="h-48 bg-gradient-to-br relative flex items-end p-4"
                                        style={{
                                            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${guide.image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        <h3 className="text-white font-bold text-lg line-clamp-2">
                                            {guide.title}
                                        </h3>
                                    </div>
                                </Link>
                            }
                        >
                            <p className="text-gray-700 text-sm mb-4">
                                {guide.description}
                            </p>
                            <Link
                                to={`/travel-guide/${guide.id}/${guide.id}/${guide.id}`}
                                className="text-blue-500 p-0"
                            >
                                {guide.link} →
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Destinations Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-8">Điểm đến nổi tiếng</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {destinations.map((dest) => (
                        <Link
                            to={`/travel-guide/${dest.id}`}
                            className={`rounded-lg p-4 h-[200px] flex items-end cursor-pointer hover:opacity-90 transition-opacity`}
                            style={{
                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${dest.background})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <span className="text-white font-semibold text-lg">
                                {dest.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-8">Điểm đến nổi bật</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {destinationMostFeature.map((dest) => (
                        <Link
                            to={`/travel-guide/${dest.id}`}
                            className={`rounded-lg p-4 h-[200px] flex items-end cursor-pointer hover:opacity-90 transition-opacity`}
                            style={{
                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${dest.background})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <span className="text-white font-semibold text-lg">
                                {dest.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-8">
                    Những nơi phải ghé thăm: 100 Cẩm nang du lịch mới nhất
                </h2>

                {/* Grid of Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((item) => (
                        <Link
                            key={item.id}
                            to={`/travel-guide/${item.id}/${item.id}/${item.id}`}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Title */}
                                <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-600 line-clamp-3">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TravelGuide;
