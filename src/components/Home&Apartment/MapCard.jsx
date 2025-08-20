import { useState } from 'react';
import icMap from '../../images/hotel/map.jpg';
import HomeMapPopup from './HomeMapPopup';

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
          <strong>Vị trí tuyệt vời</strong> - Cách trung tâm TP. 380 m
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <strong>🚶Tuyệt vời để đi bộ</strong>
        </div>
        <div className="mt-3 text-sm">
          <strong className="block mb-2">Nơi có thể đi bộ</strong>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>🏬 Siêu thị US</span>
              <span className="text-gray-600">340 m</span>
            </li>
            <li className="flex justify-between">
              <span>🖼️ Phòng tranh An Bình</span>
              <span className="text-gray-600">420 m</span>
            </li>
            <li className="flex justify-between">
              <span>🏬 Cửa hàng Thành Đạt</span>
              <span className="text-gray-600">480 m</span>
            </li>
            <li className="flex justify-between">
              <span>🏛️ Riverside Palace - Trung Tâm HN</span>
              <span className="text-gray-600">490 m</span>
            </li>
            <li className="flex justify-between">
              <span>🛣️ Đường Nguyễn Văn Cừ</span>
              <span className="text-gray-600">500 m</span>
            </li>
          </ul>
        </div>
      </div>

      {open && <HomeMapPopup onClose={() => setOpen(false)} />}
    </>
  );
};

export default MapCard;
