import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, Collapse, Input, Radio, Slider, Tag } from "antd";
import { callFetchActivity } from "config/api";
import React, { useEffect, useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaCar, FaStar } from "react-icons/fa";
import { FaTent } from "react-icons/fa6";
import { ImSpoonKnife } from "react-icons/im";
import { IoIosStar, IoMdMusicalNote } from "react-icons/io";
import { MdTour, MdWindow } from "react-icons/md";
import { PiListChecksFill } from "react-icons/pi";
import {
    Link,
    useLocation,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";

const ActivityCity = () => {
    const { state } = useLocation();
    const { cityId } = useParams();
    const [keyword, setKeyword] = useState(state?.keyword || "");
    const [searchParams, setSearchParams] = useSearchParams();
    const [activities, setActivities] = useState([]);
    const [pageQuery, setPageQuery] = useState({
        current: Number(searchParams.get("current")) || 1,
        pageSize: 30,
    });
    const [meta, setMeta] = useState({
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 0,
        totalPages: 0,
    });

    const [selectedItem, setSelectedItem] = useState(
        searchParams.get("category") || "all"
    );

    const [value, setValue] = useState(1);
    const [valuePrices, setValuePrices] = useState([0, 100]);

    const handleGetActivities = async (query) => {
        const res = await callFetchActivity(query);
        if (res.isSuccess) {
            setActivities(res.data);
            setMeta(res.meta);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cityId) {
            let query = `current=${pageQuery.current}&pageSize=${pageQuery.pageSize}&city_id=${cityId}`;
            if (selectedItem !== "all") {
                query += `&category=${selectedItem}`;
            }
            if (keyword) {
                query += `&name=${keyword}`;
            }
            handleGetActivities(query);
        }
    }, [cityId, pageQuery, selectedItem, keyword]);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const categories = [
        {
            value: "all",
            label: "Tất cả",
            icon: <MdWindow className="text-[20px]" />,
        },
        {
            value: "journey",
            label: "Chuyến tham quan",
            icon: <MdTour className="text-[20px]" />,
        },
        {
            value: "moving",
            label: "Di chuyển",
            icon: <FaCar className="text-[20px]" />,
        },
        {
            value: "experience",
            label: "Trải nghiệm",
            icon: <IoMdMusicalNote className="text-[20px]" />,
        },
        {
            value: "food",
            label: "Ẩm thực",
            icon: <ImSpoonKnife className="text-[20px]" />,
        },
        {
            value: "tourist_attractions",
            label: "Điểm tham quan",
            icon: <FaTent className="text-[20px]" />,
        },
        {
            value: "travel_preparation",
            label: "Hành trang du lịch",
            icon: <PiListChecksFill className="text-[20px]" />,
        },
    ];

    const items = categories.map((category) => {
        return {
            key: category.value,
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => {
                        setSelectedItem(category.value);
                        setSearchParams({
                            ...searchParams,
                            category: category.value,
                        });
                    }}
                >
                    {category.icon}
                    {category.label}
                    {selectedItem === category.value && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    aaa
                </div>
            ),
        };
    });

    const itemTypes = [
        {
            key: "1",
            label: (
                <p className="text-[20px] font-semibold leading-[24px]">
                    Danh mục
                </p>
            ),
            children: (
                <Radio.Group
                    className="flex flex-col gap-[12px] mt-[16px]"
                    onChange={onChange}
                    value={value}
                    options={[
                        {
                            value: 1,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Tất cả
                                </p>
                            ),
                        },
                        {
                            value: 2,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Chuyến tham quan
                                </p>
                            ),
                        },
                        {
                            value: 3,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Trải nghiệm
                                </p>
                            ),
                        },
                        {
                            value: 4,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Di chuyển
                                </p>
                            ),
                        },
                        {
                            value: 5,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Đồ ăn & Thức uống
                                </p>
                            ),
                        },
                        {
                            value: 6,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Điểm tham quan
                                </p>
                            ),
                        },
                        {
                            value: 7,
                            label: (
                                <p className="text-[16px] leading-[20px]">
                                    Hành trang du lịch
                                </p>
                            ),
                        },
                    ]}
                />
            ),
        },
    ];

    const onChangeItemTypes = (key) => {
        console.log(key);
    };

    const handleNextPage = () => {
        const nextPage = pageQuery.current + 1;
        setPageQuery((prev) => ({ ...prev, current: nextPage }));

        // update url
        setSearchParams({
            current: nextPage,
            category: selectedItem,
        });
    };

    const handlePrevPage = () => {
        const prevPage = pageQuery.current - 1;
        setPageQuery((prev) => ({ ...prev, current: prevPage }));

        setSearchParams({
            current: prevPage,
            category: selectedItem,
        });
    };

    return (
        <div>
            <div className="sticky top-0 z-[5] bg-white">
                <div className="flex justify-center py-[8px] border-b-[1px] border-t-[1px] border-[#5e6b8252]">
                    <Input
                        placeholder="Tìm kiếm"
                        size="large"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        prefix={<SearchOutlined />}
                        className="rounded-[40px] w-[744px] bg-[#edf0f9]"
                    />
                </div>
                <div className="flex justify-center shadow-[0px_1px_3px_0px_rgba(4,7,10,0.16)]">
                    <div className="flex justify-center gap-[32px] h-[44px]">
                        {items.map((item, index) => {
                            return item.label;
                        })}
                    </div>
                </div>
            </div>
            <div className="bg-[#eff4fc] pt-[12px] pb-[48px] px-[8px]">
                <div className="grid grid-cols-6 gap-[12px] max-w-[1600px] mx-auto">
                    <div className="col-start-1 col-span-1 p-[16px] bg-white border-[1px] border-[#5e6b8252] rounded-[16px]">
                        <div>
                            <p className="text-[20px] font-semibold">Sắp xếp</p>
                            <Radio.Group
                                className="flex flex-col gap-[12px] mt-[16px]"
                                onChange={onChange}
                                value={value}
                                options={[
                                    {
                                        value: 1,
                                        label: (
                                            <p className="text-[16px] leading-[20px]">
                                                Được ưa chuộng
                                            </p>
                                        ),
                                    },
                                    {
                                        value: 2,
                                        label: (
                                            <p className="text-[16px] leading-[20px]">
                                                Giá thấp nhất trước
                                            </p>
                                        ),
                                    },
                                    {
                                        value: 3,
                                        label: (
                                            <p className="text-[16px] leading-[20px]">
                                                Xếp hạng cao nhất trước
                                            </p>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                        <div className="mt-[24px]">
                            <p className="text-[20px] font-semibold">Giá</p>
                            <div className="mt-[10px] flex items-center justify-between">
                                <p>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(160000 * valuePrices[0])}
                                </p>
                                <p>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(160000 * valuePrices[1])}
                                </p>
                            </div>
                            <Slider
                                className="mt-[12px]"
                                range
                                tooltip={{
                                    placement: "bottom",
                                }}
                                value={valuePrices}
                                onChange={setValuePrices}
                            />
                        </div>
                        <div className="mt-[24px]">
                            <p className="text-[20px] font-semibold">
                                Đánh giá sao
                            </p>
                            <div className="mt-[16px]">
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px]">
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px]">
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px]">
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px]">
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px]">
                                            <FaStar className="text-[#b54c01] text-[14px]" />
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            Không có đánh giá
                                        </div>
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <p className="text-[20px] font-semibold leading-[24px]">
                                Đặc điểm của đơn đặt chỗ
                            </p>
                            <div className="mt-[16px]">
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            Hủy miễn phí
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            Xác nhận ngay lập tức
                                        </div>
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <p className="text-[20px] font-semibold leading-[24px]">
                                Thời gian
                            </p>
                            <div className="mt-[16px]">
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            Tối đa 1 tiếng
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            1-4 tiếng
                                        </div>
                                    </Checkbox>
                                </div>
                                <div>
                                    <Checkbox
                                        onChange={(val) => console.log(val)}
                                    >
                                        <div className="flex items-center gap-[2px] text-[16px]">
                                            Hơn 4 tiếng
                                        </div>
                                    </Checkbox>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <Collapse
                                className="bg-white"
                                bordered={false}
                                items={itemTypes}
                                defaultActiveKey={["1"]}
                                onChange={onChangeItemTypes}
                            />
                        </div>
                    </div>
                    <div className="col-start-2 col-end-7">
                        <div className="grid grid-cols-4 gap-[12px]">
                            {activities.map((item, index) => (
                                <Link
                                    to={`/activity/detail/${item.id}`}
                                    key={index}
                                    className="bg-white rounded-[16px] overflow-hidden border-[1px] border-[#d5d9e2] hover:shadow-[rgba(4,7,10,0.24)_0px_4px_10px_0px] transition-all duration-200"
                                >
                                    <img
                                        src={`${process.env.REACT_APP_BE_URL}/${item.images[0].image}`}
                                        className="w-full h-[170px] object-cover"
                                    />
                                    <div className="pt-[12px] px-[16px] pb-[16px]">
                                        <p className="font-semibold text-[20px] leading-[24px] line-clamp-2">
                                            {item.name}
                                        </p>
                                        <div className="flex items-center gap-[4px]">
                                            <IoIosStar className="text-[#b54c01] text-[12px]" />
                                            <p className="font-semibold">
                                                {item.avg_star}
                                            </p>
                                            <p className="text-[13px] text-[#5e6b82]">
                                                (49)
                                            </p>
                                            <p className="text-[#5e6b82]">•</p>
                                            <p className="text-[13px] text-[#5e6b82]">
                                                298 người đã đặt
                                            </p>
                                        </div>
                                        <div className="flex items-center mt-[4px]">
                                            <Tag
                                                color="blue"
                                                className="p-[4px]"
                                            >
                                                <BsLightningChargeFill className="text-[14px]" />
                                            </Tag>
                                            <Tag
                                                color="blue"
                                                className="p-[4px] text-[13px] leading-[14px]"
                                            >
                                                Hủy miễn phí
                                            </Tag>
                                        </div>
                                        <div className="flex justify-end mt-[52px]">
                                            <Tag
                                                color="#c53829"
                                                className="p-[4px] text-[13px] leading-[14px] mr-0"
                                            >
                                                Giảm 0%
                                            </Tag>
                                        </div>
                                        <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                            <p className="text-[13px] text-end line-through">
                                                {formatCurrency(item.avg_price)}{" "}
                                                ₫
                                            </p>
                                            <div className="flex items-center justify-end gap-[8px]">
                                                <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                    {formatCurrency(
                                                        item.avg_price
                                                    )}
                                                </p>
                                                <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                    ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-[16px] flex items-center justify-between">
                            {meta.currentPage > 1 ? (
                                <div
                                    onClick={handlePrevPage}
                                    className="w-fit bg-white text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                                >
                                    Quay lại
                                </div>
                            ) : (
                                <div></div>
                            )}

                            <p>
                                Trang {meta.currentPage} trên {meta.totalPages}
                            </p>
                            {meta.currentPage < meta.totalPages ? (
                                <div
                                    onClick={handleNextPage}
                                    className="w-fit bg-white text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                                >
                                    Tiếp theo
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCity;
