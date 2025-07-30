import HostProfilePopup from 'components/Hotel/HostProfilePopup';
import avatar from 'images/hotel/ic_avatar.png'; // giả sử có sẵn avatar
import { useState } from 'react';

export default function HostProfileLink() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="border rounded-lg p-4 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={avatar}
              alt="Host avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-base">Hosted by Uyen Tran</p>
              <p className="text-green-600 text-sm font-medium">
                🏆 8.4 Máy chủ được đánh giá cao
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            4 bất động sản • 392 đánh giá
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-blue-600 text-sm font-semibold underline mt-2 text-left"
        >
          Xem hồ sơ chủ nhà
        </button>
      </div>

      {showModal && <HostProfilePopup onClose={() => setShowModal(false)} />}
    </>
  );
}
