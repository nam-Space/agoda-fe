import React from 'react';

const RoomOptionsSection = ({
    title,
    roomImage,
    roomDetails,
    cancellationPolicy,
    perks,
    price,
    bookingInfo,
    additionalInfo,
}) => {
    return (
        <div className="room-options bg-white border border-gray-300 rounded-lg p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">Giá không bao gồm thuế & phí</p>
            </div>

            {/* Room Option */}
            <div className="room-option border border-gray-300 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-[30%_40%_30%] gap-4">
                    {/* Left Column: Room Details */}
                    <div>
                        <img
                            src={roomImage}
                            alt="Room Image"
                            className="rounded-lg mb-4"
                        />
                        <a href="#" className="text-blue-600 hover:underline text-sm">Xem ảnh và chi tiết</a>
                        <ul className="text-sm text-gray-600 mt-2">
                            {roomDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                        <a href="#" className="text-blue-600 hover:underline text-sm mt-2">Các tiện ích khác</a>
                    </div>

                    {/* Middle Column: Price Details */}
                    <div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                            <p className="text-green-600 font-bold text-sm">{cancellationPolicy}</p>
                            <ul className="text-sm text-gray-600 mt-2">
                                {perks.map((perk, index) => (
                                    <li key={index}>{perk}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Chương trình thưởng và giảm giá khác:</p>
                            <ul className="mt-2">
                                {additionalInfo.map((info, index) => (
                                    <li key={index} className={info.highlight ? "text-purple-600 font-bold" : ""}>
                                        {info.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Booking Details */}
                    <div className="text-center">
                        <p className="text-red-600 text-lg font-bold">{price}</p>
                        <p className="text-sm text-gray-600">Giá mỗi đêm chưa gồm thuế và phí</p>
                        <button className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 mt-4">
                            Đặt ngay
                        </button>
                        <br />
                        <button className="bg-blue-500 text-white font-bold rounded-lg px-6 py-3 hover:bg-blue-600 shadow-md transition duration-300 ease-in-out mt-4">
                            Thêm vào giỏ hàng
                        </button>
                        <p className="text-green-600 text-sm mt-2">{bookingInfo}</p>
                        <p className="text-sm text-gray-600">Còn ít phòng</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomOptionsSection;