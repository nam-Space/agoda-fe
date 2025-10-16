
const HotelMapPopup = ({ onClose, lat, lng, hotelName }) => {
  const mapUrl =
    lat && lng
      ? `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          hotelName
        )}&output=embed`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-3/4 flex rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Map */}
        <div className="w-2/3 h-full">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hotel Map"
          ></iframe>
        </div>

        {/* Info Sidebar */}
        <div className="w-1/3 h-full bg-gray-100 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">{hotelName}</h3>
          <div className="flex items-center text-sm text-yellow-500 mb-2">
            ★★★★★ <span className="ml-2 text-gray-700">Khá tốt</span>
          </div>
          <div className="text-sm mb-4 text-gray-600">
            Xem vị trí khách sạn trên bản đồ
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
            Khám phá thêm
          </button>
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
};

export default HotelMapPopup;
