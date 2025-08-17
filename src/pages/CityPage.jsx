import ClientLayout from "layouts/ClientLayout";
import Banner from "components/City/Banner";
import TopHotel from "components/City/TopHotel";
import MoreInfo from "components/City/MoreInfo";
import Footer from "components/City/Footer";
import { Layout } from 'antd';

const { Content } = Layout;

const CityPage = () => {
    return (
        <ClientLayout>
            <Banner />
            <Content className="p-6">
                <div className="max-w-6xl mx-auto">
                    <TopHotel />
                    <MoreInfo />
                </div>
            </Content>
            <Footer />
        </ClientLayout>
    );
};

export default CityPage;
