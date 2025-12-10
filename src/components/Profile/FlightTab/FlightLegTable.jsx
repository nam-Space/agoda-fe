import { ConfigProvider, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { callFetchFlightLeg } from "config/api";
import { toast } from "react-toastify";
import vi_VN from "antd/locale/vi_VN";

const FlightLegTable = (props) => {
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
            title: "Mã chuyến bay",
            dataIndex: "flight_code",
        },
        {
            title: "Thời gian khởi hành",
            dataIndex: "departure_time",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {dayjs(record.departure_time).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )}
                    </div>
                );
            },
        },
        {
            title: "Thời gian hạ cánh",
            dataIndex: "arrival_time",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {dayjs(record.arrival_time).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )}
                    </div>
                );
            },
        },
        {
            title: "Tổng thời gian",
            dataIndex: "arrival_time",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        {record.duration_minutes} phút
                    </div>
                );
            },
        },
        {
            title: "Địa điểm khởi hành",
            dataIndex: "departure_airport",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        <div>
                            <p className="leading-[20px]">{`${record?.departure_airport?.name}`}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Địa điểm hạ cánh",
            dataIndex: "arrival_airport",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-[10px]">
                        <div>
                            <p className="leading-[20px]">{`${record?.arrival_airport?.name}`}</p>
                        </div>
                    </div>
                );
            },
        },
    ];

    const handleGetFlightLeg = async (query) => {
        setIsLoading(true);
        try {
            const res = await callFetchFlightLeg(query);
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

        await handleGetFlightLeg(
            `current=${current}&pageSize=${pageSize}&flight_id=${flight.id}&sort=departure_time-desc`
        );
    };

    useEffect(() => {
        if (flight?.id) {
            handleGetFlightLeg(
                `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&flight_id=${flight.id}&sort=departure_time-desc`
            );
        }
    }, [flight?.id]);

    return (
        <div>
            <h2 className="text-[16px] font-semibold">
                Danh sách các trạm dừng
            </h2>
            <div className="flex items-center justify-end gap-[10px]">
                <ReloadOutlined
                    onClick={() =>
                        handleGetFlightLeg(
                            `current=${meta.currentPage}&pageSize=${meta.itemsPerPage}&flight_id=${flight.id}&sort=departure_time-desc`
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

export default FlightLegTable;
