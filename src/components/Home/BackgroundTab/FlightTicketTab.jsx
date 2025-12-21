import { SwapOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Select, Popover, Spin } from "antd";
import React, { useState, useRef } from "react";
import { callLocationSuggestions } from "config/api";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineMeetingRoom } from "react-icons/md";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  // Disable ngày hiện tại và ngày đã qua
  return current && current < dayjs().startOf("day");
};
const FlightTicketTab = () => {
  const [fetching, setFetching] = useState(false);
  const [listFlightFrom, setListFlightFrom] = useState([]);
  const [listFlightTo, setListFlightTo] = useState([]);
  const [popoverFlightFromOpen, setPopoverFlightFromOpen] = useState(false);
  const [popoverFlightToOpen, setPopoverFlightToOpen] = useState(false);
  const [formData, setFormData] = useState({
    tripType: "oneway",
    seatClass: "economy",
    from: "",
    fromId: null,
    fromType: null,
    to: "",
    toId: null,
    toType: null,
    date: null,
    returnDate: null,
    room: 1,
    adult: 1,
    child: 0,
  });

  // Gọi API suggestion khi user nhập
  const handleSearchLocation = async (value, type) => {
    if (!value) {
      if (type === "flightFrom") {
        setListFlightFrom([]);
      } else {
        setListFlightTo([]);
      }
      return;
    }
    setFetching(true);
    try {
      const res = await callLocationSuggestions(value, "flight");
      if (type === "flightFrom") {
        setListFlightFrom(res.results || []);
      } else {
        setListFlightTo(res.results || []);
      }
    } catch (e) {
      if (type === "flightFrom") {
        setListFlightFrom([]);
      } else {
        setListFlightTo([]);
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

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      fromId: prev.toId,
      fromType: prev.toType,
      to: prev.from,
      toId: prev.fromId,
      toType: prev.fromType,
    }));
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
      }));
      triggerSearchLocation(value, "flightTo");
      setPopoverFlightToOpen(!!value);
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleChangeTripType = (value) => {
    setFormData((prev) => ({
      ...prev,
      tripType: value,
      returnDate: value === "oneway" ? null : prev.returnDate,
    }));
  };

  const onSearch = (value) => {
    console.log("search:", value);
    const {
      tripType,
      seatClass,
      fromId,
      toId,
      date,
      returnDate,
      room,
      adult,
      child,
    } = formData;

    if (fromId === toId) {
      alert("Điểm đi và điểm đến không được trùng nhau!");
      return;
    }

    if (
      !fromId ||
      !toId ||
      !date ||
      (tripType === "roundtrip" && !returnDate)
    ) {
      alert(
        "Vui lòng chọn điểm đi và điểm đến từ gợi ý và nhập đầy đủ thông tin!"
      );
      return;
    }

    const travelDate = date.format("YYYY-MM-DD");
    const returnTravelDate = returnDate
      ? returnDate.format("YYYY-MM-DD")
      : null;

    const params = new URLSearchParams({
      origin: fromId,
      destination: toId,
      departureDate: travelDate,
      passengers: adult + child,
      tripType: tripType === "roundtrip" ? "round-trip" : "one-way",
      seatClass,
    });

    if (returnTravelDate) {
      params.append("returnDate", returnTravelDate);
    }

    const url = `/flight?${params.toString()}`;
    window.open(url, "_blank");
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
      <div>
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
          {formData.tripType === "oneway" ? (
            <DatePicker
              className="w-full h-[40px] rounded-2xl text-base"
              placeholder="Ngày đi"
              onChange={(date) => handleChangeValue("date", date)}
              value={formData.date}
              disabledDate={disabledDate}
            />
          ) : (
            <RangePicker
              className="w-full h-[40px] rounded-2xl text-base"
              placeholder={["Ngày đi", "Ngày về"]}
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  handleChangeValue("date", dates[0]);
                  handleChangeValue("returnDate", dates[1]);
                } else {
                  handleChangeValue("date", null);
                  handleChangeValue("returnDate", null);
                }
              }}
              value={[formData.date, formData.returnDate]}
              disabledDate={disabledDate}
            />
          )}
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
        <div
          className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
          onClick={onSearch}
        >
          Tìm
        </div>
      </div>
    </div>
  );
};

export default FlightTicketTab;
