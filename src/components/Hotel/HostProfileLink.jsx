import HostProfilePopup from "components/Hotel/HostProfilePopup";
import { useState } from "react";

export default function HostProfileLink({ host }) {
  const [showModal, setShowModal] = useState(false);

  if (!host) return null; // ✅ tránh lỗi nếu chưa có host
if (!host || Object.keys(host).length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 text-gray-500 text-sm text-center shadow-sm">
        Thông tin chủ nhà hiện không khả dụng.
      </div>
    );
  }
  const avatarSrc = host.avatar || "/images/hotel/ic_avatar.png";

  return (
    <>
      <div className="border rounded-lg p-4 h-full flex flex-col justify-between shadow-sm bg-white">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={avatarSrc}
              alt="Host avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-base">
                {`Chủ nhà: ${host.name}`}
              </p>
              <p className="text-green-600 text-sm font-medium">
                🏆 {host.rating || "Chưa có"} • Máy chủ được đánh giá cao
              </p>
            </div>
          </div>
n
          <p className="text-sm text-gray-600 mb-2">
            {host.properties || 0} bất động sản • {host.reviews || 0} đánh giá
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 text-sm font-semibold underline mt-2 text-left"
        >
          Xem hồ sơ chủ nhà
        </button>
      </div>

      {showModal && (
        <HostProfilePopup
          onClose={() => setShowModal(false)}
          host={host}
        />
      )}
    </>
  );
}
