import React from 'react'
import { useSearchParams } from "react-router-dom";
import PromotionHotels from "../../components/Promotion/PromotionHotels";
import PromotionFlights from "../../components/Promotion/PromotionFlights";
import PromotionActivities from "../../components/Promotion/PromotionActivities";
import ClientLayout from "../../layouts/ClientLayout";

const PromotionPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "accommodation";

  const renderPromotionComponent = () => {
    switch (type) {
      case "flight":
        return <PromotionFlights />;
      case "activity":
        return <PromotionActivities />;
      case "accommodation":
      default:
        return <PromotionHotels />;
    }
  };

  return (
    <ClientLayout>
      {renderPromotionComponent()}
    </ClientLayout>
  )
}

export default PromotionPage
