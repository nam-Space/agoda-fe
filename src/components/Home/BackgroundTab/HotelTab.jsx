import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Popover,
  Spin,
} from "antd";
import React, { useState, useRef } from "react";
import { callLocationSuggestions } from "config/api";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  // Disable ngày hiện tại và ngày đã qua
  return current && current < dayjs().startOf("day");
};

const createHotelSlug = (hotelName, hotelId) => {
  if (!hotelName) return hotelId;
  return (
    hotelName
      .toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() + `-${hotelId}`
  );
};

const HotelTab = () => {
  const [fetching, setFetching] = useState(false);
  const [additionFlight, setAdditionFlight] = useState(false);
  const [listHotel, setListHotel] = useState([]);
  const [listFlight, setListFlight] = useState([]);
  const [popoverHotelOpen, setPopoverHotelOpen] = useState(false);
  const [popoverFlightOpen, setPopoverFlightOpen] = useState(false);
  const [formData, setFormData] = useState({
    search: "",
    searchId: null,
    searchType: null,
    searchName: "",
    searchCityId: null,
    dates: [],
    room: 1,
    adult: 1,
    child: 0,
    airport: "",
    airportId: null,
    airportType: null,
    stay_type: "overnight",
  });

  // Gọi API suggestion khi user nhập
  const handleSearchLocation = async (value, type) => {
    if (!value) {
      if (type === "flight") {
        setListFlight([]);
      } else {
        setListHotel([]);
      }
      return;
    }
    setFetching(true);
    try {
      const res = await callLocationSuggestions(value, type);
      if (type === "flight") {
        setListFlight(res.results || []);
      } else {
        setListHotel(res.results || []);
      }
    } catch (e) {
      if (type === "flight") {
        setListFlight([]);
      } else {
        setListHotel([]);
      }
    }
    setFetching(false);
  };

  // Debounce handleSearchLocation
  const debounceRef = useRef();
  const triggerSearchLocation = (value, type = "hotel") => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearchLocation(value, type);
    }, 300);
  };

  const handleChangeValue = (key, value) => {
    if (key === "stay_type") {
      setFormData((prev) => ({
        ...prev,
        stay_type: value,
      }));
    } else if (key === "search") {
      setFormData((prev) => ({
        ...prev,
        search: value,
        searchId: null,
        searchType: null,
        searchCityId: null,
      }));
      triggerSearchLocation(value);
      setPopoverHotelOpen(!!value);
    } else if (key === "airport") {
      setFormData((prev) => ({
        ...prev,
        airport: value,
        airportId: null,
        airportType: null,
      }));
      triggerSearchLocation(value, "flight");
      setPopoverFlightOpen(!!value);
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSearch = (formValue) => {
    console.log("search:", formValue);
    const { dates, stay_type, adult, child, room } = formData;

    if (
      !formData.searchId ||
      !formData.searchType ||
      dates.length < 1 ||
      (stay_type === "overnight" && dates.length < 2)
    ) {
      alert("Vui lòng chọn địa điểm từ gợi ý và nhập đủ thông tin!");
      return;
    }

    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate =
      stay_type === "dayuse" ? startDate : dates[1].format("YYYY-MM-DD");

    let url;
    if (formData.searchType === "city") {
      // Chuyển sang trang search với city id
      const params = new URLSearchParams({
        cityId: formData.searchId,
        startDate,
        endDate,
        adult,
        child,
        room,
        stay_type,
      });
      url = `/search?${params.toString()}`;
    } else if (formData.searchType === "hotel") {
      // Chuyển sang trang hotel với hotel id
      const slug = createHotelSlug(formData.searchName, formData.searchId);
      const params = new URLSearchParams({
        startDate,
        endDate,
        adult,
        child,
        room,
        stay_type,
      });
      url = `/hotel/${slug}?${params.toString()}`;
    } else {
      // Fallback
      const params = new URLSearchParams({
        locationId: formData.searchId,
        locationType: formData.searchType,
        startDate,
        endDate,
        room,
        adult,
        child,
        airport: formData.airport || "",
        airportId: formData.airportId || "",
        airportType: formData.airportType || "",
        stay_type,
      });
      url = `/search?${params.toString()}`;
    }

    // Nếu có additionFlight, mở thêm tab flight
    if (additionFlight) {
      console.log("Opening flight tab, additionFlight:", additionFlight);
      if (!formData.airportId) {
        alert("Vui lòng chọn sân bay/điểm đi từ gợi ý cho chuyến bay!");
        return;
      }
      const passengers = adult + child;
      const tripType = stay_type === "overnight" ? "round-trip" : "one-way";
      const flightParams = new URLSearchParams({
        origin: formData.airportId,
        destination: formData.searchCityId || formData.searchId,
        departureDate: startDate,
        returnDate: endDate,
        passengers,
        tripType,
        seatClass: "economy", // Mặc định
      });
      const flightUrl = `/flight?${flightParams.toString()}`;
      console.log("Flight URL:", flightUrl);
      window.open(flightUrl, "_blank");
    }
    window.location.href = url;
  };

  return (
    <div className="relative">
      {additionFlight ? (
        <p className="font-bold">Khách sạn</p>
      ) : (
        <Radio.Group
          className="flex gap-[8px]"
          onChange={(e) => handleChangeValue("stay_type", e.target.value)}
          value={formData.stay_type}
        >
          <Radio.Button
            value="overnight"
            className="first:rounded-l-[50px] first:rounded-r-[50px]"
          >
            Chỗ ở qua đêm
          </Radio.Button>
          <Radio.Button
            value="dayuse"
            className="last:rounded-l-[50px] last:rounded-r-[50px] before:!hidden"
          >
            Chỗ ở trong ngày
          </Radio.Button>
        </Radio.Group>
      )}
      <div>
        <Popover
          content={
            <div className="min-w-[300px] max-h-[300px] overflow-y-auto">
              {fetching ? (
                <div className="text-center py-3">
                  <Spin size="small" />
                </div>
              ) : listHotel.length === 0 ? (
                <div className="text-center py-3">Không có gợi ý</div>
              ) : (
                listHotel.map((item) => (
                  <div
                    key={`${item.type}_${item.id}`}
                    className="px-2 py-2 cursor-pointer border-b border-[#eee] hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        search: item.name,
                        searchId: item.id,
                        searchType: item.type,
                        searchName: item.name,
                        searchCityId: item.city_id || null,
                      }));
                      setPopoverHotelOpen(false);
                    }}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.type === "city" ? "Thành phố" : "Khách sạn"}{" "}
                      {item.subtitle ? `- ${item.subtitle}` : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          }
          title="Gợi ý địa điểm"
          trigger="click"
          open={popoverHotelOpen}
          onOpenChange={setPopoverHotelOpen}
          placement="bottomLeft"
        >
          <Input
            style={{ width: "100%" }}
            className="mt-[12px]"
            value={formData.search}
            onChange={(e) => handleChangeValue("search", e.target.value)}
            placeholder="Tìm kiếm thành phố hoặc khách sạn"
            prefix={<SearchOutlined />}
            onFocus={() => setPopoverHotelOpen(!!formData.search)}
          />
        </Popover>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
          {formData.stay_type === "dayuse" ? (
            <DatePicker
              onChange={(date) =>
                handleChangeValue("dates", date ? [date] : [])
              }
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          ) : (
            <RangePicker
              onChange={(dates) => handleChangeValue("dates", dates)}
              disabledDate={disabledDate}
            />
          )}
          <div className="grid grid-cols-3 gap-[12px]">
            <InputNumber
              addonBefore={<span>Phòng</span>}
              prefix={<MdOutlineMeetingRoom className="text-[22px]" />}
              style={{ width: "100%" }}
              value={formData.room}
              onChange={(value) => handleChangeValue("room", value)}
            />
            <InputNumber
              addonBefore={<span>Người lớn</span>}
              prefix={<HiOutlineUsers className="text-[22px]" />}
              style={{ width: "100%" }}
              value={formData.adult}
              onChange={(value) => handleChangeValue("adult", value)}
            />
            <InputNumber
              addonBefore={<span>Trẻ em</span>}
              prefix={<span className="text-[22px]">👶</span>}
              style={{ width: "100%" }}
              value={formData.child}
              onChange={(value) => handleChangeValue("child", value)}
            />
          </div>
        </div>
        <div>
          {additionFlight ? (
            <div>
              <div className="flex items-center gap-[16px]">
                <p className="font-bold">Chuyến bay</p>
                <div
                  onClick={() => setAdditionFlight(false)}
                  className="w-fit gap-[3px] text-[#2067da] font-semibold relative h-[36px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                >
                  Loại bỏ
                </div>
              </div>
              {/* Popover chọn airport/city cho origin chuyến bay */}
              <Popover
                content={
                  <div className="min-w-[300px] max-h-[300px] overflow-y-auto">
                    {fetching ? (
                      <div className="text-center py-3">
                        <Spin size="small" />
                      </div>
                    ) : listFlight.length === 0 ? (
                      <div className="text-center py-3">Không có gợi ý</div>
                    ) : (
                      listFlight.map((item) => (
                        <div
                          key={`${item.type}_${item.id}`}
                          className="px-2 py-2 cursor-pointer border-b border-[#eee] hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              airport: item.name,
                              airportId: item.id,
                              airportType: item.type,
                            }));
                            setPopoverFlightOpen(false);
                          }}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.type === "city"
                              ? "Thành phố"
                              : item.type === "airport"
                              ? "Sân bay"
                              : ""}
                            {item.subtitle ? ` - ${item.subtitle}` : ""}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                }
                title="Gợi ý sân bay/điểm đi"
                trigger="click"
                open={popoverFlightOpen}
                onOpenChange={setPopoverFlightOpen}
                placement="bottomLeft"
              >
                <Input
                  placeholder="Tên thành phố hoặc sân bay"
                  size="large"
                  prefix={<IoAirplaneOutline className="text-[20px]" />}
                  className="mt-[12px]"
                  value={formData.airport}
                  onChange={(e) => handleChangeValue("airport", e.target.value)}
                  onFocus={() => setPopoverFlightOpen(!!formData.airport)}
                />
              </Popover>
            </div>
          ) : (
            <div
              onClick={() => setAdditionFlight(true)}
              className="mt-[24px] w-fit gap-[3px] text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
            >
              <PlusOutlined className="text-[20px]" /> Bổ sung chuyến bay
            </div>
          )}
        </div>
        <div
          className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
          onClick={() => onSearch(formData)}
        >
          Tìm
        </div>
      </div>
    </div>
  );
};

export default HotelTab;
