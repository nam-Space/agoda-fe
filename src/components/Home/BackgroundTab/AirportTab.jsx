import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
import React, { useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline, IoLocationOutline } from "react-icons/io5";

const { RangePicker } = DatePicker;

const AirportTab = () => {
    const [option, setOption] = useState("from-airport");

    return (
        <div className="relative">
            <Radio.Group
                className="flex gap-[8px]"
                value={option}
                onChange={(e) => setOption(e.target.value)}
            >
                <Radio.Button
                    value="from-airport"
                    className="first:rounded-l-[50px] first:rounded-r-[50px]"
                >
                    Từ sân bay
                </Radio.Button>
                <Radio.Button
                    value="from-location"
                    className="last:rounded-l-[50px] last:rounded-r-[50px] before:!hidden"
                >
                    Đến sân bay
                </Radio.Button>
            </Radio.Group>
            <div>
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <Input
                        placeholder="Sân bay đón khách"
                        size="large"
                        prefix={<IoAirplaneOutline className="text-[22px]" />}
                        className="mt-[12px]"
                    />
                    <Input
                        placeholder="Địa điểm đến"
                        size="large"
                        prefix={<IoLocationOutline className="text-[22px]" />}
                        className="mt-[12px]"
                    />
                </div>
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <DatePicker
                        showTime
                        onChange={(value, dateString) => {
                            console.log("Selected Time: ", value);
                            console.log(
                                "Formatted Selected Time: ",
                                dateString
                            );
                        }}
                        onOk={(val) => {
                            console.log(val);
                        }}
                    />
                    <InputNumber
                        addonBefore={<span>Người lớn</span>}
                        prefix={<HiOutlineUsers className="text-[22px]" />}
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer">
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default AirportTab;
