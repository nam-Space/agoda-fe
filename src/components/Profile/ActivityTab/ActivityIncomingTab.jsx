import { Button, Card, Empty } from "antd";
import { planForTrips } from "constants/profile";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { callFetchPayment } from "config/api";
import { ServiceType } from "constants/serviceType";
import dayjs from "dayjs";
import { PAYMENT_STATUS } from "constants/serviceType";
import { MessageOutlined } from "@ant-design/icons";
import { getImage } from "utils/imageUrl";

const ActivityIncomingTab = () => {
    const user = useAppSelector((state) => state.account.user);
    const [payments, setPayments] = useState([]);

    const handleGetPayments = async (query) => {
        const res = await callFetchPayment(query);
        if (res.isSuccess) {
            setPayments(res.data);
        }
    };

    useEffect(() => {
        if (user?.id) {
            handleGetPayments(
                `current=1&pageSize=10&booking__user_id=${
                    user.id
                }&booking__service_type=${
                    ServiceType.ACTIVITY
                }&min_date_launch_activity=${dayjs(Date.now()).format(
                    "YYYY-MM-DDTHH:mm:ss"
                )}&status=${PAYMENT_STATUS.SUCCESS}`
            );
        }
    }, [user]);

    return (
        <div>
            <div className="p-[16px] bg-white rounded-b-[16px]">
                <h1 className="text-[22px] font-bold">Chuyến đi sắp tới</h1>
                {payments.length === 0 ? (
                    <Empty
                        description="Chưa có chuyến đi sắp tới"
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
                                    <span className="text-green-600 font-medium">
                                        Đã xác nhận
                                    </span>
                                </div>

                                {/* Booking Details */}
                                <div className="px-6 py-6 flex gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={getImage(
                                                payment?.booking
                                                    ?.activity_date_detail
                                                    ?.activity_image
                                            )}
                                            alt={
                                                payment?.booking
                                                    ?.activity_date_detail
                                                    ?.activity_name
                                            }
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg text-gray-900 mb-4">
                                            <span className="font-bold">
                                                {
                                                    payment?.booking
                                                        ?.activity_date_detail
                                                        ?.activity_name
                                                }
                                            </span>{" "}
                                            -{" "}
                                            <span>
                                                {
                                                    payment?.booking
                                                        ?.activity_date_detail
                                                        ?.activity_package_name
                                                }
                                            </span>
                                        </h3>

                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">
                                                    Ngày tổ chức
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {dayjs(
                                                        payment?.booking
                                                            ?.activity_date_detail
                                                            ?.date_launch
                                                    ).format("YYYY-MM-DD")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-6 py-4 flex gap-4 justify-end border-t">
                                    <Button
                                        type="primary"
                                        danger
                                        size="large"
                                        className="px-8"
                                    >
                                        Hủy hoạt động
                                    </Button>
                                </div>
                            </Card>
                        ))}
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

export default ActivityIncomingTab;
