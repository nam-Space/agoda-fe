import { Empty, Pagination, Slider, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    fetchHotelsByCity,
    setCurrentPage,
    setFilters,
    setSortBy,
} from "../../../redux/slice/hotelSlide";
import FilterGroup from "./FilterGroup";
import HotelCard from "./HotelCard";
import SortBar from "./SortBar";
import { RANGE_PRICE_HOTEL } from "constants/hotel";
import { callGetHotels } from "config/api";
// HotelList component
const HotelList = ({ hotels, loading }) => {
    if (loading)
        return (
            <div className="flex justify-center py-8">
                <Spin size="large" />
            </div>
        );
    if (!hotels || hotels.length === 0)
        return (
            <div className="py-8">
                <Empty
                    description="Không tìm thấy khách sạn nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    return (
        <div>
            {hotels.map((hotel, idx) => (
                <HotelCard key={hotel.id || idx} hotel={hotel} />
            ))}
        </div>
    );
};

// Transform API data
const transformHotelData = (apiHotel) => {
    const stripHtml = (html) =>
        html ? html.replace(/<[^>]*>/g, "").trim() : "";
    const extractFacilities = (htmlTable) => {
        if (!htmlTable) return [];
        const matches = htmlTable.match(/>([^<]+)</g);
        return matches
            ? matches
                  .map((m) => m.replace(/[><]/g, "").trim())
                  .filter((t) => t.length > 1)
                  .slice(0, 4)
            : [];
    };
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/default-hotel.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        const base = process.env.REACT_APP_BE_URL?.endsWith("/")
            ? process.env.REACT_APP_BE_URL
            : process.env.REACT_APP_BE_URL + "/";
        return `${base}${imagePath.replace(/^\/+/, "")}`;
    };

    // Hàm slug giữ chữ tiếng Việt có dấu nhưng chuyển sang không dấu
    const createHotelSlug = (name, id) => {
        if (!name) return id;
        const removeVietnameseTones = (str) => {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/\s+/g, "-");
            str = str.replace(/[^a-zA-Z0-9-]/g, "");
            str = str.replace(/-+/g, "-");
            return str;
        };
        return removeVietnameseTones(name.toLowerCase()) + `-${id}`;
    };

    return {
        id: apiHotel.id,
        name: apiHotel.name || "Khách sạn",
        image: getImageUrl(apiHotel.images?.[0]?.image),
        thumbnails: apiHotel.images?.map((img) => getImageUrl(img.image)) || [],
        stars: Math.floor(apiHotel.avg_star || 0),
        area: apiHotel.location || "N/A",
        mapUrl:
            apiHotel.lat && apiHotel.lng
                ? `https://maps.google.com/?q=${apiHotel.lat},${apiHotel.lng}`
                : null,
        facilities: extractFacilities(apiHotel.facilities),
        review: stripHtml(apiHotel.description) || "",
        rating: apiHotel.avg_star?.toFixed(1) || "N/A",
        ratingText: getRatingText(apiHotel.avg_star || 0),
        ratingCount: apiHotel.review_count,
        price: "" + (apiHotel.min_price || 0).toLocaleString("vi-VN") + " đ",
        url: `/hotel/${createHotelSlug(apiHotel.name, apiHotel.id)}`,
        cityName: apiHotel.city?.name || "",
        withUs: stripHtml(apiHotel.withUs) || "",
        slug: createHotelSlug(apiHotel.name, apiHotel.id),
    };
};

const getRatingText = (rating) =>
    rating >= 9
        ? "Tuyệt hảo"
        : rating >= 8
        ? "Rất tốt"
        : rating >= 7
        ? "Tốt"
        : rating >= 6
        ? "Ổn"
        : "Trung bình";

