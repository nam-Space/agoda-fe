import Item from './Item';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useRef, useEffect } from 'react';
// Dữ liệu mẫu, bạn thay bằng API hoặc props nếu muốn
const hotels = [
  {
    image: '//pix8.agoda.net/hotelImages/174466/-1/2ae37c626594b7092c15caac1ec6b32f.jpg?ce=0&s=312x235&ar=16x9',
    name: 'Vedana Lagoon Wellness Resort & Spa',
    link: '/vi-vn/vedana-lagoon-wellness-resort-spa/hotel/hue-vn.html',
    stars: 5,
    score: '9',
    reviewText: 'Trên cả tuyệt vời',
    reviewCount: 'Dựa trên 1472 nhận xét',
    snippet: 'The resort is very beautiful with a lot of things to do.',
    reviewer: 'Hoang',
    reviewerCountry: 'Vietnam',
  },
  {
    image: '//pix8.agoda.net/hotelImages/109/10953/10953_16030216470040397599.jpg?ca=6&ce=1&s=312x235&ar=16x9',
    name: 'Furama Resort Danang',
    link: '/vi-vn/furama-resort-danang/hotel/da-nang-vn.html',
    stars: 5,
    score: '8.8',
    reviewText: 'Tuyệt vời',
    reviewCount: 'Dựa trên 8912 nhận xét',
    snippet: 'đà nẵng là nơi đáng để đi nhất ở miền trung việt nam. sẽ rất dễ dàng kiếm được 1 resort đẹp...',
    reviewer: 'Nam',
    reviewerCountry: 'Việt Nam',
  },
  {
    image: '//pix8.agoda.net/hotelImages/109/10953/10953_16030216470040397599.jpg?ca=6&ce=1&s=312x235&ar=16x9',
    name: 'Furama Resort Danang',
    link: '/vi-vn/furama-resort-danang/hotel/da-nang-vn.html',
    stars: 5,
    score: '8.8',
    reviewText: 'Tuyệt vời',
    reviewCount: 'Dựa trên 8912 nhận xét',
    snippet: 'đà nẵng là nơi đáng để đi nhất ở miền trung việt nam. sẽ rất dễ dàng kiếm được 1 resort đẹp...',
    reviewer: 'Nam',
    reviewerCountry: 'Việt Nam',
  },
  {
    image: '//pix8.agoda.net/hotelImages/109/10953/10953_16030216470040397599.jpg?ca=6&ce=1&s=312x235&ar=16x9',
    name: 'Furama Resort Danang',
    link: '/vi-vn/furama-resort-danang/hotel/da-nang-vn.html',
    stars: 5,
    score: '8.8',
    reviewText: 'Tuyệt vời',
    reviewCount: 'Dựa trên 8912 nhận xét',
    snippet: 'đà nẵng là nơi đáng để đi nhất ở miền trung việt nam. sẽ rất dễ dàng kiếm được 1 resort đẹp...',
    reviewer: 'Nam',
    reviewerCountry: 'Việt Nam',
  },
  // ...Thêm các khách sạn khác tương tự
];

const List = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="container mx-auto my-8  px-20 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Khách sạn &amp; chỗ ở tốt nhất tại Đà Nẵng
      </h2>
      {/* Nút prev */}
      <button
        ref={prevRef}
        className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      {/* Nút next */}
      <button
        ref={nextRef}
        className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7"/></svg>
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
          <SwiperSlide key={idx} >
            <Item {...hotel} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default List;