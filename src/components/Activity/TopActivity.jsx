import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosStar } from "react-icons/io";
import { Tag } from "antd";
import { BsLightningChargeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const TopActivity = () => {
    return (
        <div>
            <div className="mt-[32px] max-w-[83.33333%] mx-auto">
                <h2 className="text-[24px] leading-[29px] font-semibold">
                    Các hoạt động hàng đầu gần quý khách
                </h2>
                <div className="mt-[12px]">
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={8}
                        navigation={true}
                        modules={[Navigation]}
                    >
                        {new Array(15).fill(0).map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link
                                    to={"/activity/detail/1"}
                                    className="rounded-[16px] overflow-hidden border-[1px] border-[#d5d9e2] hover:shadow-[rgba(4,7,10,0.24)_0px_4px_10px_0px] transition-all duration-200"
                                >
                                    <img
                                        src="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/13/e5/1b/2f.jpg"
                                        className="w-full h-[170px] object-cover"
                                    />
                                    <div className="pt-[12px] px-[16px] pb-[16px]">
                                        <p className="font-semibold text-[20px] leading-[24px] line-clamp-2">
                                            Da Nang Airport Transfer to Da Nang
                                            Hotel by Private Car
                                        </p>
                                        <div className="flex items-center gap-[4px]">
                                            <IoIosStar className="text-[#b54c01] text-[12px]" />
                                            <p className="font-semibold">5</p>
                                            <p className="text-[13px] text-[#5e6b82]">
                                                (49)
                                            </p>
                                            <p className="text-[#5e6b82]">•</p>
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
                                                Giảm 5%
                                            </Tag>
                                        </div>
                                        <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                            <p className="text-[13px] text-end line-through">
                                                678.497 ₫
                                            </p>
                                            <div className="flex items-center justify-end gap-[8px]">
                                                <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                    540.762
                                                </p>
                                                <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                    ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default TopActivity;
