import { Layout, Row, Col, ConfigProvider } from "antd";
import React, { useState, useEffect } from "react";
import ClientLayout from "layouts/ClientLayout";
import SearchBar from "components/Search/SearchBar";
import FilterSidebar from "components/Search/FilterSidebar";
import HotelList from "components/Search/HotelList";
import { mockHotels } from "components/Search/data/mockHotels";
import { useSearchParams, useNavigate } from "react-router-dom";
import { callGetHotels, callFetchCityDetail } from "config/api";

const { Content } = Layout;

const SearchHouseAndApartment = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [location, setLocation] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy params từ URL
  const cityId = searchParams.get("cityId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const room = searchParams.get("room");
  const stay_type = searchParams.get("stay_type");
  const airport = searchParams.get("airport");
  const airportId = searchParams.get("airportId");
  const airportType = searchParams.get("airportType");

  useEffect(() => {
    if (cityId) {
      fetchCityName();
      fetchHotels();
    }
  }, [cityId]);

  const fetchCityName = async () => {
    try {
      const res = await callFetchCityDetail(cityId);
      setLocation(res.data.name);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await callGetHotels({
        currentPage: 1,
        pageSize: 10,
        filters: {
          cityId: cityId,
          stay_type: stay_type || "overnight",
          startDate: startDate,
          endDate: endDate,
          // adult: adult,
          // child: child,
          room: room,
        },
      });
      setHotels(response.data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setHotels([]);
    }
    setLoading(false);
  };

  const handleSearch = (searchValues) => {
    const params = new URLSearchParams();
    if (searchValues.cityId) params.set("cityId", searchValues.cityId);
    if (searchValues.dates && searchValues.dates[0])
      params.set("startDate", searchValues.dates[0].format("YYYY-MM-DD"));
    if (searchValues.dates && searchValues.dates[1])
      params.set("endDate", searchValues.dates[1].format("YYYY-MM-DD"));
    params.set("adult", searchValues.adults);
    params.set("child", searchValues.children);
    params.set("room", searchValues.rooms);
    if (searchValues.stay_type) params.set("stay_type", searchValues.stay_type);
    navigate(`?${params.toString()}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <ClientLayout>
      <Content className="p-6">
        <div className="max-w-6xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            initialValues={{
              location,
              cityId,
              startDate,
              endDate,
              adult: adult ? parseInt(adult) : 1,
              child: child ? parseInt(child) : 0,
              room: room ? parseInt(room) : 1,
              stay_type,
              airport,
              airportId,
              airportType,
            }}
          />

          <Row gutter={24}>
            <Col xs={24} lg={6}>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </Col>

            <Col xs={24} lg={18}>
              <HotelList
                hotels={hotels}
                loading={loading}
                startDate={startDate}
                endDate={endDate}
                adult={adult}
                child={child}
                room={room}
                stay_type={stay_type}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </ClientLayout>
  );
};

export default SearchHouseAndApartment;
