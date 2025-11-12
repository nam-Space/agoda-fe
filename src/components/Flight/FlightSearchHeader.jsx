import { Calendar, MapPin, Plane, Users, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { callFetchAirport } from "config/api";

const FlightSearchHeader = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState('');

  useEffect(() => {
    const loadAirports = async () => {
      const originId = searchParams.get('origin_id');
      const destId = searchParams.get('destination_id');
      
      if (originId) {
        try {
          const res = await callFetchAirport(`id=${originId}`);
          console.log('Origin API response:', res);
          if (res?.data && res.data.length > 0) {
            setOrigin(res.data[0]);
          } else if (Array.isArray(res) && res.length > 0) {
            setOrigin(res[0]);
          }
        } catch (error) {
          console.error('Error loading origin:', error);
        }
      }
      
      if (destId) {
        try {
          const res = await callFetchAirport(`id=${destId}`);
          console.log('Destination API response:', res);
          if (res?.data && res.data.length > 0) {
            setDestination(res.data[0]);
          } else if (Array.isArray(res) && res.length > 0) {
            setDestination(res[0]);
          }
        } catch (error) {
          console.error('Error loading destination:', error);
        }
      }
    };

    setPassengers(parseInt(searchParams.get('passengers') || '1'));
    setDate(searchParams.get('departure_date') || '');
    loadAirports();
  }, [searchParams]);

  const getAirportCode = (airportName) => {
    const codeMatch = airportName?.match(/\(([A-Z]{3})\)/);
    return codeMatch ? codeMatch[1] : airportName?.substring(0, 3).toUpperCase() || '';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', weekday: 'short' });
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Route */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-lg">
                {origin?.city?.name || 'Origin'} ({getAirportCode(origin?.name)})
              </span>
            </div>
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-lg">
                {destination?.city?.name || 'Destination'} ({getAirportCode(destination?.name)})
              </span>
            </div>
          </div>

          {/* Right - Date & Passengers */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{passengers} hành khách</span>
            </div>
            <button
              onClick={() => navigate('/flight')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Tìm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchHeader;
