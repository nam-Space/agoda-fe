import { Calendar, MapPin, Plane, Users, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirportSearchInput from "./AirportSearchInput";

const FlightTicketTab = () => {
  const navigate = useNavigate();
  
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
  
  const dateRef = useRef(null);
  const returnDateRef = useRef(null);
  const passengerRef = useRef(null);

  // Handle swap airports
  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

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

  // Generate calendar
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
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
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

    // Validate departure date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    
    if (depDate < today) {
      alert('Ngày đi phải từ hôm nay trở đi');
      return;
    }

    // Validate return date > departure date
    if (tripType === 'roundtrip' && returnDate) {
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      if (retDate <= depDate) {
        alert('Ngày về phải sau ngày đi');
        return;
      }
    }

    // Format date as YYYY-MM-DD using local time (fix timezone bug)
    const formatDateLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const params = new URLSearchParams();
    params.append('origin_id', fromAirport.id);
    params.append('destination_id', toAirport.id);
    params.append('departure_date', formatDateLocal(departureDate));
    if (tripType === 'roundtrip' && returnDate) {
      params.append('return_date', formatDateLocal(returnDate));
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
    <div>
      {/* Trip Type Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setTripType("oneway")}
          className={`px-8 py-2 rounded-full font-medium transition-all ${
            tripType === "oneway"
              ? "border-2 border-blue-600 text-blue-600 bg-white"
              : "border border-gray-300 text-gray-700 bg-gray-50"
          }`}
        >
          Một chiều
        </button>
        <button
          onClick={() => setTripType("roundtrip")}
          className={`px-8 py-2 rounded-full font-medium transition-all ${
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
            onClick={handleSwapAirports}
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

        {/* Row 2: Date(s) & Passengers */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date(s) - conditional based on trip type */}
          <div className={`${tripType === 'roundtrip' ? 'grid grid-cols-2 gap-4' : ''}`}>
            {/* Departure Date */}
            <div ref={dateRef} className="relative">
              <div
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200 bg-white"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Ngày đi</div>
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

            {/* Return Date - only for roundtrip */}
            {tripType === 'roundtrip' && (
              <div ref={returnDateRef} className="relative">
                <div
                  onClick={() => setShowReturnDatePicker(!showReturnDatePicker)}
                  className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Ngày về</div>
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
              className="border border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div className="text-gray-900 font-medium">
                  {adults + children + infants} Hành khách, {seatClass}
                </div>
              </div>
            </div>

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

                  {/* Seat Class - Grid 2x2 */}
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

        {/* Hotel bundle checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hotel-bundle-home"
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="hotel-bundle-home" className="text-sm text-gray-700 cursor-pointer">
            Thêm khách sạn để tiết kiệm tới 25%
          </label>
          <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Đặt gói để Tiết kiệm
          </span>
        </div>
      </div>

      {/* Search Button - outside form box */}
      <div className="flex justify-center -mb-6">
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-32 rounded-xl transition-all duration-200 shadow-lg text-lg"
        >
          TÌM CHUYẾN BAY
        </button>
      </div>
    </div>
  );
};

export default FlightTicketTab;
