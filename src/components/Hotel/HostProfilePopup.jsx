import RoomListForHost from 'components/Hotel/RoomListForHost';
import avatar from 'images/hotel/ic_avatar.png';

export default function HostProfilePopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-8 shadow-xl">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-black"
        >
          ✕
        </button>

        {/* Phần thông tin chủ nhà */}
        <div className="flex flex-col items-center text-center">
          <img
            src={avatar}
            alt="Host avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <h2 className="font-semibold text-xl mt-2">Uyen Tran</h2>
          <p className="text-green-600 font-medium">8.4 • Chủ nhà tuyệt vời</p>

          <div className="grid grid-cols-4 gap-4 mt-6 text-sm text-gray-700 w-full max-w-lg">
            <div className="flex flex-col items-center">
              <strong>392</strong>
              <span>đánh giá</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>100+</strong>
              <span>đặt chỗ</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>4</strong>
              <span>chỗ ở</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>8 tháng</strong>
              <span>trên Agoda</span>
            </div>
          </div>

          {/* Danh sách phòng */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-4 text-left w-full">Danh sách phòng (4)</h3>

            <div className="mx-auto w-1/2 min-w-[250px]">
              <RoomListForHost />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
