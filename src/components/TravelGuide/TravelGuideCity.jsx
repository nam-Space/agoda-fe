import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Image, Input, Pagination, Select } from "antd";
import { callFetchHandbook } from "config/api";
import { callFetchCityDetail } from "config/api";
import { HANDBOOK_CATEGORIES } from "constants/handbook";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getImage } from "utils/imageUrl";

const TravelGuideCity = () => {
    const params = useParams();
    const { cityId } = params;

    const [searchValue, setSearchValue] = useState("");
    const [cityDetail, setCityDetail] = useState({});
    const [featuredGuides, setFeaturedGuides] = useState([]);
    const [guides, setGuides] = useState([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });

    const [category, setCategory] = useState("all");

    const handleGetCityDetail = async (cityId) => {
        const res = await callFetchCityDetail(cityId);
        if (res.isSuccess) {
            setCityDetail(res.data);
        }
    };

    const handleGetHandbook = async (cityId) => {
        const res = await callFetchHandbook(
            `current=1&pageSize=3&city_id=${cityId}&recommended=true`
        );
        if (res.isSuccess) {
            setFeaturedGuides(res.data);
        }
    };

    const handleGetHandbookByCity = async (query) => {
        const res = await callFetchHandbook(query);
        if (res.isSuccess) {
            setGuides(res.data);
            setMeta({
                ...meta,
                total: res.meta.totalItems,
                totalPages: res.meta.totalPages,
            });
        }
    };

    useEffect(() => {
        if (cityId) {
            window.scrollTo(0, 0);
            handleGetCityDetail(cityId);
            handleGetHandbook(cityId);
        }
    }, [cityId]);

    useEffect(() => {
        if (cityId) {
            if (category === "all") {
                handleGetHandbookByCity(
                    `current=${meta.current}&pageSize=${meta.pageSize}&city_id=${cityId}&recommended=true`
                );
            } else {
                handleGetHandbookByCity(
                    `current=${meta.current}&pageSize=${meta.pageSize}&city_id=${cityId}&category=${category}&recommended=true`
                );
            }
        }
    }, [cityId, meta.current, meta.pageSize, category]);

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
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${getImage(
                        cityDetail?.image_handbook
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-7xl w-full mx-auto">
                    {/* Title */}
                    <h1 className="text-white text-4xl font-bold px-6 mb-8">
                        {cityDetail?.name}
                    </h1>

                    {/* Breadcrumb */}
                    <div className="px-6 mb-6">
                        <span className="text-white text-sm">
                            <Link to="/" className="hover:underline">
                                Trang chủ
                            </Link>
                            {" > "}
                            <Link
                                to={`/travel-guide`}
                                className="hover:underline"
                            >
                                Cẩm nang du lịch
                            </Link>
                            {" > "}
                            <Link
                                to={`/travel-guide/${cityDetail?.country?.id}`}
                                className="hover:underline"
                            >
                                {cityDetail?.country?.name}
                            </Link>
                            {" > "}
                            <span>{cityDetail?.name}</span>
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
                    Bài viết nổi bật về {cityDetail?.name}
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
                                        className="h-48 relative flex items-end p-4"
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

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Cẩm nang {cityDetail.name}
                    </h2>
                    <Select
                        value={category}
                        onChange={setCategory}
                        options={HANDBOOK_CATEGORIES}
                        className="w-40"
                        size="large"
                    />
                </div>

                {/* Guides List */}
                <div className="space-y-8">
                    {guides.length > 0 ? (
                        <div className="flex flex-col gap-8 items-end">
                            {guides.map((guide) => (
                                <div
                                    key={guide.id}
                                    className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* Image */}
                                    <div className="flex-shrink-0 w-full md:w-80 h-64 md:h-48 relative rounded-xl overflow-hidden">
                                        <img
                                            src={getImage(guide.image)}
                                            alt={guide.title}
                                            fill
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link
                                                to={`/travel-guide/${guide.city.country.id}/${guide.city.id}/${guide.id}`}
                                                className="text-2xl font-bold text-gray-900"
                                            >
                                                {guide.title}
                                            </Link>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        guide?.short_description ||
                                                        "",
                                                }}
                                                className="text-gray-600 leading-relaxed text-base mt-4"
                                            ></div>
                                        </div>

                                        {/* Read More Button */}
                                        <div className="mt-6">
                                            <Link
                                                to={`/travel-guide/${guide.city.country.id}/${guide.city.id}/${guide.id}`}
                                                className="text-blue-500 p-0"
                                            >
                                                Đọc thêm →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Pagination
                                showQuickJumper
                                pageSize={meta.pageSize}
                                className="mt-4"
                                total={meta.total}
                                onChange={onChangePagination}
                            />
                        </div>
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
