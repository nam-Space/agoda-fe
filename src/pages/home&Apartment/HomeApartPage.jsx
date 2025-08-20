import BreadcrumbSection from 'components/BreadcrumbSection';
import FooterClient from 'components/FooterClient';
import HeaderClient from 'components/HeaderClient';
import ActivitySlider from 'components/Home&Apartment/ActivitySliderSection';
import ExperienceSection from 'components/Home&Apartment/ExperenceSection';
import FilterSection from 'components/Home&Apartment/FilterSection';
import HostAndAmenitiesSection from 'components/Home&Apartment/HostAndAmenitiesSection';
import HostProfileLink from 'components/Home&Apartment/HostProfileLink';
import HotelOverviewSection from 'components/Home&Apartment/HotelOverviewSection';
import MapCard from 'components/Home&Apartment/MapCard';
import RoomOptionsSection from 'components/Home&Apartment/RoomOptionsSection';
import GallerySection from 'components/Hotel/GallerySection';
import FlightBookingSection from 'components/Hotel/HotelBooking/FlightBookingSection';
import PlanYourTripSection from 'components/Hotel/HotelBooking/PlanYourTripSection';

import ReviewTabView from 'components/Home&Apartment/ReviewTabView';
import SearchBar from 'components/Home&Apartment/SearchBarSection';
import NavigationBar from 'components/Hotel/NavigationBar'; // Import the new NavigationBar component

import { FaBed, FaUserFriends } from "react-icons/fa";
import icLocation from '../../images/home&Apartment/ic_location.png';
import icFlight from '../../images/home&Apartment/ic_plane.png';
import icWifi from '../../images/home&Apartment/ic_wifi.png';
import icLike from '../../images/hotel/ic_like.png';
import icTable from '../../images/hotel/ic_table.png';

import Faq from 'components/Home&Apartment/Faq-accordion';

const HotelPageBooking = () => {
    const breadcrumbs = [
        { text: 'Trang chủ', link: '/', isActive: true },
        { text: 'Khách sạn Việt Nam (107.219)', link: '/vietnam-hotels', isActive: false },
        { text: 'Khách sạn Hồ Chí Minh (6.329)', link: '/ho-chi-minh-hotels', isActive: false },
        { text: 'Hồ Chí Minh Khách sạn (2.954)', link: '/ho-chi-minh-apartments', isActive: false },
        { text: 'Đặt phòng Nhà dân Cactusland - Trần Hưng Đạo', link: '/cactusland-homestay-tran-hung-dao', isActive: false },
    ];
    const viewAllLink = {
        text: 'Xem tất cả 6.329 khách sạn tại Hồ Chí Minh.',
        link: '/ho-chi-minh-hotels',
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

            {/* Gallery Section album anh dau page*/}
            <GallerySection /> 

            {/* Navigation Bar thanh nav*/}
            <NavigationBar scrollToSection={scrollToSection} />

            {/* Main Content danh sach phong/nha/can ho*/}
                        <div className="w-full max-w-6xl mx-auto px-4">
                            {/* Overview Section with MapCard */}
                            <div id="overview" className="section flex flex-col lg:flex-row items-start">
                                <div className="lg:w-2/3">
                                    <HotelOverviewSection
                                        title="Nhà dân Cactusland - Trần Hưng Đạo (Cactusland Homestay - Tran Hung Dao)"
                                        address="393/30 Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP Hồ Chí Minh, Việt Nam"
                                        mapLink="#"
                                        tags={[
                                            { text: "Đáng tiền nhất", color: "bg-blue-600" },
                                            // { text: "SCUBA DIVING SALE", color: "bg-purple-600" },
                                            { text: "Nhà dân", color: "bg-green-600" },
                                        ]}
                                        highlights={[
                                            { icon: icLocation, text: "Nằm ở trung tâm Thành phố" },
                                            { icon: icLike, text: "Thích hợp cho các hoạt động" },
                                            { icon: icFlight, text: "Đưa đón sân bay" },
                                            { icon: icTable, text: "Nhận phòng [24 giờ]" },
                                            { icon: icWifi, text: "Wi-Fi miễn phí trong tất cả các phòng" },
                                        ]}
                                        roomDetails={[
                                            { icon: <FaUserFriends />, title: "Tối đa 2 khách" },
                                            { icon: <FaBed />, title: "1 phòng, 1 giường" },
                                        ]}   
                                        promotionTitle="Khuyến mãi đặc biệt"
                                        promotionCategories={[
                                            { title: "Ưu đãi ăn uống", items: ["Buffet sáng miễn phí", "Giảm 20% nhà hàng"] },
                                            { title: "Dịch vụ", items: ["Đưa đón sân bay", "Spa miễn phí"] },
                                        ]}
                                        facilities={[
                                            "Miễn phí Wi-Fi",
                                            "Ban công/sân hiển",
                                            "Giờ giảm giá đồ uống",
                                            "Dịch vụ phòng",
                                            "Bếp chung",
                                            "Chuyến tham quan",
                                        ]}
                                        aboutText="Hãy để chuyến đi của quý khách có một khởi đầu tuyệt vời khi ở lại khách sạn này, nơi có Wi-Fi miễn phí trong tất cả các phòng. Nằm ở vị trí trung tâm tại Quận 1 của Hồ Chí Minh, chỗ nghỉ này đặt quý khách ở gần các điểm thu hút và tùy chọn ăn uống thú vị. Đừng rời đi trước khi ghé thăm Bảo tàng Chứng tích chiến tranh nổi tiếng."
                                        aboutLink="#"
                                        hotSaleText="Ngày quý khách chọn là ngày phổ biến đối với du khách!"
                                        hotSaleCount="Điểm đến nổi tiếng! Các chỗ nghỉ ở Hồ Chí Minh đang được đặt 1 phút một lần."
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

                {/* Filter chon phong / loc phong */}
                <div id="rooms" className="section">
                    <FilterSection />
                    <RoomOptionsSection
                        title="Phòng Tiêu chuẩn giường đôi (Standard Double)"
                        roomImage="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                        roomDetails={[
                            "1 giường đôi lớn",
                            "Diện tích phòng: 48 m²",
                            "Hướng Thành phố",
                            "Ban công/sân hiên",
                            "Vòi sen",
                            "Bể bơi riêng",
                            "Bếp nhỏ",
                        ]}
                        cancellationPolicy="Miễn phí hủy trước 25 tháng 7 2025"
                        perks={["Đặt không cần thẻ tín dụng", "WiFi miễn phí"]}
                        price="513.747 đ"
                        bookingInfo="Không thanh toán hôm nay"
                        additionalInfo={[
                            { text: "CACTUSLAND SALE", highlight: true },
                            { text: "Giảm 120000 VND!", highlight: false },
                        ]}
                    /> 
                </div>

                {/* hoat dong khong the bo qua */}
                <div id="activities" className="section">
                    <ActivitySlider />
                </div>

                <div id="location" className="section">
                    <PlanYourTripSection />
                </div>

                <div id="policy" className="section">
                    <FlightBookingSection />
                </div>

                {/* chu nha va tien nghi co so vat chat */}
                <div id="host" className="section">
                    <HostAndAmenitiesSection />
                </div>

                {/* kinh nghiem du lich - gioi thieu ngan ve page */}
                <div id="facilities" className="section">
                    <ExperienceSection />
                    <Faq />
                </div>

                {/* review commnent */}
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