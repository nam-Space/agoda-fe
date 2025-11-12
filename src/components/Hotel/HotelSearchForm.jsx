import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Input, InputNumber, Button, Popover } from 'antd';
import { SearchOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const HotelSearchForm = ({ className = '' }) => {
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  const handleSearch = () => {
    // Validation
    if (!destination || !dates || dates.length !== 2) {
      alert('Vui lòng nhập đầy đủ thông tin: Điểm đến và Ngày nhận/trả phòng');
      return;
    }

    // Format dates
    const checkIn = dates[0].format('YYYY-MM-DD');
    const checkOut = dates[1].format('YYYY-MM-DD');

    // Build query params
    const queryParams = new URLSearchParams({
      destination,
      check_in: checkIn,
      check_out: checkOut,
      adults,
      rooms
    });

    // Navigate to search page
    navigate(`/search?${queryParams.toString()}`);
  };

  // Guest Popover Content
  const guestContent = (
    <div className="w-64 p-2">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Người lớn</span>
        <InputNumber
          min={1}
          max={10}
          value={adults}
          onChange={(val) => setAdults(val || 1)}
          className="w-20"
        />
      </div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Trẻ em</span>
        <InputNumber
          min={0}
          max={10}
          value={children}
          onChange={(val) => setChildren(val || 0)}
          className="w-20"
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Phòng</span>
        <InputNumber
          min={1}
          max={10}
          value={rooms}
          onChange={(val) => setRooms(val || 1)}
          className="w-20"
        />
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-4">Tìm kiếm khách sạn</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Điểm đến
          </label>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Nhập tên thành phố hoặc khách sạn"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            size="large"
          />
        </div>

        {/* Date Range Picker */}
        <div>
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
              // Disable dates before today
              return current && current < dayjs().startOf('day');
            }}
          />
        </div>

        {/* Guest & Rooms Popover */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Khách & Phòng
          </label>
          <Popover
            content={guestContent}
            trigger="click"
            open={guestPopoverOpen}
            onOpenChange={setGuestPopoverOpen}
          >
            <Input
              prefix={<UserOutlined />}
              suffix={<HomeOutlined />}
              value={`${adults + children} khách, ${rooms} phòng`}
              readOnly
              size="large"
              className="cursor-pointer"
            />
          </Popover>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Tìm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchForm;
