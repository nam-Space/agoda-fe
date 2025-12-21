import { callFetchAirport } from "config/api";
import { callFetchHotelQuery } from "config/api";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/formatCurrency";

const GoodToKnow = ({ cityId, city }) => {
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const [quickInfoMap, setQuickInfoMap] = useState({});

    const handleGetHotelAndAirport = async (queryHotel, queryAirport) => {
        const [resHotel, resAirport] = await Promise.all([
            callFetchHotelQuery(queryHotel),
            callFetchAirport(queryAirport),
        ]);
        if (resHotel.isSuccess && resAirport.isSuccess) {
            const newQuickInfoMap = { ...quickInfoMap };

            newQuickInfoMap["Nơi ở"] = `${resHotel.meta.totalItems}`;
            newQuickInfoMap["Khách sạn phổ biến"] = resHotel.data[0]?.name;
            newQuickInfoMap["Giá mỗi đêm từ"] = `${formatCurrency(
                +(resHotel.data[0]?.min_price || "0")
            )}đ`;
            newQuickInfoMap["Lý do vi vu"] = resHotel.data[0]?.best_comment;
            newQuickInfoMap["Sân bay"] = resAirport.data[0]?.name;
            setQuickInfoMap({ ...newQuickInfoMap });
        }
    };
    useEffect(() => {
        if (cityId) {
            handleGetHotelAndAirport(
                `current=1&pageSize=1&cityId=${cityId}&recommended=true`,
                `current=1&pageSize=1&city_id=${cityId}`
            );
        }
    }, [cityId]);

    useEffect(() => {
        if (!cityId) return;

        const fetchData = async () => {
            try {
                const [neighRes] = await Promise.all([
                    fetch(
                        `${process.env.REACT_APP_BE_URL}/api/neighborhoods?city_id=${cityId}`
                    ),
                ]);

                if (!neighRes.ok) throw new Error("Không thể tải dữ liệu");

                const neighData = await neighRes.json();

                setNeighborhoods(neighData.results || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cityId]);

    return (
        <div className="container mx-auto my-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-8 border">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-blue-700">
                        Thông tin nhanh về {city?.name}, {city?.country?.name}
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <tbody>
                            {Object.entries(quickInfoMap).map(
                                ([key, value], index) => (
                                    <tr
                                        key={index}
                                        className={
                                            index % 2 === 0
                                                ? "bg-[#f8f7f9]"
                                                : ""
                                        }
                                    >
                                        <td className="py-2 px-4 font-semibold text-gray-700 w-1/3">
                                            {key}
                                        </td>
                                        <td className="py-2 px-4 text-gray-900">
                                            {value}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Neighborhoods */}
            <section className="mb-8">
                <div className="bg-white rounded-lg shadow p-6 border">
                    <div className="mb-4 border-b pb-4">
                        <h2 className="text-2xl font-bold text-blue-700">
                            Khám phá khu vực ở {city.name}
                        </h2>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    ) : neighborhoods.length === 0 ? (
                        <p className="text-gray-500">
                            Không có dữ liệu khu vực.
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                            {neighborhoods.map((item) => (
                                <div
                                    key={item.id}
                                    className="block hover:bg-blue-50 rounded px-3 py-3 transition border border-gray-100"
                                >
                                    <dt className="font-semibold text-gray-700">
                                        {item.name}
                                    </dt>
                                    <dd className="text-gray-500 text-sm">
                                        {item.description || "Chưa có mô tả"}
                                    </dd>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default GoodToKnow;
