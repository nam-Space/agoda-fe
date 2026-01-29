import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createHotelSlug } from "utils/slugHelpers";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const Item = ({
  id,
  image,
  name,
  link,
  stars = 0,
  reviewText = "",
  reviewCount = "",
  snippet = "",
}) => {
  const [showFull, setShowFull] = useState(false);
  const shortSnippet =
    snippet?.length > 120 ? snippet.slice(0, 120) + "..." : snippet;

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/hotel/${createHotelSlug(name, id)}`}
              className="font-semibold text-blue-600 text-base leading-tight line-clamp-2"
            >
              {name}
            </Link>
            <div className="flex mt-2">
              {Array.from({ length: Math.round(stars) }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-4 h-4" />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-green-700">
              <span className="font-normal text-gray-700 text-[14px]">
                {reviewText}
              </span>
            </div>
            <div className="text-gray-400 text-[12px] w-max">{reviewCount}</div>
          </div>
        </div>

        {snippet && (
          <div className="mt-4 text-gray-700 text-base min-h-[48px]">
            {showFull ? (
              <>
                {snippet}
                <span
                  className="text-blue-600 cursor-pointer ml-1 hover:underline flex items-center gap-1"
                  onClick={() => setShowFull(false)}
                >
                  Thu gọn
                  <IoIosArrowUp className="mt-1 text-blue-600 text-[14px]" />
                </span>
              </>
            ) : (
              <>
                {shortSnippet}
                {snippet?.length > 120 && (
                  <span
                    className="text-blue-600 cursor-pointer ml-1 hover:underline flex items-center gap-1"
                    onClick={() => setShowFull(true)}
                  >
                    Xem tiếp
                    <IoIosArrowDown className="mt-1 text-blue-600 text-[14px]" />
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
