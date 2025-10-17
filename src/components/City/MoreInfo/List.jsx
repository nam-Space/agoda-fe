import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Item from './Item';

const List = ({ cityId }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return; // không fetch khi chưa có cityId

    setLoading(true);
    fetch(`http://localhost:8000/api/hotels/by-city/${cityId}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess && data.data) {
          setHotels(data.data);
        } else {
          setHotels([]);
        }
      })
      .catch((err) => console.error('Lỗi tải khách sạn:', err))
      .finally(() => setLoading(false));
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

      {/* Nút prev */}
      <button
        ref={prevRef}
        className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Nút next */}
      <button
        ref={nextRef}
        className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        loop
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!pb-8"
      >
        {hotels.map((hotel, idx) => (
          <SwiperSlide key={idx}>
            <Item
              image={`http://localhost:8000${hotel.images?.[0]?.image}`}
              name={hotel.name}
              link="#"
              stars={hotel.avg_star}
              score={hotel.point}
              reviewText="Tuyệt vời"
              reviewCount={`${Math.floor(Math.random() * 500 + 50)} nhận xét`}
              snippet={hotel.description}
              reviewer={hotel.owner?.first_name || 'Ẩn danh'}
              reviewerCountry="Việt Nam"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default List;
