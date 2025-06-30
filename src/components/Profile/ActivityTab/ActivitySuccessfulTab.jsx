import { Empty, Input, Select } from "antd";
import { planForTrips } from "constants/profile";
import React from "react";
import { FaSort } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ActivitySuccessfulTab = () => {
    const sortOptions = [
        {
            value: "check-in",
            label: (
                <div className="flex items-center gap-[4px]">
                    <FaSort />
                    Sắp xếp theo: Ngày nhận phòng
                </div>
            ),
        },
        {
            value: "reservation",
            label: (
                <div className="flex items-center gap-[4px]">
                    <FaSort />
                    Sắp xếp theo: Ngày đặt phòng
                </div>
            ),
        },
    ];

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    return (
        <div>
            <div className="p-[16px] bg-white rounded-b-[16px]">
                <h1 className="text-[22px] font-bold">Chuyến đi hoàn thành</h1>
                <div className="mt-[8px] flex justify-between items-center">
                    <Select
                        defaultValue={sortOptions[0].value}
                        style={{ width: 300 }}
                        onChange={handleChange}
                        options={sortOptions}
                    />
                    <Input.Search
                        placeholder="Tìm kiếm theo mã đặt phòng"
                        style={{
                            width: 260,
                        }}
                    />
                </div>
                <Empty
                    description="Chưa có chuyến đi hoàn thành"
                    className="bg-[#abb6cb1f] mx-0 mt-[12px] py-[24px] rounded-[16px]"
                />
            </div>
            <div className="mt-[8px] p-[16px] bg-white rounded-[16px]">
                <h1 className="text-[22px] font-bold">
                    Bắt đầu lên kế hoạch cho chuyến đi tiếp theo?
                </h1>
                <div className="grid grid-cols-8 mt-[12px] gap-[8px]">
                    {planForTrips.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            style={{
                                background:
                                    "linear-gradient(0deg, rgba(227, 237, 255, 0) 0%, rgb(227, 237, 255) 100%)",
                            }}
                            className="rounded-[16px] p-[12px] border-[1px] border-[#5e6b8252] hover:shadow-[rgba(4,7,10,0.24)_0px_4px_10px_0px] transition-all duration-200"
                        >
                            {item.icon}
                            <p className="mt-[16px] leading-[18px] font-semibold">
                                {item.text}
                            </p>
                            <p className="leading-[18px] font-semibold">
                                {item.subtext}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivitySuccessfulTab;
