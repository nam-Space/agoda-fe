import { PlusOutlined, SwapOutlined, SearchOutlined } from "@ant-design/icons";
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

const { Option } = Select;
const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  // Disable ngày hiện tại và ngày đã qua
  return current && current < dayjs().startOf("day");
};

const FlightAndAccommodationTab = () => {
  const [fetching, setFetching] = useState(false);
  const [listFlightFrom, setListFlightFrom] = useState([]);
  const [listFlightTo, setListFlightTo] = useState([]);
  const [listHotel, setListHotel] = useState([]);
  const [popoverFlightFromOpen, setPopoverFlightFromOpen] = useState(false);
  const [popoverFlightToOpen, setPopoverFlightToOpen] = useState(false);
  const [popoverHotelOpen, setPopoverHotelOpen] = useState(false);
  const [formData, setFormData] = useState({
    tripType: "oneway",
    seatClass: "economy",
    from: "",
    fromId: null,
    fromType: null,
    to: "",
    toId: null,
    toType: null,
    dates: [],
    hotel: "",
    hotelId: null,
    hotelType: null,
    hotelDates: [],
    room: 1,
    adult: 1,
    child: 0,
  });

  // Gọi API suggestion khi user nhập
  const handleSearchLocation = async (value, type) => {
    if (!value) {
      if (type === "flightFrom") {
        setListFlightFrom([]);
      } else if (type === "flightTo") {
        setListFlightTo([]);
      } else {
        setListHotel([]);
      }
      return;
    }
    setFetching(true);
    try {
      const res = await callLocationSuggestions(
        value,
        type === "hotel" ? "hotel" : "flight"
      );
      if (type === "flightFrom") {
        setListFlightFrom(res.results || []);
      } else if (type === "flightTo") {
        setListFlightTo(res.results || []);
      } else {
        setListHotel(res.results || []);
      }
    } catch (e) {
      if (type === "flightFrom") {
        setListFlightFrom([]);
      } else if (type === "flightTo") {
        setListFlightTo([]);
      } else {
        setListHotel([]);
      }
    }
    setFetching(false);
  };

  // Debounce handleSearchLocation
  const debounceRef = useRef();
  const triggerSearchLocation = (value, type) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearchLocation(value, type);
    }, 300);
  };

  const handleChangeValue = (key, value) => {
    if (key === "from") {
      setFormData((prev) => ({
        ...prev,
        from: value,
        fromId: null,
        fromType: null,
      }));
      triggerSearchLocation(value, "flightFrom");
      setPopoverFlightFromOpen(!!value);
    } else if (key === "to") {
      setFormData((prev) => ({
        ...prev,
        to: value,
        toId: null,
        toType: null,
        // Set hotel to destination initially
        hotel: value,
        hotelId: null,
        hotelType: null,
      }));
      triggerSearchLocation(value, "flightTo");
      setPopoverFlightToOpen(!!value);
    } else if (key === "hotel") {
      setFormData((prev) => ({
        ...prev,
        hotel: value,
        hotelId: null,
        hotelType: null,
      }));
      triggerSearchLocation(value, "hotel");
      setPopoverHotelOpen(!!value);
    } else if (key === "dates") {
      setFormData((prev) => ({
        ...prev,
        dates: value,
        // Set hotel dates to flight dates initially
        hotelDates: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleChangeTripType = (value) => {
    setFormData((prev) => ({
      ...prev,
      tripType: value,
      dates: value === "oneway" ? [] : prev.dates,
    }));
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      fromId: prev.toId,
      fromType: prev.toType,
      to: prev.from,
      toId: prev.fromId,
      toType: prev.fromType,
      // Update hotel to new destination
      hotel: prev.from,
      hotelId: prev.fromId,
      hotelType: prev.fromType,
    }));
  };

  const handleSearch = () => {
    console.log("Search with data:", formData);
    const {
      tripType,
      seatClass,
      fromId,
      toId,
      dates,
      hotelId,
      hotelDates,
      room,
      adult,
      child,
    } = formData;

    if (fromId === toId) {
      alert("Điểm đi và điểm đến không được trùng nhau!");
      return;
    }

    if (!fromId || !toId || dates.length < (tripType === "oneway" ? 1 : 2)) {
      alert(
        "Vui lòng chọn điểm đi và điểm đến từ gợi ý và nhập đầy đủ thông tin!"
      );
      return;
    }

    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate =
      tripType === "roundtrip" ? dates[1].format("YYYY-MM-DD") : null;

    // Open flight tab
    const flightParams = new URLSearchParams({
      origin: fromId,
      destination: toId,
      departureDate: startDate,
      returnDate: endDate,
      passengers: adult + child,
      tripType: tripType === "roundtrip" ? "round-trip" : "one-way",
      seatClass,
    });
    const flightUrl = `/flight?${flightParams.toString()}`;
    window.open(flightUrl, "_blank");

    // Open hotel tab if hotel selected
    if (hotelId && hotelDates.length >= 2) {
      const hotelStartDate = hotelDates[0].format("YYYY-MM-DD");
      const hotelEndDate = hotelDates[1].format("YYYY-MM-DD");
      const hotelParams = new URLSearchParams({
        cityId: hotelId,
        startDate: hotelStartDate,
        endDate: hotelEndDate,
        adult,
        child,
        room,
      });
      const hotelUrl = `/search?${hotelParams.toString()}`;
      window.location.href = hotelUrl;
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-[12px]">
        <Select
          defaultValue="oneway"
          className="w-[150px] [&_.ant-select-selector]:rounded-full"
          onChange={handleChangeTripType}
        >
          <Option value="oneway">Một chiều</Option>
          <Option value="roundtrip">Khứ hồi</Option>
        </Select>

        <Select
          defaultValue="economy"
          className="w-[150px] [&_.ant-select-selector]:rounded-full"
          onChange={(value) => handleChangeValue("seatClass", value)}
        >
          <Option value="economy">Phổ thông</Option>
          <Option value="business">Thương gia</Option>
          <Option value="first">Hạng nhất</Option>
        </Select>
      </div>
      <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
        <div className="flex items-center">
          <Popover
            content={
              <div className="min-w-[300px] max-h-[300px] overflow-y-auto">
                {fetching ? (
                  <div className="text-center py-3">
                    <Spin size="small" />
                  </div>
                ) : listFlightFrom.length === 0 ? (
                  <div className="text-center py-3">Không có gợi ý</div>
                ) : (
                  listFlightFrom.map((item) => (
                    <div
                      key={`${item.type}_${item.id}`}
                      className="px-2 py-2 cursor-pointer border-b border-[#eee] hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        const displayName =
                          item.type === "airport"
                            ? `${item.name} (${item.subtitle})`
                            : item.name;
                        setFormData((prev) => ({
                          ...prev,
                          from: displayName,
                          fromId: item.id,
                          fromType: item.type,
                        }));
                        setPopoverFlightFromOpen(false);
                      }}
                    >
                      <div className="font-medium">
                        {item.type === "airport"
                          ? `${item.name} (${item.subtitle})`
                          : item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.type === "airport" ? "Sân bay" : "Thành phố"}{" "}
                        {item.subtitle ? `- ${item.subtitle}` : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            }
            title="Gợi ý điểm đi"
            trigger="click"
            open={popoverFlightFromOpen}
            onOpenChange={setPopoverFlightFromOpen}
            placement="bottomLeft"
          >
            <Input
              placeholder="Điểm đi"
              prefix={<i className="fa fa-plane-departure" />}
              className="rounded-l-2xl rounded-r-none border-r-0 h-[40px] text-base"
              onChange={(e) => handleChangeValue("from", e.target.value)}
              value={formData.from}
              onFocus={() => setPopoverFlightFromOpen(!!formData.from)}
            />
          </Popover>

          <button
            className="z-10 -mx-2 flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow"
            onClick={handleSwap}
          >
            <SwapOutlined />
          </button>

          <Popover
            content={
              <div className="min-w-[300px] max-h-[300px] overflow-y-auto">
                {fetching ? (
                  <div className="text-center py-3">
                    <Spin size="small" />
                  </div>
                ) : listFlightTo.length === 0 ? (
                  <div className="text-center py-3">Không có gợi ý</div>
                ) : (
                  listFlightTo.map((item) => (
                    <div
                      key={`${item.type}_${item.id}`}
                      className="px-2 py-2 cursor-pointer border-b border-[#eee] hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        const displayName =
                          item.type === "airport"
                            ? `${item.name} (${item.subtitle})`
                            : item.name;
                        setFormData((prev) => ({
                          ...prev,
                          to: displayName,
                          toId: item.id,
                          toType: item.type,
                          // Set hotel to destination initially
                          hotel:
                            item.type === "airport" ? item.subtitle : item.name,
                          hotelId:
                            item.type === "airport" ? item.city_id : item.id,
                          hotelType:
                            item.type === "airport" ? "city" : item.type,
                        }));
                        setPopoverFlightToOpen(false);
                      }}
                    >
                      <div className="font-medium">
                        {item.type === "airport"
                          ? `${item.name} (${item.subtitle})`
                          : item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.type === "airport" ? "Sân bay" : "Thành phố"}{" "}
                        {item.subtitle ? `- ${item.subtitle}` : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            }
            title="Gợi ý điểm đến"
            trigger="click"
            open={popoverFlightToOpen}
            onOpenChange={setPopoverFlightToOpen}
            placement="bottomLeft"
          >
            <Input
              placeholder="Điểm đến"
              prefix={<i className="fa fa-map-marker-alt" />}
              className="rounded-r-2xl rounded-l-none border-l-0 h-[40px] text-base"
              onChange={(e) => handleChangeValue("to", e.target.value)}
              value={formData.to}
              onFocus={() => setPopoverFlightToOpen(!!formData.to)}
            />
          </Popover>
        </div>
        <div>
          {formData.tripType === "oneway" ? (
            <DatePicker
              className="w-full h-[40px] rounded-2xl text-base"
              placeholder="Ngày đi"
              onChange={(date) =>
                handleChangeValue("dates", date ? [date] : [])
              }
              value={formData.dates.length > 0 ? formData.dates[0] : null}
              disabledDate={disabledDate}
            />
          ) : (
            <RangePicker
              className="w-full h-[40px] rounded-2xl text-base"
              placeholder={["Ngày đi", "Ngày về"]}
              onChange={(dates) => handleChangeValue("dates", dates)}
              value={formData.dates}
              disabledDate={disabledDate}
            />
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-[12px] h-[40px]">
        <InputNumber
          addonBefore={<span>Phòng</span>}
          prefix={<MdOutlineMeetingRoom className="text-[22px]" />}
          size="large"
          className="w-full rounded-2xl"
          onChange={(value) => handleChangeValue("room", value)}
          value={formData.room}
        />
        <InputNumber
          addonBefore={<span>Người lớn</span>}
          prefix={<HiOutlineUsers className="text-[22px]" />}
          size="large"
          className="w-full rounded-2xl"
          onChange={(value) => handleChangeValue("adult", value)}
          value={formData.adult}
        />
        <InputNumber
          addonBefore={<span>Trẻ em</span>}
          prefix={<span className="text-[22px]">👶</span>}
          size="large"
          className="w-full rounded-2xl"
          onChange={(value) => handleChangeValue("child", value)}
          value={formData.child}
        />
      </div>

      {/* Accommodation Section */}
      <div className="mt-[20px]">
        <p className="font-bold mb-[12px]">Khách sạn</p>
        <div className="grid grid-cols-2 gap-[12px]">
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
                        let hotelName = item.name;
                        let hotelId = item.id;
                        let hotelType = item.type;
                        if (item.type === "airport") {
                          // For airports in hotel search, use city name and city id
                          hotelName = item.subtitle;
                          hotelId = item.city_id;
                          hotelType = "city";
                        }
                        setFormData((prev) => ({
                          ...prev,
                          hotel: hotelName,
                          hotelId: hotelId,
                          hotelType: hotelType,
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
              placeholder="Tìm kiếm thành phố hoặc khách sạn"
              prefix={<SearchOutlined />}
              className="w-full rounded-2xl h-[40px] text-base"
              onChange={(e) => handleChangeValue("hotel", e.target.value)}
              value={formData.hotel}
              onFocus={() => setPopoverHotelOpen(!!formData.hotel)}
            />
          </Popover>
          <RangePicker
            className="w-full h-[40px] rounded-2xl text-base"
            placeholder={["Ngày nhận phòng", "Ngày trả phòng"]}
            onChange={(dates) => handleChangeValue("hotelDates", dates)}
            value={formData.hotelDates}
            disabledDate={disabledDate}
          />
        </div>
      </div>
      <div
        className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
        onClick={handleSearch}
      >
        Tìm
      </div>
    </div>
  );
};

export default FlightAndAccommodationTab;
