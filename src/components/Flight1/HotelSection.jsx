const HotelSection = () => {
  const hotels = [
    {
      name: 'GreenTree Inn Rizhao JuXian YinXing Avenue',
      rating: 9.3,
      reviewText: 'Trên cả tuyệt vời',
      stars: 3,
      price: 357581,
      image: 'https://bravatmienbac.com.vn/wp-content/uploads/2018/12/La-residencia-boutique-hotel.jpg',
    },
    {
      name: 'GreenTree Inn Shandong Rizhao University City',
      rating: 8.8,
      reviewText: 'Tuyệt vời',
      stars: 3,
      price: 1345290,
      image: 'https://bravatmienbac.com.vn/wp-content/uploads/2018/12/La-residencia-boutique-hotel.jpg',
    },
    {
      name: 'GreenTree Inn Rizhao Train Station',
      rating: 9.4,
      reviewText: 'Trên cả tuyệt vời',
      stars: 3,
      price: 1896812,
      image: 'https://bravatmienbac.com.vn/wp-content/uploads/2018/12/La-residencia-boutique-hotel.jpg',
    },
  ];

  return (
    <div className="p-4 bg-white">
      <h2 className="text-lg font-semibold mb-1">
        Cần khách sạn cho chuyến đi đến Nhật Chiếu của quý khách?
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        9 tháng 8 - 10 tháng 8 • 1 Người lớn
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div
              className="h-32 bg-gray-200"
              style={{
                backgroundImage: `url(${hotel.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="p-2">
              <h3 className="text-sm font-medium line-clamp-2">
                {hotel.name}
              </h3>
              <div className="flex items-center mt-1 text-sm">
                <span className="text-yellow-500">
                  {'★'.repeat(hotel.stars)}
                </span>
                <span className="text-blue-600 font-medium ml-2">
                  {hotel.rating}
                </span>
                <span className="text-gray-500 ml-1">{hotel.reviewText}</span>
              </div>
              <p className="text-red-600 font-medium mt-1">
                đ {hotel.price.toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        ))}

        {/* Card "Xem hết" */}
        <a
          href="#"
          className="border rounded-lg flex flex-col items-center justify-center hover:shadow-lg transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full border bg-white shadow mb-2">
            <span className="text-lg">{'>'}</span>
          </div>
          <span className="text-blue-500 text-sm font-medium">Xem hết</span>
        </a>
      </div>
    </div>
  );
};

export default HotelSection;
