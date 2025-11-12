import Footer from 'components/FooterClient';
import Header from 'components/HeaderClient';
import { callBook } from 'config/api';
import { SERVICE_TYPE } from 'constants/booking';
import { CheckCircle2, CreditCard, Plane, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/hooks';

const FlightBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, serviceType, bookingInfo } = location.state || {};
  const user = useAppSelector(state => state.account.user);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Guest info
  const [guestInfo, setGuestInfo] = useState({
    full_name: user?.username || '',
    email: user?.email || '',
    phone: '',
    country: 'Vietnam',
    special_request: ''
  });
  
  // Flight booking details - get from bookingInfo (passed from flight list)
  const [bookingDetails, setBookingDetails] = useState({
    num_passengers: bookingInfo?.passengers || bookingInfo?.adults + bookingInfo?.children + bookingInfo?.infants || 1,
    seat_class: bookingInfo?.seat_class || 'Economy',
    adults: bookingInfo?.adults || 1,
    children: bookingInfo?.children || 0,
    infants: bookingInfo?.infants || 0
  });
  
  // Payment info
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    if (!flight) {
      toast.error('Vui lòng chọn chuyến bay trước');
      navigate('/flight');
    }
  }, [flight, navigate]);

  if (!flight) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPrice = flight.price * bookingDetails.num_passengers;

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

  const handleSubmit = async () => {
    if (step === 1) {
      // Validate guest info
      if (!guestInfo.full_name || !guestInfo.email || !guestInfo.phone) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Create booking theo quy trình chuẩn
      setLoading(true);
      try {
        const bookingData = {
          service_type: SERVICE_TYPE.FLIGHT,
          total_price: totalPrice,
          guest_info: guestInfo,
          flight_detail: {
            flight_id: flight.id,
            seat_class: mapSeatClassToEnglish(bookingDetails.seat_class),
            num_passengers: bookingDetails.num_passengers
          }
        };

        const res = await callBook(bookingData);
        console.log('📝 Booking response:', res);
        
        if (res?.isSuccess || res?.booking_id) {
          const bookingId = res.booking_id;
          const refId = res.data?.id || res.id;
          
          toast.success('Tạo booking thành công! Chuyển đến trang thanh toán...');
          
          // Redirect đến trang booking chuẩn để xử lý payment
          setTimeout(() => {
            navigate(
              `/book?booking_id=${bookingId}&type=${SERVICE_TYPE.FLIGHT}&ref=${refId}`,
              {
                state: {
                  flight,
                  bookingDetails,
                  totalPrice,
                  paymentMethod
                }
              }
            );
          }, 500);
        } else {
          toast.error(res?.message || 'Lỗi tạo booking');
        }
      } catch (error) {
        console.error('❌ Booking error:', error);
        toast.error('Có lỗi xảy ra khi tạo booking');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-[1152px] mx-auto px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {[
                { num: 1, label: 'Thông tin khách hàng', icon: User },
                { num: 2, label: 'Chi tiết thanh toán', icon: CreditCard },
                { num: 3, label: 'Đã xác nhận đặt chỗ', icon: CheckCircle2 }
              ].map((item, idx) => (
                <div key={item.num} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= item.num ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${step >= item.num ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                      {item.num}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {idx < 2 && <div className={`w-20 h-1 mx-3 ${step > item.num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Thông tin hành khách</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Họ và tên</label>
                      <input
                        type="text"
                        value={guestInfo.full_name}
                        onChange={(e) => setGuestInfo({...guestInfo, full_name: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="0123456789"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Số hành khách</label>
                      <input
                        type="number"
                        min="1"
                        max={flight.seat_capacity}
                        value={bookingDetails.num_passengers}
                        onChange={(e) => setBookingDetails({
                          ...bookingDetails, 
                          num_passengers: parseInt(e.target.value) || 1
                        })}
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Hạng ghế</label>
                      <select
                        value={bookingDetails.seat_class}
                        onChange={(e) => setBookingDetails({...bookingDetails, seat_class: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                      >
                        <option value="Economy">Phổ thông</option>
                        <option value="Business">Thương gia</option>
                        <option value="First">Hạng nhất</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Yêu cầu đặc biệt (tùy chọn)</label>
                      <textarea
                        value={guestInfo.special_request}
                        onChange={(e) => setGuestInfo({...guestInfo, special_request: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2"
                        rows="3"
                        placeholder="Vd: Cần hỗ trợ người già, trẻ em..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
                  
                  <div className="space-y-4">
                    <div 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors
                        ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          checked={paymentMethod === 'stripe'}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Thẻ tín dụng / Thẻ ghi nợ</span>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('cash')}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors
                        ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          checked={paymentMethod === 'cash'}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <span className="text-2xl">💵</span>
                        <span className="font-medium">Tiền mặt tại sân bay</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Xác nhận đặt chỗ</h2>
                  
                  {/* Flight Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      Chi tiết chuyến bay
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hãng bay</span>
                        <span className="font-medium">{flight.airline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số hiệu</span>
                        <span className="font-medium">{flight.flight_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tuyến bay</span>
                        <span className="font-medium">{flight.origin_city} → {flight.destination_city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Khởi hành</span>
                        <span className="font-medium">{formatTime(flight.departure_datetime)} - {formatDate(flight.departure_datetime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hạng ghế</span>
                        <span className="font-medium">{bookingDetails.seat_class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số hành khách</span>
                        <span className="font-medium">{bookingDetails.num_passengers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Thông tin hành khách
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Họ và tên</span>
                        <span className="font-medium">{guestInfo.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{guestInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số điện thoại</span>
                        <span className="font-medium">{guestInfo.phone}</span>
                      </div>
                      {guestInfo.special_request && (
                        <div className="pt-2 border-t">
                          <span className="text-gray-600 block mb-1">Yêu cầu đặc biệt</span>
                          <span className="font-medium">{guestInfo.special_request}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Phương thức thanh toán
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-medium">
                        {paymentMethod === 'stripe' ? 'Thẻ tín dụng / Thẻ ghi nợ' : 'Tiền mặt tại sân bay'}
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-4">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-1" required />
                      <span className="text-sm text-gray-600">
                        Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản và điều kiện</a> của Agoda
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold mb-4">Chi tiết chuyến bay</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Plane className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold">{flight.airline}</div>
                      <div className="text-gray-600">{flight.flight_number}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Khởi hành</span>
                      <span className="font-semibold">{formatTime(flight.departure_datetime)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Hạ cánh</span>
                      <span className="font-semibold">{formatTime(flight.arrival_datetime)}</span>
                    </div>
                    <div className="text-gray-600 text-xs">{formatDate(flight.departure_datetime)}</div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Điểm đi</span>
                      <span className="font-semibold">{flight.origin_city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm đến</span>
                      <span className="font-semibold">{flight.destination_city}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Giá vé (x{bookingDetails.num_passengers})</span>
                      <span>{formatPrice(flight.price)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-600">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6
                    hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Đang xử lý...' : step === 3 ? 'Xác nhận đặt vé' : 'Tiếp tục'}
                </button>
                
                {(step === 2 || step === 3) && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full border border-gray-300 py-3 rounded-lg font-semibold mt-3
                      hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlightBookingPage;
