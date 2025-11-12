import { Calendar, MapPin, Plane, Users, RefreshCw, Hotel, Home, Activity, Car } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AirportSearchInput from "../Home/BackgroundTab/AirportSearchInput";

const SearchBarSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Trip type
  const [tripType, setTripType] = useState("oneway");
  
  // Airports
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  
  // Dates
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  
  // Passengers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seatClass, setSeatClass] = useState("Phổ thông");
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);
  
  // Hotel bundle
  const [includeHotel, setIncludeHotel] = useState(false);
  
  const dateRef = useRef(null);
  const returnDateRef = useRef(null);
  const passengerRef = useRef(null);

  // Helper to format airport display value
  const formatAirportDisplay = (airport) => {
    if (!airport) return '';
    if (airport.isAllAirports) {
      return airport.city?.name || airport.name;
    }
    // Get airport code
    const getCode = (name) => {
      const codes = {
        'Nội Bài': 'HAN',
        'Tân Sơn Nhất': 'SGN',
        'Đà Nẵng': 'DAD',
        'Phú Quốc': 'PQC',
        'Cam Ranh': 'CXR',
        'Phù Cát': 'UIH',
        'Vinh': 'VII',
        'Buôn Ma Thuột': 'BMV'
      };
      for (const [key, code] of Object.entries(codes)) {
        if (name.includes(key)) return code;
      }
      return name.substring(0, 3).toUpperCase();
    };
    
    const cityName = airport.city?.name || airport.name;
    const code = getCode(airport.name);
    return `${cityName} (${code})`;
  };

  // Initialize from URL params
  useEffect(() => {
    const originId = searchParams.get('origin_id');
    const destId = searchParams.get('destination_id');
    const depDate = searchParams.get('departure_date');
    
    if (depDate) {
      setDepartureDate(new Date(depDate));
    }
    
    // Load airport info if IDs provided
    // You can add logic here to fetch and set airports based on IDs
  }, [searchParams]);

  // Generate calendar months
  const generateCalendarMonths = (startDate) => {
    const months = [];
    for (let i = 0; i < 2; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      months.push(date);
    }
    return months;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const handleSearch = () => {
    console.log('=== SEARCH BUTTON CLICKED ===');
    console.log('From Airport:', fromAirport);
    console.log('To Airport:', toAirport);
    
    if (!fromAirport || !toAirport) {
      alert('Vui lòng chọn điểm đi và điểm đến');
      return;
    }

    if (!fromAirport.id || !toAirport.id) {
      console.error('Airport IDs missing!', { fromAirport, toAirport });
      alert('Lỗi: Không lấy được ID sân bay. Vui lòng chọn lại.');
      return;
    }

    const params = new URLSearchParams();
    params.append('origin_id', fromAirport.id);
    params.append('destination_id', toAirport.id);
    params.append('departure_date', departureDate.toISOString().split('T')[0]);
    if (tripType === 'roundtrip' && returnDate) {
      params.append('return_date', returnDate.toISOString().split('T')[0]);
    }
    params.append('passengers', adults + children + infants);
    params.append('adults', adults);
    params.append('children', children);
    params.append('infants', infants);
    params.append('seat_class', seatClass);
    
    console.log('Search params:', params.toString());
    navigate(`/flight?${params.toString()}`);
  };

  return (
    <>
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              <Hotel className="w-5 h-5" />
              <span className="font-medium">Khách sạn</span>
            </button>
            <button 
              onClick={() => navigate('/home-apartment')}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Nhà và Căn hộ</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors relative">
              <Plane className="w-5 h-5" />
              <span className="font-medium">Máy bay + K.san</span>
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Đặt gói Tiết kiệm</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-blue-600 border-b-2 border-blue-600 font-medium relative">
              <Plane className="w-5 h-5" />
              <span>Vé máy bay</span>
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Mới</span>
            </button>
            <button 
              onClick={() => navigate('/activity')}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Hoạt động</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
              <Car className="w-5 h-5" />
              <span className="font-medium">Đưa đón sân bay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto mt-6">
        {/* Trip Type Tabs */}
        <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTripType("oneway")}
          className={`px-8 py-2.5 rounded-full font-medium transition-all ${
            tripType === "oneway"
              ? "border-2 border-blue-600 text-blue-600 bg-white"
              : "border border-gray-300 text-gray-700 bg-gray-50"
          }`}
        >
          Một chiều
        </button>
        <button
          onClick={() => setTripType("roundtrip")}
          className={`px-8 py-2.5 rounded-full font-medium transition-all ${
            tripType === "roundtrip"
              ? "border-2 border-blue-600 text-blue-600 bg-white"
              : "border border-gray-300 text-gray-700 bg-gray-50"
          }`}
        >
          Khứ hồi
        </button>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4">
        {/* Row 1: From & To with Swap */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Bay từ */}
          <AirportSearchInput
            placeholder="Bay từ"
            onSelect={(airport) => setFromAirport(airport)}
            value={formatAirportDisplay(fromAirport)}
            icon={Plane}
            iconClassName="w-5 h-5 text-blue-600 transform rotate-45"
          />

          {/* Swap Button */}
          <button
            onClick={() => {
              const temp = fromAirport;
              setFromAirport(toAirport);
              setToAirport(temp);
            }}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>

          {/* Bay đến */}
          <AirportSearchInput
            placeholder="Bay đến"
            onSelect={(airport) => setToAirport(airport)}
            value={formatAirportDisplay(toAirport)}
            icon={MapPin}
            iconClassName="w-5 h-5 text-blue-600"
          />
        </div>

        {/* Row 2: Dates & Passengers */}
        <div className="grid grid-cols-2 gap-4">
          {/* Dates */}
          <div className={`grid ${tripType === 'roundtrip' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            {/* Departure Date */}
            <div ref={dateRef} className="relative">
              <div
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Ngày đi</div>
                    <div className="text-gray-900 font-medium">
                      {departureDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Popup */}
              {showDatePicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <div className="flex gap-4">
                      {generateCalendarMonths(departureDate).map((monthDate, idx) => (
                        <div key={idx} className="min-w-[280px]">
                          <div className="text-center font-medium mb-3">
                            Tháng {monthDate.getMonth() + 1} {monthDate.getFullYear()}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                              <div key={day} className="text-center text-xs text-gray-500 py-2">
                                {day}
                              </div>
                            ))}
                            {getDaysInMonth(monthDate).map((day, dayIdx) => (
                              <div key={dayIdx}>
                                {day ? (
                                  <button
                                    onClick={() => {
                                      setDepartureDate(day);
                                      setShowDatePicker(false);
                                    }}
                                    className={`w-full aspect-square rounded-lg text-sm transition-all duration-200 ${
                                      isSameDay(day, departureDate)
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-blue-50 text-gray-700'
                                    }`}
                                  >
                                    {day.getDate()}
                                  </button>
                                ) : (
                                  <div className="w-full aspect-square" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Return Date (only for roundtrip) */}
            {tripType === 'roundtrip' && (
              <div ref={returnDateRef} className="relative">
                <div
                  onClick={() => setShowReturnDatePicker(!showReturnDatePicker)}
                  className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Ngày về</div>
                      <div className="text-gray-900 font-medium">
                        {returnDate ? returnDate.toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'Chọn ngày'}
                      </div>
                    </div>
                  </div>
                </div>

                {showReturnDatePicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowReturnDatePicker(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                      <div className="flex gap-4">
                        {generateCalendarMonths(departureDate).map((monthDate, idx) => (
                          <div key={idx} className="min-w-[280px]">
                            <div className="text-center font-medium mb-3">
                              Tháng {monthDate.getMonth() + 1} {monthDate.getFullYear()}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                                <div key={day} className="text-center text-xs text-gray-500 py-2">
                                  {day}
                                </div>
                              ))}
                              {getDaysInMonth(monthDate).map((day, dayIdx) => (
                                <div key={dayIdx}>
                                  {day ? (
                                    <button
                                      onClick={() => {
                                        setReturnDate(day);
                                        setShowReturnDatePicker(false);
                                      }}
                                      className={`w-full aspect-square rounded-lg text-sm transition-all duration-200 ${
                                        isSameDay(day, returnDate)
                                          ? 'bg-blue-600 text-white'
                                          : 'hover:bg-blue-50 text-gray-700'
                                      }`}
                                    >
                                      {day.getDate()}
                                    </button>
                                  ) : (
                                    <div className="w-full aspect-square" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Passengers */}
          <div ref={passengerRef} className="relative">
            <div
              onClick={() => setShowPassengerPicker(!showPassengerPicker)}
              className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-gray-900 font-medium">
                    {adults + children + infants} Hành khách, {seatClass}
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Picker */}
            {showPassengerPicker && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowPassengerPicker(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-5 z-50">
                  {/* Passengers */}
                  <div className="space-y-4 mb-5">
                    {[
                      { label: "Người lớn", sublabel: "(12 tuổi trở lên)", value: adults, setValue: setAdults, min: 1 },
                      { label: "Trẻ em", sublabel: "(2–11 tuổi)", value: children, setValue: setChildren, min: 0 },
                      { label: "Trẻ sơ sinh", sublabel: "(dưới 2 tuổi)", value: infants, setValue: setInfants, min: 0 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.sublabel}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              item.setValue(Math.max(item.min, item.value - 1));
                            }}
                            disabled={item.value <= item.min}
                            className="w-9 h-9 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">{item.value}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              item.setValue(item.value + 1);
                            }}
                            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Seat Class */}
                  <div className="grid grid-cols-2 gap-3">
                    {["Phổ thông", "Phổ thông cao cấp", "Thương gia", "Hạng nhất"].map((cls) => (
                      <button
                        key={cls}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeatClass(cls);
                        }}
                        className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${
                          seatClass === cls
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hotel Bundle Checkbox */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="hotel-bundle"
            checked={includeHotel}
            onChange={(e) => setIncludeHotel(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="hotel-bundle" className="text-sm text-gray-700 cursor-pointer">
            Thêm khách sạn để tiết kiệm tới 25%
          </label>
          <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Đặt gói để Tiết kiệm
          </span>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg text-lg"
        >
          TÌM CHUYẾN BAY
        </button>
      </div>
    </div>
    </>
  );
};

export default SearchBarSection;
