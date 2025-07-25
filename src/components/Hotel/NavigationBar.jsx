import React from 'react';

const NavigationBar = ({ scrollToSection }) => {
    return (
        <div className="navigation-bar bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between w-full max-w-6xl mx-auto m-4">
            {/* Navigation Links */}
            <div className="flex space-x-6 text-gray-600 text-sm">
                <button onClick={() => scrollToSection('overview')} className="hover:text-blue-600 font-bold">Tổng quan</button>
                <button onClick={() => scrollToSection('rooms')} className="hover:text-blue-600 font-bold">Phòng nghỉ</button>
                <button onClick={() => scrollToSection('activities')} className="hover:text-blue-600 font-bold">Làm gì đi đâu</button>
                <button onClick={() => scrollToSection('host')} className="hover:text-blue-600 font-bold">Chủ nhà</button>
                <button onClick={() => scrollToSection('host')} className="hover:text-blue-600 font-bold">Cơ sở vật chất</button>
                <button onClick={() => scrollToSection('reviews')} className="hover:text-blue-600 font-bold">Đánh giá</button>
                <button onClick={() => scrollToSection('location')} className="hover:text-blue-600 font-bold">Vị trí</button>
                <button onClick={() => scrollToSection('policy')} className="hover:text-blue-600 font-bold">Chính sách</button>
            </div>

            {/* Price and Button */}
            <div className="flex items-center space-x-4">
                <span className="text-red-600 text-2xl">từ 507.966 đ</span>
                <button className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700">
                    Xem giá
                </button>
            </div>
        </div>
    );
};

export default NavigationBar;