import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
import React, { useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md"
import { LiaChildSolid } from "react-icons/lia";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FlightAndAccommodationTab = () => {
    const [formData, setFormData] = useState({
        tripType: "oneway", 
        seatClass: "economy", 
        from: "",
        to: "",
        dates: [], 
        room: 1,
        adult: 1,
        child: 0,
    });

    const handleChangeValue = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSwap = () => {
        setFormData((prev) => ({
        ...prev,
        from: prev.to,
        to: prev.from,
        }));
    };

    const handleSearch = () => {
        console.log("Search with data:", formData);
        const { tripType, seatClass, from, to, dates, room, adult, child, airport } = formData;

        if (dates.length < 2) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const startDate = dates[0].format("YYYY-MM-DD");
        const endDate = dates[1].format("YYYY-MM-DD");
        const query = new URLSearchParams({
                        from: from.trim(),
                        to: to.trim(),
                        startDate,
                        endDate,
                        room,
                        adult,
                        child,
                        tripType,
                        seatClass,
                    }).toString();
        const url = `/search?${query}`;
        window.open(url, "_blank");
    };

    return (
        <div className="relative">
            <div className="flex gap-[12px]">
                <Select
                    defaultValue="oneway"
                    className="w-[150px] [&_.ant-select-selector]:rounded-full"
                    onChange={(value) => handleChangeValue("tripType", value)}
                >
                    <Option value="oneway">Một chiều</Option>
                    <Option value="roundtrip">Khứ hồi</Option>
                </Select>

                <Select
                    defaultValue="economy"
                    className="w-[150px] [&_.ant-select-selector]:rounded-full"
                    onChange={(value) => handleChangeValue("seatClass", value)}
                >
                    <Option value="economy">Phổ thông</Option>
                    <Option value="business">Thương gia</Option>
                    <Option value="first">Hạng nhất</Option>
                </Select>
            </div>
            <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                <div className="flex items-center">
                    <Input
                        placeholder="Tên thành phố hoặc sân bay"
                        prefix={<i className="fa fa-plane-departure" />}
                        className="rounded-l-2xl rounded-r-none border-r-0 h-[40px] text-base"
                        onChange={(e) => handleChangeValue("from", e.target.value)}
                        value={formData.from}
                    />

                    <button
                        className="z-10 -mx-2 flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow"
                        onClick={handleSwap}
                    >
                        <SwapOutlined />
                    </button>

                    <Input
                        placeholder="Tên thành phố hoặc sân bay"
                        prefix={<i className="fa fa-map-marker-alt" />}
                        className="rounded-r-2xl rounded-l-none border-l-0 h-[40px] text-base"
                        onChange={(e) => handleChangeValue("to", e.target.value)}
                        value={formData.to}
                    />
                </div>
                <div >
                    <RangePicker 
                    className="w-full h-full rounded-2xl text-base"
                    onChange={(dates) => handleChangeValue("dates", dates)}
                    value={formData.dates}
                    />
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-[12px] h-[40px]">
                <InputNumber
                    addonBefore={<span>Phòng</span>}
                    prefix={
                        <MdOutlineMeetingRoom className="text-[22px]" />
                    }
                    size="large"
                    className="w-full rounded-2xl"
                    onChange={(value) => handleChangeValue("room", value)}
                    value={formData.room}
                />
                <InputNumber
                    addonBefore={<span>Người lớn</span>}
                    prefix={<HiOutlineUsers className="text-[22px]" />}
                    size="large"
                    className="w-full rounded-2xl"
                    onChange={(value) => handleChangeValue("adult", value)}
                    value={formData.adult}
                />
                <InputNumber
                    addonBefore={<span>Trẻ em</span>}
                    prefix={<LiaChildSolid className="text-[22px]" />}
                    size="large"
                    className="w-full rounded-2xl"
                    onChange={(value) => handleChangeValue("child", value)}
                    value={formData.child}
                />
            </div>
            <div 
            className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
            onClick={handleSearch}
            >
                Tìm
            </div>
        </div>
    );
};

export default FlightAndAccommodationTab;
