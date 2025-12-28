import HotelMapPopup from "components/Hotel/HotelMapPopup";
import { useState } from "react";

const HotelOverviewSection = ({
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
    lat,
    lng,
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
                    {address} -{" "}
                    <span
                        onClick={() => {
                            setShowMap(true);
                        }}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        TRÊN BẢN ĐỒ
                    </span>
                </p>

                {/* SHOW POPUP OUTSIDE <p> TAG! */}
                {showMap && (
                    <HotelMapPopup
                        onClose={() => setShowMap(false)}
                        lat={lat}
                        lng={lng}
                    />
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
                    <div
                        key={index}
                        className="flex flex-col items-center text-center"
                    >
                        {highlight.icon ? (
                            <img
                                src={highlight.icon}
                                alt="Icon"
                                className="w-8 h-8 mb-1"
                            />
                        ) : (
                            <span className="w-8 h-8 mb-1 flex items-center justify-center" />
                        )}
                        <p className="text-sm text-gray-600 leading-5">
                            {highlight.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* Room and Space Section
            <div className="room-space-section mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Không gian & phòng</h2>
                <div className="grid grid-cols-3 gap-4">
                    {roomDetails.map((room, index) => (
                        <div key={index} className="p-4 border border-gray-300 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-800 mb-2">{room.title}</h3>
                            <p className="text-sm text-gray-600">{room.description}</p>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Promotion Section */}
            <div className="new-section bg-white border border-gray-300 rounded-lg p-4 mt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    {promotionTitle}
                </h2>
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {promotionCategories.map((category, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-bold text-gray-800">
                                {category.title}
                            </h3>
                            <div className="text-sm text-gray-600 grid gap-3 mt-3">
                                {category.items.map((item, idx) => (
                                    <div key={idx}>✔ {item}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="border-t border-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Cơ sở vật chất
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                    {facilities.map((facility, index) => (
                        <div key={index}>✔ {facility}</div>
                    ))}
                </div>

                <hr className="border-t border-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Về chúng tôi
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {isExpanded
                        ? aboutText
                        : `${aboutText.substring(0, 100)}...`}
                </p>
                <button
                    onClick={toggleReadMore}
                    className="text-blue-600 hover:underline"
                >
                    {isExpanded ? "Thu gọn" : "Đọc thêm"}
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

export default HotelOverviewSection;
