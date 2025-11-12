import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Spin, Empty, Checkbox, Slider, Rate, Button, Select, Input, DatePicker, InputNumber } from 'antd';
import { EnvironmentOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { callSearchHotels } from 'config/api';
import AgodaHotelCard from 'components/Search/AgodaHotelCard';
import Header from 'components/HeaderClient';
import Footer from 'components/FooterClient';
import './HotelSearchPage.css';

const { Sider, Content } = Layout;

const HotelSearchPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  
  // Filters state
  const [selectedStars, setSelectedStars] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'price_low', 'price_high', 'rating'
  
  // Search params
  const destination = searchParams.get('destination');
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  const adults = searchParams.get('adults');
  const rooms = searchParams.get('rooms');

  // Local search form state
  const [qDestination, setQDestination] = useState(destination || '');
  const [qDates, setQDates] = useState(null);
  const [qAdults, setQAdults] = useState(parseInt(adults || '1'));
  const [qRooms, setQRooms] = useState(parseInt(rooms || '1'));

  // Fetch hotels on mount
  useEffect(() => {
    fetchHotels();
  }, [destination, checkIn, checkOut, adults, rooms]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [hotels, selectedStars, priceRange]);

  const fetchHotels = async () => {
    if (!destination || !checkIn || !checkOut) {
      return;
    }

    setLoading(true);
    try {
      const response = await callSearchHotels({
        destination,
        check_in: checkIn,
        check_out: checkOut,
        adults: adults || 1,
        rooms: rooms || 1
      });

      // Our axios instance returns response.data directly
      if (response && response.isSuccess) {
        setHotels(response.data || []);
        
        // Calculate max price for slider (coerce string -> number)
        if (response.data && response.data.length > 0) {
          const maxPrice = Math.max(
            ...response.data.map(h => {
              const v = parseFloat(h.min_price);
              return Number.isFinite(v) ? v : 0;
            })
          );
          setPriceRange([0, maxPrice]);
        }
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (!qDestination || !qDates || qDates.length !== 2) return;
    const params = new URLSearchParams(searchParams);
    params.set('destination', qDestination);
    params.set('check_in', qDates[0].format('YYYY-MM-DD'));
    params.set('check_out', qDates[1].format('YYYY-MM-DD'));
    params.set('adults', String(qAdults));
    params.set('rooms', String(qRooms));
    window.history.replaceState(null, '', `?${params.toString()}`);
    fetchHotels();
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    // Filter by star rating
    if (selectedStars.length > 0) {
      filtered = filtered.filter(hotel => {
        const hotelStars = Math.round(hotel.avg_star);
        return selectedStars.includes(hotelStars);
      });
    }

    // Filter by price
    filtered = filtered.filter(hotel => {
      const price = Number.parseFloat(hotel.min_price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.avg_star || 0) - (a.avg_star || 0));
        break;
      default:
        // Recommended: sort by weighted_score or popularity
        filtered.sort((a, b) => (b.total_weighted_score || 0) - (a.total_weighted_score || 0));
    }

    setFilteredHotels(filtered);
  };

  const handleStarChange = (stars) => {
    if (selectedStars.includes(stars)) {
      setSelectedStars(selectedStars.filter(s => s !== stars));
    } else {
      setSelectedStars([...selectedStars, stars]);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Search Header with Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {/* Inline search bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
              <Input placeholder="Điểm đến (thành phố/khách sạn)" value={qDestination} onChange={(e)=>setQDestination(e.target.value)} />
              <DatePicker.RangePicker format="DD/MM/YYYY" value={qDates} onChange={setQDates} />
              <InputNumber min={1} value={qAdults} onChange={(v)=>setQAdults(v||1)} addonBefore="Người lớn" className="w-full" />
              <InputNumber min={1} value={qRooms} onChange={(v)=>setQRooms(v||1)} addonBefore="Phòng" className="w-full" />
              <Button type="primary" className="bg-blue-600" onClick={handleSearchSubmit}>Tìm</Button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Khách sạn tại {destination}
                </h1>
                <p className="text-gray-600 text-sm">
                  {checkIn} - {checkOut} • {adults} người lớn • {rooms} phòng
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-3">
                <Button
                  icon={<EnvironmentOutlined />}
                  onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'map' ? 'Xem danh sách' : 'Xem trên bản đồ'}
                </Button>
                
                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'text'}
                    icon={<UnorderedListOutlined />}
                    onClick={() => setViewMode('list')}
                  />
                  <Button
                    type={viewMode === 'map' ? 'primary' : 'text'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('map')}
                  />
                </div>
              </div>
            </div>
            
            {/* Sort & Results Count */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-gray-600">
                Tìm thấy <span className="font-semibold text-gray-900">{filteredHotels.length}</span> khách sạn
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 200 }}
                  options={[
                    { label: 'Đề xuất', value: 'recommended' },
                    { label: 'Giá thấp nhất', value: 'price_low' },
                    { label: 'Giá cao nhất', value: 'price_high' },
                    { label: 'Đánh giá cao nhất', value: 'rating' },
                  ]}
                />
              </div>
            </div>
          </div>

          <Layout className="bg-transparent">
            {/* Sidebar Filters */}
            <Sider width={280} className="bg-white rounded-lg shadow-sm p-4 mr-4" style={{ height: 'fit-content' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Bộ lọc</h3>
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => {
                    setSelectedStars([]);
                    setPriceRange([0, hotels.length > 0 ? Math.max(...hotels.map(h => h.min_price || 0)) : 10000000]);
                  }}
                  className="text-blue-600"
                >
                  Xóa tất cả
                </Button>
              </div>

              {/* Star Rating Filter */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-3 text-sm">Hạng sao</h4>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="mb-2 hover:bg-gray-50 rounded p-1 transition">
                    <Checkbox
                      checked={selectedStars.includes(star)}
                      onChange={() => handleStarChange(star)}
                    >
                      <Rate disabled value={star} className="text-xs" />
                    </Checkbox>
                  </div>
                ))}
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-sm">Giá mỗi đêm</h4>
                <Slider
                  range
                  min={0}
                  max={hotels.length > 0 ? Math.max(...hotels.map(h => {
                    const v = parseFloat(h.min_price);
                    return Number.isFinite(v) ? v : 0;
                  })) : 10000000}
                  value={priceRange}
                  onChange={setPriceRange}
                  step={100000}
                  tooltip={{
                    formatter: (value) => `${formatPrice(value)} ₫`
                  }}
                  trackStyle={[{ backgroundColor: '#1890ff' }]}
                  handleStyle={[{ borderColor: '#1890ff' }, { borderColor: '#1890ff' }]}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-3">
                  <div className="bg-gray-50 px-2 py-1 rounded">
                    {formatPrice(priceRange[0])} ₫
                  </div>
                  <div className="bg-gray-50 px-2 py-1 rounded">
                    {formatPrice(priceRange[1])} ₫
                  </div>
                </div>
              </div>
            </Sider>

            {/* Hotel List Content */}
            <Content className="bg-transparent">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin size="large" />
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8">
                  <Empty description="Không tìm thấy khách sạn nào" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHotels.map(hotel => (
                    <AgodaHotelCard
                      key={hotel.id}
                      hotel={hotel}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      adults={adults}
                      rooms={rooms}
                    />
                  ))}
                </div>
              )}
            </Content>
          </Layout>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelSearchPage;
