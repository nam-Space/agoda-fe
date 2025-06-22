import { Navigation } from "swiper/modules";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const SaleOffAccommodation = () => {
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
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link>
                                <img
                                    src="https://cdn6.agoda.net/images/WebCampaign/dealspagebanner_hp_web/vi-vn.png"
                                    className="w-full h-[154px] rounded-[16px]"
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
