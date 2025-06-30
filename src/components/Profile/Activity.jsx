import React from "react";
import ActivityIncomingTab from "./ActivityTab/ActivityIncomingTab";
import ActivitySuccessfulTab from "./ActivityTab/ActivitySuccessfulTab";
import ActivityCancelledTab from "./ActivityTab/ActivityCancelledTab";
import { Tabs } from "antd";

const Activity = () => {
    const items = [
        {
            key: "1",
            label: <p className="font-semibold">Sắp tới</p>,
            children: <ActivityIncomingTab />,
        },
        {
            key: "2",
            label: <p className="font-semibold">Hoàn tất</p>,
            children: <ActivitySuccessfulTab />,
        },
        {
            key: "3",
            label: <p className="font-semibold">Đã hủy</p>,
            children: <ActivityCancelledTab />,
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

export default Activity;
