import { Button, Card, Empty, Input, Pagination, Select, Spin } from "antd";
import { planForTrips } from "constants/profile";
import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { callFetchPayment } from "config/api";
import { ServiceType } from "constants/serviceType";
import { PAYMENT_STATUS } from "constants/serviceType";
import { MessageOutlined } from "@ant-design/icons";
import { getImage } from "utils/imageUrl";
import dayjs from "dayjs";
import ModalFlightDetail from "./ModalFlightDetail";
import { ServiceTab } from "constants/profile";
import { formatCurrency } from "utils/formatCurrency";
import { callRebook } from "config/api";
import { toast } from "react-toastify";

const FlightCancelledTab = ({ currentTab, setCurrentTab }) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.account.user);
    const [selectedFlight, setSelectedFlight] = useState({});
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [meta, setMeta] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
    });

    const [sortVal, setSortVal] = useState("sort=created_at-asc");
    const [bookingCode, setBookingCode] = useState("");

    const handleRebook = async (oldBookingId) => {
        try {
            const res = await callRebook(oldBookingId);
            if (res.isSuccess) {
                navigate(
                    `/book?booking_id=${res.new_booking_id}&type=${ServiceType.FLIGHT}`
                );
            }
        } catch (error) {
            toast.error("Đặt lại thất bại: " + error.message);
        }
    };

    const sortOptions = [
        {
            value: "sort=created_at-asc",
            label: (
                <div className="flex items-center gap-[4px]">
                    <FaSort />
                    Sắp xếp theo: Ngày đặt vé
                </div>
            ),
        },
    ];

    const handleChange = (value) => {
        setSortVal(value);
    };

    const handleGetPayments = async (query) => {
        setIsLoading(true);
        const res = await callFetchPayment(query);
        if (res.isSuccess) {
            setPayments(res.data);
            setMeta(res.meta);
        }
        setIsLoading(false);
    };

    const onChangePagination = (pageNumber, pageSize) => {
        setMeta({
            ...meta,
            currentPage: pageNumber,
            itemsPerPage: pageSize,
        });
    };

    useEffect(() => {
        if (user?.id && currentTab === ServiceTab.CANCELLED) {
            handleGetPayments(
                `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&booking__user_id=${user.id}&booking__service_type=${ServiceType.FLIGHT}&status=${PAYMENT_STATUS.REFUNDED}&${sortVal}&booking__booking_code=${bookingCode}`
            );
        }
    }, [
        user,
        sortVal,
        bookingCode,
        meta.currentPage,
        meta.itemsPerPage,
        currentTab,
    ]);

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
                        value={sortVal}
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
                {isLoading ? (
                    <div className="flex justify-center items-center h-[200px]">
                        <Spin size="large" />
                    </div>
                ) : payments.length === 0 ? (
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
                                    <div className="flex flex-col items-end">
                                        <span className="text-blue-600 font-medium">
                                            Đã hủy
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {payment?.booking?.discount_amount >
                                                0 && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(
                                                        payment?.booking
                                                            ?.total_price
                                                    )}{" "}
                                                    ₫
                                                </p>
                                            )}

                                            <div className="flex items-center">
                                                <span className="text-red-600 font-semibold text-[22px] w-max">
                                                    {formatCurrency(
                                                        Math.max(
                                                            payment?.booking
                                                                ?.final_price,
                                                            0
                                                        )
                                                    )}{" "}
                                                    ₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                {payment?.booking?.flight_detail?.map(
                                    (flight_detail) => {
                                        const flightLegsSorted = flight_detail
                                            ?.flight?.legs?.length
                                            ? [
                                                  ...flight_detail?.flight.legs,
                                              ].sort(
                                                  (a, b) =>
                                                      new Date(
                                                          a.departure_time
                                                      ).getTime() -
                                                      new Date(
                                                          b.departure_time
                                                      ).getTime() // giảm dần
                                              )
                                            : [];

                                        const firstLeg = flightLegsSorted[0];
                                        const lastLeg =
                                            flightLegsSorted[
                                                flightLegsSorted.length - 1
                                            ];

                                        return (
                                            <div
                                                onClick={() => {
                                                    setSelectedFlight(
                                                        flight_detail.flight
                                                    );
                                                    setIsModalDetailOpen(true);
                                                }}
                                                className="cursor-pointer px-6 py-6 flex gap-6 hover:bg-gray-100 transition-all duration-150"
                                            >
                                                {/* Info */}
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={getImage(
                                                                flight_detail
                                                                    ?.flight
                                                                    ?.airline
                                                                    ?.logo
                                                            )}
                                                            alt={
                                                                flight_detail
                                                                    ?.flight
                                                                    ?.airline
                                                                    ?.name
                                                            }
                                                            className="w-12 object-cover rounded-lg"
                                                        />
                                                        <h3 className="text-lg text-gray-900">
                                                            <span className="font-bold">
                                                                {
                                                                    flight_detail
                                                                        ?.flight
                                                                        ?.airline
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    <div>
                                                        Chuyến bay từ:{" "}
                                                        <strong>
                                                            {
                                                                firstLeg
                                                                    ?.departure_airport
                                                                    ?.name
                                                            }
                                                        </strong>{" "}
                                                        <strong>→</strong>{" "}
                                                        <strong>
                                                            {
                                                                lastLeg
                                                                    ?.arrival_airport
                                                                    ?.name
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div className="flex gap-8 mt-[6px]">
                                                        <div>
                                                            <p className="text-gray-600 text-sm mb-1">
                                                                Thời gian cất
                                                                cánh
                                                            </p>
                                                            <p className="font-semibold text-gray-900">
                                                                {dayjs(
                                                                    firstLeg.departure_time
                                                                ).format(
                                                                    "YYYY-MM-DD HH:mm:ss"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600 text-sm mb-1">
                                                                Thời gian hạ
                                                                cánh
                                                            </p>
                                                            <p className="font-semibold text-gray-900">
                                                                {dayjs(
                                                                    lastLeg.arrival_time
                                                                ).format(
                                                                    "YYYY-MM-DD HH:mm:ss"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                                {/* Action Buttons */}
                                <div className="px-6 py-4 flex gap-4 justify-end border-t">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="px-8"
                                        onClick={() =>
                                            handleRebook(payment.booking.id)
                                        }
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
                                current={meta.currentPage}
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
            <ModalFlightDetail
                flight={selectedFlight}
                isModalOpen={isModalDetailOpen}
                setIsModalOpen={setIsModalDetailOpen}
            />
        </div>
    );
};

export default FlightCancelledTab;
