import { EnvironmentOutlined } from "@ant-design/icons";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import { createHotelSlug } from "utils/slugHelpers";

const HotelCardForHost = ({ hotel }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white mb-4 flex flex-col justify-between">
      <div>
        <img
          src={process.env.REACT_APP_BE_URL + hotel?.images?.[0]?.image}
          alt={hotel?.name}
          className="w-full h-48 object-cover"
        />
        <div className="grid grid-cols-4 gap-1 mt-2 w-full">
          {hotel?.images?.slice(0, 8)?.map((item, idx) => (
            <div className="relative hover:opacity-80">
              <img
                key={idx}
                src={process.env.REACT_APP_BE_URL + item.image}
                alt={`item-${idx}`}
                className="w-full h-12 object-cover rounded cursor-pointer"
              />
              {(idx === 7 || idx === hotel?.images?.length - 1) && (
                <div className="text-[14px] absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,.7)] text-white">
                  Xem hết
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4">
          <Link
            to={`/hotel/${createHotelSlug(hotel.name, hotel.id)}`}
            className="text-lg font-bold text-gray-800 text-left block hover:text-blue-600 duration-100"
          >
            {hotel.name}
          </Link>
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="flex">
              {Array.from({ length: hotel.avg_star }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-base" />
              ))}
            </span>
            {hotel?.city?.id && (
              <Link
                to={`/city/${hotel?.city?.id}`}
                className="text-blue-600 text-sm font-semibold hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {hotel?.city?.name}
              </Link>
            )}
            {hotel?.lat && hotel?.lng && (
              <a
                href={`https://maps.google.com/?q=${hotel.lat},${hotel.lng}`}
                className="text-blue-500 text-xs underline ml-2 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking map
              >
                <EnvironmentOutlined />
                Xem trên bản đồ
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="text-right">
          <div className="text-xs text-gray-500">Giá trung bình mỗi đêm</div>
          <div className="font-bold text-red-600 text-2xl">
            {formatCurrency((+hotel.min_price)?.toFixed(0))}đ
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelListForHost = ({ hotels }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-4">
        {hotels.map((hotel) => (
          <HotelCardForHost key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelListForHost;
