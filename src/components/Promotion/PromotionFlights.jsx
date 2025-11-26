import React, { useEffect, useState } from "react";
import { Spin, Alert, Select, Button, DatePicker, Radio, InputNumber, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { Plane, ArrowLeft, Home, Calendar, Users } from "lucide-react";
import { getPromotionDetail, getAirports, getAirlines } from "../../config/api";
import PromotionEmptyState from "./PromotionEmptyState";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

const PromotionFlights = () => {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const [promotionData, setPromotionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    origin_id: null,
    destination_id: null,
    start_date: null,
    airline_id: null,
    price_sort: null, // 'asc' or 'desc'
  });

  const [searchForm, setSearchForm] = useState({
    tripType: "one-way", // one-way or round-trip
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: 1,
    seatClass: "economy",
  });

  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    const loadAirports = async () => {
      try {
        const res = await getAirports();
        const data = res?.data || [];
        setAirports(data);
      } catch (err) {
        console.error("load airports failed", err);
      }
    };

    const loadAirlines = async () => {
      try {
        const res = await getAirlines();
        const data = res?.data || [];
        setAirlines(data);
      } catch (err) {
        console.error("load airlines failed", err);
      }
    };

    loadAirports();
    loadAirlines();
  }, []);

  useEffect(() => {
    const loadPromotionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getPromotionDetail(promotionId);
        const data = res?.data || res;
        data.flight_promotions = (data.flight_promotions || []).filter(Boolean);
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
      origin_id: null,
      destination_id: null,
      start_date: null,
      airline_id: null,
      price_sort: null,
    });
  };

  const handleSearchFlight = () => {
    // Validate required fields
    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate || 
        (searchForm.tripType === "round-trip" && !searchForm.returnDate)) {
      message.error({
        content: "Vui lòng điền đầy đủ thông tin tìm kiếm!",
        duration: 4,
        style: {
          fontSize: '16px',
          marginTop: '20vh',
        }
      });
      return;
    }

    // Validate logic
    if (searchForm.origin === searchForm.destination) {
      message.warning({
        content: "Điểm đi và điểm đến không được trùng nhau!",
        duration: 4,
        style: {
          fontSize: '16px',
          marginTop: '20vh',
        }
      });
      return;
    }

    if (dayjs(searchForm.departureDate).isBefore(dayjs(), 'day')) {
      message.warning({
        content: "Ngày đi không được nhỏ hơn ngày hiện tại!",
        duration: 4,
        style: {
          fontSize: '16px',
          marginTop: '20vh',
        }
      });
      return;
    }

    const params = new URLSearchParams({
      origin: searchForm.origin || "",
      destination: searchForm.destination || "",
      departureDate: searchForm.departureDate || "",
      returnDate: searchForm.returnDate || "",
      passengers: searchForm.passengers || 1,
      seatClass: searchForm.seatClass || "economy",
      tripType: searchForm.tripType || "one-way",
      promotionId: promotionId,
    });
    navigate(`/flight?${params.toString()}`);
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
      {/* Banner with Search Form */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="space-y-6">
            {/* Promotion Info */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {promotionData.title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/95 max-w-2xl font-medium">
                {promotionData.description}
              </p>
              
              <div className="inline-flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {formatDate(promotionData.start_date)} - {formatDate(promotionData.end_date)}
                </span>
              </div>

              {promotionData.discount_percent && (
                <div className="inline-block ml-3 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  Giảm tới {Number(promotionData.discount_percent)}%
                </div>
              )}
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Trip Type */}
              <div className="mb-4">
                <Radio.Group 
                  value={searchForm.tripType} 
                  onChange={(e) => setSearchForm(prev => ({ ...prev, tripType: e.target.value }))}
                  className="flex gap-4"
                >
                  <Radio value="one-way" className="text-base">Một chiều</Radio>
                  <Radio value="round-trip" className="text-base">Khứ hồi</Radio>
                </Radio.Group>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Plane className="inline h-4 w-4 mr-1" />
                    Bay từ
                  </label>
                  <Select
                    showSearch
                    placeholder="Chọn sân bay đi"
                    className="w-full"
                    size="large"
                    value={searchForm.origin}
                    onChange={(val) => setSearchForm(prev => ({ ...prev, origin: val }))}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {airports.map((a) => (
                      <Option key={a.id} value={a.id}>
                        {a.name}-{a.code}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Plane className="inline h-4 w-4 mr-1 rotate-90" />
                    Bay đến
                  </label>
                  <Select
                    showSearch
                    placeholder="Chọn sân bay đến"
                    className="w-full"
                    size="large"
                    value={searchForm.destination}
                    onChange={(val) => setSearchForm(prev => ({ ...prev, destination: val }))}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {airports.map((a) => (
                      <Option key={a.id} value={a.id}>
                        {a.name}-{a.code}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Ngày đi
                  </label>
                  <DatePicker
                    className="w-full"
                    size="large"
                    placeholder="Chọn ngày đi"
                    value={searchForm.departureDate ? dayjs(searchForm.departureDate) : null}
                    onChange={(date) => setSearchForm(prev => ({ 
                      ...prev, 
                      departureDate: date ? date.format("YYYY-MM-DD") : null 
                    }))}
                    format="DD/MM/YYYY"
                  />
                </div>

                {/* Return Date (only for round-trip) */}
                {searchForm.tripType === "round-trip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Ngày về
                    </label>
                    <DatePicker
                      className="w-full"
                      size="large"
                      placeholder="Chọn ngày về"
                      value={searchForm.returnDate ? dayjs(searchForm.returnDate) : null}
                      onChange={(date) => setSearchForm(prev => ({ 
                        ...prev, 
                        returnDate: date ? date.format("YYYY-MM-DD") : null 
                      }))}
                      format="DD/MM/YYYY"
                      disabled={!searchForm.departureDate}
                      disabledDate={(current) => {
                        return current && searchForm.departureDate && current.isBefore(dayjs(searchForm.departureDate));
                      }}
                    />
                  </div>
                )}

                {/* Passengers & Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Hành khách & Hạng
                  </label>
                  <div className="flex gap-2">
                    <InputNumber
                      min={1}
                      value={searchForm.passengers}
                      onChange={(val) => {
                        const newVal = val === null || val === undefined ? 1 : val;
                        setSearchForm(prev => ({ ...prev, passengers: Number(newVal) }));
                      }}
                      className="w-20"
                      size="large"
                    />
                    <Select
                      value={searchForm.seatClass}
                      onChange={(val) => setSearchForm(prev => ({ ...prev, seatClass: val }))}
                      className="flex-1"
                      size="large"
                    >
                      <Option value="economy">Phổ thông</Option>
                      <Option value="business">Thương gia</Option>
                      <Option value="first">Hạng nhất</Option>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
                    onClick={handleSearchFlight}
                  >
                    TÌM CHUYẾN BAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromotionFlights;
