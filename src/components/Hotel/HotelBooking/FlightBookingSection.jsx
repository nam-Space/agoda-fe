import React, { useEffect, useState } from "react";
import { callFetchFlight } from "../../../config/api";
import { getImage } from "utils/imageUrl";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { formatCurrency } from "utils/formatCurrency";
import { Link } from "react-router-dom";
import { Empty } from "antd";

const FlightBookingSection = ({ hotel }) => {
    const [flights, setFlights] = useState([]);

    const handleGetFlight = async (query) => {
        const res = await callFetchFlight(query);
        if (res.isSuccess) {
            setFlights(res.data);
        }
    };

    useEffect(() => {
        if (hotel?.id) {
            handleGetFlight(
                `current=1&pageSize=10&arrival_city_id=${
                    hotel.city_id
                }&min_flight_leg_departure=${dayjs(Date.now()).format(
                    "YYYY-MM-DDTHH:mm:ss"
                )}&sort=legs__departure_time-asc`
            );
        }
    }, [hotel]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                Cần vé máy bay cho chuyến đi của quý khách?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                2 Hành Khách • Một chiều • Bay đến {hotel.cityName}
            </p>
            <div className="relative">
                {flights.length === 0 ? (
                    <Empty
                        description="Không có chuyến bay nào được tìm thấy."
                        className="bg-[#abb6cb1f] w-full mx-0 py-[70px] rounded-[16px]"
                    />
                ) : (
                    <Swiper
                        slidesPerView={5}
                        spaceBetween={16}
                        navigation={true}
                        modules={[Navigation]}
                        className="mt-[24px]"
                    >
                        {flights.map((flight, index) => {
                            if (flight.legs?.length === 0) return <div></div>;

                            const recordLegSorted = [...flight.legs].sort(
                                (a, b) =>
                                    new Date(a.departure_time).getTime() -
                                    new Date(b.departure_time).getTime() // giảm dần
                            );

                            const firstLeg = recordLegSorted[0];
                            const lastLeg =
                                recordLegSorted[recordLegSorted.length - 1];
                            return (
                                <SwiperSlide key={index} className="!h-auto">
                                    <Link
                                        to={`/flight?origin=${
                                            firstLeg.departure_airport.id
                                        }&destination=${
                                            lastLeg.arrival_airport.id
                                        }&departureDate=${dayjs(
                                            firstLeg.departure_time
                                        ).format(
                                            "YYYY-MM-DD"
                                        )}&passengers=2&seatClass=economy&tripType=one-way`}
                                        className="block h-full border-gray-200 border-[1px] p-[10px] rounded-[10px] cursor-pointer hover:bg-gray-300 transition-all duration-150"
                                    >
                                        <div className="flex items-center gap-[6px]">
                                            <img
                                                src={getImage(
                                                    flight?.airline?.logo
                                                )}
                                                alt={flight?.airline?.name}
                                                className="w-[24px]"
                                            />
                                            <p className="text-[12px] text-gray-500">
                                                {flight?.airline?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-base">
                                                {dayjs(
                                                    firstLeg?.departure_time
                                                ).format("HH:ss")}{" "}
                                                →{" "}
                                                {dayjs(
                                                    lastLeg?.arrival_time
                                                ).format("HH:ss")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {dayjs(
                                                    firstLeg?.departure_time
                                                ).format("DD/MM/YYYY")}{" "}
                                                -{" "}
                                                {dayjs(
                                                    lastLeg?.arrival_time
                                                ).format("DD/MM/YYYY")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-[10px]">
                                            <p className="font-semibold leading-[20px]">{`${firstLeg?.departure_airport?.name}`}</p>
                                            →
                                            <p className="font-semibold leading-[20px]">{`${lastLeg?.arrival_airport?.name}`}</p>
                                        </div>
                                        <div class="flex justify-between items-center mt-[20px]">
                                            <div>
                                                {flight?.promotion
                                                    ?.discount_percent && (
                                                    <p class="text-[12px] text-gray-500 line-through">
                                                        {formatCurrency(
                                                            flight.base_price
                                                        )}{" "}
                                                        ₫
                                                    </p>
                                                )}

                                                <div class="flex items-center">
                                                    <span class="text-red-600 leading-[18px] font-semibold text-[18px]">
                                                        {formatCurrency(
                                                            flight.base_price -
                                                                (flight.base_price *
                                                                    (flight
                                                                        ?.promotion
                                                                        ?.discount_percent ||
                                                                        0)) /
                                                                    100
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default FlightBookingSection;
