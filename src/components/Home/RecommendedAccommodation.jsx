import { Navigation } from "swiper/modules";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Tabs } from "antd";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const RecommendedAccommodation = () => {
    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: "1",
            label: "Hồ Chí Minh",
            children: (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link className="relative">
                                <img
                                    src="https://pix8.agoda.net/hotelImages/73279272/0/1680b34a33244e7ad492d6402071da7f.jpg?ce=2&s=375x"
                                    className="w-full h-[154px] rounded-[16px]"
                                />
                                <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                    8.9
                                </div>
                                <p className="font-bold mt-[12px]">
                                    Cozrum Homes Charming Corner
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <div className="flex items-center">
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                    </div>
                                    <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                        <FaLocationDot />
                                        Quận 9, Hồ Chí Minh
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#5e6b82]">
                                    Giá mỗi đêm chưa gồm thuế và phí
                                </p>
                                <p className="text-[#c53829] text-[16px] font-bold">
                                    VND 1.437.037
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
        },
        {
            key: "2",
            label: "Đà Nẵng",
            children: (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link className="relative">
                                <img
                                    src="https://pix8.agoda.net/hotelImages/5481632/0/da09338cef146914309f07bc1bc7f655.jpg?ce=0&s=375x"
                                    className="w-full h-[154px] rounded-[16px]"
                                />
                                <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                    8.9
                                </div>
                                <p className="font-bold mt-[12px]">
                                    Cozrum Homes Charming Corner
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <div className="flex items-center">
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                    </div>
                                    <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                        <FaLocationDot />
                                        Quận 9, Hồ Chí Minh
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#5e6b82]">
                                    Giá mỗi đêm chưa gồm thuế và phí
                                </p>
                                <p className="text-[#c53829] text-[16px] font-bold">
                                    VND 1.437.037
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
        },
        {
            key: "3",
            label: "Vũng Tàu",
            children: (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link className="relative">
                                <img
                                    src="https://pix8.agoda.net/hotelImages/64197808/0/ab1f583eeca03d56ad34565b00bd06bd.jpg?ce=0&s=375x"
                                    className="w-full h-[154px] rounded-[16px]"
                                />
                                <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                    8.9
                                </div>
                                <p className="font-bold mt-[12px]">
                                    Cozrum Homes Charming Corner
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <div className="flex items-center">
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                    </div>
                                    <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                        <FaLocationDot />
                                        Quận 9, Hồ Chí Minh
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#5e6b82]">
                                    Giá mỗi đêm chưa gồm thuế và phí
                                </p>
                                <p className="text-[#c53829] text-[16px] font-bold">
                                    VND 1.437.037
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
        },
        {
            key: "4",
            label: "Hà Nội",
            children: (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link className="relative">
                                <img
                                    src="https://q-xx.bstatic.com/xdata/images/hotel/max500/542517411.jpg?k=a5955e84c2dea6de2b8f5fc02cfe69794c1f78814f45c7e484c00acb9c71c18a&o=&s=375x"
                                    className="w-full h-[154px] rounded-[16px]"
                                />
                                <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                    8.9
                                </div>
                                <p className="font-bold mt-[12px]">
                                    Cozrum Homes Charming Corner
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <div className="flex items-center">
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                    </div>
                                    <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                        <FaLocationDot />
                                        Quận 9, Hồ Chí Minh
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#5e6b82]">
                                    Giá mỗi đêm chưa gồm thuế và phí
                                </p>
                                <p className="text-[#c53829] text-[16px] font-bold">
                                    VND 1.437.037
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
        },
        {
            key: "5",
            label: "Nha Trang",
            children: (
                <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation]}
                    className="mt-[24px]"
                >
                    {new Array(15).fill(0).map((item, index) => (
                        <SwiperSlide key={index}>
                            <Link className="relative">
                                <img
                                    src="https://pix8.agoda.net/hotelImages/51142820/0/8756551a38d6ea123b0e70e01620e4c9.jpg?ce=2&s=375x"
                                    className="w-full h-[154px] rounded-[16px]"
                                />
                                <div className="absolute top-[12px] right-[12px] p-[4px] bg-[#2067da] text-white font-bold rounded-[4px]">
                                    8.9
                                </div>
                                <p className="font-bold mt-[12px]">
                                    Cozrum Homes Charming Corner
                                </p>
                                <div className="flex items-center gap-[4px]">
                                    <div className="flex items-center">
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                        <FaStar className="text-[#c42c65]" />
                                    </div>
                                    <div className="font-semibold flex items-center gap-[4px] text-[#2067da]">
                                        <FaLocationDot />
                                        Quận 9, Hồ Chí Minh
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#5e6b82]">
                                    Giá mỗi đêm chưa gồm thuế và phí
                                </p>
                                <p className="text-[#c53829] text-[16px] font-bold">
                                    VND 1.437.037
                                </p>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
        },
    ];

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
