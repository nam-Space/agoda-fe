import { useState } from 'react';

const ExperienceSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="experience-section bg-white rounded-lg shadow-md p-6">
            {/* Image and Title */}
            <div className="relative">
                <img
                    src="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                    alt="The Song House Vung Tau"
                    className="rounded-lg w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h2 className="text-white text-2xl font-bold">
                        Kinh nghiệm du lịch<br />Cactusland Homestay - Tran Hung Dao
                    </h2>
                </div>
            </div>

            {/* Description */}
            <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">The Song House Vung Tau</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Cactusland Homestay - Tran Hung Dao cung cấp nhiều cơ sở vật chất tại chỗ để làm hài lòng cả vị khách khó tính. Không bao giờ mất liên lạc với các mối liên hệ của quý khách, với Wi-Fi miễn phí được cung cấp trong suốt thời gian của quý khách.
                    {isExpanded && (
                        <span>
                            {' '}Ngoài ra, nơi đây còn có hồ bơi, phòng gym, và các dịch vụ spa để quý khách thư giãn sau một ngày dài khám phá.
                        </span>
                    )}
                </p>
                <button
                    onClick={toggleDescription}
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                    {isExpanded ? 'Thu gọn' : 'Xem tiếp'}
                </button>
            </div>
        </div>
    );
};

export default ExperienceSection;