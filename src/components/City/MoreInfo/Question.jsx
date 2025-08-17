import React, { useState } from 'react';

const faqs = [
  {
    question: 'Giá trung bình của một khách sạn ở Đà Nẵng là bao nhiêu?',
    answer:
      'Giá trung bình cho một khách sạn 3 sao ở Đà Nẵng là 756.924 VND. Giá trung bình cho một khách sạn 4 sao ở Đà Nẵng là 1.371.532 VND. Giá trung bình cho một khách sạn 5 sao ở Đà Nẵng là 4.471.839 VND.',
  },
  {
    question: 'Giá trung bình của một khách sạn ở Đà Nẵng vào cuối tuần này là bao nhiêu?',
    answer:
      'Giá trung bình cho một khách sạn 3 sao ở Đà Nẵng vào cuối tuần này là 854.507 VND. Giá trung bình cho một khách sạn 4 sao ở Đà Nẵng vào cuối tuần này là 1.727.246 VND. Giá trung bình cho một khách sạn 5 sao ở Đà Nẵng vào cuối tuần này là 5.037.450 VND.',
  },
  {
    question: 'Giá trung bình của một khách sạn ở Đà Nẵng vào tối nay là bao nhiêu?',
    answer:
      'Giá trung bình cho một khách sạn 3 sao ở Đà Nẵng vào tối nay là 795.240 VND. Giá trung bình cho một khách sạn 4 sao ở Đà Nẵng vào tối nay là 1.616.338 VND. Giá trung bình cho một khách sạn 5 sao ở Đà Nẵng vào tối nay là 5.709.791 VND.',
  },
  {
    question: 'Đâu là những khách sạn tốt nhất ở Đà Nẵng gần Sân bay Quốc tế Đà Nẵng?',
    answer:
      'Những du khách đã được xác minh đến Đà Nẵng và ở gần Sân bay Quốc tế Đà Nẵng đã đưa ra bài đánh giá cao nhất cho Khách sạn Centre, Khách sạn Satya Đà Nẵng Chợ Hàn và Wink Hotel Danang Centre - 24hrs Lifestyle Stay.',
  },
  {
    question: 'Đâu là những khách sạn tốt nhất ở Đà Nẵng gần Ngũ Hành Sơn?',
    answer:
      'Những du khách đã được xác minh đến Đà Nẵng và ở gần Ngũ Hành Sơn đã đưa ra bài đánh giá cao nhất cho Fusion Resort & Villas Da Nang, Khu nghỉ dưỡng và Spa Hyatt Regency Đà Nẵng và Furama Resort Danang.',
  },
  {
    question: 'Đâu là những khách sạn tốt nhất ở Đà Nẵng gần Chợ Hàn?',
    answer:
      'Những du khách đã được xác minh đến Đà Nẵng và ở gần Chợ Hàn đã đưa ra bài đánh giá cao nhất cho Khách sạn Centre, Khách sạn Satya Đà Nẵng Chợ Hàn và Wink Hotel Danang Centre - 24hrs Lifestyle Stay.',
  },
  {
    question: 'Những khách sạn nào được ưa chuộng nhất ở Đà Nẵng?',
    answer:
      'Các khách sạn nổi tiếng ở Đà Nẵng bao gồm Khách sạn Centre, Mercure Danang French Village Bana Hills và SALA DANANG BEACH HOTEL.',
  },
  {
    question: 'Đâu là những khách sạn tốt nhất ở Đà Nẵng dành cho lứa đôi?',
    answer:
      'Những cặp nam nữ ở lại Đà Nẵng đã đánh giá cao cho Khách sạn Centre, Mercure Danang French Village Bana Hills và SALA DANANG BEACH HOTEL.',
  },
  {
    question: 'Đâu là những khách sạn tốt nhất ở Đà Nẵng dành cho gia đình?',
    answer:
      'Những gia đình ở lại Đà Nẵng đề cao Khách sạn Centre, Mercure Danang French Village Bana Hills và SALA DANANG BEACH HOTEL.',
  },
  {
    question: 'Những khách sạn nào ở Đà Nẵng có góc nhìn tốt nhất?',
    answer:
      'Những du khách đã được xác minh đến Đà Nẵng đã đưa ra bài đánh giá cao nhất cho góc nhìn tại The Herriott Hotel & Suite Danang, Le Sands Oceanfront Danang Hotel và Avora Hotel.',
  },
  {
    question: 'Những khách sạn nào ở Đà Nẵng có bữa sáng tốt nhất?',
    answer:
      'Những du khách đã được xác minh đến Đà Nẵng đã đưa ra bài đánh giá cao nhất cho bữa sáng tại Frangipani Boutique Hotel Da Nang, John Boutique Villa và Travellers Nest Hostel.',
  },
  {
    question: 'Đâu là khu tốt nhất ở Đà Nẵng để ở lại?',
    answer:
      'Những khu phổ biến đối với du khách ở lại Đà Nẵng bao gồm Phước Mỹ, Hải Châu và An Hải Bắc.',
  },
];

