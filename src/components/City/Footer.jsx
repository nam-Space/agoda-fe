import React from 'react';

const hotels = [
  { name: "Vedana Lagoon Wellness Resort & Spa", link: "/vi-vn/vedana-lagoon-wellness-resort-spa/hotel/hue-vn.html" },
  { name: "Khu nghỉ dưỡng TIA Wellness - Bao gồm spa", link: "/vi-vn/fusion-maia-resort-all-spa-inclusive/hotel/da-nang-vn.html" },
  { name: "Khách sạn Mường Thanh Luxury Đà Nẵng", link: "/vi-vn/muong-thanh-luxury-da-nang-hotel/hotel/da-nang-vn.html" },
  { name: "Fusion Suites Đà Nẵng", link: "/vi-vn/fusion-suites-danang-beach/hotel/da-nang-vn.html" },
  { name: "Vanda Hotel", link: "/vi-vn/vanda-hotel/hotel/da-nang-vn.html" },
  { name: "Wyndham Đà Nẵng Golden Bay", link: "/vi-vn/danang-golden-bay_3/hotel/da-nang-vn.html" },
  { name: "Diamond Sea Hotel", link: "/vi-vn/diamond-sea-hotel/hotel/da-nang-vn.html" },
  { name: "Mercure Danang French Village Bana Hills", link: "/vi-vn/mercure-danang-french-village-bana-hills_2/hotel/da-nang-vn.html" },
  { name: "Grand Tourane Hotel", link: "/vi-vn/grand-tourane-hotel/hotel/da-nang-vn.html" },
];

const types = [
  { name: "Căn hộ ở Đà Nẵng", link: "/vi-vn/theme/apartments/city/da-nang-vn.html" },
  { name: "Khách sạn giá rẻ ở Đà Nẵng", link: "/vi-vn/theme/cheap-hotels/city/da-nang-vn.html" },
  { name: "Hostel ở Đà Nẵng", link: "/vi-vn/theme/hostels/city/da-nang-vn.html" },
  { name: "Khu nghỉ dưỡng ở Đà Nẵng", link: "/vi-vn/theme/resorts/city/da-nang-vn.html" },
  { name: "Biệt thự ở Đà Nẵng", link: "/vi-vn/theme/villas/city/da-nang-vn.html" },
];

const guides = [
  { name: "Cuộc phiêu lưu Đà Nẵng: Hướng dẫn toàn diện về niềm vui và sự phấn khích", link: "/vi-vn/travel-guides/vietnam/da-nang/da-nang-adventures-a-comprehensive-guide-to-fun-and-excitement/" },
  { name: "Khám phá Ngũ Hành Sơn Đà Nẵng: Cẩm nang du lịch về những viên ngọc ẩn giấu và cuộc phiêu lưu", link: "/vi-vn/travel-guides/vietnam/da-nang/discover-lucky-mountain-da-nang-your-ultimate-travel-guide-to-hidden-gems-and-adventure/" },
  { name: "Lịch trình 3 ngày ở Đà Nẵng: Bãi biển, dãy núi và di tích lịch sử", link: "/vi-vn/travel-guides/vietnam/da-nang/3-days-in-da-nang-itinerary-beaches-mountains-and-historical-sites/" },
  { name: "Những quán cà phê quyến rũ ở Đà Nẵng", link: "/vi-vn/travel-guides/vietnam/da-nang/charming-cafes-in-da-nang-discover-the-citys-most-beautiful-coffee-spots/" },
  { name: "Khám phá Bà Nà Hills đầy mê hoặc", link: "/vi-vn/travel-guides/vietnam/da-nang/exploring-the-enchanting-ba-na-hills-your-ultimate-travel-guide-to-da-nangs-magical-mountain-retreat/" },
  { name: "Khám phá các viên ngọc ẩn của Đà Nẵng", link: "/vi-vn/travel-guides/vietnam/da-nang/discover-da-nangs-hidden-gems-boutique-hotels-that-offer-unique-experiences/" },
];

const Footer = () => {
  // Chia khách sạn thành 3 cột, mỗi cột 3 khách sạn
  const hotelCols = [
    hotels.slice(0, 3),
    hotels.slice(3, 6),
    hotels.slice(6, 9),
  ];
  // Chia loại hình thành 2 cột, mỗi cột 2-3 loại
  const typeCols = [
    types.slice(0, 3),
    types.slice(3, 5),
  ];
  // Chia cẩm nang thành 2 cột, mỗi cột 3 guide
  const guideCols = [
    guides.slice(0, 3),
    guides.slice(3, 6),
  ];

  return (
    <footer className="bg-gray-50 border-t mt-16 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Khách sạn nổi tiếng */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Khách Sạn Nổi Tiếng ở Đà Nẵng</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotelCols.map((col, idx) => (
              <ul key={idx} className="space-y-2">
                {col.map((hotel, i) => (
                  <li key={i}>
                    <a
                      href={hotel.link}
                      className="text-blue-600 hover:underline text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {hotel.name}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        {/* Loại hình lưu trú */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tìm theo loại hình cơ sở lưu trú</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {typeCols.map((col, idx) => (
              <ul key={idx} className="space-y-2">
                {col.map((type, i) => (
                  <li key={i}>
                    <a
                      href={type.link}
                      className="text-blue-600 hover:underline text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {type.name}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        {/* Cẩm nang du lịch */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Cẩm nang du lịch Đà Nẵng</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guideCols.map((col, idx) => (
              <ul key={idx} className="space-y-2">
                {col.map((guide, i) => (
                  <li key={i}>
                    <a
                      href={guide.link}
                      className="text-blue-600 hover:underline text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {guide.name}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;