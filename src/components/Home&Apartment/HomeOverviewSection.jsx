import HomeMapPopup from 'components/Home&Apartment/HomeMapPopup';
import { useState } from 'react';

const HomeOverviewSection = ({
    title,
    address,
    mapLink,
    tags,
    highlights,
    roomDetails,
    promotionTitle,
    promotionCategories,
    facilities,
    aboutText,
    aboutLink,
    hotSaleText,
    hotSaleCount,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-sm text-gray-600">
                    {address} -{' '}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowMap(true);
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        TRÊN BẢN ĐỒ
                    </a>
                </p>

                {/* SHOW POPUP OUTSIDE <p> TAG! */}
                {showMap && (
                    <HomeMapPopup onClose={() => setShowMap(false)} />
                )}

                <div className="flex space-x-2 mt-4">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-4 py-1 rounded-full text-sm text-white ${tag.color}`}
                        >
                            {tag.text}
                        </span>
                    ))}
                </div>
            </div>

           {/* Highlights Section */}
           <div className="highlights-section grid grid-cols-5 gap-4 mb-6">
            {highlights.map((highlight, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                    {highlight.icon ? (
                        <img src={highlight.icon} alt="Icon" className="w-8 h-8 mb-1" />
                    ) : (
                    <span className="w-8 h-8 mb-1 flex items-center justify-center" />
                    )}
                    <p className="text-sm text-gray-600 leading-5">{highlight.text}</p>
                    </div>
                ))}
                </div>


            {/* Room and Space Section */}
            <div className="room-space-section mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Không gian & phòng</h2>
                <div className="grid grid-cols-3 gap-4">
                    {roomDetails.map((room, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {room.icon}
                            <span>{room.title}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Promotion Section */}
            <div className="new-section bg-white border border-gray-300 rounded-lg p-4 mt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{promotionTitle}</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {promotionCategories.map((category, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-bold text-gray-800">{category.title}</h3>
                            <ul className="text-sm text-gray-600">
                                {category.items.map((item, idx) => (
                                    <li key={idx}>✔ {item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <hr className="border-t border-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-4">Cơ sở vật chất</h2>
                <ul className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {facilities.map((facility, index) => (
                        <li key={index}>✔ {facility}</li>
                    ))}
                </ul>

                <hr className="border-t border-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-4">Về chúng tôi</h2>
                <p className="text-sm text-gray-600 mb-4">
                    {isExpanded ? aboutText : `${aboutText.substring(0, 100)}...`}
                </p>
                <button onClick={toggleReadMore} className="text-blue-600 hover:underline">
                    {isExpanded ? 'Thu gọn' : 'Đọc thêm'}
                </button>

                <hr className="border-t border-gray-300 mb-4" />
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                    <p className="text-sm font-bold">{hotSaleText}</p>
                    <p className="text-sm">{hotSaleCount}</p>
                </div>
            </div>
        </div>
    );
};

export default HomeOverviewSection;
