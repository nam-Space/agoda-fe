import { BiSolidPlaneAlt } from "react-icons/bi";
import { LuFerrisWheel } from "react-icons/lu";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { TbBuildingAirport } from "react-icons/tb";

export const planForTrips = [
    {
        icon: (
            <PiBuildingApartmentFill className="text-[28px] text-[#2067da]" />
        ),
        text: "Tìm",
        subtext: "Nơi lưu trú",
        link: "/",
    },
    {
        icon: <LuFerrisWheel className="text-[28px] text-[#2067da]" />,
        text: "Tìm",
        subtext: "Hoạt động",
        link: "/",
    },
    {
        icon: <BiSolidPlaneAlt className="text-[28px] text-[#2067da]" />,
        text: "Tìm",
        subtext: "Chuyến bay",
        link: "/",
    },
    {
        icon: <TbBuildingAirport className="text-[28px] text-[#2067da]" />,
        text: "Tìm",
        subtext: "Đưa đón sân bay",
        link: "/",
    },
];

export const planForTripsBlueIcon = [
    {
        icon: (
            <PiBuildingApartmentFill className="text-[28px] text-[#007e3e]" />
        ),
        text: "Tìm",
        subtext: "Nơi lưu trú",
        link: "/",
    },
    {
        icon: <LuFerrisWheel className="text-[28px] text-[#007e3e]" />,
        text: "Tìm",
        subtext: "Hoạt động",
        link: "/",
    },
    {
        icon: <BiSolidPlaneAlt className="text-[28px] text-[#007e3e]" />,
        text: "Tìm",
        subtext: "Chuyến bay",
        link: "/",
    },
    {
        icon: <TbBuildingAirport className="text-[28px] text-[#007e3e]" />,
        text: "Tìm",
        subtext: "Đưa đón sân bay",
        link: "/",
    },
];

export const ServiceTab = {
    INCOMING: "incoming",
    SUCCESSFUL: "successful",
    CANCELLED: "cancelled",
};
