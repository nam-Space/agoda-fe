import React from 'react';

const quickInfo = [
  { label: 'Nơi ở', value: '5,534 chỗ', highlight: true },
  { label: 'Khách sạn phổ biến', value: 'Khách sạn Centre' },
  { label: 'Địa bàn phổ biến', value: 'Phước Mỹ', highlight: true },
  { label: 'Giá mỗi đêm từ', value: '131015 ₫' },
  { label: 'Sân bay', value: 'Sân bay Quốc tế Đà Nẵng', highlight: true },
  { label: 'Lý do vi vu', value: 'Bãi biển, Ngắm cảnh, Nhà hàng' },
];

const neighborhoods = [
  [
    { name: 'Phước Mỹ', count: '3665 khách sạn', link: '/vi-vn/phu-c-m/maps/da-nang-vn.html' },
    { name: 'Hòa Hải', count: '1728 khách sạn', link: '/vi-vn/hoa-h-i/maps/da-nang-vn.html' },
    { name: 'Hải Châu', count: '989 khách sạn', link: '/vi-vn/h-i-chau/maps/da-nang-vn.html' },
    { name: 'An Hải Bắc', count: '586 khách sạn', link: '/vi-vn/an-hai-bac/maps/da-nang-vn.html' },
  ],
  [
    { name: 'Xuân Hà', count: '254 khách sạn', link: '/vi-vn/xuan-ha/maps/da-nang-vn.html' },
    { name: 'Thọ Quang', count: '118 khách sạn', link: '/vi-vn/tho-quang/maps/da-nang-vn.html' },
    { name: 'Hòa Vang', count: '99 khách sạn', link: '/vi-vn/hoa-vang/maps/da-nang-vn.html' },
    { name: 'Hòa Minh', count: '84 khách sạn', link: '/vi-vn/hoa-minh/maps/da-nang-vn.html' },
  ],
  [
    { name: 'Lăng Cô', count: '58 khách sạn', link: '/vi-vn/lang-co/maps/da-nang-vn.html' },
    { name: 'Cẩm Lệ', count: '55 khách sạn', link: '/vi-vn/cam-le/maps/da-nang-vn.html' },
    { name: 'Hòa Hiệp Bắc', count: '9 khách sạn', link: '/vi-vn/hoa-hiep-bac/maps/da-nang-vn.html' },
    { name: 'Hòa Ninh', count: '8 khách sạn', link: '/vi-vn/hoa-ninh/maps/da-nang-vn.html' },
  ],
];

const GoodToKnow = () => {
  return (
    <div className="container mx-auto my-6">
      {/* Quick Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Thông tin nhanh về Đà Nẵng, Việt Nam</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              {quickInfo.map((item, idx) => (
                <tr
                  key={item.label}
                  className={item.highlight ? 'bg-blue-50' : ''}
                >
                  <td className="py-2 px-4 font-semibold text-gray-700 w-1/3">{item.label}</td>
                  <td className="py-2 px-4 text-gray-900">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Neighborhoods */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-700">Khám phá khu vực ở Đà Nẵng</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {neighborhoods.map((col, colIdx) => (
              <div key={colIdx} className="flex-1">
                <dl>
                  {col.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      className="block hover:bg-blue-50 rounded px-2 py-2 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <dt className="font-semibold text-gray-700">{item.name}</dt>
                      <dd className="text-gray-500">{item.count}</dd>
                    </a>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoodToKnow;