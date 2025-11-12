import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { Plane } from 'lucide-react';
import { callFetchAirport } from 'config/api';
import './AirportSearchInput.css';

const removeVietnameseAccents = (str) => {
  if (!str) return '';
  
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\s+/g, ' ').trim();
  
  return str;
};

const getAirportCode = (airportName) => {
  // Try to extract 3-letter code from airport name
  const codeMatch = airportName.match(/\(([A-Z]{3})\)/);
  if (codeMatch) return codeMatch[1];
  
  // Common airport codes
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
  
  for (const [name, code] of Object.entries(codes)) {
    if (airportName.includes(name)) return code;
  }
  
  // Fallback: first 3 letters uppercase
  return airportName.substring(0, 3).toUpperCase();
};

const AirportSearchInput = ({
  placeholder = 'Tìm kiếm sân bay',
  onSelect,
  value = '',
  className = '',
  icon: Icon = Plane,
  iconClassName = 'w-5 h-5 text-blue-600'
}) => {
  const [airports, setAirports] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true);
      try {
        const response = await callFetchAirport('pageSize=100&current=1');
        console.log('Airport API Response:', response);
        // Axios interceptor already returns response.data, so response IS the data object
        if (response?.data) {
          console.log('Airports loaded:', response.data.length);
          setAirports(response.data);
        } else if (Array.isArray(response)) {
          // In case response is directly the array
          console.log('Airports loaded (array):', response.length);
          setAirports(response);
        } else {
          console.error('No airport data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  useEffect(() => {
    // Group airports by city
    const groupedByCity = {};
    airports.forEach((airport) => {
      const cityName = airport.city?.name || airport.name;
      if (!groupedByCity[cityName]) {
        groupedByCity[cityName] = [];
      }
      groupedByCity[cityName].push(airport);
    });

    // Create options: City "All airports" + individual airports
    const transformedOptions = [];
    
    Object.entries(groupedByCity).forEach(([cityName, cityAirports]) => {
      // Add "City - All airports" option
      transformedOptions.push({
        value: `${cityName} - Mọi sân bay`,
        label: (
          <div className="py-2 px-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600 text-sm">{cityName}, Việt Nam</span>
              </div>
              <span className="text-xs text-gray-500">Mọi sân bay</span>
            </div>
          </div>
        ),
        airportId: null,
        airportName: 'All',
        cityName: cityName,
        location: cityName,
        airport: {
          id: `city_${cityName}`,
          name: `${cityName} - Mọi sân bay`,
          city: { name: cityName },
          location: cityName,
          isAllAirports: true
        }
      });

      // Add individual airports
      cityAirports.forEach((airport) => {
        const airportName = airport.name;
        const location = airport.location;
        
        transformedOptions.push({
          value: `${cityName} - ${airportName}`,
          label: (
            <div className="py-2 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Plane className="w-4 h-4 text-gray-400 ml-1" />
                  <span className="text-sm text-gray-900">{airportName}</span>
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  {getAirportCode(airportName)}
                </span>
              </div>
              <div className="ml-7 text-xs text-gray-400">{location}</div>
            </div>
          ),
          airportId: airport.id,
          airportName: airportName,
          cityName: cityName,
          location: location,
          airport: airport
        });
      });
    });

    console.log('Transformed options:', transformedOptions.length);
    setOptions(transformedOptions);
  }, [airports]);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const filterOption = (inputValue, option) => {
    if (!option) return false;
    
    const normalizedInput = removeVietnameseAccents(inputValue);
    const normalizedCityName = removeVietnameseAccents(option.cityName);
    const normalizedAirportName = removeVietnameseAccents(option.airportName);
    const normalizedLocation = removeVietnameseAccents(option.location);

    return (
      normalizedCityName.includes(normalizedInput) ||
      normalizedAirportName.includes(normalizedInput) ||
      normalizedLocation.includes(normalizedInput)
    );
  };

  const handleSelect = (selectedValue, option) => {
    // If "All airports" option, show only city name
    if (option.airport?.isAllAirports) {
      setSearchValue(option.cityName);
    } else {
      // For specific airport, show "City (CODE)"
      const code = getAirportCode(option.airportName);
      setSearchValue(`${option.cityName} (${code})`);
    }
    
    if (onSelect) {
      onSelect(option.airport);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <div className={`border border-gray-300 rounded-xl p-4 hover:border-blue-500 transition-all duration-200 bg-white ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className={iconClassName} />
        <AutoComplete
          value={searchValue}
          options={options}
          onSelect={handleSelect}
          onSearch={handleSearch}
          placeholder={placeholder}
          filterOption={filterOption}
          className="flex-1 airport-search-input"
          loading={loading}
          notFoundContent={
            loading ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                Đang tải danh sách sân bay...
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm">
                Không tìm thấy sân bay phù hợp
              </div>
            )
          }
          popupClassName="airport-search-dropdown shadow-xl border border-gray-200 rounded-lg"
          allowClear
          bordered={false}
          size="large"
        />
      </div>
    </div>
  );
};

export default AirportSearchInput;
