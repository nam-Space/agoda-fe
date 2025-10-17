import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

const Question = ({ cityId }) => {
  const [faqs, setFaqs] = useState([]);
  const [travelTips, setTravelTips] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  // Gọi API khi cityId thay đổi
  useEffect(() => {
    if (!cityId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [faqRes, tipRes] = await Promise.all([
          fetch(`http://localhost:8000/api/faqs/by-city/?cityId=${cityId}`),
          fetch(`http://localhost:8000/api/travel-tips/by-city/?cityId=${cityId}`),
        ]);
        const faqData = await faqRes.json();
        const tipData = await tipRes.json();

        setFaqs(faqData.results || []);
        setTravelTips(tipData.results || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cityId]);

  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, faqs.length));

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    setOpenIdx(null);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <>
      {/* --- Phần FAQ --- */}
      <div className="container mx-auto my-10 px-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Các câu hỏi thường gặp
        </h3>
        <div className="space-y-4">
          {faqs.length === 0 && (
            <p className="text-center text-gray-500">Không có dữ liệu FAQ.</p>
          )}
          {faqs.slice(0, visibleCount).map((faq, idx) => (
            <div
              key={faq.id}
              className="border rounded-xl bg-white shadow-lg transition hover:shadow-2xl"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none hover:bg-blue-50 transition rounded-xl"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
              >
                <span className="font-medium text-gray-900 text-base">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-400 transform transition-transform duration-200 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
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
            faqs.length > PAGE_SIZE && (
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium shadow hover:bg-gray-300 transition"
                onClick={handleShowLess}
              >
                Ẩn bớt
              </button>
            )
          )}
        </div>
      </div>

      {/* --- Phần Travel Tips --- */}
      <div className="container mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-8">
          Kinh nghiệm du lịch
        </h2>
        {travelTips.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu mẹo du lịch.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {travelTips.map((tip) => (
              <div
                key={tip.id}
                className="p-6 bg-white shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-700 text-base mb-2">{tip.content}</p>
                <span className="inline-block mt-2 text-sm text-blue-500 font-medium">
                  #{tip.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Question;
