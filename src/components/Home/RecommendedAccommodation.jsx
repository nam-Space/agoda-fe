import { Navigation } from "swiper/modules";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Tabs } from "antd";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { getCities, callFetchHotel } from "../../config/api";
const RecommendedAccommodation = () => {
    const [cities, setCities] = useState([]);
    const [hotelsByCity, setHotelsByCity] = useState({});
    const [loading, setLoading] = useState(true);

    const onChange = (key) => {
        console.log(key);
    };
    // lấy cities
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await getCities({ current: 1, pageSize: 6 });
                setCities(res.data);
            } catch (error) {
                console.error("Failed to load cities:", error);
            }
        };
        fetchCities();
    }, []);

    // lấy hotels cho từng city
    useEffect(() => {
        const fetchHotels = async () => {
            if (cities?.length === 0) return;
            setLoading(true);

            const promises = cities?.map(async (city) => {
                try {
                    const res = await callFetchHotel({ cityId: city.id });
                    return { cityId: city.id, hotels: res.data || [] };
                } catch (error) {
                    console.error(
                        `Failed to load hotels for city ${city.name}:`,
                        error
                    );
                    return { cityId: city.id, hotels: [] };
                }
            });

            const results = await Promise.all(promises);
            const hotelsMap = {};
            results.forEach((item) => {
                hotelsMap[item.cityId] = item.hotels;
            });

            setHotelsByCity(hotelsMap);
            setLoading(false);
        };

        fetchHotels();
    }, [cities]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                {/* <Spin size="large" /> */}
                Loading...
            </div>
        );
    }

    const items = cities.map((city) => ({
        key: city.id.toString(),
        label: city.name,
        children: (
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                navigation={true}
                modules={[Navigation]}
                className="mt-[24px]"
            >
                {hotelsByCity[city.id]?.map((hotel) => (
                    <SwiperSlide key={hotel.id}>
                        <Link className="relative">
                            <img
                                src={
                                    hotel?.images
                                        ? `http://localhost:8000${hotel.images[0]?.image}`
                                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYR83krjU8bD9NkDRlV3iGwsdCsAmyzAPSdg&s"
                                }
                                className="w-full h-[154px] rounded-[16px]"
                            />
                            <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                {hotel.rating || "8.5"}
                            </div>
                            <p className="font-bold mt-[12px]">{hotel.name}</p>
                            <div className="flex items-center gap-[4px]">
                                <div className="flex items-center">
                                    {Array.from({
                                        length: hotel.stars || 5,
                                    }).map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className="text-[#c42c65]"
                                        />
                                    ))}
                                </div>
                                <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                    <FaLocationDot />
                                    {hotel.address || city.name}
                                </div>
                            </div>
                            <p className="text-[12px] text-[#5e6b82]">
                                Giá mỗi đêm chưa gồm thuế và phí
                            </p>
                            <p className="text-[#c53829] text-[16px] font-bold">
                                VND{" "}
                                {hotel.price?.toLocaleString("vi-VN") || "0"}
                            </p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        ),
    }));

    return (
        <div>
            <div className="w-[1124px] mx-auto mt-[64px]">
                <h2 className="text-[24px] font-bold">
                    Những chỗ nghỉ nổi bật được đề xuất cho quý khách:
                </h2>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </div>
    );
};

export default RecommendedAccommodation;
