import FooterClient from "components/FooterClient";
import HeaderClient from "components/HeaderClient";
import React from "react";
import { FaRegCalendarCheck, FaUser } from "react-icons/fa";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { LuFerrisWheel } from "react-icons/lu";
import { AiFillMessage } from "react-icons/ai";
import { Link, useLocation, useParams } from "react-router-dom";

const ProfileClientLayout = ({ children }) => {
    const location = useLocation();

    console.log("location", location);

    const menus = [
        {
            link: "/profile/hotel",
            icon: <FaRegCalendarCheck className="text-[24px]" />,
            text: "Chuyến đi",
            active: location.pathname === "/profile/hotel",
        },
        {
            link: "/profile/hotel",
            icon: <PiBuildingApartmentFill className="text-[24px]" />,
            text: "Khách sạn",
            active: location.pathname === "/profile/hotel",
        },
        {
            link: "/profile/flight",
            icon: <BiSolidPlaneAlt className="text-[24px]" />,
            text: "Chuyến bay",
            active: location.pathname === "/profile/flight",
        },
        {
            link: "/profile/activity",
            icon: <LuFerrisWheel className="text-[24px]" />,
            text: "Hoạt động",
            active: location.pathname === "/profile/activity",
        },
        {
            link: "/profile/chat",
            icon: <AiFillMessage className="text-[24px]" />,
            text: "Tin nhắn từ chỗ nghỉ",
            active: location.pathname === "/profile/chat",
        },
        {
            link: "/profile",
            icon: <FaUser className="text-[24px]" />,
            text: "Hồ sơ",
            active: location.pathname === "/profile",
        },
    ];

    return (
        <div>
            <HeaderClient />
            <div className="bg-[#eff4fc] py-[16px]">
                <div className="grid grid-cols-4 gap-[32px] max-w-[1124px] mx-auto">
                    <div className="col-span-1 flex flex-col gap-[8px] bg-white p-[8px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(4,7,10,0.16)]">
                        {menus.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className={`flex items-center relative gap-[12px] py-[8px] px-[16px] after:transition-all after:duration-300 after:rounded-[8px] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 ${
                                    item.active && index !== 0
                                        ? "after:opacity-10 text-[#2067da]"
                                        : ""
                                }`}
                            >
                                {item.icon}
                                {item.text}
                            </Link>
                        ))}
                    </div>
                    <div className="col-start-2 col-span-3">{children}</div>
                </div>
            </div>

            <FooterClient />
        </div>
    );
};

export default ProfileClientLayout;
