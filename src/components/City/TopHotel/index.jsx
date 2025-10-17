import { Empty, Pagination, Spin, message } from "antd";
import { useEffect } from "react";
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
        ratingCount: Math.floor(Math.random() * 1000) + 100,
        price: "" + (apiHotel.min_price || 0).toLocaleString("vi-VN") + " đ",
        url: `/hotel/${createHotelSlug(apiHotel.name, apiHotel.id)}`,
        cityName: apiHotel.city?.name || "",
        point: apiHotel.point || 0,
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
    const dispatch = useAppDispatch();
    const {
        hotels,
        isLoadingHotels,
        totalHotels,
        currentPage,
        pageSize,
        totalPages,
        sortBy,
        filters,
        error,
    } = useAppSelector((state) => state.hotel || {});

    const filterOptions = [
        {
            title: "Đánh giá sao",
            key: "avg_star",
            options: [
                { label: "5 sao", value: "5" },
                { label: "4 sao", value: "4" },
                { label: "3 sao", value: "3" },
                { label: "2 sao", value: "2" },
                { label: "1 sao", value: "1" },
            ],
        },
        {
            title: "Điểm đánh giá",
            key: "rating_range",
            options: [
                { label: "Trên 9+", value: "9+" },
                { label: "Rất tốt 8+", value: "8+" },
                { label: "Tốt 7+", value: "7+" },
                { label: "Dễ chịu 6+", value: "6+" },
            ],
        },
    ];

    const sortOptions = [
        "Lựa chọn hàng đầu",
        "Giá thấp nhất trước",
        "Gần nhất với",
        "Được đánh giá tốt nhất",
    ];

    useEffect(() => {
        if (cityId) {
            dispatch(
                fetchHotelsByCity({ cityId, currentPage, pageSize, filters })
            );
        }
    }, [dispatch, cityId, currentPage, pageSize, filters]);

    const handleSortChange = (idx) => dispatch(setSortBy(idx));
    const handlePageChange = (page) => dispatch(setCurrentPage(page));
    const handleFilterChange = (key, values) =>
        dispatch(setFilters({ [key]: values }));

    const transformedHotels = hotels.map(transformHotelData);

    useEffect(() => {
        if (error) message.error(error);
    }, [error]);

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6">
                {totalHotels > 0
                    ? `${totalHotels} khách sạn tốt nhất`
                    : "Khách sạn"}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/6">
                    {filterOptions.map((group, idx) => (
                        <FilterGroup
                            key={idx}
                            title={group.title}
                            options={group.options.map((o) => o.label)}
                            onFilterChange={(vals) =>
                                handleFilterChange(group.key, vals)
                            }
                        />
                    ))}
                </div>
                <div className="md:w-3/4">
                    <SortBar
                        sorts={sortOptions}
                        activeSort={sortBy}
                        onSort={handleSortChange}
                    />
                    <HotelList
                        hotels={transformedHotels}
                        loading={isLoadingHotels}
                    />
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                current={currentPage}
                                total={totalHotels}
                                pageSize={pageSize}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) =>
                                    `${range[0]}-${range[1]} của ${total} khách sạn`
                                }
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopHotel;
