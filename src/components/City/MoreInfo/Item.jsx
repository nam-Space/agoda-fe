import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createHotelSlug } from "utils/slugHelpers";

const Item = ({
    id,
    image,
    name,
    link,
    stars = 0,
    score = "—",
    reviewText = "",
    reviewCount = "",
    snippet = "",
}) => {
    const [showFull, setShowFull] = useState(false);
    const shortSnippet =
        snippet?.length > 120 ? snippet.slice(0, 120) + "..." : snippet;

    return (
        <Link
            to={`/hotel/${createHotelSlug(name, id)}`}
            className="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-full overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl"
        >
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="font-semibold text-blue-600 text-base leading-tight line-clamp-2">
                            {name}
                        </span>
                        <div className="flex mt-2">
                            {Array.from({ length: Math.round(stars) }).map(
                                (_, i) => (
                                    <FaStar
                                        key={i}
                                        className="text-yellow-400 w-4 h-4"
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <div className="text-right ml-2 min-w-[120px]">
                        <div className="font-bold text-lg text-green-700">
                            {score}{" "}
                            <span className="font-normal text-gray-700">
                                {reviewText}
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            {reviewCount}
                        </div>
                    </div>
                </div>

                {snippet && (
                    <div className="mt-4 text-gray-700 text-base min-h-[48px]">
                        {showFull ? (
                            <>
                                {snippet}
                                <span
                                    className="text-blue-600 cursor-pointer ml-1 hover:underline"
                                    onClick={() => setShowFull(false)}
                                >
                                    Thu gọn ▲
                                </span>
                            </>
                        ) : (
                            <>
                                {shortSnippet}
                                {snippet?.length > 120 && (
                                    <span
                                        className="text-blue-600 cursor-pointer ml-1 hover:underline inline-flex items-center"
                                        onClick={() => setShowFull(true)}
                                    >
                                        Xem tiếp
                                        <svg
                                            className="w-4 h-4 ml-1 text-blue-600 inline"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M7 8l3 3 3-3"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default Item;
