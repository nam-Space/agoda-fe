import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivitySlider = ({ cityId, cityName }) => {
  const sliderRef = useRef(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const navigate = useNavigate();

  const categoryMap = {
    tourist_attractions: "Điểm tham quan",
    journey: "Tour",
  };
  const typeMap = Object.fromEntries(Object.entries(categoryMap).map(([k, v]) => [v, k]));

  // Fetch API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/activities/activities/?current=1&pageSize=10&city_id=${cityId}`
        );
        const data = await res.json();

        if (data.isSuccess && data.data) {
          const formatted = data.data.map(act => ({
            id: act.id,
            title: act.name,
            type: act.category,
            price: act.avg_price ? `${act.avg_price.toLocaleString('vi-VN')} đ` : 'Đang cập nhật',
            images: act.images?.map(img => `http://127.0.0.1:8000${img.image}`) || [],
            image: act.images?.[0] ? `http://127.0.0.1:8000${act.images[0].image}` : 'https://via.placeholder.com/250x150?text=No+Image',
            rating: act.avg_star || 0,
            reviews: act.total_time || 0,
          }));

          setActivities(formatted);
          setFilteredActivities(formatted);

          const uniqueCategories = Array.from(new Set(formatted.map(a => a.type)));
          setCategories(['Tất cả', ...uniqueCategories.map(c => categoryMap[c] || c)]);
        }
      } catch (err) {
        console.error('Fetch activities error:', err);
      }
    };

    fetchActivities();
  }, [cityId]);

  // Filter category
  useEffect(() => {
    if (selectedCategory === 'Tất cả') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter(a => a.type === typeMap[selectedCategory])
      );
    }
  }, [selectedCategory, activities]);

  // Scroll slider
  const scrollLeft = () => {
    if (sliderRef.current) {
      const itemWidth = 250 + 16; // min-width + gap
      sliderRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      const itemWidth = 250 + 16;
      sliderRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  // Navigate to detail
  const handleActivityClick = (id) => {
    navigate(`/activity/${id}`);
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Title & Categories */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800">
            Hoạt động không thể bỏ qua ở {cityName}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                } transition`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-gray-100"
          >
            ‹
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide"
          >
            {filteredActivities.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-500">
                Không có hoạt động nào được tìm thấy.
              </div>
            ) : (
              filteredActivities.map(activity => (
                <div
                  key={activity.id}
                  className="min-w-[250px] bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleActivityClick(activity.id)}
                >
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 truncate">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{categoryMap[activity.type]}</p>
                    <p className="text-blue-600 font-bold mt-1">{activity.price}</p>
                    <div className="flex items-center mt-1 text-sm">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < Math.round(activity.rating) ? "text-yellow-500" : "text-gray-300"}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="ml-1 text-gray-500">({activity.reviews} đánh giá)</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivitySlider;
