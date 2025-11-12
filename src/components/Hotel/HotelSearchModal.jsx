import React, { useState } from 'react';
import { Modal, Tabs, Input, DatePicker, Button, Radio, Calendar, Badge } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './HotelSearchModal.css';

const { TabPane } = Tabs;

const HotelSearchModal = ({ visible, onClose }) => {
  const navigate = useNavigate();
  
  // State
  const [stayType, setStayType] = useState('overnight'); // overnight or hourly
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(dayjs().add(1, 'day'));
  const [checkOut, setCheckOut] = useState(dayjs().add(2, 'day'));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [dateTab, setDateTab] = useState('fixed'); // fixed or flexible
  const [flexibleStay, setFlexibleStay] = useState('3days'); // 3days, 1week, 1month
  const [flexibleMonth, setFlexibleMonth] = useState(null);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  
  // Recent searches (mock data)
  const recentSearches = [
    {
      destination: 'Hồ Chí Minh, Việt Nam',
      dates: '12 tháng 11 2025 - 13 tháng 11 2025',
      guests: 2
    }
  ];
  
  // Featured properties
  const featuredProperties = [
    {
      name: 'The Ascott Limited',
      tag: 'Tầm hướng ký nghỉ theo cách của quý khách',
      icon: '🏢'
    },
    {
      name: 'Khách sạn và Khu nghỉ dưỡng U',
      tags: ['Đơn giản', 'Truyền cảm hứng', 'Quý khách'],
      icon: '🏨'
    }
  ];
  
  // Popular destinations - Vietnam
  const vietnamDestinations = [
    { name: 'Hồ Chí Minh', count: '(15,546)', tags: ['nhà hàng', 'mua sắm'], image: '🏙️' },
    { name: 'Hà Nội', count: '(10,744)', tags: ['nhà hàng', 'tham quan'], image: '🏛️' },
    { name: 'Vũng Tàu', count: '(6,329)', tags: ['bãi biển', 'nhà hàng'], image: '🏖️' },
    { name: 'Nha Trang', count: '(4,098)', tags: ['bãi biển', 'nhà hàng'], image: '🌊' },
    { name: 'Đà Nẵng', count: '(5,534)', tags: ['bãi biển', 'tham quan'], image: '🌉' },
    { name: 'Đà Lạt', count: '(5,165)', tags: ['thiên nhiên', 'tham quan'], image: '🌲' }
  ];
  
  // International destinations
  const internationalDestinations = [
    { name: 'Singapore', count: '(1,326)', tags: ['mua sắm', 'nhà hàng'], image: '🦁' },
    { name: 'Seoul', count: '(5,945)', tags: ['mua sắm', 'nhà hàng'], image: '🏯' },
    { name: 'Bangkok', count: '(12,048)', tags: ['mua sắm', 'nhà hàng'], image: '🛕' }
  ];
  
  // Price per date (mock data)
  const pricePerDate = {
    '2025-11-12': '1.146k',
    '2025-11-13': '1.104k',
    '2025-11-14': '1.323k',
    // ... more dates
  };
  
  const handleSearch = () => {
    const params = new URLSearchParams({
      destination,
      check_in: checkIn.format('YYYY-MM-DD'),
      check_out: checkOut.format('YYYY-MM-DD'),
      adults: guests.adults,
      rooms: guests.rooms
    });
    
    navigate(`/search?${params.toString()}`);
    onClose();
  };
  
  const renderDateCell = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const price = pricePerDate[dateStr];
    
    return (
      <div className="calendar-cell">
        <div className="date-number">{date.date()}</div>
        {price && <div className="date-price">{price}</div>}
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={960}
      className="hotel-search-modal"
      destroyOnClose
    >
      {/* Main Tabs */}
      <Tabs defaultActiveKey="hotel" className="main-tabs">
        <TabPane 
          tab={<span><EnvironmentOutlined /> Khách sạn</span>} 
          key="hotel"
        />
        <TabPane tab="Nhà và Căn hộ" key="homes" disabled />
        <TabPane tab={<span><span className="tab-badge">Đặt Gì Tiết Kiệm</span>Máy bay + K.sạn</span>} key="flights" disabled />
        <TabPane tab="Vé máy bay" key="plane" disabled />
        <TabPane tab={<span><span className="tab-badge">Mới</span>Hoạt động</span>} key="activities" disabled />
        <TabPane tab="Đưa đón sân bay" key="airport" disabled />
      </Tabs>
      
      <div className="search-content">
        {/* Stay Type Toggle */}
        <div className="stay-type-toggle mb-4">
          <Radio.Group value={stayType} onChange={(e) => setStayType(e.target.value)}>
            <Radio.Button value="overnight" className="rounded-pill">
              Chỗ Ở Qua Đêm
            </Radio.Button>
            <Radio.Button value="hourly" className="rounded-pill ml-2">
              Chỗ Ở Trong Ngày
            </Radio.Button>
          </Radio.Group>
        </div>
        
        {/* Destination Input */}
        <div className="destination-input-wrapper mb-4">
          <Input
            size="large"
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Nhập điểm du lịch hoặc tên khách sạn"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestinationDropdown(true)}
            className="destination-input"
          />
        </div>
        
        {showDestinationDropdown && (
          <div className="destination-dropdown">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="dropdown-section">
                <div className="section-title">Tìm kiếm gần đây</div>
                {recentSearches.map((search, idx) => (
                  <div key={idx} className="recent-search-item" onClick={() => {
                    setDestination(search.destination);
                    setShowDestinationDropdown(false);
                  }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{search.destination}</div>
                        <div className="text-sm text-gray-500">{search.dates}</div>
                      </div>
                      <div className="text-gray-500">
                        <UserOutlined /> {search.guests}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Featured Properties */}
            <div className="dropdown-section">
              <div className="section-title">Cơ sở lưu trú nổi bật tại</div>
              <div className="flex gap-3">
                {featuredProperties.map((prop, idx) => (
                  <div key={idx} className="featured-property-card">
                    <div className="property-icon">{prop.icon}</div>
                    <div className="property-name font-semibold">{prop.name}</div>
                    <div className="property-tags text-xs text-blue-600">
                      {Array.isArray(prop.tags) ? prop.tags.join('. ') : prop.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular Destinations */}
            <div className="destinations-grid">
              <div className="destinations-column">
                <div className="section-title">Các điểm đến ở Việt Nam</div>
                {vietnamDestinations.map((dest, idx) => (
                  <div 
                    key={idx} 
                    className="destination-item"
                    onClick={() => {
                      setDestination(dest.name);
                      setShowDestinationDropdown(false);
                    }}
                  >
                    <div className="dest-image">{dest.image}</div>
                    <div className="dest-info">
                      <div className="dest-name">
                        {dest.name} <span className="dest-count">{dest.count}</span>
                      </div>
                      <div className="dest-tags">{dest.tags.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="destinations-column">
                <div className="section-title">Các điểm đến quốc tế</div>
                {internationalDestinations.map((dest, idx) => (
                  <div 
                    key={idx} 
                    className="destination-item"
                    onClick={() => {
                      setDestination(dest.name);
                      setShowDestinationDropdown(false);
                    }}
                  >
                    <div className="dest-image">{dest.image}</div>
                    <div className="dest-info">
                      <div className="dest-name">
                        {dest.name} <span className="dest-count">{dest.count}</span>
                      </div>
                      <div className="dest-tags">{dest.tags.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Date Selection */}
        <div className="date-selection mb-4">
          <Tabs activeKey={dateTab} onChange={setDateTab} className="date-tabs">
            <TabPane tab="Lịch" key="fixed">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="date-picker-wrapper">
                  <div className="text-sm text-gray-600 mb-1">Nhận phòng</div>
                  <DatePicker
                    value={checkIn}
                    onChange={setCheckIn}
                    format="DD [tháng] MM YYYY"
                    className="w-full"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {checkIn.format('dddd')}
                  </div>
                </div>
                
                <div className="date-picker-wrapper">
                  <div className="text-sm text-gray-600 mb-1">Trả phòng</div>
                  <DatePicker
                    value={checkOut}
                    onChange={setCheckOut}
                    format="DD [tháng] MM YYYY"
                    className="w-full"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {checkOut.format('dddd')}
                  </div>
                </div>
              </div>
              
              {/* Dual Calendar */}
              <div className="dual-calendar">
                <Calendar
                  fullscreen={false}
                  value={checkIn}
                  onSelect={setCheckIn}
                  dateFullCellRender={renderDateCell}
                  headerRender={({ value, onChange }) => (
                    <div className="calendar-header">
                      <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                        ‹
                      </Button>
                      <span>{value.format('Tháng MM YYYY')}</span>
                      <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                        ›
                      </Button>
                    </div>
                  )}
                />
                
                <Calendar
                  fullscreen={false}
                  value={checkOut}
                  onSelect={setCheckOut}
                  dateFullCellRender={renderDateCell}
                  headerRender={({ value, onChange }) => (
                    <div className="calendar-header">
                      <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                        ‹
                      </Button>
                      <span>{value.format('Tháng MM YYYY')}</span>
                      <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                        ›
                      </Button>
                    </div>
                  )}
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Giá ước tính (theo VNĐ) chỉ mốt đêm ở trong một căn phòng 3 sao cho vị trí được tìm kiếm
              </div>
            </TabPane>
            
            <TabPane tab="Linh hoạt" key="flexible">
              <div className="flexible-options">
                {/* Stay Duration */}
                <div className="mb-6">
                  <div className="font-semibold mb-3">
                    Quý khách muốn lưu trú trong bao lâu?
                  </div>
                  <Radio.Group value={flexibleStay} onChange={(e) => setFlexibleStay(e.target.value)}>
                    <Radio.Button value="3days" className="rounded-pill">3 đêm</Radio.Button>
                    <Radio.Button value="1week" className="rounded-pill ml-2">1 tuần</Radio.Button>
                    <Radio.Button value="1month" className="rounded-pill ml-2">1 tháng</Radio.Button>
                  </Radio.Group>
                </div>
                
                {/* Month Selection */}
                <div>
                  <div className="font-semibold mb-3">
                    Quý khách muốn đi vào lúc nào?
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Có thể chọn nhiều tháng
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {['Tháng 11\n2025', 'Tháng 12\n2025', 'Tháng 1\n2026', 'Tháng 2\n2026', 'Tháng 3\n2026', 'Tháng 4\n2026'].map((month, idx) => (
                      <div
                        key={idx}
                        className={`month-card ${flexibleMonth === month ? 'selected' : ''}`}
                        onClick={() => setFlexibleMonth(month)}
                      >
                        <CalendarOutlined className="text-2xl mb-2" />
                        <div className="whitespace-pre-line text-center text-sm">
                          {month}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={() => setFlexibleMonth(null)}>Xóa</Button>
                  <Button type="primary" onClick={handleSearch}>Chọn</Button>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        
        {/* Guests & Rooms */}
        <div className="guests-rooms mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Khách</div>
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>{guests.adults} người lớn</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Phòng</div>
              <div className="flex items-center gap-2">
                <span>{guests.rooms} phòng</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Button */}
        <div className="text-center">
          <Button
            type="primary"
            size="large"
            className="search-button"
            onClick={handleSearch}
            disabled={!destination}
          >
            Tìm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HotelSearchModal;
