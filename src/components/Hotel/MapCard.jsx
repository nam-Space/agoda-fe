import { useState } from 'react';
import icMap from '../../images/hotel/map.jpg';
import HotelMapPopup from './HotelMapPopup';

const MapCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="border rounded-lg p-4 cursor-pointer" onClick={() => setOpen(true)}>
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
        <div className="font-semibold text-lg">8.5 Rất tốt</div>
        <div className="text-gray-500 text-sm">Điểm đánh giá vị trí</div>
        <div className="mt-2 text-sm">
          <strong>Vị trí tuyệt vời</strong> - Cách bãi biển 420 mét
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>🚗 Bãi đậu xe</span>
          <span className="text-green-600 font-medium">Có sẵn</span>
        </div>
      </div>

      {open && <HotelMapPopup onClose={() => setOpen(false)} />}
    </>
  );
};

export default MapCard;
