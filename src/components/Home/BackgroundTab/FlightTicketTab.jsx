import { SwapOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineMeetingRoom } from "react-icons/md"
import { LiaChildSolid } from "react-icons/lia";

const { Option } = Select;
const FlightTicketTab = () => {
    const [formData, setFormData] = useState({
        tripType: "oneway",  
        seatClass: "economy", 
        from: "",
        to: "",
        date: null,           
        room: 1,
        adult: 1,
        child: 0,
    });

    const handleSwap = () => {
        setFormData((prev) => ({
            ...prev,
            from: prev.to,
            to: prev.from,
        }));
    };

    const handleChangeValue = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const onSearch = (value) => {
        console.log("search:", value);
        const { tripType, seatClass, from, to, date, room, adult, child } = formData;

        if (!from || !to || !date) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const travelDate = date.format("YYYY-MM-DD");

        const params = new URLSearchParams({
            tripType: tripType,
            seatClass: seatClass,
            from: from?.trim() || "",
            to: to?.trim() || "",
            date: travelDate,
            room,
            adult,
            child,
            });

        const url = `/search?${params.toString()}`;
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
            <div>
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
                    <DatePicker 
                    className="w-full h-[40px] rounded-2xl text-base"
                    placeholder="Ngày đi" 
                    />
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
                <div className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer">
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default FlightTicketTab;
