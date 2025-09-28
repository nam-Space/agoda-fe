import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Radio, Select } from "antd";
import React, { useState } from "react";
import { IoAirplaneOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const ActivityTab = () => {
    const navigate = useNavigate();
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
            <Input
                placeholder="Tìm kiếm"
                size="large"
                prefix={<SearchOutlined />}
                className="mt-[12px]"
            />
            <div
                onClick={() => navigate("/activity")}
                className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
            >
                Tìm
            </div>
        </div>
    );
};

export default ActivityTab;
