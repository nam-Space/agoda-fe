import React from 'react';

const ReviewProgressBar = ({ label, value, maxValue = 10, color = 'green' }) => {
    const percentage = (value / maxValue) * 100;

    return (
        <div className="review-progress-bar flex items-center space-x-4">
            {/* Label */}
            <span className="text-sm text-gray-600">{label}</span>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div
                    className={`absolute top-0 left-0 h-2 rounded-full`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>

            {/* Value */}
            <span className={`text-sm font-bold text-${color}-600`}>{value}</span>
        </div>
    );
};

export default ReviewProgressBar;