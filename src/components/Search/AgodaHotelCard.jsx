import React from 'react';
import { Card, Rate, Tag, Button } from 'antd';
import { EnvironmentOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AgodaHotelCard.css';

const AgodaHotelCard = ({ hotel, checkIn, checkOut, adults, rooms }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_BACKEND_URL}${imagePath}`;
  };

  const handleViewDetails = () => {
    // Navigate to hotel detail page
    navigate(`/hotel/${hotel.id}?check_in=${checkIn}&check_out=${checkOut}&adults=${adults}&rooms=${rooms}`);
  };

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = hotel.min_price * nights;
  
  // Calculate discount from API data (không dùng hardcode)
  const hasDiscount = hotel.discount_percentage && hotel.discount_percentage > 0;
  const originalTotalPrice = hotel.original_price ? hotel.original_price * nights : totalPrice;
  const discountPercentage = hotel.discount_percentage || 0;

  // Get rating category
  const getRatingCategory = (score) => {
    if (score >= 9) return { text: 'Tuyệt vời', color: '#1a7f37' };
    if (score >= 8) return { text: 'Rất tốt', color: '#4a8c2a' };
    if (score >= 7) return { text: 'Tốt', color: '#6ba82f' };
    if (score >= 6) return { text: 'Khá', color: '#9fc035' };
    return { text: 'Trung bình', color: '#c5d037' };
  };

  const ratingInfo = getRatingCategory(hotel.avg_star * 2); // Convert 5-star to 10-point scale

  return (
    <Card 
      className="agoda-hotel-card hover:shadow-lg transition-shadow duration-300"
      bordered={false}
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex gap-4 p-4">
        {/* Hotel Image */}
        <div className="relative flex-shrink-0">
          <img
            src={getImageUrl(hotel.images?.[0]?.image)}
            alt={hotel.name}
            className="w-64 h-48 object-cover rounded-lg"
          />
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            {isFavorite ? (
              <HeartFilled className="text-red-500 text-xl" />
            ) : (
              <HeartOutlined className="text-gray-600 text-xl" />
            )}
          </button>
          {hotel.images && hotel.images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              +{hotel.images.length - 1} ảnh
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Hotel Name & Location */}
            <div className="mb-2">
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer mb-1">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Rate disabled value={Math.round(hotel.avg_star)} className="text-sm" />
                <span className="text-gray-400">|</span>
                <EnvironmentOutlined />
                <span>{hotel.city?.name || 'N/A'}</span>
              </div>
            </div>

            {/* Description */}
            {hotel.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {hotel.description}
              </p>
            )}

            {/* Amenities/Features */}
            {hotel.mostFeature && (
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.mostFeature.split(',').slice(0, 3).map((feature, idx) => (
                  <Tag key={idx} color="blue" className="m-0">
                    {feature.trim()}
                  </Tag>
                ))}
              </div>
            )}

            {/* Review Score */}
            {hotel.review_count > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="px-2 py-1 rounded font-bold text-white"
                  style={{ backgroundColor: ratingInfo.color }}
                >
                  {(hotel.avg_star * 2).toFixed(1)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{ratingInfo.text}</div>
                  <div className="text-xs text-gray-500">{hotel.review_count} đánh giá</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between pt-2 border-t">
            <div className="text-sm text-gray-600">
              <div className="mb-1">Giá cho {nights} đêm</div>
              {hotel.total_click > 0 && (
                <div className="text-xs text-orange-600">
                  🔥 {hotel.total_click} người đã xem gần đây
                </div>
              )}
            </div>
            <div className="text-right">
              {hasDiscount && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(originalTotalPrice)} ₫
                </div>
              )}
              <div className="text-2xl font-bold text-red-600 mb-1">
                {formatPrice(totalPrice)} ₫
              </div>
              {hasDiscount && (
                <div className="text-xs text-green-600 mb-2">
                  Tiết kiệm {discountPercentage}%
                </div>
              )}
              <Button 
                type="primary" 
                size="large"
                onClick={handleViewDetails}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgodaHotelCard;