const TopHotel = () => {
    const { cityId } = useParams(); // string
    // const dispatch = useAppDispatch();
    // const {
    //     hotels,
    //     isLoadingHotels,
    //     totalHotels,
    //     currentPage,
    //     pageSize,
    //     totalPages,
    //     sortBy,
    //     filters,
    //     error,
    // } = useAppSelector((state) => state.hotel || {});

    const [hotels, setHotels] = useState([]);
    const [isLoadingHotels, setIsLoadingHotels] = useState(false);
    const [error, setError] = useState("");
    const [filterSearch, setFilterSearch] = useState({
        avg_star: -1,
    });

    const [valuePrices, setValuePrices] = useState([0, 100]);

    const [valueSort, setValueSort] = useState("recommended=true");

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });

    const filterOptions = [
        {
            title: "Đánh giá sao",
            key: "avg_star",
            options: [
                { label: "5 sao", value: 5 },
                { label: "4 sao", value: 4 },
                { label: "3 sao", value: 3 },
                { label: "2 sao", value: 2 },
                { label: "1 sao", value: 1 },
                { label: "Tất cả", value: -1 },
            ],
        },
    ];

    const sortOptions = [
        { label: "Lựa chọn hàng đầu", value: "recommended=true" },
        { label: "Giá thấp nhất trước", value: "sort=min_price-asc" },
        { label: "Được đánh giá tốt nhất", value: "sort=total_positive-desc" },
    ];

    // useEffect(() => {
    //     if (cityId) {
    //         dispatch(
    //             fetchHotelsByCity({
    //                 cityId,
    //                 currentPage,
    //                 pageSize,
    //                 filters: {
    //                     ...filters,
    //                     recommended: true,
    //                 },
    //             })
    //         );
    //     }
    // }, [dispatch, cityId, currentPage, pageSize, filters]);

    const handleGetHotels = async (body) => {
        setIsLoadingHotels(true);
        const res = await callGetHotels({ ...body });
        setIsLoadingHotels(false);
        setMeta({
            ...meta,
            total: res.meta.totalItems,
            totalPages: res.meta.totalPages,
        });
        if (res.isSuccess) {
            setHotels(res.data);
        } else {
            setError(res.message || "Đã có lỗi xảy ra khi tải khách sạn");
        }
    };

    useEffect(() => {
        if (cityId) {
            const [sort, valToSort] = valueSort.split("=");
            handleGetHotels({
                cityId,
                currentPage: meta.current,
                pageSize: meta.pageSize,
                filters: {
                    ...(filterSearch.avg_star !== -1
                        ? { avg_star: filterSearch.avg_star }
                        : {}),
                    ...(valuePrices[0] >= 0
                        ? {
                              min_avg_price: RANGE_PRICE_HOTEL * valuePrices[0],
                          }
                        : {}),
                    ...(valuePrices[1] <= 100
                        ? {
                              max_avg_price: RANGE_PRICE_HOTEL * valuePrices[1],
                          }
                        : {}),
                    ...(sort === "recommended"
                        ? { recommended: true }
                        : { sort: valToSort }),
                },
            });
        }
    }, [
        cityId,
        filterSearch,
        JSON.stringify(valuePrices),
        meta.current,
        meta.pageSize,
    ]);

    // const handleSortChange = (idx) => dispatch(setSortBy(idx));
    // const handlePageChange = (page) => dispatch(setCurrentPage(page));

    const onChangePagination = (pageNumber, pageSize) => {
        setMeta({
            ...meta,
            current: pageNumber,
            pageSize: pageSize,
        });
    };

    const transformedHotels = hotels.map(transformHotelData);

    useEffect(() => {
        if (error) message.error(error);
    }, [error]);

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6">
                {meta.total > 0
                    ? `${meta.total} khách sạn tốt nhất`
                    : "Khách sạn"}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/5">
                    {filterOptions.map((group, idx) => (
                        <FilterGroup
                            key={idx}
                            title={group.title}
                            group={group}
                            filterSearch={filterSearch}
                            setFilterSearch={setFilterSearch}
                        />
                    ))}
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <p className="text-[20px] font-semibold">Giá</p>
                        <div className="mt-[10px] flex items-center justify-between">
                            <p>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(RANGE_PRICE_HOTEL * valuePrices[0])}
                            </p>
                            <p>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(RANGE_PRICE_HOTEL * valuePrices[1])}
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
                </div>
                <div className="md:w-3/4">
                    <SortBar
                        sorts={sortOptions}
                        valueSort={valueSort}
                        setValueSort={setValueSort}
                    />
                    <HotelList
                        hotels={transformedHotels}
                        loading={isLoadingHotels}
                    />
                    {meta.total > 0 && (
                        <div className="flex justify-center mt-6">
                            {/* <Pagination
                                current={currentPage}
                                total={totalHotels}
                                pageSize={pageSize}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} của ${total} khách sạn`
                                }
                                onChange={handlePageChange}
                            /> */}
                            <Pagination
                                pageSize={meta.pageSize}
                                showQuickJumper
                                total={meta.total}
                                onChange={onChangePagination}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopHotel;
