import React from 'react';
import { Card, Slider, Checkbox, Rate, Divider, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const priceRange = [500000, 5000000];
  const amenities = [
    'WiFi miễn phí',
    'Hồ bơi',
    'Spa',
    'Gym',
    'Nhà hàng',
    'Bar',
    'Dịch vụ phòng',
    'Chỗ đậu xe',
    'Sân bay đưa đón',
    'Cho phép thú cưng'
  ];

  return (
    <div className="space-y-4">
      <Card title={<><FilterOutlined className="mr-2" />Lọc kết quả</>} className="shadow-md">
        <div className="space-y-6">
          {/* Price Filter */}
          <div>
            <h4 className="font-medium mb-3">Khoảng giá mỗi đêm</h4>
            <Slider
              range
              min={500000}
              max={5000000}
              step={100000}
              defaultValue={priceRange}
              tipFormatter={(value) => `${(value / 1000).toFixed(0)}K VND`}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>500K VND</span>
              <span>5M VND</span>
            </div>
          </div>

          <Divider />

          {/* Star Rating Filter */}
          <div>
            <h4 className="font-medium mb-3">Xếp hạng sao</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => (
                <Checkbox key={star}>
                  <Rate disabled defaultValue={star} className="text-sm" />
                </Checkbox>
              ))}
            </div>
          </div>

          <Divider />

          {/* Amenities Filter */}
          <div>
            <h4 className="font-medium mb-3">Tiện nghi</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {amenities.map(amenity => (
                <Checkbox key={amenity} className="w-full">
                  {amenity}
                </Checkbox>
              ))}
            </div>
          </div>

          <Divider />
        </div>
      </Card>
    </div>
  );
};

export default FilterSidebar;