import RoomListForHost from "components/Hotel/RoomListForHost";
import defaultAvatar from "images/hotel/ic_avatar.png";

export default function HostProfilePopup({ onClose, host }) {
  // Nếu chưa có host, không render để tránh lỗi
  if (!host) return null;

  const {
    avatar,
    name,
    rating,
    reviews,
    properties,
    bookings,
    memberDuration,
  } = host;

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
            src={avatar || defaultAvatar}
            alt="Host avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <h2 className="font-semibold text-xl mt-2">
            {name || "Chủ nhà chưa cập nhật"}
          </h2>
          <p className="text-green-600 font-medium">
            {rating ? `${rating} • Chủ nhà tuyệt vời` : "Chưa có đánh giá"}
          </p>

          {/* Thống kê */}
          <div className="grid grid-cols-4 gap-4 mt-6 text-sm text-gray-700 w-full max-w-lg">
            <div className="flex flex-col items-center">
              <strong>{reviews || 0}</strong>
              <span>đánh giá</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>{bookings || "100+"}</strong>
              <span>đặt chỗ</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>{properties || 0}</strong>
              <span>chỗ ở</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>{memberDuration || "8 tháng"}</strong>
              <span>trên Agoda</span>
            </div>
          </div>

          {/* Danh sách phòng */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-4 text-left w-full">
              Danh sách phòng ({properties || 0})
            </h3>

            <div className="mx-auto w-1/2 min-w-[250px]">
              <RoomListForHost hostId={host.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
