import { ConfigProvider, Table } from "antd";
import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { callFetchSeatClassPricing } from "config/api";
import { toast } from "react-toastify";
import vi_VN from "antd/locale/vi_VN";
import {
    HAS_FREE_DRINK_VI,
    HAS_LOUNGE_ACCESS_VI,
    HAS_MEAL_VI,
    HAS_POWER_OUTLET_VI,
    HAS_PRIORITY_BOARDING_VI,
    SEAT_CLASS_VI,
} from "constants/airline";

const SeatClassPricingTable = (props) => {
    const { flight } = props;

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Loại ghế",
            dataIndex: "seat_class",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {SEAT_CLASS_VI[record.seat_class]}
                    </div>
                );
            },
        },
        {
            title: "Hệ số giá",
            dataIndex: "multiplier",
        },
        {
            title: "Tổng số ghế",
            dataIndex: "capacity",
        },
        {
            title: "Số ghế khả dụng",
            dataIndex: "available_seats",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {record.available_seats}
                    </div>
                );
            },
        },
        {
            title: "Đồ ăn",
            dataIndex: "has_meal",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {HAS_MEAL_VI[record.has_meal]}
                    </div>
                );
            },
        },
        {
            title: "Đồ uông miễn phí",
            dataIndex: "has_free_drink",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {HAS_FREE_DRINK_VI[record.has_free_drink]}
                    </div>
                );
            },
        },
        {
            title: "Phòng chờ",
            dataIndex: "has_lounge_access",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {HAS_LOUNGE_ACCESS_VI[record.has_lounge_access]}
                    </div>
                );
            },
        },
        {
            title: "Ổ cắm điện",
            dataIndex: "has_power_outlet",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {HAS_POWER_OUTLET_VI[record.has_power_outlet]}
                    </div>
                );
            },
        },
        {
            title: "Ưu tiên lên máy bay",
            dataIndex: "has_priority_boarding",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {HAS_PRIORITY_BOARDING_VI[record.has_priority_boarding]}
                    </div>
                );
            },
        },
    ];

    const handleGetSeatClassPricing = async (query) => {
        setIsLoading(true);
        try {
            const res = await callFetchSeatClassPricing(query);
            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-right",
            });
        }
        setIsLoading(false);
    };

    const handleChange = async (pagination) => {
        const { current, pageSize } = pagination;

        await handleGetSeatClassPricing(
            `current=${current}&pageSize=${pageSize}&flight_id=${flight.id}&sort=id-desc`
        );
    };

    useEffect(() => {
        if (flight?.id) {
            handleGetSeatClassPricing(
                `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&flight_id=${flight.id}&sort=id-desc`
            );
        }
    }, [flight?.id]);

    return (
        <div>
            <h2 className="text-[16px] font-semibold">
                Danh sách các hạng ghế
            </h2>
            <div className="flex items-center justify-end gap-[10px]">
                <ReloadOutlined
                    onClick={() =>
                        handleGetSeatClassPricing(
                            `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&flight_id=${flight.id}&sort=id-desc`
                        )
                    }
                    className="text-[18px] px-[6px] cursor-pointer"
                />
            </div>
            <div className="mt-[10px]">
                <ConfigProvider locale={vi_VN}>
                    <Table
                        scroll={{ x: true }}
                        className="table-ele"
                        loading={isLoading}
                        pagination={{
                            current: meta?.currentPage,
                            pageSize: meta?.itemsPerPage,
                            showSizeChanger: true,
                            total: meta?.totalItems,
                            showTotal: (total, range) => {
                                return (
                                    <div>
                                        {" "}
                                        {range[0]}-{range[1]} trên {total} bản
                                        ghi
                                    </div>
                                );
                            },
                        }}
                        onChange={handleChange}
                        columns={columns}
                        dataSource={data}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default SeatClassPricingTable;
