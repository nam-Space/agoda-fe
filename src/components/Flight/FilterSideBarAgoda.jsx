import { useEffect, useState } from 'react';
import CustomCheckbox from './CustomCheckbox';
import DualRangeSlider from './DualRangeSlider';
import './FilterSideBarAgoda.css';

const FilterSideBarAgoda = ({ filters, setFilters, flights = [] }) => {
  const [localFilters, setLocalFilters] = useState({
    baggageIncluded: false,
    nonStop: false,
    oneStop: false,
    twoOrMoreStops: false,
    airlines: [],
    departureTimeStart: 0,
    departureTimeEnd: 24,
    arrivalTimeStart: 0,
    arrivalTimeEnd: 24,
    priceMin: 0,
    priceMax: 10000000
  });

  const airlines = [...new Set(flights.map(f => f.airline))];

  const prices = flights.map(f => f.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
  const [duration, setDuration] = useState(72);

  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      priceMin: minPrice,
      priceMax: maxPrice
    }));
  }, [minPrice, maxPrice]);

  // Keep local UI state in sync if parent `filters` changes (e.g., on remount)
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      baggageIncluded: !!filters.baggageIncluded,
      nonStop: !!filters.nonStop,
      oneStop: !!filters.oneStop,
      twoOrMoreStops: !!filters.twoOrMoreStops,
      airlines: Array.isArray(filters.airlines) ? filters.airlines : [],
      departureTimeStart: filters.departureTimeStart ?? prev.departureTimeStart,
      departureTimeEnd: filters.departureTimeEnd ?? prev.departureTimeEnd,
      arrivalTimeStart: filters.arrivalTimeStart ?? prev.arrivalTimeStart,
      arrivalTimeEnd: filters.arrivalTimeEnd ?? prev.arrivalTimeEnd,
      priceMin: filters.priceMin ?? prev.priceMin,
      priceMax: filters.priceMax ?? prev.priceMax
    }));
  }, [filters]);

  // Debug: Log filter changes
  useEffect(() => {
    console.log('🔍 Filters updated:', localFilters);
  }, [localFilters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatTime = (hour) => {
    return `${Math.floor(hour).toString().padStart(2, '0')}:00`;
  };

  const handleNonStopChange = (checked) => {
    console.log('✈️ Non-stop filter:', checked);
    setLocalFilters(prev => ({ ...prev, nonStop: checked }));
    setFilters(prev => ({ ...prev, nonStop: checked }));
  };

  const handleAirlineChange = (airline, checked) => {
    const newAirlines = checked
      ? [...localFilters.airlines, airline]
      : localFilters.airlines.filter(a => a !== airline);
    
    console.log('✈️ Airline filter:', airline, checked, '→', newAirlines);
    setLocalFilters(prev => ({ ...prev, airlines: newAirlines }));
    setFilters(prev => ({ ...prev, airlines: newAirlines }));
  };

  const handleDepartureTimeChange = (type, value) => {
    const newFilters = {
      ...localFilters,
      [type]: parseFloat(value)
    };
    setLocalFilters(newFilters);
    setFilters(prev => ({
      ...prev,
      departureTimeStart: newFilters.departureTimeStart,
      departureTimeEnd: newFilters.departureTimeEnd
    }));
  };

  const handleArrivalTimeChange = (type, value) => {
    const newFilters = {
      ...localFilters,
      [type]: parseFloat(value)
    };
    setLocalFilters(newFilters);
    setFilters(prev => ({
      ...prev,
      arrivalTimeStart: newFilters.arrivalTimeStart,
      arrivalTimeEnd: newFilters.arrivalTimeEnd
    }));
  };

  const handlePriceChange = (type, value) => {
    const newFilters = {
      ...localFilters,
      [type]: parseFloat(value)
    };
    setLocalFilters(newFilters);
    setFilters(prev => ({
      ...prev,
      priceMin: newFilters.priceMin,
      priceMax: newFilters.priceMax
    }));
  };

  const clearAllFilters = () => {
    const resetFilters = {
      baggageIncluded: false,
      nonStop: false,
      oneStop: false,
      twoOrMoreStops: false,
      airlines: [],
      departureTimeStart: 0,
      departureTimeEnd: 24,
      arrivalTimeStart: 0,
      arrivalTimeEnd: 24,
      priceMin: minPrice,
      priceMax: maxPrice
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="font-semibold text-base">Bộ lọc</h3>
        <button
          onClick={clearAllFilters}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Xóa
        </button>
      </div>

      {/* Recommended */}
      <div className="border-b pb-4">
        <h4 className="font-medium mb-3 text-sm">Được đề xuất</h4>
        <CustomCheckbox
          checked={localFilters.baggageIncluded}
          onChange={(newValue) => {
            console.log('🧳 Baggage clicked:', newValue);
            setLocalFilters(prev => ({ ...prev, baggageIncluded: newValue }));
            setFilters(prev => ({ ...prev, baggageIncluded: newValue }));
          }}
          label="Đã gồm hành lý ký gửi"
        />
      </div>

      {/* Airlines */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Hãng hàng không</h4>
          <button
            onClick={() => {
              setLocalFilters(prev => ({ ...prev, airlines: [] }));
              setFilters(prev => ({ ...prev, airlines: [] }));
            }}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Xóa
          </button>
        </div>
        
        {/* Toggle All Airlines */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-700">Chọn tất cả các hãng</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={airlines.length === 0 || localFilters.airlines.length === airlines.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalFilters(prev => ({ ...prev, airlines: airlines }));
                  setFilters(prev => ({ ...prev, airlines: airlines }));
                } else {
                  setLocalFilters(prev => ({ ...prev, airlines: [] }));
                  setFilters(prev => ({ ...prev, airlines: [] }));
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {/* Individual Airlines */}
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {airlines.map((airline, idx) => (
            <CustomCheckbox
              key={idx}
              checked={localFilters.airlines.includes(airline)}
              onChange={(newValue) => handleAirlineChange(airline, newValue)}
              label={airline}
              className="p-1"
            />
          ))}
        </div>
      </div>

      {/* Stops */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Điểm dừng</h4>
          <button
            onClick={() => {
              setLocalFilters(prev => ({ ...prev, nonStop: false, oneStop: false, twoOrMoreStops: false }));
              setFilters(prev => ({ ...prev, nonStop: false, oneStop: false, twoOrMoreStops: false }));
            }}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Xóa
          </button>
        </div>
        <div className="space-y-1">
          <CustomCheckbox
            checked={localFilters.nonStop}
            onChange={(newValue) => handleNonStopChange(newValue)}
            label="Bay thẳng"
          />
          <CustomCheckbox
            checked={localFilters.oneStop}
            onChange={(newValue) => {
              setLocalFilters(prev => ({ ...prev, oneStop: newValue }));
              setFilters(prev => ({ ...prev, oneStop: newValue }));
            }}
            label="1 Điểm Dừng"
          />
          <CustomCheckbox
            checked={localFilters.twoOrMoreStops}
            onChange={(newValue) => {
              setLocalFilters(prev => ({ ...prev, twoOrMoreStops: newValue }));
              setFilters(prev => ({ ...prev, twoOrMoreStops: newValue }));
            }}
            label=">2 Điểm Dừng"
          />
        </div>
      </div>


      {/* Schedule - Dual Range Sliders */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Lịch trình</h4>
          <button
            onClick={() => {
              setLocalFilters(prev => ({ 
                ...prev, 
                departureTimeStart: 0, 
                departureTimeEnd: 24,
                arrivalTimeStart: 0,
                arrivalTimeEnd: 24
              }));
              setFilters(prev => ({ 
                ...prev, 
                departureTimeStart: 0, 
                departureTimeEnd: 24,
                arrivalTimeStart: 0,
                arrivalTimeEnd: 24
              }));
            }}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Xóa
          </button>
        </div>
        <div className="space-y-4">
          {/* Departure Time */}
          <div>
            <DualRangeSlider
              min={0}
              max={24}
              step={1}
              minValue={localFilters.departureTimeStart}
              maxValue={localFilters.departureTimeEnd}
              onMinChange={(val) => handleDepartureTimeChange('departureTimeStart', val)}
              onMaxChange={(val) => handleDepartureTimeChange('departureTimeEnd', val)}
              formatLabel={(min, max) => `Khởi hành ${formatTime(min)} - ${formatTime(max)}`}
            />
          </div>

          {/* Arrival Time */}
          <div>
            <DualRangeSlider
              min={0}
              max={24}
              step={1}
              minValue={localFilters.arrivalTimeStart}
              maxValue={localFilters.arrivalTimeEnd}
              onMinChange={(val) => handleArrivalTimeChange('arrivalTimeStart', val)}
              onMaxChange={(val) => handleArrivalTimeChange('arrivalTimeEnd', val)}
              formatLabel={(min, max) => `Đến nơi ${formatTime(min)} - ${formatTime(max)}`}
            />
          </div>
        </div>
      </div>

      {/* Price Range - Dual Range Slider */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Giá mỗi người</h4>
          <button
            onClick={() => {
              setLocalFilters(prev => ({ ...prev, priceMin: minPrice, priceMax: maxPrice }));
              setFilters(prev => ({ ...prev, priceMin: minPrice, priceMax: maxPrice }));
            }}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Xóa
          </button>
        </div>
        <div>
          <DualRangeSlider
            min={minPrice}
            max={maxPrice}
            step={50000}
            minValue={localFilters.priceMin}
            maxValue={localFilters.priceMax}
            onMinChange={(val) => handlePriceChange('priceMin', val)}
            onMaxChange={(val) => handlePriceChange('priceMax', val)}
            formatLabel={(min, max) => `Lên đến ${formatPrice(max)} ₫`}
          />
        </div>
      </div>

      {/* Duration Filter - Dual Range Slider */}
      <div>
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-medium text-sm">Thời gian</h4>
    <button
      onClick={() => setDuration(72)}
      className="text-xs text-blue-600 hover:text-blue-700"
    >
      Xóa
    </button>
  </div>
  <div>
    <div className="flex justify-between text-xs text-gray-600 mb-2">
      <span>Dưới {duration} tiếng</span>
    </div>
    <div className="relative h-2">
      {/* Track */}
      <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

      {/* Active track */}
      <div
        className="absolute h-2 bg-blue-600 rounded-full"
        style={{
          left: '0%',
          width: `${(duration / 72) * 100}%`,
        }}
      ></div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="72"
        step="1"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="absolute w-full h-2 appearance-none bg-transparent 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-blue-600 
          [&::-webkit-slider-thumb]:cursor-pointer 
          [&::-webkit-slider-thumb]:border-2 
          [&::-webkit-slider-thumb]:border-white 
          [&::-webkit-slider-thumb]:shadow"
      />
    </div>
  </div>
</div>

      {/* Active Filters Count */}
      {(localFilters.baggageIncluded || localFilters.nonStop || localFilters.oneStop || localFilters.twoOrMoreStops || localFilters.airlines.length > 0) && (
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 space-y-1">
            {localFilters.baggageIncluded && <span className="block">✓ Có hành lý ký gửi</span>}
            {localFilters.nonStop && <span className="block">✓ Bay thẳng</span>}
            {localFilters.oneStop && <span className="block">✓ 1 điểm dừng</span>}
            {localFilters.twoOrMoreStops && <span className="block">✓ {'>'} 2 điểm dừng</span>}
            {localFilters.airlines.length > 0 && (
              <span className="block">✓ {localFilters.airlines.length} hãng được chọn</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSideBarAgoda;
