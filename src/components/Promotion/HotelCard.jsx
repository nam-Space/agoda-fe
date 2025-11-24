import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge } from "antd";
import { Star, MapPin } from "lucide-react";
import { getImageUrl } from "../../config/api";

const HotelCard = ({ item }) => {
  const navigate = useNavigate();
  const {
    name,
    thumbnail,
    max_discount,
    avg_star,
    review_count,
    locationInfo,
    total_weighted_score,
    min_price,
  } = item;

  // Tính giá gốc và giá sau giảm (giả sử max_discount là số tiền giảm, min_price là giá sau giảm)
  let originalPrice = min_price;
  let finalPrice = min_price;
  if (max_discount && min_price) {
    originalPrice = min_price;
    finalPrice = min_price*(1 - max_discount/100);
  }

  return (
    <Card
      hoverable
      onClick={() => navigate(`/hotel/${item.id}`)}
      className="max-w-xs w-full mx-auto"
      cover={
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={getImageUrl(thumbnail)}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {max_discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                count={
                  <span className="bg-red-500 text-white px-2 py-1 rounded font-bold text-base flex flex-col items-center min-w-[48px]">
                    <span className="text-lg font-extrabold leading-none">{max_discount}%</span>
                    <span className="block text-xs font-normal leading-none">giảm giá</span>
                  </span>
                }
              />
            </div>
          )}
        </div>
      }
    >
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <div className="flex items-center gap-1 mb-3">
        {avg_star && Array.from({ length: Math.round(avg_star) }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        <MapPin className="w-4 h-4 text-blue-500 ml-1" />
        <span className="text-sm text-blue-500">{locationInfo}</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded font-bold text-lg">
          {total_weighted_score?.toFixed(1) || avg_star?.toFixed(1) || "-"}
        </div>
        <div>
          <div className="font-semibold">Tuyệt vời</div>
          <div className="text-sm text-gray-500">{review_count?.toLocaleString() || 0} nhận xét</div>
        </div>
      </div>
      <div className="border-t pt-4">
        <p className="text-xs text-gray-500 mb-2">
          Giá mỗi đêm chưa gồm thuế và phí
        </p>
        <div className="flex items-baseline gap-2">
          {originalPrice && originalPrice !== finalPrice && (
            <span className="text-sm text-gray-500 line-through">
              đ {originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-2xl font-bold text-red-500">
            đ {finalPrice?.toLocaleString() || "-"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default HotelCard;