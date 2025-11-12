import { callBook } from 'config/api';
import { SERVICE_TYPE } from 'constants/booking';
import { Check, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/hooks';

const FlightListAgoda = ({ flights = [], bookingInfo = {} }) => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.account.user);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}p`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getAirlineLogoUrl = (airline) => {
    // Map airline names to Agoda CDN logo URLs
    const airlineLogos = {
      'Vietnam Airlines': 'https://img.agoda.net/images/mvc/default/airlines/VN_v1.png?s=116x',
      'VietJet Air': 'https://img.agoda.net/images/mvc/default/airlines/VJ_v3.png?s=116x',
      'Thai Airways': 'https://img.agoda.net/images/mvc/default/airlines/TG_v1.png?s=116x',
      'Default': 'https://via.placeholder.com/60x60?text=Airline'
    };
    
    return airlineLogos[airline] || airlineLogos['Default'];
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Map Vietnamese seat class to English for API
  const mapSeatClassToEnglish = (seatClass) => {
    const mapping = {
      'Phổ thông': 'Economy',
      'Economy': 'Economy',
      'Thương gia': 'Business',
      'Business': 'Business',
      'Hạng nhất': 'First',
      'First': 'First'
    };
    return mapping[seatClass] || 'Economy';
  };

  const handleSelectFlight = async (flight) => {
    if (isBooking) return; // Prevent double click

    try {
      setIsBooking(true);
      
      // Prepare booking data with placeholder guest info (will be updated in booking page)
      const bookingData = {
        service_type: SERVICE_TYPE.FLIGHT,
        total_price: flight.price * bookingInfo.passengers,
        guest_info: {
          full_name: user?.username || 'Guest User',
          email: user?.email || 'guest@example.com',
          phone: user?.phone || '0000000000',
          country: 'Vietnam'
        },
        flight_detail: {
          flight_id: flight.id,
          seat_class: mapSeatClassToEnglish(bookingInfo.seat_class || 'Economy'),
          num_passengers: bookingInfo.passengers || 1
        }
      };

      console.log('📝 Creating booking:', bookingData);
      
      // Call booking API
      const res = await callBook(bookingData);
      console.log('✅ Booking response:', res);
      
      if (res?.isSuccess || res?.booking_id) {
        const bookingId = res.booking_id;
        const refId = res.data?.id || res.id;
        
        toast.success('Tạo booking thành công!');
        
        // Redirect to booking page (BookingContactActivity)
        navigate(
          `/book?booking_id=${bookingId}&type=${SERVICE_TYPE.FLIGHT}&ref=${refId}`,
          {
            state: {
              flight,
              bookingInfo
            }
          }
        );
      } else {
        toast.error(res?.message || 'Không thể tạo booking');
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      toast.error('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại!');
    } finally {
      setIsBooking(false);
    }
  };

  if (flights.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border">
        <Plane className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Không tìm thấy chuyến bay phù hợp</p>
        <p className="text-gray-400 text-sm mt-2">Vui lòng thử tìm kiếm với tiêu chí khác</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flights.map((flight, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Flight Card */}
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Airline Logo */}
                <div className="flex-shrink-0 w-16">
                  <img
                    src={getAirlineLogoUrl(flight.airline)}
                    alt={flight.airline}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x60?text=Airline';
                    }}
                  />
                </div>

                {/* Flight Info */}
                <div className="flex-1 min-w-0">
                  {/* Airline Name */}
                  <div className="text-sm text-gray-600 mb-1">{flight.airline}</div>
                  
                  {/* Times and Duration */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatTime(flight.departure_datetime)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(flight.departure_datetime).split('/')[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-sm text-gray-500">{formatDuration(flight.duration_minutes)}</div>
                      <div className="w-full h-px bg-gray-300 my-1"></div>
                      <div className="text-xs text-green-600 font-medium">Bay thẳng</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatTime(flight.arrival_datetime)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(flight.arrival_datetime).split('/')[0]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Flight Number */}
                  <div className="text-xs text-gray-400 mt-1">
                    {flight.flight_number}
                  </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-right min-w-[180px]">
                  {/* Discount Badge */}
                  {Math.random() > 0.5 && (
                    <div className="text-xs text-red-600 font-semibold mb-1">
                      Giảm VJ-{Math.floor(Math.random() * 9000) + 1000}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-1">Giá mỗi khách</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(flight.price)} đ
                  </div>
                  
                  {/* Included Info */}
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1 justify-end">
                    <Check className="w-3 h-3" />
                    <span>Đã bao gồm</span>
                  </div>
                  
                  <button
                    onClick={() => toggleExpand(index)}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 ml-auto"
                  >
                    Xem chi tiết
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t bg-gray-50 p-4">
                <div className="space-y-4">
                  {/* Route Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Khởi hành</div>
                      <div className="font-semibold">{formatTime(flight.departure_datetime)}</div>
                      <div className="text-sm text-gray-600">{flight.origin_name}</div>
                      <div className="text-xs text-gray-500">{flight.origin_city}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Đến</div>
                      <div className="font-semibold">{formatTime(flight.arrival_datetime)}</div>
                      <div className="text-sm text-gray-600">{flight.destination_name}</div>
                      <div className="text-xs text-gray-500">{flight.destination_city}</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t">
                    <div>
                      <div className="text-xs text-gray-500">Thời gian bay</div>
                      <div className="text-sm font-medium">{formatDuration(flight.duration_minutes)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Hạng ghế</div>
                      <div className="text-sm font-medium">Phổ thông</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Số chỗ còn</div>
                      {/* <div className="text-sm font-medium">{flight.seat_capacity} chỗ</div> */}
                      <div className="text-sm font-medium">{flight.available_seats} chỗ</div>

                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectFlight(flight)}
                    disabled={isBooking}
                    className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isBooking 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isBooking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      'Chọn chuyến bay'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FlightListAgoda;
