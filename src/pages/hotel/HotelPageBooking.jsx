import React from 'react';
import HeaderClient from 'components/HeaderClient';
import NavigationBar from 'components/Hotel/NavigationBar'; // Import the new NavigationBar component
import SearchBar from 'components/Hotel/SearchBarSection';
import BreadcrumbSection from 'components/BreadcrumbSection';
import GallerySection from 'components/Hotel/GallerySection';
import FilterSection from 'components/Hotel/FilterSection';
import HotelOverviewSection from 'components/Hotel/HotelOverviewSection';
import HotelRoomEmptyList from 'components/Hotel/HotelBooking/HotelRoomEmptyList';
import ActivitySlider from 'components/Hotel/ActivitySliderSection';
import HostAndAmenitiesSection from 'components/Hotel/HostAndAmenitiesSection';
import ExperienceSection from 'components/Hotel/ExperenceSection';
import ReviewTabView from 'components/Hotel/ReviewTabView';
import PlanYourTripSection from 'components/Hotel/HotelBooking/PlanYourTripSection';
import FlightBookingSection from 'components/Hotel/HotelBooking/FlightBookingSection';
import FooterClient from 'components/FooterClient';

import icPublicCar from '../../images/hotel/ic_public_car.png';
import icLike from '../../images/hotel/ic_like.png';
import icNotice from '../../images/hotel/ic_notice.png';
import icTable from '../../images/hotel/ic_table.png';

const HotelPageBooking = () => {
    const breadcrumbs = [
        { text: 'Trang chủ', link: '/', isActive: true },
        { text: 'Khách sạn Việt Nam (107.219)', link: '/vietnam-hotels', isActive: false },
        { text: 'Khách sạn Vũng Tàu (6.329)', link: '/vung-tau-hotels', isActive: false },
        { text: 'Vũng Tàu Căn hộ (2.954)', link: '/vung-tau-apartments', isActive: false },
        { text: 'Đặt phòng The Song House Vung Tau', link: '/the-song-house-vung-tau', isActive: false },
    ];
    const viewAllLink = {
        text: 'Xem tất cả 6.329 khách sạn tại Vũng Tàu.',
        link: '/vung-tau-hotels',
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="hotel-page">
            {/* Reuse HeaderClient */}
            <HeaderClient />

            {/* Search Bar */}
            <div className="search-bar bg-white shadow-md rounded-lg mx-auto my-8">
                <SearchBar />
                <BreadcrumbSection breadcrumbs={breadcrumbs} viewAllLink={viewAllLink} />
            </div>

            {/* Gallery Section */}
            <GallerySection />

            {/* Navigation Bar */}
            <NavigationBar scrollToSection={scrollToSection} />

            <div className="hotel-info-container bg-white rounded-lg p-6 w-full max-w-6xl mx-auto">
                {/* Sections */}
                <div id="overview" className="section">
                    <HotelOverviewSection
                        title="The Song House Vung Tau"
                        address="28 Đường Thi Sách, Thắng Tam, Vũng Tàu, Việt Nam"
                        mapLink="#"
                        tags={[
                            { text: "Domestic Deal", color: "bg-blue-600" },
                            { text: "SCUBA DIVING SALE", color: "bg-purple-600" },
                            { text: "Căn hộ", color: "bg-green-600" },
                        ]}
                        highlights={[
                            { icon: icPublicCar, text: "Cách phương tiện công cộng 990 m" },
                            { icon: icLike, text: "Thích hợp cho các hoạt động" },
                            { icon: icTable, text: "Bàn tiếp tân [24 giờ]" },
                            { icon: icNotice, text: "Cách Bãi sau 420 m" },
                            { icon: "", text: "Cách bãi biển 420 m" },
                        ]}
                        roomDetails={[
                            { title: "Phòng 1", description: "1 giường sofa" },
                            { title: "Phòng tắm và vật dụng vệ sinh", description: "Các loại khăn, Gương, Máy sấy tóc..." },
                            { title: "Bếp", description: "Tự nấu ăn, Bàn ăn, Bếp đầy đủ..." },
                        ]}
                        promotionTitle="Đang có khuyến mại kỳ nghỉ ngắn"
                        promotionCategories={[
                            { title: "Ăn và Uống", items: ["Quán cà phê", "Dịch vụ phòng", "Quán bar"] },
                            { title: "Sức khỏe", items: ["Phòng tập", "Phòng xông ướt", "Xông khô"] },
                            { title: "Hoạt động", items: ["Bể bơi", "CLB trẻ em", "Bãi biển"] },
                            { title: "Thể thao", items: ["Đi bộ đường dài"] },
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

            {/* Footer */}
            <FooterClient />
        </div>
    );
};

export default HotelPageBooking;