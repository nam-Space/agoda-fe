import { Tabs } from "antd";
import React from "react";
import HotelIncomingTab from "./HotelTab/HotelIncomingTab";
import HotelSuccessfulTab from "./HotelTab/HotelSuccessfulTab";
import HotelCancelledTab from "./HotelTab/HotelCancelledTab";

const Hotel = () => {
    const items = [
        {
            key: "1",
            label: <p className="font-semibold">Sắp tới</p>,
            children: <HotelIncomingTab />,
        },
        {
            key: "2",
            label: <p className="font-semibold">Hoàn tất</p>,
            children: <HotelSuccessfulTab />,
        },
        {
            key: "3",
            label: <p className="font-semibold">Đã hủy</p>,
            children: <HotelCancelledTab />,
        },
    ];

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div>
            <Tabs
                className="tab-profile-container"
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
            />
        </div>
    );
};

export default Hotel;
