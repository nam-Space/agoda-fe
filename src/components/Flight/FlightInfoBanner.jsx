import { X, Info } from 'lucide-react';
import { useState } from 'react';

const FlightInfoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Hoặc dùng tìm kiếm của một hãng hàng không gần phím tìm chuyến bay để nhận</span>{' '}
              <span className="text-blue-700">"Phương hàng": Bỏ thay kết quả.</span>
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:text-blue-800 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightInfoBanner;
