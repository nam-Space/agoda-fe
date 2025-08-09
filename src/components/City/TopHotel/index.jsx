import React from "react";
import FilterGroup from './FilterGroup';
import SortBar from './SortBar';
import HotelCard from './HotelCard';

// HotelList component
const HotelList = ({ hotels }) => (
  <div>
    {hotels.map((hotel, idx) => (
      <HotelCard key={idx} hotel={hotel} />
    ))}
  </div>
);

// SeeAllButton component
const SeeAllButton = ({ total }) => (
  <div className="flex justify-center mt-6">
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow">
      Xem tất cả {total} khách sạn ở Đà Nẵng
    </button>
  </div>
);

// Dummy data
const filterOptions = [
  { title: "Đánh giá sao", options: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"] },
  { title: "Điểm đánh giá", options: ["Trên cả tuyệt vời 9+", "Rất tốt 8+", "Tốt 7+", "Dễ chịu 6+"] },
];

const sortOptions = [
  "Lựa chọn hàng đầu của chúng tôi",
  "Giá thấp nhất trước",
  "Gần nhất với",
  "Được đánh giá tốt nhất",
];

const link = "//pix8.agoda.net/hotelImages/72310894/0/3eaecfdabe912246481db6a0f7030332.png?ce=2&s=450x450"
// Dummy hotel data (bạn thay bằng API hoặc props)
const hotels = [
  {
    image: "//pix8.agoda.net/hotelImages/72310894/0/3eaecfdabe912246481db6a0f7030332.png?ce=2&s=450x450",
    thumbnails: [link, link],
    name: "Khách sạn Moonlight Đà Nẵng",
    englishName: "Moonlight Hotel Da Nang",
    stars: 3,
    area: "Hải Châu, Đà Nẵng",
    mapUrl: "https://maps.google.com/...",
    facilities: ["Miễn phí Wi-Fi", "Đỗ xe miễn phí", "Spa", "+5"],
    review: "Rất hài lòng, phòng rất sạch sẽ, gấp nhiều lần khách sạn 4 sao ở Huế và Hội An mình đã đi qua đợt này. Nhân viên thân thiện, mình không nghĩ đây là khách sạn 3 sao nữa, ngoài ra phòng 1402 của mình view ra sông hàn rất đẹp. Hi vọng khách sạn luôn giữ đc phong cách phục vụ tận tình và sạch sẽ như này, lần sao vào mình chắc chắn sẽ quay lại. :)",
    rating: "7.8",
    ratingText: "Rất tốt",
    ratingCount: 1130,
    price: "768.305 ₫",
    url: "/vi-vn/moonlight-hotel-da-nang/hotel/da-nang-vn.html"
  },
  {
    image: "//pix8.agoda.net/hotelImages/72310894/0/3eaecfdabe912246481db6a0f7030332.png?ce=2&s=450x450",
    thumbnails: [link, link],
    name: "Khách sạn Moonlight Đà Nẵng",
    englishName: "Moonlight Hotel Da Nang",
    stars: 3,
    area: "Hải Châu, Đà Nẵng",
    mapUrl: "https://maps.google.com/...",
    facilities: ["Miễn phí Wi-Fi", "Đỗ xe miễn phí", "Spa", "+5"],
    review: "Rất hài lòng, phòng rất sạch sẽ, gấp nhiều lần khách sạn 4 sao ở Huế và Hội An mình đã đi qua đợt này. Nhân viên thân thiện, mình không nghĩ đây là khách sạn 3 sao nữa, ngoài ra phòng 1402 của mình view ra sông hàn rất đẹp. Hi vọng khách sạn luôn giữ đc phong cách phục vụ tận tình và sạch sẽ như này, lần sao vào mình chắc chắn sẽ quay lại. :)",
    rating: "7.8",
    ratingText: "Rất tốt",
    ratingCount: 1130,
    price: "768.305 ₫",
    url: "/vi-vn/moonlight-hotel-da-nang/hotel/da-nang-vn.html"
  },
  // ...thêm các khách sạn khác
];

const TopHotel = () => {
  const [activeSort, setActiveSort] = React.useState(0);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">10 khách sạn tốt nhất ở Đà Nẵng</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Panel */}
        <div className="md:w-1/6">
          {filterOptions.map((group, idx) => (
            <FilterGroup key={idx} title={group.title} options={group.options} />
          ))}
        </div>
        {/* Main Panel */}
        <div className="md:w-3/4">
          <SortBar sorts={sortOptions} activeSort={activeSort} onSort={setActiveSort} />
          <HotelList hotels={hotels} />
          <SeeAllButton total={5101} />
        </div>
      </div>
    </div>
  );
};

export default TopHotel;