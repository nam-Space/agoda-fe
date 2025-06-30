import React from "react";
import FlightIncomingTab from "./FlightTab/FlightIncomingTab";
import FlightSuccessfulTab from "./FlightTab/FlightSuccessfulTab";
import FlightCancelledTab from "./FlightTab/FlightCancelledTab";
import { Tabs } from "antd";

const Flight = () => {
    const items = [
        {
            key: "1",
            label: <p className="font-semibold">Sắp tới</p>,
            children: <FlightIncomingTab />,
        },
        {
            key: "2",
            label: <p className="font-semibold">Hoàn tất</p>,
            children: <FlightSuccessfulTab />,
        },
        {
            key: "3",
            label: <p className="font-semibold">Đã hủy</p>,
            children: <FlightCancelledTab />,
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

export default Flight;
