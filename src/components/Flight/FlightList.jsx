import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { getFlights, getImageUrl, getFlightSeats } from "../../config/api";
import { Spin, Modal } from "antd";
import { useSearchParams } from "react-router-dom";

const FlightList = ({
  origin,
  destination,
  departureDate,
  onSelectFlight,
  step,
  selectedOutbound,
  tripType,
  numPassengers = 1, // Số người mặc định là 1
}) => {
  const [searchParams] = useSearchParams();
  const [openIndexes, setOpenIndexes] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  // Track selected seat class per flight (flightId -> seatClass)
  const [selectedSeatClass, setSelectedSeatClass] = useState({});
  // Modal chọn ghế
  const [seatModalVisible, setSeatModalVisible] = useState(false);
  const [currentFlightForSeat, setCurrentFlightForSeat] = useState(null);
  const [currentSeatClass, setCurrentSeatClass] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  // Track selected seats per flight+seatClass (key: "flightId_seatClass" -> [seat_numbers])
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({});

  useEffect(() => {
    const loadFlights = async () => {
      // Ưu tiên lấy từ props, fallback searchParams (giữ backward compatibility)
      const o = origin || searchParams.get("origin");
      const d = destination || searchParams.get("destination");
      const date = departureDate || searchParams.get("departureDate");
      if (!o || !d || !date) {
        setFlights([]);
        return;
      }
      try {
        setLoading(true);
        const params = {
          origin: o,
          destination: d,
          departureDate: date,
        };
        // Có thể truyền thêm params khác nếu cần
        const res = await getFlights(params);
        const data = res?.data || res?.results || [];
        setFlights(data);
      } catch (err) {
        console.error("Failed to load flights", err);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    loadFlights();
  }, [origin, destination, departureDate]);

  const toggleOpen = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const formatTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return { time: "", date: "" };
    const date = new Date(datetime);
    return {
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get selected seat class for a flight (by id), fallback to seatClass param or economy
  const getSelectedSeatClass = (flight) => {
    // Ưu tiên lấy từ selectedSeatClass state, fallback searchParams, fallback 'economy'
    const seatClassParam = searchParams.get("seatClass") || "economy";
    return selectedSeatClass[flight.id] || seatClassParam;
  };

  // Get price for selected seat class
  const getSeatClassPrice = (flight) => {
    if (!flight.seat_classes || flight.seat_classes.length === 0) {
      return flight.base_price;
    }
    const sel = getSelectedSeatClass(flight);
    const matchingSeatClass = flight.seat_classes.find(
      (sc) => sc.seat_class === sel
    );
    if (matchingSeatClass) {
      return matchingSeatClass.price;
    }
    // Fallback: lowest price
    const minPrice = Math.min(...flight.seat_classes.map((sc) => sc.price));
    return minPrice;
  };

  // Get discounted price for selected seat class
  const getDiscountedPrice = (flight) => {
    const basePrice = getSeatClassPrice(flight);
    const promotion = flight.promotion;
    if (!promotion) return basePrice;
    if (promotion.discount_amount) {
      return basePrice - promotion.discount_amount;
    }
    if (promotion.discount_percent) {
      return basePrice * (1 - promotion.discount_percent / 100);
    }
    return basePrice;
  };

  // Mở modal chọn ghế
  const handleOpenSeatModal = async (flight, seatClassObj) => {
    setCurrentFlightForSeat(flight);
    setCurrentSeatClass(seatClassObj);
    setSelectedSeats([]);
    setSeatModalVisible(true);
    setLoadingSeats(true);

    try {
      const res = await getFlightSeats(flight.id, {
        seat_class: seatClassObj.seat_class,
        only_available: true,
      });
      const seats = res?.data || [];
      setAvailableSeats(seats);

      // Load lại selected seats nếu đã chọn trước đó
      const key = `${flight.id}_${seatClassObj.seat_class}`;
      const prevSelected = selectedSeatsMap[key] || [];
      setSelectedSeats(prevSelected);
    } catch (err) {
      console.error("Failed to load seats", err);
      setAvailableSeats([]);
    } finally {
      setLoadingSeats(false);
    }
  };

  // Toggle chọn ghế
  const handleToggleSeat = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        // Bỏ chọn
        return prev.filter((s) => s !== seatNumber);
      } else {
        // Chọn thêm (chỉ cho phép tối đa = numPassengers)
        if (prev.length >= numPassengers) {
          return prev; // Đã đủ số lượng
        }
        return [...prev, seatNumber];
      }
    });
  };

  // Xác nhận chọn ghế và gọi booking
  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế");
      return;
    }
    if (selectedSeats.length > numPassengers) {
      alert(`Chỉ được chọn tối đa ${numPassengers} ghế`);
      return;
    }

    // Lưu selected seats vào map
    const key = `${currentFlightForSeat.id}_${currentSeatClass.seat_class}`;
    setSelectedSeatsMap((prev) => ({
      ...prev,
      [key]: selectedSeats,
    }));

    setSeatModalVisible(false);

    // Gọi booking ngay sau khi chọn ghế (nếu truyền prop onSelectFlight)
    if (typeof onSelectFlight === "function") {
      onSelectFlight(currentFlightForSeat, currentSeatClass, selectedSeats);
    }
  };

  // Lấy selected seats cho flight + seatClass
  const getSelectedSeatsForFlight = (flight, seatClass) => {
    const key = `${flight.id}_${seatClass}`;
    return selectedSeatsMap[key] || [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  const o = origin || searchParams.get("origin");
  const d = destination || searchParams.get("destination");
  const date = departureDate || searchParams.get("departureDate");
  if (!o || !d || !date) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">
          Vui lòng chọn điểm đi, điểm đến và ngày khởi hành để tìm chuyến bay
        </p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">Không tìm thấy chuyến bay phù hợp</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {flights.map((flight, index) => {
        const isOpen = openIndexes.includes(index);
        const depDateTime = formatDateTime(flight.departure_time);
        const arrDateTime = formatDateTime(flight.arrival_time);
        const originalPrice = getSeatClassPrice(flight);
        const finalPrice = getDiscountedPrice(flight);
        const selSeatClass = getSelectedSeatClass(flight);
        const hasDiscount = flight.has_promotion;

        return (
          <div
            key={flight.id}
            className="border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* Header */}
            <div
              className="grid grid-cols-12 gap-4 items-center p-4 cursor-pointer"
              onClick={() => toggleOpen(index)}
            >
              {/* Logo + Airline */}
              <div className="col-span-3 flex items-center space-x-3">
                {flight.airline?.logo && (
                  <img
                    src={getImageUrl(flight.airline.logo)}
                    alt={flight.airline.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <p className="font-semibold text-base">
                    {flight.airline?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.departure_airport?.code} -{" "}
                    {flight.arrival_airport?.code}
                  </p>
                </div>
              </div>

              {/* Time + stops */}
              <div className="col-span-5 text-center">
                <p className="text-xl font-bold">
                  {depDateTime.time} - {arrDateTime.time}
                </p>
                <p className="text-xs text-gray-500">
                  {depDateTime.date} - {arrDateTime.date}
                </p>
                <p className="text-sm text-gray-600">
                  {flight.stops} điểm dừng •{" "}
                  {formatDuration(flight.total_duration)}
                </p>
              </div>

              {/* Price with promotion */}
              <div className="col-span-3 text-right">
                {hasDiscount ? (
                  <>
                    <p className="text-2xl font-bold text-red-600">
                      {formatPrice(finalPrice)}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>

              {/* Icon */}
              <div className="col-span-1 text-right">
                {isOpen ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </div>
            </div>

            {/* Details */}
            {isOpen && (
              <div className="bg-gray-50 px-6 py-4 space-y-4 text-sm">
                {flight.legs?.map((leg, i) => (
                  <>
                    <div
                      key={leg.id}
                      className="border rounded p-3 bg-white space-y-1"
                    >
                      <p className="font-semibold text-base">
                        {formatDateTime(leg.departure_time).time} →{" "}
                        {formatDateTime(leg.arrival_time).time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(leg.departure_time).date} -{" "}
                        {formatDateTime(leg.arrival_time).date}
                      </p>
                      <p className="text-gray-700">
                        <strong>
                          {leg.departure_airport?.name} (
                          {leg.departure_airport?.code})
                        </strong>{" "}
                        →{" "}
                        <strong>
                          {leg.arrival_airport?.name} (
                          {leg.arrival_airport?.code})
                        </strong>
                      </p>
                      <p className="text-gray-600">
                        ⏱ Thời gian: {formatDuration(leg.duration_minutes)}
                      </p>
                      <p className="text-gray-600">
                        ✈️ Mã chuyến bay: {leg.flight_code}
                      </p>
                      {flight.aircraft && (
                        <p className="text-gray-600">
                          🛫 Máy bay: {flight.airline?.name} -{" "}
                          {flight.aircraft?.model}
                        </p>
                      )}
                    </div>
                    {/* Layover time between legs */}
                    {i < flight.legs.length - 1 &&
                      (() => {
                        const nextLeg = flight.legs[i + 1];
                        const layoverMinutes = Math.floor(
                          (new Date(nextLeg.departure_time) -
                            new Date(leg.arrival_time)) /
                            60000
                        );
                        if (layoverMinutes > 0) {
                          return (
                            <div className="text-center text-blue-600 font-semibold py-2">
                              Nghỉ giữa các chặng:{" "}
                              {formatDuration(layoverMinutes)}
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </>
                ))}

                {/* Seat Classes */}
                {flight.seat_classes && flight.seat_classes.length > 0 && (
                  <div className="border rounded p-3 bg-white">
                    <p className="font-semibold mb-2">Hạng ghế:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {flight.seat_classes.map((sc) => {
                        const isSelected = selSeatClass === sc.seat_class;
                        const selectedSeatsForThis = getSelectedSeatsForFlight(
                          flight,
                          sc.seat_class
                        );
                        const hasSelectedSeats =
                          selectedSeatsForThis.length > 0;
                        return (
                          <button
                            key={sc.id}
                            className={`p-2 border rounded text-center w-full transition-all ${
                              isSelected
                                ? "bg-blue-100 border-blue-600 font-bold"
                                : "bg-white hover:bg-gray-100"
                            }`}
                            style={{
                              outline: isSelected
                                ? "2px solid #2563eb"
                                : "none",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSeatClass((prev) => ({
                                ...prev,
                                [flight.id]: sc.seat_class,
                              }));
                              // Mở modal chọn ghế
                              handleOpenSeatModal(flight, sc);
                            }}
                          >
                            <p className="font-medium">
                              {sc.seat_class === "economy"
                                ? "Phổ thông"
                                : sc.seat_class === "business"
                                ? "Thương gia"
                                : "Hạng nhất"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(sc.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Còn {sc.available_seats} ghế
                            </p>
                            {hasSelectedSeats && (
                              <p className="text-xs text-green-600 font-semibold mt-1">
                                Đã chọn: {selectedSeatsForThis.join(", ")}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      const seatClassObj = flight.seat_classes?.find(
                        (sc) => sc.seat_class === selSeatClass
                      );
                      const selectedSeatsForThis = getSelectedSeatsForFlight(
                        flight,
                        selSeatClass
                      );

                      // Kiểm tra đã chọn ghế chưa
                      if (selectedSeatsForThis.length === 0) {
                        alert("Vui lòng chọn ghế trước khi đặt chuyến bay");
                        return;
                      }

                      if (onSelectFlight) {
                        onSelectFlight(
                          flight,
                          seatClassObj,
                          selectedSeatsForThis
                        );
                      }
                    }}
                  >
                    Chọn
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal chọn ghế */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>
              Chọn ghế -{" "}
              {currentSeatClass?.seat_class === "economy"
                ? "Phổ thông"
                : currentSeatClass?.seat_class === "business"
                ? "Thương gia"
                : "Hạng nhất"}
            </span>
            <button
              onClick={() => setSeatModalVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        }
        open={seatModalVisible}
        onCancel={() => setSeatModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Vui lòng chọn {numPassengers} ghế (đã chọn: {selectedSeats.length}/
            {numPassengers})
          </p>

          {loadingSeats ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {availableSeats.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  Không còn ghế trống
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Sơ đồ ghế - hiển thị dạng grid */}
                  <div className="grid grid-cols-6 gap-2">
                    {availableSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(
                        seat.seat_number
                      );
                      const isDisabled =
                        !seat.is_available ||
                        (selectedSeats.length >= numPassengers && !isSelected);

                      return (
                        <button
                          key={seat.id}
                          disabled={isDisabled}
                          onClick={() => handleToggleSeat(seat.seat_number)}
                          className={`
                            p-3 border rounded text-center transition-all
                            ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-700 font-bold"
                                : isDisabled
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
                            }
                          `}
                        >
                          {seat.seat_number}
                        </button>
                      );
                    })}
                  </div>

                  {/* Danh sách ghế đã chọn */}
                  {selectedSeats.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="font-semibold mb-2">Ghế đã chọn:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seatNum) => (
                          <span
                            key={seatNum}
                            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                          >
                            {seatNum}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Button xác nhận */}
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setSeatModalVisible(false)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirmSeats}
                      disabled={
                        selectedSeats.length === 0 ||
                        selectedSeats.length > numPassengers
                      }
                      className={`px-4 py-2 rounded text-white ${
                        selectedSeats.length === 0 ||
                        selectedSeats.length > numPassengers
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Xác nhận ({selectedSeats.length}/{numPassengers})
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FlightList;
