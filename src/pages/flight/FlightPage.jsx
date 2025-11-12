import Footer from 'components/FooterClient';
import Header from 'components/HeaderClient';
import { callSearchFlights } from 'config/api';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Spin } from 'antd';
import FilterSideBarAgoda from 'components/Flight/FilterSideBarAgoda';
import FlightDateTabs from 'components/Flight/FlightDateTabs';
import FlightInfoBanner from 'components/Flight/FlightInfoBanner';
import FlightListAgoda from 'components/Flight/FlightListAgoda';
import FlightSearchHeader from 'components/Flight/FlightSearchHeader';
import FlightSortTabs from 'components/Flight/FlightSortTabs';

const FlightPage = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    sort_by: 'price',
    sort_order: 'asc',
    nonStop: false,
    airlines: [],
    departureTimeStart: 0,
    departureTimeEnd: 24,
    arrivalTimeStart: 0,
    arrivalTimeEnd: 24,
    priceMin: 0,
    priceMax: 10000000
  });

  // Filtered flights based on filters
  const [filteredFlights, setFilteredFlights] = useState([]);

  useEffect(() => {
    let filtered = [...flights];

    // Filter by non-stop
    if (filters.nonStop) {
      filtered = filtered.filter(f => !f.stops || f.stops === 0);
    }

    // Filter by airlines
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(f => filters.airlines.includes(f.airline));
    }

    // Filter by departure time
    filtered = filtered.filter(f => {
      const hour = new Date(f.departure_datetime).getHours();
      return hour >= filters.departureTimeStart && hour <= filters.departureTimeEnd;
    });

    // Filter by arrival time
    filtered = filtered.filter(f => {
      const hour = new Date(f.arrival_datetime).getHours();
      return hour >= filters.arrivalTimeStart && hour <= filters.arrivalTimeEnd;
    });

    // Filter by price
    filtered = filtered.filter(f => {
      return f.price >= filters.priceMin && f.price <= filters.priceMax;
    });

    // Sort
    if (filters.sort_by === 'price') {
      filtered.sort((a, b) => (filters.sort_order === 'asc' ? a.price - b.price : b.price - a.price));
    } else if (filters.sort_by === 'duration') {
      filtered.sort((a, b) => (filters.sort_order === 'asc' ? a.duration_minutes - b.duration_minutes : b.duration_minutes - a.duration_minutes));
    } else if (filters.sort_by === 'departure_time') {
      filtered.sort((a, b) => {
        const ta = new Date(a.departure_datetime).getTime();
        const tb = new Date(b.departure_datetime).getTime();
        return filters.sort_order === 'asc' ? ta - tb : tb - ta;
      });
    } else if (filters.sort_by === 'best') {
      // Overall best: combine normalized price and duration (50/50)
      const prices = filtered.map(f => f.price);
      const durs = filtered.map(f => f.duration_minutes || 0);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const minD = Math.min(...durs);
      const maxD = Math.max(...durs);
      const norm = (v, min, max) => (max === min ? 0 : (v - min) / (max - min));
      filtered.sort((a, b) => {
        const scoreA = 0.5 * norm(a.price, minP, maxP) + 0.5 * norm(a.duration_minutes || 0, minD, maxD);
        const scoreB = 0.5 * norm(b.price, minP, maxP) + 0.5 * norm(b.duration_minutes || 0, minD, maxD);
        return scoreA - scoreB; // lower is better
      });
    }

    setFilteredFlights(filtered);
  }, [flights, filters]);

  const originId = searchParams.get('origin_id');
  const destinationId = searchParams.get('destination_id');

  useEffect(() => {
    const fetchFlights = async () => {
      if (!originId || !destinationId) return;
      
      setLoading(true);
      try {
        const params = {
          origin_id: originId,
          destination_id: destinationId,
          departure_date: searchParams.get('departure_date'),
          passengers: searchParams.get('passengers'),
          seat_class: searchParams.get('seat_class'),
          current: 1,
          pageSize: 20,
          // Do NOT include UI filters in the API request; we filter client-side.
        };

        const res = await callSearchFlights(params);
        console.log('Flight API Response:', res);
        if (res?.data) {
          setFlights(res.data);
          setMeta(res.meta);
        } else if (Array.isArray(res)) {
          setFlights(res);
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [originId, destinationId, searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Search Header - sticky */}
      {originId && destinationId && <FlightSearchHeader />}

      {/* Date Tabs */}
      {originId && destinationId && <FlightDateTabs />}

      {/* Info Banner */}
      {originId && destinationId && <FlightInfoBanner />}

      {/* Sort Tabs */}
      {originId && destinationId && (
        <FlightSortTabs
          onSortChange={(sortBy, sortOrder) => {
            setFilters(prev => ({ ...prev, sort_by: sortBy, sort_order: sortOrder }));
          }}
        />
      )}

      <main className="flex-1 w-full">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : !originId || !destinationId ? (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center text-gray-500">
              <p className="text-lg">Vui lòng chọn điểm đi và điểm đến để tìm chuyến bay</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Title */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Chuyến bay từ {flights[0]?.origin_city || 'Origin'} đi {flights[0]?.destination_city || 'Destination'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {meta ? `${meta.totalItems} kết quả` : `${filteredFlights.length} kết quả`} - Giá mỗi hành khách
              </p>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
              {/* Left - Filters */}
              <aside className="w-72 flex-shrink-0">
                <FilterSideBarAgoda 
                  filters={filters} 
                  setFilters={setFilters}
                  flights={flights}
                />
              </aside>

              {/* Right - Flight List */}
              <div className="flex-1 min-w-0">
                <FlightListAgoda 
                  flights={filteredFlights}
                  bookingInfo={{
                    adults: parseInt(searchParams.get('adults') || '1'),
                    children: parseInt(searchParams.get('children') || '0'),
                    infants: parseInt(searchParams.get('infants') || '0'),
                    passengers: parseInt(searchParams.get('passengers') || '1'),
                    seat_class: searchParams.get('seat_class') || 'Economy'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FlightPage;