const PAGE_SIZE = 5;

const Question = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, faqs.length));
  };

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    setOpenIdx(null);
  };

  return (
    <>
        <div className="max-w-3xl mx-auto my-10">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Các câu hỏi thường gặp</h3>
        <div className="space-y-4">
            {faqs.slice(0, visibleCount).map((faq, idx) => (
            <div
                key={idx}
                className="border rounded-xl bg-white shadow-lg transition hover:shadow-2xl"
            >
                <button
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none hover:bg-blue-50 transition rounded-xl"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
                >
                <span className="font-medium text-gray-900 text-base">{faq.question}</span>
                <svg
                    className={`w-5 h-5 text-blue-400 transform transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
                </button>
                {openIdx === idx && (
                <div className="px-6 pb-4 text-gray-700 text-base animate-fade-in">
                    {faq.answer}
                </div>
                )}
            </div>
            ))}
        </div>
        <div className="flex justify-center mt-6">
            {visibleCount < faqs.length ? (
            <button
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium shadow hover:bg-blue-700 transition"
                onClick={handleShowMore}
            >
                Hiện thêm câu hỏi
            </button>
            ) : (
            <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium shadow hover:bg-gray-300 transition"
                onClick={handleShowLess}
            >
                Ẩn bớt
            </button>
            )}
        </div>
        </div>

        {/* Kinh nghiệm du lịch Đà Nẵng */}
        <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-8">Kinh nghiệm du lịch Đà Nẵng</h2>
            <div className="grid grid-cols-1 gap-2">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">10 lý do bạn nên đến Đà Nẵng</h3>
                    <ul className="list-none pl-5 text-gray-700 space-y-2 mb-6">
                        <li>Nằm giữa Hà Nội và TP.HCM, Đà Nẵng là điểm đến hấp dẫn, tránh xa sự ồn ào.</li>
                        <li>Nhiều bãi biển đẹp, chùa cổ kính, sông êm đềm, đồi núi xanh ngắt.</li>
                        <li>Thành phố đa dạng văn hóa, nghệ thuật, nhiều lễ hội và sự kiện quanh năm.</li>
                        <li>Nhiều nhà hàng, quán cà phê, cửa hàng độc đáo, trải nghiệm ẩm thực và mua sắm tuyệt vời.</li>
                        <li>Nổi tiếng với bãi biển cát trắng, nước biển trong xanh, lý tưởng để thư giãn.</li>
                        <li>Khám phá Ngũ Hành Sơn với hang động và chùa cổ kính.</li>
                        <li>Tham quan Bảo tàng Đà Nẵng, tìm hiểu lịch sử và văn hóa.</li>
                        <li>Đi bộ trên Cầu Rồng, công trình kiến trúc độc đáo Đông Nam Á.</li>
                        <li>Vui chơi tại Sun World Danang Wonders, công viên giải trí lớn.</li>
                        <li>Thưởng thức ẩm thực địa phương tại chợ Hàn và các quán ăn đặc sản.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Thời điểm tốt nhất để đến Đà Nẵng</h3>
                    <p className="text-gray-700 mb-6">
                        Đà Nẵng có khí hậu nhiệt đới, mùa mưa và mùa khô rõ ràng. Thời điểm lý tưởng là từ tháng 2 đến tháng 5, khi thời tiết khô ráo, mát mẻ và nhiều lễ hội diễn ra.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Một số lưu ý hữu ích cho du khách</h3>
                    <ul className="list-none pl-5 text-gray-700 space-y-2">
                        <li>Chuẩn bị quần áo phù hợp, giày dép thoải mái cho hoạt động ngoài trời.</li>
                        <li>Nên mang theo sách hướng dẫn hoặc tham gia tour địa phương để hiểu rõ lịch sử, văn hóa.</li>
                        <li>Thử các món đặc sản như bánh tráng cuốn thịt heo, mì Quảng, bún mắm, bánh bèo.</li>
                        <li>Mua sắm tại chợ Hàn hoặc cửa hàng địa phương để tìm quà lưu niệm.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Khám phá những điều thú vị về Đà Nẵng</h3>
                    <ul className="list-none pl-5 text-gray-700 space-y-2 mb-6">
                        <li>Tham quan Ngũ Hành Sơn, hang động và chùa cổ kính.</li>
                        <li>Khám phá Bảo tàng Đà Nẵng với nhiều hiện vật quý giá.</li>
                        <li>Đi bộ trên Cầu Rồng, biểu tượng kiến trúc của thành phố.</li>
                        <li>Vui chơi tại Sun World Danang Wonders với nhiều trò chơi hấp dẫn.</li>
                        <li>Thưởng thức ẩm thực tại chợ Hàn và các quán ăn địa phương.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Cách đến Đà Nẵng dễ dàng nhất</h3>
                    <p className="text-gray-700 mb-6">
                        Đà Nẵng có sân bay quốc tế, nhiều chuyến bay từ Hà Nội, TP.HCM và các thành phố khác. Bạn cũng có thể đi xe hơi, xe buýt từ các tỉnh lân cận.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Cách di chuyển trong Đà Nẵng</h3>
                    <ul className="list-none pl-5 text-gray-700 space-y-2 mb-6">
                        <li>Di chuyển bằng xe đạp, xe máy, taxi hoặc xe buýt địa phương.</li>
                        <li>Đi bộ thuận tiện trong khu vực trung tâm thành phố.</li>
                        <li>Có thể thuê xe đạp, xe máy tại các cửa hàng địa phương.</li>
                        <li>Dùng ứng dụng di động để đặt taxi nhanh chóng.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Những trải nghiệm thú vị khi đến Đà Nẵng</h3>
                    <ul className="list-none pl-5 text-gray-700 space-y-2 mb-6">
                        <li>Lướt sóng, lặn biển, đi bộ trên bãi biển.</li>
                        <li>Đua thuyền buồm, chèo thuyền trên sông Hàn.</li>
                        <li>Tham gia lễ hội ánh sáng Đà Nẵng vào tháng 3, với âm nhạc, triển lãm ánh sáng và pháo hoa.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Nên ở đâu ở Đà Nẵng?</h3>
                    <p className="text-gray-700 mb-6">
                        Có nhiều lựa chọn khách sạn từ sang trọng đến giá rẻ. Nếu muốn ở gần biển, chọn khu Mỹ Khê hoặc Non Nước. Nếu muốn gần trung tâm, chọn khu Hải Châu hoặc Thanh Khê.
                    </p>
                </div>
                <div>       
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Tại sao nên đặt khách sạn ở Đà Nẵng trên Agoda.com</h3>
                    <p className="text-gray-700">
                        Agoda.com là trang đặt phòng hàng đầu, nhiều lựa chọn khách sạn, giá tốt, đặt phòng nhanh chóng. Bạn có thể tìm khách sạn gần biển, trung tâm hoặc các điểm tham quan dễ dàng.
                    </p>
                </div>
            </div>
        </div>
    </>
    );
};

export default Question;