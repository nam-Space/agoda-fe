import { Layout } from "antd";
import Banner from "components/City/Banner";
import Footer from "components/City/Footer";
import MoreInfo from "components/City/MoreInfo";
import TopHotel from "components/City/TopHotel";
import { callFetchCityDetail } from "config/api";
import ClientLayout from "layouts/ClientLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const { Content } = Layout;

const CityPage = () => {
    const { cityId } = useParams(); // ✅ Lấy cityId từ URL
    const [city, setCity] = useState({});

    const handleGetCity = async (cityId) => {
        const res = await callFetchCityDetail(cityId);
        if (res.isSuccess) {
            setCity(res.data);
        }
    };

    useEffect(() => {
        if (cityId) {
            window.scrollTo(0, 0);
            handleGetCity(cityId);
        }
    }, [cityId]);

    return (
        <ClientLayout>
            <Banner city={city} />
            <Content className="p-6">
                <div className="max-w-[1200px] mx-auto">
                    <TopHotel />
                    <MoreInfo cityId={cityId} city={city} />
                </div>
            </Content>
            <Footer city={city} />
        </ClientLayout>
    );
};

export default CityPage;
