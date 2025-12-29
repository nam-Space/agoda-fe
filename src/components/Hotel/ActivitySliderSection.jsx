import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosStar } from "react-icons/io";
import { Empty, Spin, Tag } from "antd";
import { BsLightningChargeFill } from "react-icons/bs";
import { formatCurrency } from "utils/formatCurrency";
import { callFetchActivity } from "config/api";
import { ACTIVITY_TYPE } from "constants/activity";

const ActivitySlider = ({ cityId, cityName }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const categories = [
        "all",
        ...Object.entries(ACTIVITY_TYPE).map(([key, _]) => key),
    ];
    const [selectedCategory, setSelectedCategory] = useState("all");

    const fetchActivities = async (query) => {
        setIsLoading(true);
        const res = await callFetchActivity(query);
        if (res.data) {
            const formatted = res.data;
            setActivities(formatted);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchActivities(
                `current=1&pageSize=10&recommended=true&city_id=${cityId}&category=${
                    selectedCategory === "all" ? "" : selectedCategory
                }`
            );
        }
    }, [cityId, selectedCategory]);

    return (
        <section className="bg-white shadow-md rounded-2xl p-6">
            <div className="container mx-auto px-4">
                {/* Title & Categories */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                        Hoạt động không thể bỏ qua ở {cityName}
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full border ${
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                } transition`}
                            >
                                {cat === "all" ? "Tất cả" : ACTIVITY_TYPE[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Slider */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-[100px]">
                        <Spin size="large" />
                    </div>
                ) : activities.length === 0 ? (
                    <Empty
                        description="Không có hoạt động nào được tìm thấy."
                        className="bg-[#abb6cb1f] w-full mx-0 py-[70px] rounded-[16px]"
                    />
                ) : (
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={8}
                        navigation={true}
                        modules={[Navigation]}
                    >
                        {activities.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="rounded-[16px] border-[1px] border-[#d5d9e2] overflow-hidden">
                                    <Link to={`/activity/detail/${item.id}`}>
                                        <img
                                            src={`${process.env.REACT_APP_BE_URL}${item?.images?.[0]?.image}`}
                                            alt={item.name}
                                            className="w-full h-[170px] object-cover"
                                        />
                                        <div className="pt-[12px] px-[16px] pb-[16px]">
                                            <p className="font-semibold text-[20px] leading-[24px] line-clamp-2 min-h-[48px]">
                                                {item.name}
                                            </p>
                                            <div className="flex items-center gap-[4px]">
                                                <IoIosStar className="text-[#b54c01] text-[12px]" />
                                                <p className="font-semibold">
                                                    {item.avg_star?.toFixed(1)}
                                                </p>
                                                <p className="text-[13px] text-[#5e6b82]">
                                                    (49)
                                                </p>
                                                <p className="text-[#5e6b82]">
                                                    •
                                                </p>
                                                <p className="text-[13px] text-[#5e6b82]">
                                                    298 người đã đặt
                                                </p>
                                            </div>
                                            <div className="flex items-center mt-[4px]">
                                                <Tag
                                                    color="blue"
                                                    className="p-[4px]"
                                                >
                                                    <BsLightningChargeFill className="text-[14px]" />
                                                </Tag>
                                                <Tag
                                                    color="blue"
                                                    className="p-[4px] text-[13px] leading-[14px]"
                                                >
                                                    Hủy miễn phí
                                                </Tag>
                                            </div>
                                            <div className="flex justify-end mt-[52px]">
                                                <Tag
                                                    color="#c53829"
                                                    className="p-[4px] text-[13px] leading-[14px] mr-0"
                                                >
                                                    Giảm 0%
                                                </Tag>
                                            </div>
                                            <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                                <p className="text-[13px] text-end line-through">
                                                    {formatCurrency(
                                                        item.avg_price.toFixed(
                                                            0
                                                        )
                                                    )}{" "}
                                                    ₫
                                                </p>
                                                <div className="flex items-center justify-end gap-[8px]">
                                                    <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                        {formatCurrency(
                                                            item.avg_price.toFixed(
                                                                0
                                                            )
                                                        )}
                                                    </p>
                                                    <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                        ₫
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
};

export default ActivitySlider;
