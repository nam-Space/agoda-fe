import { Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    clearHotelDetail,
    fetchHotelDetail,
    fetchHotelsByCity
} from "../../redux/slice/hotelSlice";

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
import PlanYourTripSection from "components/Hotel/HotelBooking/PlanYourTripSection";
import HotelOverviewSection from "components/Hotel/HotelOverviewSection";
import MapCard from "components/Hotel/MapCard";
import NavigationBar from "components/Hotel/NavigationBar";
import ReviewTabView from "components/Hotel/ReviewTabView";
import RoomOptionsSection from "components/Hotel/RoomOptionsSection";
import SearchBar from "components/Hotel/SearchBarSection";

import icLike from "../../images/hotel/ic_like.png";
import icNotice from "../../images/hotel/ic_notice.png";
import icSea from "../../images/hotel/ic_sea.png";
import icTable from "../../images/hotel/ic_table.png";

const HotelPage = () => {
    const { hotelSlug } = useParams();
    const dispatch = useAppDispatch();
    const { hotelDetail, isLoadingHotelDetail, error } = useAppSelector(state => state.hotel);
    const { hotels, isLoadingHotels } = useAppSelector(state => state.hotel);
    const [searchParams, setSearchParams] = useState({
        capacity: null,
        startDate: null,
        endDate: null,
    });

    const isDetailPage = !!hotelSlug;
    
    const extractHotelIdFromSlug = (slug) => {
        if (!slug) return null;
        const parts = slug.split('-');
        const lastPart = parts[parts.length - 1];
        return isNaN(lastPart) ? null : parseInt(lastPart);
    };
    
    const createHotelSlug = (hotelName, hotelId) => {
        if (!hotelName) return hotelId;
        return hotelName
            .toLowerCase()
            .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
            .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
            .replace(/ì|í|ị|ỉ|ĩ/g, "i")
            .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
            .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
            .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            + `-${hotelId}`;
    };

    const hotelId = extractHotelIdFromSlug(hotelSlug);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x300";
        if (imagePath.startsWith('http')) return imagePath;
        return `${process.env.REACT_APP_BE_URL}${imagePath}`;
    };

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, '').trim();
    };

    const extractFacilities = (htmlTable) => {
        if (!htmlTable) return [];
        const matches = htmlTable.match(/>([^<]+)</g);
        return matches ? matches
            .map(match => match.replace(/[><]/g, '').trim())
            .filter(text => text && text !== '' && text.length > 1)
            .slice(0, 8) : [];
    };

    const transformHotelListToHotelData = (firstHotel) => {
        return {
            name: firstHotel.name || "Khách sạn",
            address: firstHotel.location || "Địa chỉ không có",
            description: stripHtml(firstHotel.description) || "",
            images: firstHotel.images || [],
            facilities: extractFacilities(firstHotel.facilities),
            avgStar: firstHotel.avg_star || 0,
            lat: firstHotel.lat,
            lng: firstHotel.lng,
            nearbyLocation: stripHtml(firstHotel.nearbyLocation) || "",
            mostFeature: stripHtml(firstHotel.mostFeature) || "",
            withUs: stripHtml(firstHotel.withUs) || "",
            usefulInformation: stripHtml(firstHotel.usefulInformation) || "",
            amenitiesAndFacilities: stripHtml(firstHotel.amenitiesAndFacilities) || "",
            locationInfo: stripHtml(firstHotel.locationInfo) || "",
            regulation: stripHtml(firstHotel.regulation) || "",
            point: firstHotel.point || 0,
            cityName: firstHotel.city?.name || ""
        };
    };

    useEffect(() => {
        if (isDetailPage && hotelId) {
            dispatch(fetchHotelDetail(hotelId));
        } else if (!isDetailPage) {
            dispatch(fetchHotelsByCity({
                cityId: null,
                currentPage: 1,
                pageSize: 10,
                filters: {}
            }));
        }
        return () => {
            if (isDetailPage) {
                dispatch(clearHotelDetail());
            }
        };
    }, [dispatch, hotelId, isDetailPage]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleSearch = ({ hotelId, capacity, startDate, endDate, rooms }) => {
        setSearchParams({ capacity, startDate, endDate });
    };

    if (isDetailPage && isLoadingHotelDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!isDetailPage && isLoadingHotels) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (isDetailPage && !hotelDetail && !isLoadingHotelDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                        Không tìm thấy khách sạn
                    </h2>
                    <p className="text-gray-500">
                        Khách sạn bạn tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                </div>
            </div>
        );
    }

    const transformedHotel = isDetailPage && hotelDetail ? {
        name: hotelDetail.name || "Tên khách sạn",
        address: hotelDetail.location || "Địa chỉ không có",
        description: stripHtml(hotelDetail.description) || "",
        images: hotelDetail.images || [],
        facilities: extractFacilities(hotelDetail.facilities),
        avgStar: hotelDetail.avg_star || 0,
        lat: hotelDetail.lat,
        lng: hotelDetail.lng,
        nearbyLocation: stripHtml(hotelDetail.nearbyLocation) || "",
        mostFeature: stripHtml(hotelDetail.mostFeature) || "",
        withUs: stripHtml(hotelDetail.withUs) || "",
        usefulInformation: stripHtml(hotelDetail.usefulInformation) || "",
        amenitiesAndFacilities: stripHtml(hotelDetail.amenitiesAndFacilities) || "",
        locationInfo: stripHtml(hotelDetail.locationInfo) || "",
        regulation: stripHtml(hotelDetail.regulation) || "",
        point: hotelDetail.point || 0,
        cityName: hotelDetail.city?.name || ""
    } : null;

    const defaultHotelData = !isDetailPage && hotels.length > 0 ? 
        transformHotelListToHotelData(hotels[0]) : {
            name: "The Song House Vung Tau",
            address: "28 Đường Thi Sách, Thắng Tam, Vũng Tàu, Việt Nam",
            description: "Khách sạn chất lượng cao với dịch vụ tuyệt vời",
            images: [],
            facilities: [
                "Bãi biển",
                "Miễn phí Wi-Fi", 
                "Bàn tiếp tân [24 giờ]",
                "Trung tâm thể dục",
                "Bể bơi",
                "Quán bar",
                "Bãi đỗ xe",
                "Phòng xông khô"
            ],
            avgStar: 4.5,
            lat: null,
            lng: null,
            nearbyLocation: "Cách phương tiện công cộng 990 m",
            mostFeature: "Vị trí thuận tiện, gần bãi biển",
            withUs: "Trải nghiệm tuyệt vời",
            usefulInformation: "Check-in: 14:00, Check-out: 12:00",
            amenitiesAndFacilities: "Đầy đủ tiện nghi hiện đại",
            locationInfo: "Gần các địa điểm du lịch nổi tiếng",
            regulation: "Không hút thuốc trong phòng"
        };

    const hotelData = isDetailPage ? transformedHotel : defaultHotelData;

    const breadcrumbs = isDetailPage ? [
        { text: "Trang chủ", link: "/", isActive: true },
        { text: "Khách sạn", link: "/hotel", isActive: false },
        ...(transformedHotel?.cityName ? [{ 
            text: `Khách sạn ${transformedHotel.cityName}`, 
            link: `/city/${transformedHotel.cityName.toLowerCase().replace(/\s+/g, '-')}`, 
            isActive: false 
        }] : []),
        {
            text: transformedHotel?.name || "Chi tiết khách sạn",
            link: `/hotel/${hotelId}`,
            isActive: false,
        },
    ] : [
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
        text: isDetailPage && transformedHotel?.cityName ? 
            `Xem tất cả khách sạn tại ${transformedHotel.cityName}.` : 
            "Xem tất cả khách sạn.",
        link: isDetailPage && transformedHotel?.cityName ? 
            `/city/${transformedHotel.cityName.toLowerCase().replace(/\s+/g, '-')}` : 
            "/hotel",
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const highlights = [
        ...(hotelData?.withUs ? [{
            icon: icLike,
            text: hotelData.withUs
        }] : []),
        {
            icon: icTable,
            text: isDetailPage ? 
                `Điểm đánh giá: ${hotelData?.point?.toFixed(1) || 0}/10` : 
                "Bàn tiếp tân [24 giờ]"
        },
        ...(hotelData?.usefulInformation ? [{
            icon: icNotice,
            text: hotelData.usefulInformation
        }] : [{ icon: icNotice, text: "Cách Bãi sau 420 m" }]),
        ...(hotelData?.avgStar ? [{
            icon: icSea,
            text: `Khách sạn ${hotelData.avgStar.toFixed(1)} sao`
        }] : [{
            icon: icSea,
            text: "Cách bãi biển 420 m"
        }])
    ];

    const promotionCategories = [
        {
            title: "Tiện ích chính",
            items: hotelData?.facilities?.slice(0, 3) || ["Quán cà phê", "Dịch vụ phòng", "Quán bar"]
        },
        {
            title: "Dịch vụ", 
            items: hotelData?.facilities?.slice(3, 6) || ["Phòng tập", "Phòng xông ướt", "Xông khô"]
        },
        {
            title: "Hoạt động",
            items: hotelData?.facilities?.slice(6) || ["Bể bơi", "CLB trẻ em", "Bãi biển"]
        },
        {
            title: "Vị trí",
            items: isDetailPage && hotelData?.cityName ? 
                [`Tại ${hotelData.cityName}`, "Gần trung tâm", "Thuận tiện di chuyển"] :
                ["Đi bộ đường dài"]
        }
    ];

    return (
        <div className="hotel-page">
            <HeaderClient />
            <div className="search-bar bg-white shadow-md rounded-lg mx-auto my-8">
                <SearchBar onSearch={handleSearch} />
                <BreadcrumbSection
                    breadcrumbs={breadcrumbs}
                    viewAllLink={viewAllLink}
                />
            </div>
            <GallerySection images={hotelData?.images} />
            <NavigationBar scrollToSection={scrollToSection} />
            <div className="w-full max-w-6xl mx-auto px-4">
                <div
                    id="overview"
                    className="section flex flex-col lg:flex-row items-start"
                >
                    <div className="lg:w-2/3">
                        <HotelOverviewSection
                            title={hotelData?.name}
                            address={hotelData?.address}
                            mapLink={hotelData?.lat && hotelData?.lng ? 
                                `https://maps.google.com/?q=${hotelData.lat},${hotelData.lng}` : "#"}
                            tags={[
                                { text: "Domestic Deal", color: "bg-blue-600" },
                                {
                                    text: isDetailPage ? 
                                        `${hotelData?.avgStar?.toFixed(1) || 0} sao` : 
                                        "SCUBA DIVING SALE",
                                    color: isDetailPage ? "bg-yellow-500" : "bg-purple-600",
                                },
                                { text: "Căn hộ", color: "bg-green-600" },
                            ]}
                            highlights={highlights}
                            roomDetails={isDetailPage ? [
                                {
                                    title: "Thông tin cơ bản",
                                    description: hotelData?.withUs || "Vị trí thuận lợi, tiện ích đầy đủ"
                                },
                                {
                                    title: "Đánh giá khách hàng",
                                    description: `Điểm đánh giá: ${hotelData?.point || 0}/10 - Đáng giá tiền`
                                },
                                {
                                    title: "Quy định",
                                    description: hotelData?.regulation || "Xem chi tiết quy định của khách sạn"
                                }
                            ] : [
                                {
                                    title: "Phòng 1",
                                    description: "1 giường sofa",
                                },
                                {
                                    title: "Phòng tắm và vật dụng vệ sinh",
                                    description: "Các loại khăn, Gương, Máy sấy tóc...",
                                },
                                {
                                    title: "Bếp",
                                    description: "Tự nấu ăn, Bàn ăn, Bếp đầy đủ...",
                                },
                            ]}
                            promotionTitle={isDetailPage ? 
                                "Tiện ích và dịch vụ" : 
                                "Đang có khuyến mãi kỳ nghỉ ngắn"}
                            promotionCategories={promotionCategories}
                            facilities={hotelData?.facilities || []}
                            aboutText={hotelData?.description || 
                                "Hãy để chuyến đi của quý khách có một khởi đầu tuyệt vời khi ở lại khách sạn này, nơi có Wi-Fi miễn phí trong tất cả các phòng."}
                            aboutLink="#"
                            hotSaleText={isDetailPage ? 
                                "Phòng ở đây đang được quan tâm!" : 
                                "Phòng ở đây đang bán rất chạy!"}
                            hotSaleCount={isDetailPage ? 
                                "Nhiều du khách đã xem hôm nay." : 
                                "8 du khách đã đặt hôm nay."}
                        />
                    </div>
                    <div className="lg:w-1/3 lg:pl-4 mt-4 lg:mt-0">
                        <div className="w-full mb-4">
                            <MapCard 
                                lat={hotelData?.lat}
                                lng={hotelData?.lng}
                                hotelName={hotelData?.name}
                            />
                        </div>
                        <div className="w-full">
                            <HostProfileLink />
                        </div>
                    </div>
                </div>
                <div id="rooms" className="section">
                    <FilterSection />
                    <RoomOptionsSection
                        title={isDetailPage ? `Phòng tại ${hotelData?.name}` : "Studio Có Giường Cỡ King Và Giường Sofa (King Studio with Sofa Bed)"}
                        roomImage={isDetailPage ? getImageUrl(hotelData?.images?.[0]?.image) : "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"}
                        roomDetails={isDetailPage ? [
                            "Phòng tiện nghi đầy đủ",
                            hotelData?.mostFeature || "Tiện ích cơ bản", 
                            "Dịch vụ chất lượng cao",
                            "Wi-Fi miễn phí",
                            "Dịch vụ phòng 24/7"
                        ] : [
                            "1 giường đôi lớn",
                            "Diện tích phòng: 48 m²",
                            "Hướng Thành phố",
                            "Ban công/sân hiên",
                            "Vòi sen",
                            "Bể bơi riêng",
                            "Bếp nhỏ",
                        ]}
                        cancellationPolicy={isDetailPage ? "Chính sách hủy theo quy định của khách sạn" : "Miễn phí hủy trước 25 tháng 7 2025"}
                        perks={["Bãi đậu xe", "WiFi miễn phí"]}
                        price={isDetailPage ? "Liên hệ" : "513.747 đ"}
                        bookingInfo={isDetailPage ? "Đặt phòng ngay" : "Không thanh toán hôm nay"}
                        additionalInfo={isDetailPage ? [
                            { text: `Điểm đánh giá: ${hotelData?.avgStar?.toFixed(1) || 0}`, highlight: true },
                            { text: "Chất lượng phục vụ tốt!", highlight: false },
                        ] : [
                            { text: "SCUBA DIVING SALE", highlight: true },
                            { text: "Giảm 120000 VND!", highlight: false },
                        ]}
                        hotelId={hotelId}
                        capacity={searchParams.capacity}
                        startDate={searchParams.startDate}
                        endDate={searchParams.endDate}
                    />
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
                    <ReviewTabView hotelId={isDetailPage ? hotelId : null} />
                </div>
            </div>
            <FooterClient />
        </div>
    );
};

export default HotelPage;