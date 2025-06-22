import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Radio, Select } from "antd";
import React, { useState } from "react";
import { IoAirplaneOutline } from "react-icons/io5";

const { RangePicker } = DatePicker;

const AirportTab = () => {
    const [option, setOption] = useState("night");
    const [additionFlight, setAdditionFlight] = useState(false);

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log("search:", value);
    };

    return (
        <div className="relative">
            {additionFlight ? (
                <p className="font-bold">Chuyến bay</p>
            ) : (
                <Radio.Group
                    className="flex gap-[8px]"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                >
                    <Radio.Button
                        value="night"
                        className="first:rounded-l-[50px] first:rounded-r-[50px]"
                    >
                        Chỗ ở qua đêm
                    </Radio.Button>
                    <Radio.Button
                        value="day"
                        className="last:rounded-l-[50px] last:rounded-r-[50px] before:!hidden"
                    >
                        Chỗ ở trong ngày
                    </Radio.Button>
                </Radio.Group>
            )}
            <div>
                <Input
                    placeholder="Tìm kiếm"
                    size="large"
                    prefix={<SearchOutlined />}
                    className="mt-[12px]"
                />
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <RangePicker />
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        options={[
                            {
                                value: "jack",
                                label: "Jack",
                            },
                            {
                                value: "lucy",
                                label: "Lucy",
                            },
                            {
                                value: "tom",
                                label: "Tom",
                            },
                        ]}
                    />
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
                <div className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer">
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default AirportTab;
