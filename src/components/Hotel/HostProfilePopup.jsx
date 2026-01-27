import { Empty, Pagination, Spin } from "antd";
import HotelListForHost from "components/Hotel/HotelListForHost";
import { callFetchHotelQuery } from "config/api";
import dayjs from "dayjs";
import defaultAvatar from "images/hotel/ic_avatar.png";
import { useEffect, useState } from "react";

export default function HostProfilePopup({ onClose, host }) {
  // Nếu chưa có host, không render để tránh lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  const { id, avatar, name, rating, reviews, properties, bookings, joinedAt } =
    host;

  const handleGetHotel = async (query) => {
    setIsLoading(true);
    const res = await callFetchHotelQuery(query);
    if (res.isSuccess) {
      setHotels(res.data);
      setMeta({
        current: res.meta.currentPage,
        pageSize: res.meta.itemsPerPage,
        total: res.meta.totalItems,
        totalPages: res.meta.totalPages,
      });
    }
    setIsLoading(false);
  };

  const onChangePagination = (pageNumber, pageSize) => {
    setMeta({
      ...meta,
      current: pageNumber,
      pageSize: pageSize,
    });
  };

  useEffect(() => {
    handleGetHotel(
      `current=${meta.current}&pageSize=${meta.pageSize}&ownerId=${id}`,
    );
  }, [id, meta.current, meta.pageSize]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-4xl relative p-8 shadow-xl"
      >
        {/* Phần thông tin chủ nhà */}
        <div className="flex flex-col items-center text-center max-h-[80vh] overflow-y-auto">
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
              <strong>{meta.total || 0}</strong>
              <span>chỗ ở</span>
            </div>
            <div className="flex flex-col items-center">
              <strong>
                {dayjs().utc().diff(dayjs.utc(joinedAt), "month") || 0} tháng
              </strong>
              <span>trên Agoda</span>
            </div>
          </div>

          {/* Danh sách phòng */}
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-4 text-left w-full">
              Danh sách khách sạn ({meta.total || 0})
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : hotels.length === 0 ? (
              <div className="py-8">
                <Empty
                  description="Không tìm thấy khách sạn nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <div className="mx-auto">
                <HotelListForHost hostId={host.id} hotels={hotels} />
              </div>
            )}
            {meta.total > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  pageSize={meta.pageSize}
                  showQuickJumper
                  total={meta.total}
                  onChange={onChangePagination}
                  current={meta.current}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
