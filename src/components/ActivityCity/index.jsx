import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, Collapse, Input, Radio, Slider, Tabs, Tag } from "antd";
import React, { useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaCar, FaStar } from "react-icons/fa";
import { FaTent } from "react-icons/fa6";
import { ImSpoonKnife } from "react-icons/im";
import { IoIosStar, IoMdMusicalNote } from "react-icons/io";
import { MdTour, MdWindow } from "react-icons/md";
import { PiListChecksFill } from "react-icons/pi";

const ActivityCity = () => {
    const [selectedItem, setSelectedItem] = useState(0);

    const [value, setValue] = useState(1);
    const [valuePrices, setValuePrices] = useState([0, 100]);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const items = [
        {
            key: "1",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(0)}
                >
                    <MdWindow className="text-[20px]" />
                    Tất cả
                    {selectedItem === 0 && (
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
        },
        {
            key: "2",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(1)}
                >
                    <MdTour className="text-[20px]" />
                    Chuyến tham quan
                    {selectedItem === 1 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    bbb
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(2)}
                >
                    <IoMdMusicalNote className="text-[20px]" />
                    Trải nghiệm
                    {selectedItem === 2 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    ccc
                </div>
            ),
        },
        {
            key: "4",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(3)}
                >
                    <FaCar className="text-[20px]" />
                    Di chuyển
                    {selectedItem === 3 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    ddd
                </div>
            ),
        },
        {
            key: "5",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(4)}
                >
                    <ImSpoonKnife className="text-[20px]" />
                    Ẩm thực
                    {selectedItem === 4 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    eee
                </div>
            ),
        },
        {
            key: "6",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(5)}
                >
                    <FaTent className="text-[20px]" />
                    Điểm tham quan
                    {selectedItem === 5 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    fff
                </div>
            ),
        },
        {
            key: "7",
            label: (
                <div
                    className="relative flex items-center gap-[8px] cursor-pointer"
                    onClick={() => setSelectedItem(6)}
                >
                    <PiListChecksFill className="text-[20px]" />
                    Hành trang du lịch
                    {selectedItem === 6 && (
                        <div className="bg-[#2067da] absolute left-0 right-0 bottom-0 h-[2px]"></div>
                    )}
                </div>
            ),
            children: (
                <div>
                    <Checkbox onChange={(val) => console.log(val)}>
                        Checkbox
                    </Checkbox>
                    ggg
                </div>
            ),
        },
    ];

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

    return (
        <div>
            <div className="sticky top-0 z-[5] bg-white">
                <div className="flex justify-center py-[8px] border-b-[1px] border-t-[1px] border-[#5e6b8252]">
                    <Input
                        placeholder="Tìm kiếm"
                        size="large"
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
                            {new Array(30).fill(0).map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-[16px] overflow-hidden border-[1px] border-[#d5d9e2] hover:shadow-[rgba(4,7,10,0.24)_0px_4px_10px_0px] transition-all duration-200"
                                >
                                    <img
                                        src="https://q-xx.bstatic.com/xdata/images/xphoto/2500x1600/227832255.jpg?k=386d20ee8736141176d14c1754c924ae102b3b1ce9a6059115f388f1038f2ef8&o="
                                        className="w-full h-[170px] object-cover"
                                    />
                                    <div className="pt-[12px] px-[16px] pb-[16px]">
                                        <p className="font-semibold text-[20px] leading-[24px] line-clamp-2">
                                            Vé Tropicana Park Hồ Tràm
                                        </p>
                                        <div className="flex items-center gap-[4px]">
                                            <IoIosStar className="text-[#b54c01] text-[12px]" />
                                            <p className="font-semibold">5</p>
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
                                                Giảm 5%
                                            </Tag>
                                        </div>
                                        <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                            <p className="text-[13px] text-end line-through">
                                                678.497 ₫
                                            </p>
                                            <div className="flex items-center justify-end gap-[8px]">
                                                <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                    540.762
                                                </p>
                                                <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                    ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-[16px] flex items-center justify-between">
                            <div className="opacity-0 w-fit bg-white text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                                Tiếp theo
                            </div>
                            <p>Trang 1 trên 29</p>
                            <div className="w-fit bg-white text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                                Tiếp theo
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCity;
