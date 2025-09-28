import { Navigation } from "swiper/modules";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { getTopVietNamHotel } from "../../config/api";

const VietnamDestination = () => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTopVietNamHotel({ limit: 10 });
                if (res.isSuccess) {
                    setCities(res.data|| []);
                }
            } catch (error) {
                console.error("Failed to fetch top VN cities:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="w-[1124px] mx-auto mt-[160px]">
                <h2 className="text-[24px] font-bold">
                    Các điểm đến thu hút nhất Việt Nam
                </h2>
                <Swiper
                    slidesPerView={5}
                    spaceBetween={16}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {cities.map((city) => (
                        <SwiperSlide key={city.id}>
                            <Link to={`/city/${city.id}`}>
                                <img
                                    src={city?.image? `http://localhost:8000${city.image}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYR83krjU8bD9NkDRlV3iGwsdCsAmyzAPSdg&s"}
                                    alt={city.name}
                                    className="w-full h-[200px] rounded-[16px]"
                                />
                                <p className="font-bold text-center">
                                    {city?.name}
                                </p>
                                <p className="text-center text-[12px]">
                                    {city.hotelCount} chỗ ở
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default VietnamDestination;
