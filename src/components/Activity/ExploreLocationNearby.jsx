import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const ExploreLocationNearby = () => {
    return (
        <div>
            <div className="mt-[48px] max-w-[83.33333%] mx-auto">
                <h2 className="text-[24px] leading-[29px] font-semibold">
                    Các hoạt động hàng đầu gần quý khách
                </h2>
                <div className="mt-[12px]">
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={12}
                        navigation={true}
                        modules={[Navigation]}
                        className="mt-[24px]"
                    >
                        {new Array(15).fill(0).map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link to={"/activity/1"}>
                                    <img
                                        src="https://pix6.agoda.net/geo/city/16552/1_16552_02.jpg?ca=6&ce=1&s=396x298&ar=4x3"
                                        className="w-full h-[148px] object-cover rounded-[16px]"
                                    />
                                    <p className="pl-[4px] leading-[18px] text-[14px] mt-[7px] font-semibold">
                                        Đà Nẵng
                                    </p>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default ExploreLocationNearby;
