import { Button, Card, Empty, Input, Pagination, Select } from "antd";
import { planForTrips } from "constants/profile";
import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { callFetchPayment } from "config/api";
import { ServiceType } from "constants/serviceType";
import dayjs from "dayjs";
import { PAYMENT_STATUS } from "constants/serviceType";
import { MessageOutlined } from "@ant-design/icons";
import { getImage } from "utils/imageUrl";

const HotelCancelledTab = () => {
    const user = useAppSelector((state) => state.account.user);
    const [payments, setPayments] = useState([]);
    const [meta, setMeta] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
    });

    const [sortVal, setSortVal] = useState(
        "sort=booking__hotel_detail__check_in-asc"
    );
    const [bookingCode, setBookingCode] = useState("");

    const sortOptions = [
        {
            value: "sort=created_at-asc",
            label: (
                <div className="flex items-center gap-[4px]">
                    <FaSort />
                    Sắp xếp theo: Ngày đặt phòng
                </div>
            ),
        },
        {
            value: "sort=booking__hotel_detail__check_in-asc",
            label: (
                <div className="flex items-center gap-[4px]">
                    <FaSort />
                    Sắp xếp theo: Ngày nhận phòng
                </div>
            ),
        },
    ];

    const handleChange = (value) => {
        setSortVal(value);
    };

    const handleGetPayments = async (query) => {
        const res = await callFetchPayment(query);
        if (res.isSuccess) {
            setPayments(res.data);
            setMeta(res.meta);
        }
    };

    const onChangePagination = (pageNumber, pageSize) => {
        setMeta({
            ...meta,
            currentPage: pageNumber,
            itemsPerPage: pageSize,
        });
    };

    useEffect(() => {
        if (user?.id) {
            handleGetPayments(
                `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&booking__user_id=${user.id}&booking__service_type=${ServiceType.HOTEL}&status=${PAYMENT_STATUS.CANCELLED}&${sortVal}&booking__booking_code=${bookingCode}`
            );
        }
    }, [user, sortVal, bookingCode, meta.currentPage, meta.itemsPerPage]);

    return (
        <div>
            <div className="p-[16px] bg-white rounded-b-[16px]">
                <h1 className="text-[22px] font-bold">Chuyến đi đã hủy</h1>
                <div className="mt-[8px] flex justify-between items-center">
                    <Select
                        defaultValue={sortOptions[0].value}
                        style={{ width: 300 }}
                        onChange={handleChange}
                        options={sortOptions}
                    />
                    <Input.Search
                        placeholder="Tìm kiếm theo mã đặt phòng"
                        onChange={(e) => setBookingCode(e.target.value)}
                        value={bookingCode}
                        style={{
                            width: 260,
                        }}
                    />
                </div>

                {payments.length === 0 ? (
                    <Empty
                        description="Chưa có chuyến đi đã hủy"
                        className="bg-[#abb6cb1f] mx-0 mt-[12px] py-[24px] rounded-[16px]"
                    />
                ) : (
                    <div className="space-y-6 mt-[12px]">
                        {payments.map((payment) => (
                            <Card
                                key={payment.id}
                                className="overflow-hidden"
                                bodyStyle={{ padding: 0 }}
                            >
                                {/* Header */}
                                <div className="bg-blue-50 px-6 py-4 border-b flex items-center gap-3">
                                    <MessageOutlined className="text-blue-600 text-xl" />
                                    <span className="text-blue-600 font-medium">
                                        Liên hệ với Dịch vụ Khách hàng Agoda
                                    </span>
                                </div>

                                {/* Booking ID */}
                                <div className="px-6 py-4 border-b flex justify-between items-center">
                                    <span className="font-semibold">
                                        Mã: {payment.booking.booking_code}
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                        Đã hủy
                                    </span>
                                </div>

                                {/* Booking Details */}
                                <div className="px-6 py-6 flex gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={getImage(
                                                payment?.booking
                                                    ?.room_details?.[0]?.room
                                                    ?.images?.[0]?.image
                                            )}
                                            alt={
                                                payment?.booking
                                                    ?.room_details?.[0]?.room
                                                    ?.room_type
                                            }
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                                            {
                                                payment?.booking
                                                    ?.room_details?.[0]?.room
                                                    ?.hotel?.name
                                            }{" "}
                                            -{" "}
                                            {
                                                payment?.booking
                                                    ?.room_details?.[0]?.room
                                                    ?.room_type
                                            }
                                        </h3>

                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    Nhận phòng
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {dayjs(
                                                        payment?.booking
                                                            ?.room_details?.[0]
                                                            ?.check_in
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    Trả phòng
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {dayjs(
                                                        payment?.booking
                                                            ?.room_details?.[0]
                                                            ?.check_out
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="px-6 py-4 flex gap-4 justify-end border-t">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="px-8"
                                    >
                                        Đặt lại
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        <div className="flex justify-end w-full">
                            <Pagination
                                pageSize={meta.itemsPerPage}
                                showQuickJumper
                                total={meta.totalItems}
                                onChange={onChangePagination}
                            />
                        </div>
                    </div>
                )}
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

export default HotelCancelledTab;
