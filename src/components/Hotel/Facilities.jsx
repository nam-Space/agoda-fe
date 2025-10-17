// import { Bed, Briefcase, Info } from "lucide-react";
// import { useEffect } from "react";

// export default function Facilities({ facilitiesString, usefulInformation, withUs }) {
//   useEffect(() => {
//     console.log("👉 Raw facilitiesString:", facilitiesString);
//     console.log("👉 usefulInformation:", usefulInformation);
//     console.log("👉 withUs:", withUs);
//   }, [facilitiesString, usefulInformation, withUs]);

//   // --- Làm sạch HTML phần tiện nghi ---
//   const cleanFacilities =
//     typeof facilitiesString === "string"
//       ? facilitiesString.replace(/<[^>]*>/g, "").trim()
//       : "";

//   const facilitiesArray =
//     typeof cleanFacilities === "string"
//       ? cleanFacilities
//           .split(",")
//           .map((item) => item.trim())
//           .filter(Boolean)
//       : [];

//   // --- Làm sạch HTML phần "withUs" nhưng vẫn giữ cấu trúc danh sách ---
//   const safeWithUsHTML =
//     typeof withUs === "string"
//       ? withUs.replace(/<script[^>]*>.*?<\/script>/gi, "") // chặn script
//       : "";

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
//       {/* --- Tiện nghi & cơ sở vật chất --- */}
//       <section>
//         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//           <Bed size={20} />
//           Tiện nghi và cơ sở vật chất
//         </h2>

//         {facilitiesArray.length === 0 ? (
//           <p className="text-gray-500 italic">Không có dữ liệu tiện nghi.</p>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-3">
//             {facilitiesArray.map((item, idx) => (
//               <div key={idx} className="flex items-center gap-2 text-sm">
//                 <Bed size={16} />
//                 <span>{item}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* --- Thông tin hữu ích --- */}
//       {usefulInformation && (
//         <section>
//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <Info size={20} />
//             Thông tin hữu ích
//           </h2>
//           <p className="text-gray-700">{usefulInformation}</p>
//         </section>
//       )}

//       {/* --- Dịch vụ cùng chúng tôi --- */}
//       {withUs && (
//         <section>
//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <Briefcase size={20} />
//             Dịch vụ cùng chúng tôi
//           </h2>
//           <div
//             className="prose prose-sm text-gray-700 max-w-none"
//             dangerouslySetInnerHTML={{ __html: safeWithUsHTML }}
//           />
//         </section>
//       )}
//     </div>
//   );
// }

import { Bed, Briefcase, Info } from "lucide-react";
import { useEffect } from "react";

export default function Facilities({ facilitiesString, usefulInformation, withUs }) {
  useEffect(() => {
    console.log("👉 Raw facilitiesString:", facilitiesString);
    console.log("👉 usefulInformation:", usefulInformation);
    console.log("👉 withUs:", withUs);
  }, [facilitiesString, usefulInformation, withUs]);

  // Hàm tiện ích: loại bỏ thẻ HTML, tách theo dấu phẩy
  const parseCommaSeparated = (text) => {
    if (!text) return [];
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    return cleanText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // --- Tiện nghi & cơ sở vật chất ---
  const facilitiesArray = parseCommaSeparated(facilitiesString);

  // --- Thông tin hữu ích ---
  const infoArray = parseCommaSeparated(usefulInformation);

  // --- Dịch vụ cùng chúng tôi ---
  const withUsArray = parseCommaSeparated(withUs);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* --- Tiện nghi & cơ sở vật chất --- */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bed size={20} />
          Tiện nghi và cơ sở vật chất
        </h2>

        {facilitiesArray.length === 0 ? (
          <p className="text-gray-500 italic">Không có dữ liệu tiện nghi.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {facilitiesArray.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Bed size={16} className="text-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Thông tin hữu ích --- */}
      {infoArray.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info size={20} />
            Thông tin hữu ích
          </h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {infoArray.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Info size={16} className="text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- Dịch vụ cùng chúng tôi --- */}
      {withUsArray.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase size={20} />
            Dịch vụ cùng chúng tôi
          </h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {withUsArray.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Briefcase size={16} className="text-amber-500" />
                <span>{item}</span>
              </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}