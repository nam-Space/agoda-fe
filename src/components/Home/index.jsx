import React from "react";
import BackgroundHome from "./BackgroundHome";
import VietnamDestination from "./VietnamDestination";
import SaleOffAll from "./SaleOffAll";
import RecommendedAccommodation from "./RecommendedAccommodation";
import ForeignCountryDestination from "./ForeignCountryDestination";

const Home = () => {
    return (
        <div>
            <BackgroundHome />
            <VietnamDestination />
            <SaleOffAll />
            <RecommendedAccommodation />
            <ForeignCountryDestination />
        </div>
    );
};

export default Home;
