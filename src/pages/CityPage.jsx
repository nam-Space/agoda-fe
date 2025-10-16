import { Layout } from "antd";
import Banner from "components/City/Banner";
import Footer from "components/City/Footer";
import MoreInfo from "components/City/MoreInfo";
import TopHotel from "components/City/TopHotel";
import ClientLayout from "layouts/ClientLayout";
import { useParams } from "react-router-dom";

const { Content } = Layout;

const CityPage = () => {
  const { cityId } = useParams(); // ✅ Lấy cityId từ URL

  return (
    <ClientLayout>
      <Banner cityId={cityId} />
      <Content className="p-6">
        <div className="max-w-6xl mx-auto">
          <TopHotel />
          <MoreInfo cityId={cityId} /> 
        </div>
      </Content>
      <Footer />
    </ClientLayout>
  );
};

export default CityPage;
