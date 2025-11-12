import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DatePicker, InputNumber, Button, Spin, Empty, Card, Tag } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { callGetRoomAvailability } from 'config/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const RoomAvailabilitySearch = () => {
  const { id: hotelId } = useParams();
  
  const [dates, setDates] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleCheckAvailability = async () => {
    // Validation
    if (!dates || dates.length !== 2) {
      alert('Vui lòng chọn ngày nhận và trả phòng');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const checkIn = dates[0].format('YYYY-MM-DD');
      const checkOut = dates[1].format('YYYY-MM-DD');

      const response = await callGetRoomAvailability(hotelId, {
        check_in: checkIn,
        check_out: checkOut,
        adults
      });

      if (response.data && response.data.isSuccess) {
        setAvailableRooms(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
      alert('Có lỗi xảy ra khi tìm phòng trống');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const calculateNights = () => {
    if (!dates || dates.length !== 2) return 0;
    return dates[1].diff(dates[0], 'day');
  };

  const calculateTotalPrice = (pricePerNight) => {
    const nights = calculateNights();
    return pricePerNight * nights;
  };

  return (
    <div className="room-availability-search">
      {/* Search Form */}
      <Card className="mb-6">
        <h3 className="text-xl font-bold mb-4">Tìm phòng trống</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range Picker */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Ngày nhận/trả phòng
            </label>
            <RangePicker
              value={dates}
              onChange={(dates) => setDates(dates)}
              format="DD/MM/YYYY"
              placeholder={['Nhận phòng', 'Trả phòng']}
              size="large"
              className="w-full"
              disabledDate={(current) => {
                return current && current < dayjs().startOf('day');
              }}
            />
          </div>

          {/* Adults */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Người lớn
            </label>
            <InputNumber
              prefix={<UserOutlined />}
              min={1}
              max={10}
              value={adults}
              onChange={(val) => setAdults(val || 1)}
              size="large"
              className="w-full"
            />
          </div>

          {/* Children */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Trẻ em
            </label>
            <InputNumber
              min={0}
              max={10}
              value={children}
              onChange={(val) => setChildren(val || 0)}
              size="large"
              className="w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4">
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleCheckAvailability}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Cập nhật
          </Button>
        </div>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      )}

      {!loading && searched && availableRooms.length === 0 && (
        <Card>
          <Empty description="Không có phòng trống trong khoảng thời gian này" />
        </Card>
      )}

      {!loading && availableRooms.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            Phòng trống ({availableRooms.length})
          </h3>
          
          <div className="space-y-4">
            {availableRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Room Info */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-bold mb-2">{room.room_type}</h4>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📐 Diện tích: {room.area_m2} m²</p>
                      <p>🛏️ Số giường: {room.beds}</p>
                      <p>👥 Sức chứa: {room.adults_capacity} người lớn, {room.children_capacity} trẻ em</p>
                      <p className="text-green-600 font-semibold">
                        ✅ Còn {room.rooms_available} phòng trống
                      </p>
                    </div>

                    {room.description && (
                      <p className="mt-3 text-gray-700">{room.description}</p>
                    )}
                  </div>

                  {/* Pricing & Booking */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="text-right mb-2">
                        <span className="text-sm text-gray-600">Giá mỗi đêm</span>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(room.price_per_night)} ₫
                        </p>
                      </div>
                      
                      {calculateNights() > 0 && (
                        <div className="text-right mb-2">
                          <span className="text-sm text-gray-600">
                            Tổng ({calculateNights()} đêm)
                          </span>
                          <p className="text-xl font-bold text-red-600">
                            {formatPrice(calculateTotalPrice(room.price_per_night))} ₫
                          </p>
                        </div>
                      )}

                      <div className="text-right text-xs text-gray-500">
                        Đã bao gồm thuế và phí
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        // Navigate to booking page with room details
                        const bookingUrl = `/hotels/${hotelId}/booking?room_id=${room.id}&check_in=${dates[0].format('YYYY-MM-DD')}&check_out=${dates[1].format('YYYY-MM-DD')}&adults=${adults}&children=${children}`;
                        window.location.href = bookingUrl;
                      }}
                    >
                      Đặt phòng ngay
                    </Button>
                  </div>
                </div>

                {/* Room Images */}
                {room.images && room.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {room.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image}
                        alt={`${room.room_type} ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAvailabilitySearch;
