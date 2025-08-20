// const HotelMapPopup = ({ onClose }) => {
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-3/4 flex rounded-lg overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Map Section */}
//         <div className="w-2/3 h-full">
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.144312614511!2d107.08386481514391!3d10.34578909257815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzQ0LjciTiAxMDfCsDA1JzAxMi4xIkU!5e0!3m2!1sen!2s!4v1698445200000"
//             width="100%"
//             height="100%"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           ></iframe>
//         </div>

//         {/* Info Sidebar */}
//         <div className="w-1/3 h-full bg-gray-100 p-4 overflow-y-auto">
//           <h3 className="text-lg font-semibold mb-2">
//             Căn hộ Studio The Song Vũng Tàu - Hồng Hà Homes
//           </h3>
//           <div className="flex items-center text-sm text-yellow-500 mb-2">
//             ★★★★★ <span className="ml-2 text-gray-700">Rất tốt 8.5</span>
//           </div>
//           <div className="text-sm mb-4 text-gray-600">
//             Vị trí tuyệt vời - cách biển 420 mét
//           </div>

//           <div className="text-sm mb-2">
//             <strong>🚗 Parking:</strong>{' '}
//             <span className="text-green-600">Available</span>
//           </div>

//           <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
//             Khám phá thêm
//           </button>
//         </div>
//       </div>

//       <button
//         className="absolute top-4 right-4 text-white text-2xl"
//         onClick={onClose}
//       >
//         ×
//       </button>
//     </div>
//   );
// };

// export default HotelMapPopup;

const HotelMapPopup = ({ onClose }) => {
  // Địa chỉ bạn muốn hiển thị trên bản đồ
  const address = "393/30 Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP Hồ Chí Minh, Việt Nam";

  // Tạo URL nhúng động từ địa chỉ
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-3/4 flex rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Map Section: sử dụng mapUrl thay vì link iframe cố định */}
        <div className="w-2/3 h-full">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>

        {/* Info Sidebar */}
        <div className="w-1/3 h-full bg-gray-100 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">
            Nhà dân Cactusland - Trần Hưng Đạo (Cactusland Homestay - Tran Hung Dao)
          </h3>
          <div className="flex items-center text-sm text-yellow-500 mb-2">
            ★★★★★ <span className="ml-2 text-gray-700">Khá tốt 7.0</span>
          </div>
          <div className="text-sm mb-4 text-gray-600">
            Vị trí tuyệt vời - Cách trung tâm TP. 380 m
          </div>

          <div className="text-sm mb-2">
            <strong>🚶Tuyệt vời để đi bộ</strong>{" "}
          </div>

          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
            Khám phá thêm
          </button>
        </div>
      </div>

      {/* Nút đóng popup */}
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default HotelMapPopup;

