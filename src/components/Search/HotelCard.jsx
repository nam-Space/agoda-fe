import React from 'react';
import {Tooltip, Card, Rate, Button, Tag, Badge, Image } from 'antd';
import { HeartOutlined, WifiOutlined, CarOutlined, EnvironmentOutlined,  HomeOutlined, SoundOutlined, RestOutlined, FireOutlined } from '@ant-design/icons';

const HotelCard = ({ hotel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  return (
    <Badge.Ribbon 
      text={hotel.discount ? `-${hotel.discount}%` : undefined} 
      color="red"
      className={hotel.discount ? '' : 'hidden'}
    >
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-300" bodyStyle={{ padding: 0 }}>
        <div className="flex">
          {/* Hotel Image */}
          <div className="w-72 h-48 relative">
            <Image
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover rounded-l-lg"
              preview={false}
            />
            <Button
              type="text"
              icon={<HeartOutlined />}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            />
          </div>

          {/* Hotel Info */}
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Rate disabled defaultValue={hotel.rating} allowHalf className="text-sm" />
                  <span className="text-sm text-gray-600">({hotel.reviews} đánh giá)</span>
                </div>

                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                  {hotel.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <EnvironmentOutlined className="mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 4).map(amenity => (
                    <Tag key={amenity} className="text-xs">
                      {amenity === 'WiFi' && <WifiOutlined className="mr-1" />}
                      {amenity === 'Parking' && <CarOutlined className="mr-1" />}
                      {amenity}
                    </Tag>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <Tag className="text-xs">+{hotel.amenities.length - 4} tiện nghi</Tag>
                  )}
                </div>

                <div className="flex gap-2">
                  {hotel.freeBreakfast && (
                    <Tag color="green">Bữa sáng miễn phí</Tag>
                  )}
                  {hotel.freeCancellation && (
                    <Tag color="blue">Hủy miễn phí</Tag>
                  )}
                </div>
                <div className="w-full border-t border-gray-300 my-4" />
                <div className="flex items-center gap-3 mb-2 mt-4">
                    <span className="text-sm text-gray-600">Điểm nổi bật nhất: </span>
                    <Tooltip title="30 m²">
                        <HomeOutlined className="text-lg cursor-pointer text-black" />
                    </Tooltip>
                    <div className="h-5 border-l border-gray-300" />
                    <Tooltip title="Có cách âm">
                        <SoundOutlined className="text-lg cursor-pointer text-black" />
                    </Tooltip>
                    <div className="h-5 border-l border-gray-300" />
                    <Tooltip title="1 phòng tắm">
                        <RestOutlined className="text-lg cursor-pointer text-black" /> <span className="text-xs">x 1</span>
                    </Tooltip>
                    <div className="h-5 border-l border-gray-300" />
                    <Tooltip title="Bếp riêng">
                        <FireOutlined className="text-lg cursor-pointer text-black" />
                    </Tooltip>
                </div>
              </div>
                {/* Price and Booking Button */}
                <div className="mx-4 w-px bg-gray-300" />
              <div className="text-right">
                <div className="mb-2">
                  {hotel.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(hotel.originalPrice)}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(hotel.price)}
                  </div>
                  <div className="text-xs text-gray-500">mỗi đêm</div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  Xem phòng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

export default HotelCard;