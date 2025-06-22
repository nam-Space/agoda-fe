import { Navigation } from "swiper/modules";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const ForeignCountryDestination = () => {
    return (
        <div>
            <div className="w-[1124px] mx-auto my-[64px]">
                <h2 className="text-[24px] font-bold">
                    Các điểm đến nổi tiếng ngoài Việt Nam
                </h2>
                <Swiper
                    slidesPerView={5}
                    spaceBetween={16}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link>
                                <img
                                    src="https://pix6.agoda.net/geo/city/5085/1_5085_02.jpg?ca=6&ce=1&s=1024x&ar=1x1"
                                    className="w-full h-[200px] rounded-[16px]"
                                />
                                <p className="font-bold text-center">Tokyo</p>
                                <p className="text-center text-[12px]">
                                    15.546 chỗ ở
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ForeignCountryDestination;
