// import { Building2, Car, Clock, Plane } from "lucide-react";

// export default function HotelRules({ regulation }) {
//   // Debug: xem giá trị regulation
//   console.log("HotelRules regulation:", regulation);

//   const createMarkup = (html) => ({ __html: html });

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 text-gray-800">
//       <h2 className="text-xl font-bold mb-4">Quy định của chỗ nghỉ</h2>

//       {regulation ? (
//         <div
//           className="prose prose-sm text-gray-700 mb-6"
//           dangerouslySetInnerHTML={createMarkup(regulation)}
//         />
//       ) : (
//         <p>Chưa có quy định nào được cung cấp.</p>
//       )}

//       <h2 className="text-xl font-bold mb-4">Vài thông tin hữu ích</h2>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div>
//           <h3 className="font-semibold mb-2 flex items-center gap-2">
//             <Clock size={18} /> Nhận phòng/Trả phòng
//           </h3>
//           <ul className="text-sm space-y-1">
//             <li>🕒 Nhận phòng từ: 14:00</li>
//             <li>🕛 Trả phòng đến: 12:00</li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold mb-2 flex items-center gap-2">
//             <Building2 size={18} /> Về khách sạn
//           </h3>
//           <ul className="text-sm space-y-1">
//             <li>🏨 Khách sạn được xây vào năm: 1994</li>
//             <li>🏗️ Số tầng khách sạn: 8</li>
//             <li>🔌 Điện áp trong phòng: 220</li>
//             <li>🏢 Tổng số lượng phòng: 58</li>
//             <li>🛠️ Khách sạn được nâng cấp gần nhất vào: 2012</li>
//             <li>🍽️ Số lượng nhà hàng: 1</li>
//             <li>🍹 Số lượng quán bar/lounge: 1</li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold mb-2 flex items-center gap-2">
//             <Car size={18} /> Đỗ xe
//           </h3>
//           <ul className="text-sm space-y-1 mb-3">
//             <li>🅿️ Phí giữ xe hằng ngày: 0 VND</li>
//           </ul>

//           <h3 className="font-semibold mb-2 flex items-center gap-2">
//             <Plane size={18} /> Di chuyển
//           </h3>
//           <ul className="text-sm space-y-1">
//             <li>📍 Khoảng cách tới trung tâm thành phố: 6 km</li>
//             <li>🚌 Thời gian di chuyển tới sân bay (phút): 34</li>
//             <li>💸 Phí đưa đón sân bay: 450000 VND</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Info } from "lucide-react";

export default function HotelRules({ regulation }) {
    // Xử lý nội dung quy định
    const parseRegulation = (html) => {
        if (!html) return [];

        let text = html
            .replace(/<[^>]*>/g, "") // loại bỏ thẻ HTML
            .replace(/;/g, ",") // đổi dấu ; thành ,
            .replace(/\s*,\s*/g, ", ") // chuẩn hóa dấu phẩy
            .trim();

        return text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };

    const regulationList = parseRegulation(regulation);

    return (
        <div className="mx-auto bg-white shadow-md rounded-2xl p-6 text-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info size={20} />
                Quy định của chỗ nghỉ
            </h2>

            {regulationList.length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-700">
                    {regulationList.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <Info size={16} className="text-blue-500 mt-1" />
                            <span>{rule}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">
                    Chưa có quy định nào được cung cấp.
                </p>
            )}
        </div>
    );
}
