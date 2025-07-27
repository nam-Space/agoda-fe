import React from 'react';

const ReviewItem = ({ score, title, country, userType, roomType, stayDate, reviewDate, comment, commentDescription, helpful }) => {
    return (
        <div className="grid grid-cols-[30%_70%] gap-4 p-4 border rounded-lg bg-white shadow-sm mt-2">
            {/* Left Column: Review Details */}
            <div>
                <p className="text-4xl font-bold text-blue-600">{score}</p>
                <p className="text-lg font-bold text-gray-800">{title}</p>
                <p className="text-xs text-gray-600 flex items-center">
                    <span className="mr-2">🇻🇳</span> {country}
                </p>
                <p className="text-xs text-gray-600">{userType}</p>
                <p className="text-xs text-gray-600">{roomType}</p>
                <p className="text-xs text-gray-600">{stayDate}</p>
            </div>

            {/* Right Column: User Feedback */}
            <div className="flex flex-col rounded-lg">
                <div className="flex flex-col space-y-4 bg-gray-100 p-4 rounded-lg w-full">
                    <p className="text-lg font-bold text-gray-800">"{comment}"</p>
                    {commentDescription && (
                        <p className="text-xs text-gray-600">{commentDescription}</p>
                    )}
                    <div className="text-xs flex text-gray-600 flex space-x-4 p-2 rounded w-full">
                        <span className="w-full">{reviewDate}</span>
                        <div className="flex justify-end space-x-2 w-full">
                            <span>Được dịch tự động thông qua A.I. sản sinh</span>
                            <span className="text-blue-600 cursor-pointer font-bold">Xem bản gốc</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-gray-800 flex justify-end p-2 rounded-lg">
                    <span>Bạn thấy nhận xét này có hữu ích không?{' '}</span>
                    <span className="text-blue-600 cursor-pointer ml-2">CÓ</span>
                    <span className="mx-2">|</span>
                    <span className="text-blue-600 cursor-pointer">KHÔNG</span>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;