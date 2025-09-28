import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
import React, { useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { LiaChildSolid } from "react-icons/lia";
const { RangePicker } = DatePicker;

const HomestayTab = () => {
    const [additionFlight, setAdditionFlight] = useState(false);
    const [formData, setFormData] = useState({
        option: "night",
        search: "",
        dates: [], 
        room: 1,
        adult: 1,
        child: 0,
        airport: "",
    });
    const handleChangeValue = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const onSearch = (formValue) => {
        console.log("search:", formValue);
        const { option, search, dates, room, adult, child, airport } = formData;

        if (!search || dates.length < 2) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const startDate = dates[0].format("YYYY-MM-DD");
        const endDate = dates[1].format("YYYY-MM-DD");
        const params = new URLSearchParams({
            searchValue: search.trim(),
            startDate,
            endDate,
            room,
            adult,
            child,
            airport: airport.trim(),
            option,
        });

        const url = `/search?${params.toString()}`;
        window.open(url, "_blank");
    };
    return (
        <div className="relative">
            {additionFlight && (
                <p className="font-bold">Khách sạn</p>
            )}
            <div>
                <Input
                    placeholder="Tìm kiếm"
                    size="large"
                    prefix={<SearchOutlined />}
                    className="mt-[12px]"
                    onChange={(e) => handleChangeValue("search", e.target.value)}
                    value={formData.search}
                />
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <RangePicker
                        onChange={(dates) => handleChangeValue("dates", dates)}
                    />
                    <div className="grid grid-cols-3 gap-[12px]">
                        <InputNumber
                            addonBefore={<span>Phòng</span>}
                            prefix={
                                <MdOutlineMeetingRoom className="text-[22px]" />
                            }
                            style={{ width: "100%" }}
                            value={formData.room}
                            onChange={(value) => handleChangeValue("room", value)}
                        />
                        <InputNumber
                            addonBefore={<span>Người lớn</span>}
                            prefix={<HiOutlineUsers className="text-[22px]" />}
                            style={{ width: "100%" }}
                            value={formData.adult}
                            onChange={(value) => handleChangeValue("adult", value)}
                        />
                        <InputNumber
                            addonBefore={<span>Trẻ em</span>}
                            prefix={<LiaChildSolid className="text-[22px]" />}
                            style={{ width: "100%" }}
                            value={formData.child}
                            onChange={(value) => handleChangeValue("child", value)}
                        />
                    </div>
                </div>
                <div>
                    {additionFlight ? (
                        <div>
                            <div className="flex items-center gap-[16px]">
                                <p className="font-bold">Chuyến bay</p>
                                <div
                                    onClick={() => setAdditionFlight(false)}
                                    className="w-fit gap-[3px] text-[#2067da] font-semibold relative h-[36px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                                >
                                    Loại bỏ
                                </div>
                            </div>
                            <Input
                                placeholder="Tên thành phố hoặc sân bay"
                                size="large"
                                prefix={
                                    <IoAirplaneOutline className="text-[20px]" />
                                }
                                className="mt-[12px]"
                                value={formData.airport}
                                onChange={(e) => handleChangeValue("airport", e.target.value)}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() => setAdditionFlight(true)}
                            className="mt-[24px] w-fit gap-[3px] text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                        >
                            <PlusOutlined className="text-[20px]" /> Bổ sung
                            chuyến bay
                        </div>
                    )}
                </div>
                <div
                    className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
                    onClick={() => onSearch(formData)}
                >
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default HomestayTab;
