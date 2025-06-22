import React from "react";
import BackgroundHome from "./BackgroundHome";
import VietnamDestination from "./VietnamDestination";
import SaleOffAccommodation from "./SaleOffAccommodation";
import FlightAndActivity from "./FlightAndActivity";
import RecommendedAccommodation from "./RecommendedAccommodation";
import ForeignCountryDestination from "./ForeignCountryDestination";

const Home = () => {
    return (
        <div>
            <BackgroundHome />
            <VietnamDestination />
            <SaleOffAccommodation />
            <FlightAndActivity />
            <RecommendedAccommodation />
            <ForeignCountryDestination />
        </div>
    );
};

export default Home;
