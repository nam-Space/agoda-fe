import { EnvironmentOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Input, Popover, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { callGetSearchSuggestions } from '../../config/api';

const { RangePicker } = DatePicker;

const SearchForm = ({ onSearch }) => {
  const [searchValues, setSearchValues] = useState({
    location: '',
    dates: [null, null],
    rooms: 1,
    adults: 1,
    children: 0,
  });

  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // 🔹 Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();

  const handleSearch = () => {
    onSearch(searchValues);
    setShowSuggestions(false);
  };

  // 🔹 Lấy gợi ý từ API khi người dùng gõ
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = searchValues.location.trim();
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await callGetSearchSuggestions(`q=${encodeURIComponent(query)}`);
        setSuggestions(response.data.data.filtered_suggestions || []);
      } catch (err) {
        console.error('Fetch suggestions failed:', err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchValues.location]);

  // 🔹 Chọn suggestion
  const handleSelectSuggestion = (item) => {
    setSearchValues({ ...searchValues, location: item.name });
    setShowSuggestions(false);
  };

  // 🔹 Đóng autocomplete khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const GuestPopoverContent = () => (
    <div className="w-72 p-2">
      {['rooms', 'adults', 'children'].map((type) => (
        <div key={type}>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">
                {type === 'rooms' ? 'Phòng' : type === 'adults' ? 'Người lớn' : 'Trẻ em'}
              </div>
              {type === 'adults' && <div className="text-sm text-gray-500">18 tuổi trở lên</div>}
              {type === 'children' && <div className="text-sm text-gray-500">0-17 tuổi</div>}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="text"
                shape="circle"
                onClick={() =>
                  setSearchValues({
                    ...searchValues,
                    [type]:
                      type === 'children'
                        ? Math.max(0, searchValues[type] - 1)
                        : Math.max(1, searchValues[type] - 1),
                  })
                }
                disabled={
                  (type === 'rooms' && searchValues.rooms <= 1) ||
                  (type === 'adults' && searchValues.adults <= 1) ||
                  (type === 'children' && searchValues.children <= 0)
                }
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">{searchValues[type]}</span>
              <Button
                type="text"
                shape="circle"
                onClick={() =>
                  setSearchValues({
                    ...searchValues,
                    [type]: Math.min(10, searchValues[type] + 1),
                  })
                }
                disabled={searchValues[type] >= 10}
              >
                +
              </Button>
            </div>
          </div>
          {type !== 'children' && <Divider className="my-2" />}
        </div>
      ))}
    </div>
  );

  const getGuestSummary = () => {
    const totalGuests = searchValues.adults + searchValues.children;
    return `${totalGuests} người lớn${searchValues.children > 0 ? `, ${searchValues.children} trẻ em` : ''}, ${searchValues.rooms} phòng`;
  };

  return (
    <>
      {(guestPopoverOpen || datePickerOpen) && (
        <div
          className="fixed inset-0 bg-black opacity-35 z-10"
          onClick={() => {
            setGuestPopoverOpen(false);
            setDatePickerOpen(false);
          }}
        />
      )}

      <Card className="mb-6 shadow-lg relative z-20">
        <Row gutter={[16, 16]} align="middle">
          {/* Location with autocomplete */}
          <Col xs={24} md={6}>
            <div className="relative" ref={inputRef}>
              <Input
                size="large"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="Nhập thành phố hoặc khách sạn"
                value={searchValues.location}
                onChange={(e) => {
                  setSearchValues({ ...searchValues, location: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded z-50 max-h-64 overflow-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      {item.type === 'city' ? `Thành phố: ${item.name}` : `Khách sạn: ${item.name}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Date Range */}
          <Col xs={24} md={8}>
            <RangePicker
              size="large"
              className="w-full"
              value={searchValues.dates}
              onChange={(dates) => setSearchValues({ ...searchValues, dates: dates || [] })}
              format="DD/MM/YYYY"
              open={datePickerOpen}
              onOpenChange={setDatePickerOpen}
              placeholder={['Nhận phòng', 'Trả phòng']}
            />
          </Col>

          {/* Guests */}
          <Col xs={24} md={6}>
            <Popover
              content={<GuestPopoverContent />}
              trigger="click"
              open={guestPopoverOpen}
              onOpenChange={setGuestPopoverOpen}
              placement="bottomLeft"
              overlayClassName="z-30"
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                value={getGuestSummary()}
                readOnly
                className="cursor-pointer"
                placeholder="Chọn số khách"
              />
            </Popover>
          </Col>

          {/* Search Button */}
          <Col xs={24} md={4}>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default SearchForm;
