import Footer from "components/FooterClient";
import Header from "components/HeaderClient";

import FilterSideBar from "components/Flight/FilterSideBar";
import FlightList from "components/Flight/FlightList";
import FlightSortFilter from "components/Flight/FlightSortFilter";
import FlightDateHeader from "components/Flight/FligthDateHeader";
import HotelSection from "components/Flight/HotelSection";
import SearchBarSection from "components/Flight/SearchBarSection";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getAirports, callBook } from "../../config/api";
import { ServiceType } from "constants/serviceType";

const FlightPage = () => {
    const [searchParams] = useSearchParams();
    const [airports, setAirports] = useState([]);
    const navigate = useNavigate();

    // Params
    const promotionId = searchParams.get("promotionId") || "";
    const originParam = searchParams.get("origin");
    const destinationParam = searchParams.get("destination");
    const departureDateParam = searchParams.get("departureDate");
    const returnDateParam = searchParams.get("returnDate");
    const passengers = parseInt(searchParams.get("passengers") || 1);
    const seatClass = searchParams.get("seatClass") || "economy";
    const tripType = searchParams.get("tripType") || "one-way";

    // State for round-trip selection
    const [step, setStep] = useState("outbound"); // 'outbound' | 'inbound'
    const [selectedOutbound, setSelectedOutbound] = useState(null); // flight object
    const [selectedInbound, setSelectedInbound] = useState(null); // flight object

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadAirports = async () => {
            try {
                const res = await getAirports();
                setAirports(res?.data || []);
            } catch (err) {
                console.error("Failed to load airports", err);
            }
        };
        loadAirports();
    }, []);

    // Tìm tên sân bay từ ID
    const getAirportName = (id) => {
        const airport = airports.find((a) => a.id === parseInt(id));
        return airport ? `${airport.name} (${airport.code})` : "N/A";
    };

    // Handler khi chọn flight
    const handleSelectFlight = useCallback(
        async (flight, seatClassSelected) => {
            if (tripType === "one-way") {
                // Gọi API booking 1 chiều
                const bookingBody = {
                    service_type: 3, // FLIGHT
                    // service_ref_id: flight.id,
                    // total_price: seatClassSelected ? seatClassSelected.price : flight.base_price,
                    flight_detail: [
                        {
                            flight: flight.id,
                            seat_class: seatClassSelected
                                ? seatClassSelected.seat_class
                                : seatClass,
                            num_passengers: passengers,
                        },
                    ],
                };
                try {
                    const res = await callBook(bookingBody);
                    const bookingId = res?.booking_id;
                    if (bookingId) {
                        navigate(
                            `/book?booking_id=${bookingId}&type=${ServiceType.FLIGHT}`
                        );
                    }
                } catch (err) {
                    alert("Đặt vé thất bại!");
                }
            } else {
                // round-trip
                if (step === "outbound") {
                    setSelectedOutbound({ flight, seatClassSelected });
                    setStep("inbound");
                } else if (step === "inbound") {
                    setSelectedInbound({ flight, seatClassSelected });
                    // Gọi API booking khứ hồi
                    const bookingBody = {
                        service_type: 3,
                        // total_price: (selectedOutbound?.seatClassSelected?.price || selectedOutbound?.flight?.base_price || 0)
                        //   + (seatClassSelected ? seatClassSelected.price : flight.base_price),
                        flight_detail: [
                            {
                                flight: selectedOutbound.flight.id,
                                seat_class: selectedOutbound.seatClassSelected
                                    ? selectedOutbound.seatClassSelected
                                          .seat_class
                                    : seatClass,
                                num_passengers: passengers,
                            },
                            {
                                flight: flight.id,
                                seat_class: seatClassSelected
                                    ? seatClassSelected.seat_class
                                    : seatClass,
                                num_passengers: passengers,
                            },
                        ],
                    };
                    try {
                        const res = await callBook(bookingBody);
                        const bookingId = res?.booking_id;
                        if (bookingId) {
                            navigate(
                                `/book?booking_id=${bookingId}&type=${ServiceType.FLIGHT}`
                            );
                        }
                    } catch (err) {
                        alert("Đặt vé thất bại!");
                    }
                }
            }
        },
        [tripType, step, selectedOutbound, seatClass, passengers, navigate]
    );

    // Xác định props cho FlightList
    let listOrigin = originParam;
    let listDestination = destinationParam;
    let listDate = departureDateParam;
    let listTitle = "";
    if (tripType === "round-trip" && step === "inbound") {
        listOrigin = destinationParam;
        listDestination = originParam;
        listDate = returnDateParam;
        listTitle = `Chọn chuyến về: ${getAirportName(
            destinationParam
        )} → ${getAirportName(originParam)}`;
    } else {
        listTitle = `Chọn chuyến đi: ${getAirportName(
            originParam
        )} → ${getAirportName(destinationParam)}`;
    }

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Header />

            <main className="flex-1 w-full bg-white">
                <div className="max-w-[1152px] w-full mx-auto px-3 box-border space-y-6">
                    <SearchBarSection
                        defaultOrigin={originParam}
                        defaultDestination={destinationParam}
                        defaultDepartureDate={departureDateParam}
                        defaultReturnDate={returnDateParam}
                        defaultPassengers={passengers}
                        defaultSeatClass={seatClass}
                        defaultTripType={tripType}
                        defaultPromotionId={promotionId}
                        airports={airports}
                    />

                    <div className="flex gap-6">
                        {/* Left */}
                        <aside className="w-[320px] shrink-0">
                            <FilterSideBar />
                        </aside>

                        {/* Right */}
                        <div className="flex-1 min-w-0 space-y-4">
                            <FlightDateHeader departureDate={listDate} />
                            <p className="text-sm text-gray-600">
                                <span className="block font-semibold text-xl text-black">
                                    {listTitle}
                                </span>
                                {tripType === "round-trip"
                                    ? `Khứ hồi - ${passengers} hành khách`
                                    : `Một chiều - ${passengers} hành khách`}
                                {tripType === "round-trip" &&
                                    step === "inbound" &&
                                    selectedOutbound && (
                                        <span className="block mt-2 text-green-700 text-base">
                                            Đã chọn chiều đi:{" "}
                                            {getAirportName(originParam)} →{" "}
                                            {getAirportName(destinationParam)} (
                                            {
                                                selectedOutbound.flight.airline
                                                    ?.name
                                            }
                                            ,{" "}
                                            {selectedOutbound.flight.departure_time
                                                ?.slice(0, 16)
                                                .replace("T", " ")}
                                            )
                                        </span>
                                    )}
                            </p>
                            <FlightSortFilter />
                            <FlightList
                                origin={listOrigin}
                                destination={listDestination}
                                departureDate={listDate}
                                onSelectFlight={handleSelectFlight}
                                step={step}
                                selectedOutbound={selectedOutbound}
                                tripType={tripType}
                            />
                            <HotelSection />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FlightPage;
