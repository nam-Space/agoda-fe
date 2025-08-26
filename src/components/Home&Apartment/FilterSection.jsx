import { Tune } from '@mui/icons-material';
import { useState } from 'react';

const FilterSection = () => {
    const [showMoreFilters, setShowMoreFilters] = useState(false); // State to toggle additional filters
    const [selectedFilters, setSelectedFilters] = useState([]); // State to track selected filters

    const toggleShowMoreFilters = () => {
        setShowMoreFilters(!showMoreFilters); // Toggle between showing more filters and hiding them
    };

    const toggleFilterSelection = (filter) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter((item) => item !== filter)); // Remove filter if already selected
        } else {
            setSelectedFilters([...selectedFilters, filter]); // Add filter if not selected
        }
    };

    const clearAllFilters = () => {
        setSelectedFilters([]); // Reset selected filters
    };

    return (
        <div className="filter-section bg-white border border-gray-300 rounded-lg p-4">
            {/* Title */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Chọn phòng</h2>
                <a href="#" className="text-blue-600 hover:underline text-sm font-bold">Chúng tôi khớp giá!</a>
            </div>

            {/* Filters */}
            <div className="filters">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <Tune className="text-gray-600" />
                        <span className="text-sm font-bold text-gray-800">Chọn lọc:</span>
                    </div>
                    <button
                        onClick={clearAllFilters}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Xóa hết
                    </button>
                </div>

                {/* Tip */}
                <p className="text-sm text-gray-600 mb-4">
                    <span className="text-green-600 font-bold">Mẹo:</span> Phải một thời gian mới đến ngày quý khách đến/đi. Hãy thử một ưu đãi có
                    <a href="#" className="text-green-600 hover:underline"> hủy Miễn Phí</a> để linh hoạt trong trường hợp kế hoạch thay đổi.
                </p>

                {/* Filter Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Không hút thuốc (5)', icon: '🚭' },
                        { label: 'Thanh toán tại nơi ở (10)', icon: '🏠' },
                        { label: 'Hướng thành phố (1)', icon: '🏙️' },
                        { label: 'Hướng biển (3)', icon: '🌊' },
                        { label: 'Ban công/sân hiên', icon: '🏞️' },
                        { label: 'Đặt không cần thẻ tín dụng (4)', icon: '💳' },
                        { label: 'Hủy miễn phí (10)', icon: '🔄' },
                    ].map((filter, index) => (
                        <button
                            key={index}
                            onClick={() => toggleFilterSelection(filter.label)}
                            className={`flex items-center border rounded-full px-4 py-2 text-sm ${
                                selectedFilters.includes(filter.label)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-800'
                            }`}
                        >
                            <span className="mr-2">{filter.icon}</span> {filter.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSection;