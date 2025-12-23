import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Item from "./Item";
import { getImage } from "utils/imageUrl";
import { callFetchHotelQuery } from "config/api";

const List = ({ cityId }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleGetHotels = async (query) => {
        setLoading(true);
        const res = await callFetchHotelQuery(query);
        if (res.isSuccess) {
            setHotels(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!cityId) return; // không fetch khi chưa có cityId
        handleGetHotels(
            `current=1&pageSize=10&cityId=${cityId}&recommended=true`
        );
    }, [cityId]); // refetch khi cityId thay đổi

    if (loading) {
        return (
            <div className="text-center text-gray-500 py-10 text-lg">
                Đang tải danh sách khách sạn...
            </div>
        );
    }

    if (!hotels.length) {
        return (
            <div className="text-center text-gray-500 py-10 text-lg">
                Không có khách sạn nào trong thành phố này.
            </div>
        );
    }

    return (
        <section className="container my-8 px-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Khách sạn &amp; chỗ ở tốt nhất
            </h2>

            <Swiper
                modules={[Navigation]}
                slidesPerView={4}
                spaceBetween={12}
                navigation
                className="w-full h-full"
            >
                {hotels.map((hotel, idx) => (
                    <SwiperSlide key={idx} className="!h-auto">
                        <Item
                            id={hotel.id}
                            image={getImage(hotel.images?.[0]?.image)}
                            name={hotel.name}
                            link="#"
                            stars={hotel.avg_star}
                            reviewText="Tuyệt vời"
                            reviewCount={`Dựa trên ${hotel.review_count} nhận xét`}
                            snippet={hotel.best_comment}
                            reviewer={hotel.owner?.first_name || "Ẩn danh"}
                            reviewerCountry="Việt Nam"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default List;
