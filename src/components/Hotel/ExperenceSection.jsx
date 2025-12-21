import { useState } from "react";
import { getImage } from "utils/imageUrl";

const ExperienceSection = ({ hotelData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="experience-section bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Kinh nghiệm du lịch</h2>
            <div className="relative">
                <img
                    src={getImage(hotelData?.images?.[0]?.image)}
                    alt={hotelData.name}
                    className="w-full h-[270px] object-cover"
                />
                <div className="absolute left-0 bottom-0 py-[8px] px-[24px] bg-[rgba(0,0,0,0.5)]">
                    <p className="text-[22px] text-white">
                        Kinh nghiệm du lịch
                    </p>
                    <p className="text-[30px] text-white">
                        Căn hộ THE SÓNG VŨNG TÀU - TRINH'S HOUSE
                    </p>
                </div>
            </div>
            <div
                className={`markdown-container mt-[20px]`}
                dangerouslySetInnerHTML={{
                    __html: isExpanded
                        ? hotelData.description
                        : `${hotelData.description.substring(0, 360)}...`,
                }}
            ></div>
            <button
                onClick={toggleDescription}
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
                {isExpanded ? "Ẩn" : "Xem tiếp"}
            </button>
        </div>
    );
};

export default ExperienceSection;
