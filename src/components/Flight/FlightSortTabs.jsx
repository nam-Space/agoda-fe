import { useState } from 'react';

const FlightSortTabs = ({ onSortChange }) => {
  const [activeTab, setActiveTab] = useState('cheapest');

  const tabs = [
    { id: 'cheapest', label: 'Rẻ nhất', sortBy: 'price', sortOrder: 'asc' },
    { id: 'best', label: 'Tổng thể tốt nhất', sortBy: 'best', sortOrder: 'asc' },
    { id: 'fastest', label: 'Nhanh nhất', sortBy: 'duration', sortOrder: 'asc' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    onSortChange(tab.sortBy, tab.sortOrder);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Sort Dropdown */}
          <div className="ml-auto">
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value;
                switch (value) {
                  case 'price_asc':
                    onSortChange('price', 'asc');
                    setActiveTab('cheapest');
                    break;
                  case 'price_desc':
                    onSortChange('price', 'desc');
                    setActiveTab('');
                    break;
                  case 'time_asc':
                    onSortChange('departure_time', 'asc');
                    setActiveTab('');
                    break;
                  case 'time_desc':
                    onSortChange('departure_time', 'desc');
                    setActiveTab('');
                    break;
                  default:
                    break;
                }
              }}
            >
              <option value="">Sắp xếp theo</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="time_asc">Thời gian: Sớm nhất</option>
              <option value="time_desc">Thời gian: Muộn nhất</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSortTabs;
