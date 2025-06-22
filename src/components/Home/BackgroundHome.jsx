import React from "react";
import bgImg from "../../images/home/bg-agoda.png";
import { Tabs } from "antd";
import { FaHotel } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { MdFlight } from "react-icons/md";
import { LuFerrisWheel } from "react-icons/lu";
import { TbBuildingAirport } from "react-icons/tb";
import HotelTab from "./BackgroundTab/HotelTab";
import HomestayTab from "./BackgroundTab/HomestayTab";
import FLightAndAccommodationTab from "./BackgroundTab/FlightAndAccommodationTab";
import FlightTicketTab from "./BackgroundTab/FlightTicketTab";
import ActivityTab from "./BackgroundTab/ActivityTab";
import AirportTab from "./BackgroundTab/AirportTab";

const BackgroundHome = () => {
    const items = [
        {
            key: "1",
            label: (
                <div className="flex items-center gap-[5px]">
                    <FaHotel className="text-[18px]" />
                    Khách sạn
                </div>
            ),
            children: <HotelTab />,
        },
        {
            key: "2",
            label: (
                <div className="flex items-center gap-[5px]">
                    <FaHome className="text-[18px]" />
                    Nhà và căn hộ
                </div>
            ),
            children: <HomestayTab />,
        },
        {
            key: "3",
            label: (
                <div className="flex items-center gap-[5px]">
                    <MdFlightTakeoff className="text-[18px]" />
                    Máy bay + K.sạn
                </div>
            ),
            children: <FLightAndAccommodationTab />,
        },
        {
            key: "4",
            label: (
                <div className="flex items-center gap-[5px]">
                    <MdFlight className="text-[18px]" />
                    Vé máy bay
                </div>
            ),
            children: <FlightTicketTab />,
        },
        {
            key: "5",
            label: (
                <div className="flex items-center gap-[5px]">
                    <LuFerrisWheel className="text-[18px]" />
                    Hoạt động
                </div>
            ),
            children: <ActivityTab />,
        },
        {
            key: "6",
            label: (
                <div className="flex items-center gap-[5px]">
                    <TbBuildingAirport className="text-[18px]" />
                    Đưa đón sân bay
                </div>
            ),
            children: <AirportTab />,
        },
    ];

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div>
            <div className="h-[320px] relative banner-home">
                <img src={bgImg} className="h-full w-full" />
                <div className="absolute top-[24px] left-[50%] translate-x-[-50%]">
                    <p className="uppercase text-[28px] font-semibold text-white text-center">
                        Rong chơi bốn phương, giá vẫn "yêu thương"
                    </p>
                    <Tabs
                        centered={true}
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default BackgroundHome;
