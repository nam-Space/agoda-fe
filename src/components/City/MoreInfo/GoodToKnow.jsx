import { useEffect, useState } from "react";

const GoodToKnow = ({ cityId }) => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [quickInfo, setQuickInfo] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;

    const fetchData = async () => {
      try {
        const [neighRes, quickRes] = await Promise.all([
          fetch(`http://localhost:8000/api/neighborhoods?city_id=${cityId}`),
          fetch(`http://localhost:8000/api/quick-info/by-city/?city_id=${cityId}`),

        ]);

        if (!neighRes.ok || !quickRes.ok)
          throw new Error("Không thể tải dữ liệu");

        const neighData = await neighRes.json();
        const quickData = await quickRes.json();

        setNeighborhoods(neighData.results || []);
        setQuickInfo(quickData.results || []);

        // Lấy thông tin city từ bất kỳ object nào có city
        const city =
          (neighData.results?.[0]?.city || quickData.results?.[0]?.city) ?? null;
        setCityInfo(city);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  return (
    <div className="container mx-auto my-6">
      {/* Quick Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-700">
            Thông tin nhanh về{" "}
            {cityInfo
              ? `${cityInfo.name}, ${cityInfo.country.name}`
              : "Đang tải..."}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              {quickInfo.length > 0 ? (
                quickInfo.map((item) => (
                  <tr
                    key={item.id}
                    className={item.highlight ? "bg-blue-50" : ""}
                  >
                    <td className="py-2 px-4 font-semibold text-gray-700 w-1/3">
                      {item.label}
                    </td>
                    <td className="py-2 px-4 text-gray-900">{item.value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4 text-gray-500" colSpan={2}>
                    Không có dữ liệu nhanh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Neighborhoods */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-700">
              {cityInfo
                ? `Khám phá khu vực ở ${cityInfo.name}`
                : "Khám phá khu vực"}
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : neighborhoods.length === 0 ? (
            <p className="text-gray-500">Không có dữ liệu khu vực.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {neighborhoods.map((item) => (
                <div
                  key={item.id}
                  className="block hover:bg-blue-50 rounded px-3 py-3 transition border border-gray-100"
                >
                  <dt className="font-semibold text-gray-700">{item.name}</dt>
                  <dd className="text-gray-500 text-sm">
                    {item.description || "Chưa có mô tả"}
                  </dd>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GoodToKnow;

