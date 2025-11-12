import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { callSearchFlights } from "config/api";

const FlightDateTabs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [datePrices, setDatePrices] = useState({});
  const [loading, setLoading] = useState(false);
  
  const currentDate = searchParams.get('departure_date') || new Date().toISOString().split('T')[0];

  const generateDates = () => {
    const dates = [];
    const current = new Date(currentDate);
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const formatDate = (date) => {
    return {
      day: date.getDate(),
      month: `Th${date.getMonth() + 1}`,
      weekday: date.toLocaleDateString('vi-VN', { weekday: 'short' })
    };
  };

  const handleDateClick = (date) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('departure_date', date.toISOString().split('T')[0]);
    navigate(`/flight?${newParams.toString()}`);
  };

  const isSelected = (date) => {
    return date.toISOString().split('T')[0] === currentDate;
  };

  // Fetch prices for date range
  useEffect(() => {
    const fetchDatePrices = async () => {
      const dates = generateDates();
      const originId = searchParams.get('origin_id');
      const destId = searchParams.get('destination_id');
      
      if (!originId || !destId) return;
      
      setLoading(true);
      const prices = {};
      
      // Fetch flights for each date
      for (const date of dates) {
        const dateStr = date.toISOString().split('T')[0];
        try {
          const params = {
            origin_id: originId,
            destination_id: destId,
            departure_date: dateStr
          };
          const res = await callSearchFlights(params);
          const flights = res?.data || res || [];
          
          // Get min price for this date
          if (flights.length > 0) {
            const minPrice = Math.min(...flights.map(f => f.price || 0));
            prices[dateStr] = minPrice;
          }
        } catch (error) {
          console.error(`Error fetching price for ${dateStr}:`, error);
        }
      }
      
      setDatePrices(prices);
      setLoading(false);
    };
    
    fetchDatePrices();
  }, [currentDate, searchParams.get('origin_id'), searchParams.get('destination_id')]);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto">
          {generateDates().map((date, index) => {
            const formatted = formatDate(date);
            const selected = isSelected(date);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`flex flex-col items-center min-w-[110px] px-4 py-3 rounded-lg transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xs">{formatted.day} {formatted.month}</span>
                <span className={`text-sm font-semibold mt-1 ${selected ? 'text-white' : 'text-blue-600'}`}>
                  {loading ? '...' : formatPrice(datePrices[date.toISOString().split('T')[0]])}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightDateTabs;
