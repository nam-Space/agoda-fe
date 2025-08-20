import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Thời gian di chuyển trung bình từ Nhà dân Cactusland - Trần Hưng Đạo đến sân bay gần nhất là bao lâu?",
    answer:
      "Thời gian di chuyển trung bình để đến Nhà dân Cactusland - Trần Hưng Đạo từ sân bay là 30 phút. Tuy nhiên, thời gian di chuyển có thể dao động dựa trên tình hình giao thông, thời tiết và thời gian trong ngày.",
  },
  {
    question: "Có các điểm tham quan nào gần Nhà dân Cactusland - Trần Hưng Đạo và trong khoảng cách đi bộ?",
    answer: "Có một số điểm tham quan nổi bật ở gần đây, bạn có thể dễ dàng đi bộ tới.",
  },
  {
    question: "Có các quán bar nào gần Nhà dân Cactusland - Trần Hưng Đạo?",
    answer: "Có nhiều quán bar trong bán kính 1km.",
  },
  {
    question: "Tại Nhà dân Cactusland - Trần Hưng Đạo, khách thường lưu trú trong bao lâu?",
    answer: "Thông thường khách sẽ lưu trú trong khoảng 2-3 đêm.",
  },
  {
    question: "Nhân viên của Nhà dân Cactusland - Trần Hưng Đạo có thể giao tiếp bằng những ngôn ngữ nào?",
    answer: "Nhân viên có thể giao tiếp bằng tiếng Việt và tiếng Anh.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Các câu hỏi thường gặp</h2>
      <div className="border rounded-lg divide-y">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`p-4 cursor-pointer ${
                isOpen ? "bg-blue-50" : "bg-white"
              }`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium ${
                    isOpen ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {item.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {isOpen && (
                <p className="mt-2 text-gray-600">{item.answer}</p>
              )}
            </div>
          );
        })}
      </div>
      <button className="mt-3 text-blue-600 font-medium hover:underline">
        Xem thêm
      </button>
    </div>
  );
}
