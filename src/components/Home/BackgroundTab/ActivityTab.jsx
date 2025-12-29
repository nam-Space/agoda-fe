import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, Popover, Spin } from "antd";
import { callFetchActivity } from "config/api";
import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ActivityTab = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(-1);
    const [popoverSearch, setPopoverSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);

    const handleGetActivities = async (query) => {
        setLoading(true);
        const res = await callFetchActivity(query);
        if (res.isSuccess) {
            setActivities(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!popoverSearch) return;
        setLoading(true);
        const timeoutId = setTimeout(() => {
            handleGetActivities(`current=1&pageSize=10&name=${keyword}`);
        }, 500); // debounce 500ms
        return () => clearTimeout(timeoutId);
    }, [keyword]);

    const handleSearch = () => {
        if (selectedCityId == -1) {
            toast.error("Vui lòng chọn hoạt động", {
                position: "bottom-right",
            });
            return;
        }
        navigate(`/activity/city/${selectedCityId}`, {
            state: {
                keyword,
            },
        });
    };

    return (
        <div className="relative">
            <Popover
                content={
                    <div>
                        {loading ? (
                            <div className="flex justify-center items-center py-[20px]">
                                <Spin size="large" />
                            </div>
                        ) : activities.length === 0 ? (
                            <Empty
                                description="Chưa có thông tin"
                                className="bg-[#abb6cb1f] mx-0 px-[90px] py-[24px] rounded-[16px] mt-[24px] w-full"
                            />
                        ) : (
                            activities.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "8px",
                                        borderBottom: "1px solid #eee",
                                        cursor: "pointer",
                                    }}
                                    className="flex gap-[6px] items-center"
                                    onClick={() => {
                                        setKeyword(item.name);
                                        setSelectedCityId(item.city.id);
                                        setPopoverSearch(false);
                                    }}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_BE_URL}${item.images[0].image}`}
                                        alt={item.name}
                                        className="w-[70px] h-[50px] object-cover"
                                    />
                                    <div>
                                        <p>{item.name}</p>
                                        <div className="flex items-center gap-[3px] text-[#5e6b82] text-[14px]">
                                            <FaLocationDot className="text-[14px]" />
                                            {item.city.name}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                }
                title="Hoạt động"
                trigger="click"
                open={popoverSearch}
                onOpenChange={(val) => setPopoverSearch(val)}
                placement="bottomLeft"
            >
                <Input
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setPopoverSearch(!!e.target.value);
                    }}
                    placeholder="Tìm kiếm hoạt động"
                    size="large"
                    prefix={<SearchOutlined />}
                    className="mt-[12px]"
                />
            </Popover>
            <div
                onClick={handleSearch}
                className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
            >
                Tìm
            </div>
        </div>
    );
};

export default ActivityTab;
