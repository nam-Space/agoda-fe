import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Image, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TravelGuideCity = () => {
    const params = useParams();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log("params", params);
    }, [params]);

    const featuredGuides = [
        {
            id: 1,
            title: "Thời gian tốt nhất để đến thăm Đài Bắc - Hoạt động 6 điểm tham quan cho mỗi mùa",
            description:
                "Hãy tìm hiểu người ngoài quốc tế từ nước ngoài với các công cụ du lịch được cung cấp bởi Chúng tôi.",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Độc Thêm",
        },
        {
            id: 2,
            title: "Điểm tham quan phù hợp với gia đình ở Chiang Mai, 7 điều thú vị để làm với trẻ em",
            description:
                "Điểm du lịch tuyệt vời của Bạn năm nay. Bạn có thể để tránh kỳ nghỉ, thư giãn với du lịch kỳ nghỉ yêu thích của chúng tôi",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Độc Thêm",
        },
        {
            id: 3,
            title: "Chuyến đi trong ngày tại Fukuoka | 5 ý tưởng hành trình cho các tour du lịch...",
            description:
                "Fukuoka sẽ là địa điểm du lịch khoảng không gian này để hoàn thành các tour du lịch một cách tuyệt vời",
            image: "https://www.agoda.com/wp-content/uploads/2025/07/Hero-Image_TG-home2-1478x700-1.webp",
            link: "Độc Thêm",
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

    const [category, setCategory] = useState("all");

    const guides = [
        {
            id: 1,
            title: "Nha Trang Beach Bliss: Hướng dẫn danh sách nhóm cuối cùng của bạn",
            description:
                "Khám phá những bãi biển tuyệt đẹp của Nha Trang với danh sách xổ cuối cùng của chúng tôi! Hòa mình vào những cuộc phiêu lưu ngắn nắng và tìm nơi ngọai ngòi bên bờ biển hoàn hảo của bạn. Bắt đầu hành trình của bạn ngay bây giờ!",
            image: "https://www.agoda.com/wp-content/uploads/2020/11/Featured-photo-Vung-Tau-itinerary-Vietnam-1-526x320.jpg",
            category: "beach",
        },
        {
            id: 2,
            title: "Khám phá Nhà tù Hỏa Lò: Một chuyến đi trong ngày Hà Nội đầy ấn ảnh",
            description:
                "Khám phá lịch sự ấm ánh của Nhà tù Hỏa Lò ở Hà Nội. Khám phá những câu chuyện và bí mật của nó trong một chuyến đi trong ngày độc đáo. Khám phá ngay để có trải nghiệm khó quên!",
            image: "https://www.agoda.com/wp-content/uploads/2020/11/Featured-photo-Vung-Tau-itinerary-Vietnam-1-526x320.jpg",
            category: "history",
        },
        {
            id: 3,
            title: "10 cuộc phiêu lưu hoàn trăng ở Đà Nẵng: Hướng dẫn vui nhộn của người...",
            description:
                "Khám phá 10 cuộc phiêu lưu hoàn trăng ở Đà Nẵng mà những người tìm kiếm cảm giác mạnh không thể bỏ lỡ! Giải phóng tính thần phiêu lưu của bạn với những điều hàng đầu ở Đà Nẵng này. Bắt đầu hành trình của bạn ngay bây giờ!",
            image: "https://www.agoda.com/wp-content/uploads/2020/11/Featured-photo-Vung-Tau-itinerary-Vietnam-1-526x320.jpg",
            category: "adventure",
        },
    ];

    const filteredGuides =
        category === "all"
            ? guides
            : guides.filter((guide) => guide.category === category);

    const categories = [
        { label: "Tất cả", value: "all" },
        { label: "Biển", value: "beach" },
        { label: "Lịch sử", value: "history" },
        { label: "Phiêu lưu", value: "adventure" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div
                className="relative h-[500px] bg-cover bg-center flex flex-col justify-start pt-12"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://www.agoda.com/wp-content/uploads/2020/06/Featured-photo-dragon-bridge-things-to-do-in-da-nang-Vietnam.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-7xl w-full mx-auto">
                    {/* Title */}
                    <h1 className="text-white text-4xl font-bold px-6 mb-8">
                        Đà Nẵng
                    </h1>

                    {/* Breadcrumb */}
                    <div className="px-6 mb-6">
                        <span className="text-white text-sm">
                            <a href="#" className="hover:underline">
                                Home
                            </a>
                            {" > "}
                            <a href="#" className="hover:underline">
                                Cẩm nang du lịch
                            </a>
                            {" > "}
                            <a href="#" className="hover:underline">
                                Việt Nam
                            </a>
                            {" > "}
                            <a href="#" className="hover:underline">
                                Đà Nẵng
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
                    Bài viết nổi bật về Đà Nẵng
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
                                        className="h-48 relative flex items-end p-4"
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

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-8">
                        Cẩm nang Đà Nẵng
                    </h2>
                    <Select
                        value={category}
                        onChange={setCategory}
                        options={categories}
                        className="w-40"
                        size="large"
                    />
                </div>

                {/* Guides List */}
                <div className="space-y-8">
                    {filteredGuides.length > 0 ? (
                        filteredGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Image */}
                                <div className="flex-shrink-0 w-full md:w-80 h-64 md:h-48 relative rounded-xl overflow-hidden">
                                    <Image
                                        src={guide.image || "/placeholder.svg"}
                                        alt={guide.title}
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {guide.title}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed text-base">
                                            {guide.description}
                                        </p>
                                    </div>

                                    {/* Read More Button */}
                                    <div className="mt-6">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<ArrowRightOutlined />}
                                            className="bg-blue-500 hover:bg-blue-600 border-none px-8"
                                        >
                                            ĐỌC THÊM
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Empty
                            description="Không có bài viết nào"
                            className="py-12"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelGuideCity;
