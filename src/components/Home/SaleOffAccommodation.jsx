import { Navigation } from "swiper/modules";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { getPromotions } from "../../config/api";

const SaleOffAccommodation = () => {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await getPromotions({ promotion_type: 1 });
                setPromotions(res.results || []);
            } catch (error) {
                console.error("Lỗi khi load promotions:", error);
            }
        };
        fetchPromotions();
    }, []);

    return (
        <div>
            <div className="w-[1124px] mx-auto mt-[64px]">
                <h2 className="text-[24px] font-bold">
                    Chương trình khuyến mại chỗ ở
                </h2>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <Link to={`/promotions/${promo.id}`}>
                                <img
                                    src={promo.image || "/default-promo.jpg"}
                                    alt={promo.title}
                                    className="w-full h-[154px] rounded-[16px] object-cover"
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default SaleOffAccommodation;
