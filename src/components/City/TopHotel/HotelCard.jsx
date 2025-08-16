import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { EnvironmentOutlined } from "@ant-design/icons";

const HotelCard = ({ hotel }) => {
  const [showFullReview, setShowFullReview] = useState(false);

  return (
    <div className="flex bg-white rounded-xl shadow p-4 mb-4">
      {/* Cột trái: Ảnh + gallery */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Gallery thumbnails */}
        {hotel.thumbnails && hotel.thumbnails.length > 0 && (
          <div className="flex gap-1 mt-2 w-full">
            {hotel.thumbnails.slice(0, 5).map((thumb, idx) => (
              <img
                key={idx}
                src={thumb}
                alt={`thumb-${idx}`}
                className="w-1/6 h-12 object-cover rounded"
              />
            ))}
            {hotel.thumbnails.length > 5 && (
              <div className="w-1/6 h-12 flex items-center justify-center bg-gray-200 rounded text-xs">
                Xem hết
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cột giữa: Thông tin khách sạn */}
      <div className="w-2/3 px-6 flex flex-col justify-between">
        {/* Tên khách sạn */}
        <div>
          <div className="text-2xl font-bold">{hotel.name}</div>
          {hotel.englishName && (
            <div className="text-lg text-gray-600 font-medium">
              ({hotel.englishName})
            </div>
          )}
          {/* Sao, vị trí, bản đồ */}
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="flex">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-base" />
              ))}
            </span>
            <span className="text-blue-600 text-sm font-semibold">
              {hotel.area}
            </span>
            {hotel.mapUrl && (
              <a
                href={hotel.mapUrl}
                className="text-blue-500 text-xs underline ml-2 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <EnvironmentOutlined />
                Xem trên bản đồ
              </a>
            )}
          </div>
          {/* Tiện ích */}
          <div className="flex flex-wrap gap-2 mb-2">
            {hotel.facilities.map((f, idx) => (
              <span
                key={idx}
                className="px-2 py-1 border rounded-full text-xs bg-gray-50"
              >
                {f}
              </span>
            ))}
          </div>
          {/* Review nổi bật */}
          {hotel.review && (
            <div className="text-gray-700 text-sm mb-2">
              “
              {showFullReview || hotel.review.length < 180
                ? hotel.review
                : hotel.review.slice(0, 180) + "..."}
              ”
              {hotel.review.length > 180 && (
                <button
                  className="text-blue-500 ml-2 text-xs"
                  onClick={() => setShowFullReview((v) => !v)}
                >
                  {showFullReview ? "Ẩn ▲" : "Xem thêm ▼"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cột phải: Đánh giá, giá, nút */}
      <div className="w-1/4 flex flex-col items-end justify-between pl-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <div>
              <div className="text-gray-700 text-sm font-semibold text-right">
                {hotel.ratingText}
              </div>
              <div className="text-xs text-gray-500">
                {hotel.ratingCount} nhận xét
              </div>
            </div>
            <span className="bg-blue-50 border border-blue-400 text-blue-600 px-2 py-1 rounded text-base font-bold">
              {hotel.rating}
            </span>
          </div>
        </div>
        <div className="mt-4 text-right">
          <div className="text-xs text-gray-500">Giá trung bình mỗi đêm</div>
          <div className="font-bold text-red-600 text-2xl">{hotel.price}</div>
        </div>
        <a
          href={hotel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-base font-semibold"
        >
          Kiểm tra lượng phòng trống
        </a>
      </div>
    </div>
  );
};

export default HotelCard;