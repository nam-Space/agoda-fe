import { useEffect, useState } from "react";
import { callFetchPhysicalRoom } from "../../config/api";

// Modal chọn physical rooms
const PhysicalRoomSelectorModal = ({
  isOpen,
  onClose,
  onConfirm,
  room,
  roomCount,
  checkIn,
  checkOut,
}) => {
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && room?.id) {
      fetchPhysicalRooms();
    }
  }, [isOpen, room]);

  const fetchPhysicalRooms = async () => {
    setLoading(true);
    try {
      const res = await callFetchPhysicalRoom(`room_id=${room.id}`);
      // Lọc chỉ phòng có sẵn
      const availableRooms = (res.data || []).filter((pr) => pr.is_available);
      setPhysicalRooms(availableRooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (room) => {
    // Chỉ cho phép chọn nếu phòng có sẵn
    if (!room.is_available) return;

    if (selected.find((s) => s.id === room.id)) {
      setSelected(selected.filter((s) => s.id !== room.id));
    } else if (selected.length < roomCount) {
      setSelected([...selected, room]);
    }
  };

  const handleConfirm = () => {
    console.log("Selected rooms:", selected.length, "Required:", roomCount); // Debug log
    // if (Numberselected.length === roomCount) {
    onConfirm(selected);
    // }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Chọn phòng cụ thể ({selected.length}/{roomCount})
        </h3>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : physicalRooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có phòng nào có sẵn.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {physicalRooms.map((pr) => {
              const isSelected = selected.find((s) => s.id === pr.id);
              return (
                <div
                  key={pr.id}
                  className={`border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleSelect(pr)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-800">{pr.code}</p>
                    {isSelected && (
                      <span className="text-blue-600 text-xl">✔</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Tầng: {pr.floor}</p>
                  <p
                    className={`text-sm font-medium ${
                      pr.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Trạng thái: {pr.is_available ? "Có sẵn" : "Không"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={Number(selected.length) !== Number(roomCount)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Xác nhận ({selected.length}/{roomCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysicalRoomSelectorModal;
