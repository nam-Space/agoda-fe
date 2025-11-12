import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Pagination, Select } from "antd";
import { callFetchCountry } from "config/api";
import { callFetchCity } from "config/api";
import { callFetchHandbook } from "config/api";
import { HANDBOOK_CATEGORIES } from "constants/handbook";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getImage } from "utils/imageUrl";

const TravelGuide = () => {
    const [searchValue, setSearchValue] = useState("");
    const [featuredGuides, setFeaturedGuides] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [destinationMostFeature, setDestinationMostFeature] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
    });
    const [category, setCategory] = useState("all");

    const handleGetHandbooks = async (query) => {
        const res = await callFetchHandbook(query);
        if (res.isSuccess) {
            setFeaturedGuides(res.data);
        }
    };

    const handleGetHandbooksOther = async (query) => {
        const res = await callFetchHandbook(query);
        if (res.isSuccess) {
            setRecommendations(res.data);
            setMeta({
                ...meta,
                total: res.meta.totalItems,
                totalPages: res.meta.totalPages,
            });
        }
    };

    const handleGetCountry = async (query) => {
        const res = await callFetchCountry(query);
        if (res.isSuccess) {
            setDestinations(res.data);
        }
    };

    const handleGetCity = async (query) => {
        const res = await callFetchCity(query);
        if (res.isSuccess) {
            setDestinationMostFeature(res.data);
        }
    };

    useEffect(() => {
        handleGetHandbooks(`current=1&pageSize=3&recommended=true`);
        handleGetCountry(`current=1&pageSize=50`);
        handleGetCity(`current=1&pageSize=50`);
        handleGetHandbooksOther(`current=1&pageSize=20&recommended=true`);
    }, []);

    useEffect(() => {
        if (category === "all") {
            handleGetHandbooksOther(
                `current=${meta.current}&pageSize=${meta.pageSize}&recommended=true`
            );
        } else {
            handleGetHandbooksOther(
                `current=${meta.current}&pageSize=${meta.pageSize}&category=${category}&recommended=true`
            );
        }
    }, [meta.current, meta.pageSize, category]);

    const onChangePagination = (pageNumber, pageSize) => {
        setMeta({
            ...meta,
            current: pageNumber,
            pageSize: pageSize,
        });
    };

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
                            <Link to={"/"} className="hover:underline">
                                Trang chủ
                            </Link>
                            {" > "}
                            <span>Chi tiết quy định</span>
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
                                    to={`/travel-guide/${guide.city.country.id}/${guide.city.id}/${guide.id}`}
                                >
                                    <div
                                        className="h-48 bg-gradient-to-br relative flex items-end p-4"
                                        style={{
                                            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${getImage(
                                                guide.image
                                            )})`,
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
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: guide.short_description,
                                }}
                                className="text-gray-700 text-sm mb-4"
                            ></div>
                            <Link
                                to={`/travel-guide/${guide.city.country.id}/${guide.city.id}/${guide.id}`}
                                className="text-blue-500 p-0"
                            >
                                Đọc thêm →
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
                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${getImage(
                                    dest.image_handbook
                                )})`,
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
                            to={`/travel-guide/${dest.country.id}/${dest.id}`}
                            className={`rounded-lg p-4 h-[200px] flex items-end cursor-pointer hover:opacity-90 transition-opacity`}
                            style={{
                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.04)), url(${getImage(
                                    dest.image_handbook
                                )})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <span className="text-white font-semibold text-lg">
                                {dest.name}, {dest.country.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Những nơi phải ghé thăm: {recommendations.length} Cẩm
                        nang du lịch mới nhất
                    </h2>
                    <Select
                        value={category}
                        onChange={setCategory}
                        options={HANDBOOK_CATEGORIES}
                        className="w-40"
                        size="large"
                    />
                </div>

                {/* Grid of Recommendations */}
                <div className="flex flex-col gap-8 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((item) => (
                            <Link
                                key={item.id}
                                to={`/travel-guide/${item.city.country.id}/${item.city.id}/${item.id}`}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img
                                        src={getImage(item.image)}
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
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                item.short_description || "",
                                        }}
                                        className="text-xs text-gray-600 line-clamp-3"
                                    ></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination
                        showQuickJumper
                        className="mt-4"
                        total={meta.total}
                        pageSize={meta.pageSize}
                        onChange={onChangePagination}
                    />
                </div>
            </div>
        </div>
    );
};

export default TravelGuide;
