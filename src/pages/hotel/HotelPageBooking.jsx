import BreadcrumbSection from "components/BreadcrumbSection";
import FooterClient from "components/FooterClient";
import HeaderClient from "components/HeaderClient";
import ActivitySlider from "components/Hotel/ActivitySliderSection";
import ExperienceSection from "components/Hotel/ExperenceSection";
import FilterSection from "components/Hotel/FilterSection";
import GallerySection from "components/Hotel/GallerySection";
import HostAndAmenitiesSection from "components/Hotel/HostAndAmenitiesSection";
import HostProfileLink from "components/Hotel/HostProfileLink";
import FlightBookingSection from "components/Hotel/HotelBooking/FlightBookingSection";
import HotelRoomEmptyList from "components/Hotel/HotelBooking/HotelRoomEmptyList";
import PlanYourTripSection from "components/Hotel/HotelBooking/PlanYourTripSection";
import HotelOverviewSection from "components/Hotel/HotelOverviewSection";
import MapCard from "components/Hotel/MapCard";

import NavigationBar from "components/Hotel/NavigationBar"; // Import the new NavigationBar component
import ReviewTabView from "components/Hotel/ReviewTabView";
import SearchBar from "components/Hotel/SearchBarSection";

import icLike from "../../images/hotel/ic_like.png";
import icNotice from "../../images/hotel/ic_notice.png";
import icPublicCar from "../../images/hotel/ic_public_car.png";
import icSea from "../../images/hotel/ic_sea.png";
import icTable from "../../images/hotel/ic_table.png";
import { FloatButton } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import ChatBot from "components/Chatbot/Chatbot";

const HotelPageBooking = () => {
    const breadcrumbs = [
        { text: "Trang chủ", link: "/", isActive: true },
        {
            text: "Khách sạn Việt Nam (107.219)",
            link: "/vietnam-hotels",
            isActive: false,
        },
        {
            text: "Khách sạn Vũng Tàu (6.329)",
            link: "/vung-tau-hotels",
            isActive: false,
        },
        {
            text: "Vũng Tàu Căn hộ (2.954)",
            link: "/vung-tau-apartments",
            isActive: false,
        },
        {
            text: "Đặt phòng The Song House Vung Tau",
            link: "/the-song-house-vung-tau",
            isActive: false,
        },
    ];
    const viewAllLink = {
        text: "Xem tất cả 6.329 khách sạn tại Vũng Tàu.",
        link: "/vung-tau-hotels",
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="hotel-page">
            {/* Reuse HeaderClient */}
            <HeaderClient />

            {/* Search Bar */}
            <div className="search-bar bg-white shadow-md rounded-lg mx-auto my-8">
                <SearchBar />
                <BreadcrumbSection
                    breadcrumbs={breadcrumbs}
                    viewAllLink={viewAllLink}
                />
            </div>

            {/* Gallery Section */}
            <GallerySection />

            {/* Navigation Bar */}
            <NavigationBar scrollToSection={scrollToSection} />

            {/* Main Content */}
            <div className="w-full max-w-6xl mx-auto px-4">
                {/* Overview Section with MapCard */}
                <div
                    id="overview"
                    className="section flex flex-col lg:flex-row items-start"
                >
                    <div className="lg:w-2/3">
                        <HotelOverviewSection
                            title="The Song House Vung Tau"
                            address="28 Đường Thi Sách, Thắng Tam, Vũng Tàu, Việt Nam"
                            mapLink="#"
                            tags={[
                                { text: "Domestic Deal", color: "bg-blue-600" },
                                {
                                    text: "SCUBA DIVING SALE",
                                    color: "bg-purple-600",
                                },
                                { text: "Căn hộ", color: "bg-green-600" },
                            ]}
                            highlights={[
                                {
                                    icon: icPublicCar,
                                    text: "Cách phương tiện công cộng 990 m",
                                },
                                {
                                    icon: icLike,
                                    text: "Thích hợp cho các hoạt động",
                                },
                                {
                                    icon: icTable,
                                    text: "Bàn tiếp tân [24 giờ]",
                                },
                                { icon: icNotice, text: "Cách Bãi sau 420 m" },
                                { icon: icSea, text: "Cách bãi biển 420 m" },
                            ]}
                            roomDetails={[
                                {
                                    title: "Phòng 1",
                                    description: "1 giường sofa",
                                },
                                {
                                    title: "Phòng tắm và vật dụng vệ sinh",
                                    description:
                                        "Các loại khăn, Gương, Máy sấy tóc...",
                                },
                                {
                                    title: "Bếp",
                                    description:
                                        "Tự nấu ăn, Bàn ăn, Bếp đầy đủ...",
                                },
                            ]}
                            promotionTitle="Đang có khuyến mại kỳ nghỉ ngắn"
                            promotionCategories={[
                                {
                                    title: "Ăn và Uống",
                                    items: [
                                        "Quán cà phê",
                                        "Dịch vụ phòng",
                                        "Quán bar",
                                    ],
                                },
                                {
                                    title: "Sức khỏe",
                                    items: [
                                        "Phòng tập",
                                        "Phòng xông ướt",
                                        "Xông khô",
                                    ],
                                },
                                {
                                    title: "Hoạt động",
                                    items: ["Bể bơi", "CLB trẻ em", "Bãi biển"],
                                },
                                {
                                    title: "Thể thao",
                                    items: ["Đi bộ đường dài"],
                                },
                            ]}
                            facilities={[
                                "Bãi biển",
                                "Miễn phí Wi-Fi",
                                "Bàn tiếp tân [24 giờ]",
                                "Trung tâm thể dục",
                                "Bể bơi",
                                "Quán bar",
                                "Bãi đỗ xe",
                                "Phòng xông khô",
                            ]}
                            aboutText="Hãy để chuyến đi của quý khách có một khởi đầu tuyệt vời khi ở lại khách sạn này, nơi có Wi-Fi miễn phí trong tất cả các phòng."
                            aboutLink="#"
                            hotSaleText="Phòng ở đây đang bán rất chạy!"
                            hotSaleCount="8 du khách đã đặt hôm nay."
                        />
                    </div>
                    {/* Layout for Map and Profile */}
                    <div className="lg:w-1/3 lg:pl-4 mt-4 lg:mt-0">
                        <div className="w-full mb-4">
                            <MapCard />
                        </div>
                        <div className="w-full">
                            <HostProfileLink />
                        </div>
                    </div>
                </div>

                <div id="rooms" className="section">
                    <FilterSection />
                    <HotelRoomEmptyList />
                </div>

                <div id="activities" className="section">
                    <ActivitySlider />
                </div>

                <div id="host" className="section">
                    <HostAndAmenitiesSection />
                </div>

                <div id="facilities" className="section">
                    <ExperienceSection />
                </div>

                <div id="location" className="section">
                    <PlanYourTripSection />
                </div>

                <div id="policy" className="section">
                    <FlightBookingSection />
                </div>

                <div id="reviews" className="section">
                    <ReviewTabView />
                </div>
            </div>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ insetInlineEnd: 24 }}
                icon={<CommentOutlined className="text-[30px]" />}
            >
                <ChatBot />
            </FloatButton.Group>
            {/* Footer */}
            <FooterClient />
        </div>
    );
};

export default HotelPageBooking;
