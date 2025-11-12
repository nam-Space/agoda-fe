import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChinaEA from '../../images/flight/China Eastern Airlines.png';
import ChinaSA from '../../images/flight/China Southern Airlines.jpg';
import VNA from '../../images/flight/Vietnam Airlines.jpg';

const FlightList = ({ flights = [] }) => {
  const navigate = useNavigate();
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleOpen = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAirlineLogo = (airline) => {
    if (airline.toLowerCase().includes('vietnam')) return VNA;
    if (airline.toLowerCase().includes('eastern')) return ChinaEA;
    return ChinaSA;
  };

  const handleBookFlight = (flight) => {
    // Navigate to flight booking page
    navigate('/flight/booking', { 
      state: { 
        flight,
        serviceType: 'flight'
      } 
    });
  };

  const handleAddToCart = (flight) => {
    // Add to cart logic
    alert('Thêm vào giỏ hàng thành công!');
  };

  if (flights.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Không tìm thấy chuyến bay phù hợp
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {flights.map((flight, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className="border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* Header */}
            <div
              className="grid grid-cols-12 gap-4 items-center p-4 cursor-pointer"
              onClick={() => toggleOpen(index)}
            >
              {/* Logo + Airline */}
              <div className="col-span-3 flex items-center space-x-3">
                <img
                  src={getAirlineLogo(flight.airline)}
                  alt="Airline Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="font-semibold text-base">{flight.airline}</p>
                  <p className="text-sm text-gray-500">
                    {flight.origin_name} - {flight.destination_name}
                  </p>
                  <p className="text-xs text-gray-400">{flight.flight_number}</p>
                </div>
              </div>

              {/* Time + duration */}
              <div className="col-span-5 text-center">
                <p className="text-xl font-bold">
                  {formatTime(flight.departure_datetime)} - {formatTime(flight.arrival_datetime)}
                </p>
                <p className="text-sm text-gray-600">
                  Bay thẳng • {formatDuration(flight.duration_minutes)}
                </p>
              </div>

              {/* Price */}
              <div className="col-span-3 text-right">
                <p className="text-2xl font-bold text-red-600">
                  {formatPrice(flight.price)}
                </p>
                <p className="text-xs text-gray-500">Mỗi khách</p>
              </div>

              {/* Icon */}
              <div className="col-span-1 text-right">
                {isOpen ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </div>
            </div>

            {/* Details */}
            {isOpen && (
              <div className="bg-gray-50 px-6 py-4 space-y-4 text-sm">
                <div className="border rounded p-4 bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">
                        {formatTime(flight.departure_datetime)} → {formatTime(flight.arrival_datetime)}
                      </p>
                      <p className="text-gray-700 mt-1">
                        <strong>{flight.origin_name}</strong> ({flight.origin_city})
                      </p>
                      <p className="text-gray-700">
                        <strong>{flight.destination_name}</strong> ({flight.destination_city})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">⏱ Thời gian bay: {formatDuration(flight.duration_minutes)}</p>
                      <p className="text-gray-600">🛫 Số hiệu: {flight.flight_number}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-gray-600">✈️ Hãng: {flight.airline}</p>
                    <p className="text-gray-600">💺 Số chỗ còn lại: {flight.seat_capacity}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => handleBookFlight(flight)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                  >
                    Chọn chuyến bay này
                  </button>
                  <button 
                    onClick={() => handleAddToCart(flight)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                  >
                    Thêm vào giỏ hàng
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

export default FlightList;
