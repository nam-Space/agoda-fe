import { useState } from "react";
import icMap from "../../images/hotel/map.jpg";
import HotelMapPopup from "./HotelMapPopup";

const MapCard = ({ lat, lng, hotelName }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="border rounded-lg p-4 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative mb-2">
          <img
            src={icMap}
            alt="Bản đồ thu nhỏ"
            className="w-full h-32 object-cover rounded"
          />
          <div className="absolute top-2 left-2 bg-white text-black px-2 py-1 text-xs rounded shadow">
            XEM BẢN ĐỒ
          </div>
        </div>
        <div className="font-semibold text-lg">Xem vị trí</div>
        <div className="text-gray-500 text-sm">{hotelName}</div>
      </div>

      {open && <HotelMapPopup onClose={() => setOpen(false)} lat={lat} lng={lng} hotelName={hotelName} />}
    </>
  );
};

export default MapCard;
