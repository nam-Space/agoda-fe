import React, { useEffect, useState } from "react";
import { Spin, Alert, Select, InputNumber, Button, DatePicker, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Home } from "lucide-react";
import { getPromotionDetail, getCities, getImageUrl } from "../../config/api";
import PromotionBanner from "./PromotionBanner";
import PromotionEmptyState from "./PromotionEmptyState";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const PromotionActivities = () => {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const [promotionData, setPromotionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    city_id: null,
    min_price: null,
    max_price: null,
    min_rating: null,
    start_date: null,
    end_date: null,
    search: null,
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await getCities();
        const data = res?.data || [];
        setCities(data);
      } catch (err) {
        console.error("load cities failed", err);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadPromotionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = { promotion_type: 3 };
        if (filters.city_id) params.city_id = filters.city_id;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;
        if (filters.min_rating) params.min_rating = filters.min_rating;
        if (filters.start_date) params.start_date = filters.start_date;
        if (filters.end_date) params.end_date = filters.end_date;
        if (filters.search) params.search = filters.search;

        const res = await getPromotionDetail(promotionId, params);
        const data = res?.data || res;
        data.activity_promotions = (data.activity_promotions || []).filter(Boolean);
        setPromotionData(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) loadPromotionData();
  }, [promotionId, filters]);

  const handleApply = (newPartial) => {
    setFilters((prev) => ({ ...prev, ...newPartial }));
  };

  const handleReset = () => {
    setFilters({
      city_id: null,
      min_price: null,
      max_price: null,
      min_rating: null,
      start_date: null,
      end_date: null,
      search: null,
    });
  };

  const handleDateChange = (dates) => {
    if (dates) {
      handleApply({
        start_date: dates[0].format("YYYY-MM-DD"),
        end_date: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      handleApply({ start_date: null, end_date: null });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!promotionData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <PromotionBanner
          title={promotionData.title}
          description={promotionData.description}
          discountPercent={promotionData.discount_percent}
          startDate={promotionData.start_date}
          endDate={promotionData.end_date}
          image={promotionData.image}
        />
      </section>

      {/* Back / Home buttons */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-md text-sm"
          >
            <Home className="w-4 h-4" /> Trang chủ
          </button>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="container mx-auto px-4 py-4">
        <div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Thành phố</label>
              <Select
                allowClear
                showSearch
                placeholder="Chọn thành phố"
                className="w-full"
                value={filters.city_id}
                onChange={(val) => handleApply({ city_id: val })}
                popupStyle={{ maxHeight: 200, overflow: "auto" }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {cities.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tìm kiếm</label>
              <Input
                placeholder="Tìm theo tên hoặc mô tả..."
                value={filters.search}
                onChange={(e) => handleApply({ search: e.target.value })}
                allowClear
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Khoảng ngày</label>
              <RangePicker
                className="w-full"
                value={
                  filters.start_date && filters.end_date
                    ? [dayjs(filters.start_date), dayjs(filters.end_date)]
                    : null
                }
                onChange={handleDateChange}
                format="YYYY-MM-DD"
              />
            </div>

            {/* <div>
              <label className="text-sm text-gray-600 mb-1 block">Giá tối thiểu</label>
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Min price"
                value={filters.min_price}
                onChange={(val) => handleApply({ min_price: val })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Giá tối đa</label>
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Max price"
                value={filters.max_price}
                onChange={(val) => handleApply({ max_price: val })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Đánh giá tối thiểu</label>
              <InputNumber
                className="w-full"
                min={0}
                max={5}
                step={0.1}
                placeholder="Min rating"
                value={filters.min_rating}
                onChange={(val) => handleApply({ min_rating: val })}
              />
            </div> */}

            <div className="md:col-span-3 flex gap-2 justify-end">
              <Button type="primary" onClick={() => setFilters({ ...filters })}>
                Áp dụng
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Hoạt động đang khuyến mãi
          </h2>
          <span className="text-muted-foreground">
            ({promotionData.activity_promotions?.length || 0} hoạt động)
          </span>
        </div>

        {promotionData.activitys && promotionData.activitys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionData.activitys.map((activity) => {
              // Tính giá sau giảm
              const avgPrice = activity.avg_price || 0;
              const discountPercent = activity.discount || 0;
              const priceAfterDiscount = avgPrice > 0 ? Math.round(avgPrice * (1 - discountPercent / 100)) : 0;
              // Định dạng tiền VND
              const formatVND = (val) => val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
              return (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg bg-white overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {activity.thumbnails && (
                    <img
                      src={getImageUrl(activity.thumbnails)}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {activity.name || "N/A"}
                      </h3>
                      <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded flex-shrink-0 ml-2">
                        -{discountPercent || 0}%
                      </div>
                    </div>
                    {/* Không có short_description trong activitys */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs text-gray-500">Giá trung bình</div>
                        {avgPrice > 0 ? (
                          <>
                            <span className="line-through text-gray-400 text-sm mr-2">
                              {formatVND(avgPrice)}
                            </span>
                            <span className="font-bold text-blue-600 text-lg">
                              {formatVND(priceAfterDiscount)}
                            </span>
                          </>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Đánh giá</div>
                        <div className="font-medium">
                          ⭐ {activity.avg_star || "N/A"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/activity/detail/${activity.id}`)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <PromotionEmptyState
            message="Không có hoạt động phù hợp với bộ lọc của bạn."
            onReset={handleReset}
          />
        )}
      </section>
    </div>
  );
};

export default PromotionActivities;
