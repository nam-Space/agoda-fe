import { Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    clearHotelDetail,
    fetchHotelDetail,
    fetchHotelsByCity,
} from "../../redux/slice/hotelSlide";

import BreadcrumbSection from "components/BreadcrumbSection";
import FooterClient from "components/FooterClient";
import HeaderClient from "components/HeaderClient";
import ActivitySlider from "components/Hotel/ActivitySliderSection";
import ExperienceSection from "components/Hotel/ExperenceSection";
import Facilities from "components/Hotel/Facilities";
import FilterSection from "components/Hotel/FilterSection";
import GallerySection from "components/Hotel/GallerySection";
import HostAndAmenitiesSection from "components/Hotel/HostAndAmenitiesSection";
import HostProfileLink from "components/Hotel/HostProfileLink";
import FlightBookingSection from "components/Hotel/HotelBooking/FlightBookingSection";
import HotelOverviewSection from "components/Hotel/HotelOverviewSection";
import HotelRules from "components/Hotel/HotelRules";
import MapCard from "components/Hotel/MapCard";
import NavigationBar from "components/Hotel/NavigationBar";
import NearbyPlaces from "components/Hotel/NearbyPlaces";
import ReviewTabView from "components/Hotel/ReviewTabView";
import RoomOptionsSection from "components/Hotel/RoomOptionsSection";
import SearchBar from "components/Hotel/SearchBarSection";

import icTable from "../../images/hotel/ic_table.png";
import { callFetchDetailUserHotelInteractionByHotelId } from "config/api";
import { callUpsertUserHotelInteraction } from "config/api";
import { stripHtml } from "utils/renderHtml";

const HotelPage = () => {
    const { hotelSlug } = useParams();
    const dispatch = useAppDispatch();
    const [debugData, setDebugData] = useState(null);
    const [searchParams, setSearchParams] = useState({
        capacity: null,
        startDate: null,
        endDate: null,
        roomsCount: null,
    });
    const [focusDatePicker, setFocusDatePicker] = useState(false);
    const [searchedHotel, setSearchedHotel] = useState(null);
    const [searchedRooms, setSearchedRooms] = useState([]); // ✅ thêm

    const { hotelDetail, isLoadingHotelDetail, error } = useAppSelector(
        (state) => state.hotel
    );
    const { hotels, isLoadingHotels } = useAppSelector((state) => state.hotel);

    const isDetailPage = !!hotelSlug;

    const extractHotelIdFromSlug = (slug) => {
        if (!slug) return null;
        const parts = slug.split("-");
        const lastPart = parts[parts.length - 1];
        return isNaN(lastPart) ? null : parseInt(lastPart);
    };

    const hotelId = extractHotelIdFromSlug(hotelSlug);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x300";
        if (imagePath.startsWith("http")) return imagePath;
        return `${process.env.REACT_APP_BE_URL}${imagePath}`;
    };

    const extractFacilities = (input) => {
        if (!input) return [];

        // Nếu có thẻ HTML thì xử lý kiểu cũ
        if (/<[^>]*>/.test(input)) {
            const matches = input.match(/>([^<]+)</g);
            return matches
                ? matches
                      .map((m) => m.replace(/[><]/g, "").trim())
                      .filter(Boolean)
                : [];
        }

        return input
            .split(",")
            .map((item) => item.trim())
            .filter((text) => text.length > 0);
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
            nearbyLocation: firstHotel.nearbyLocation || "",
            mostFeature: stripHtml(firstHotel.mostFeature) || "",
            withUs: stripHtml(firstHotel.withUs) || "",
            usefulInformation: stripHtml(firstHotel.usefulInformation) || "",
            amenitiesAndFacilities:
                stripHtml(firstHotel.amenitiesAndFacilities) || "",
            locationInfo: stripHtml(firstHotel.locationInfo) || "",
            regulation: firstHotel.regulation || "",
            cityName: firstHotel.city?.name || "",
            city_id: firstHotel.city_id,
            min_price: firstHotel.min_price || 0,
        };
    };

    const handleUpdateTotalClick = async () => {
        const res = await callFetchDetailUserHotelInteractionByHotelId(
            hotelDetail.id
        );
        if (res.isSuccess) {
            const userHotelInteraction = res.data;
            await callUpsertUserHotelInteraction({
                hotel_id: hotelDetail.id,
                click_count: userHotelInteraction.click_count + 1,
                positive_count: userHotelInteraction.positive_count,
                negative_count: userHotelInteraction.negative_count,
                neutral_count: userHotelInteraction.neutral_count,
            });
        } else {
            await callUpsertUserHotelInteraction({
                hotel_id: hotelDetail.id,
                click_count: 1,
                positive_count: 0,
                negative_count: 0,
                neutral_count: 0,
            });
        }
    };

    useEffect(() => {
        if (isDetailPage && hotelId) {
            dispatch(fetchHotelDetail(hotelId));
        } else if (!isDetailPage) {
            dispatch(
                fetchHotelsByCity({
                    cityId: null,
                    currentPage: 1,
                    pageSize: 10,
                    filters: {},
                })
            );
        }
        return () => {
            if (isDetailPage) {
                dispatch(clearHotelDetail());
            }
        };
    }, [dispatch, hotelId, isDetailPage]);

    useEffect(() => {
        if (hotelDetail?.id) {
            handleUpdateTotalClick();
        }
    }, [hotelDetail]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleSearch = ({
        hotelId,
        capacity,
        startDate,
        endDate,
        hotel,
        rooms,
        roomsCount,
    }) => {
        setSearchParams({ capacity, startDate, endDate, roomsCount });

        if (hotel) {
            console.log("Hotel Info:", hotel);
            console.log("Rooms Info:", rooms);
            setDebugData({ hotel, rooms });
        }
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

    const transformedHotel =
        isDetailPage && hotelDetail
            ? {
                  name: hotelDetail.name || "Tên khách sạn",
                  address: hotelDetail.location || "Địa chỉ không có",
                  description: hotelDetail.description || "",
                  images: hotelDetail.images || [],
                  facilities: stripHtml(hotelDetail.facilities).split(","),
                  avgStar: hotelDetail.avg_star || 0,
                  mostFeature: hotelDetail.mostFeature || "",
                  lat: hotelDetail.lat,
                  lng: hotelDetail.lng,
                  cityName: hotelDetail.city?.name || "",
                  city_id: hotelDetail.city_id || null,
                  min_price: hotelDetail.min_price || 0,
                  regulation: hotelDetail.regulation || "",
                  amenitiesAndFacilities:
                      hotelDetail.amenitiesAndFacilities || "",
                  usefulInformation:
                      stripHtml(hotelDetail.usefulInformation) || "",
                  locationInfo: stripHtml(hotelDetail.locationInfo) || "",
                  nearbyLocation: hotelDetail.nearbyLocation || "",
                  withUs: stripHtml(hotelDetail.withUs) || "",
                  room_type: hotelDetail.room_type || "Tiêu chuẩn",
                  rooms: hotelDetail.rooms || [],
                  owner: hotelDetail.owner
                      ? {
                            name:
                                `${hotelDetail.owner.first_name || ""} ${
                                    hotelDetail.owner.last_name || ""
                                }`.trim() || "Chủ nhà chưa cập nhật",
                            avatar: hotelDetail.owner.avatar
                                ? `${process.env.REACT_APP_BE_URL}${hotelDetail.owner.avatar}`
                                : "/images/hotel/ic_avatar.png",
                            email: hotelDetail.owner.email || "Chưa cập nhật",
                            phone:
                                hotelDetail.owner.phone_number ||
                                "Chưa cập nhật",
                            gender: hotelDetail.owner.gender || "Không rõ",
                            birthday:
                                hotelDetail.owner.birthday || "Chưa cập nhật",
                            role: hotelDetail.owner.role || "Không rõ",
                            joinedAt: hotelDetail.owner.date_joined
                                ? new Date(
                                      hotelDetail.owner.date_joined
                                  ).toLocaleDateString("vi-VN")
                                : "Chưa cập nhật",
                        }
                      : null,
              }
            : null;

    const defaultHotelData =
        !isDetailPage && hotels.length > 0
            ? transformHotelListToHotelData(hotels[0])
            : {
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
                      "Phòng xông khô",
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
                  regulation: "Không hút thuốc trong phòng",
              };

    const hotelData = isDetailPage ? transformedHotel : defaultHotelData;

    const breadcrumbs = isDetailPage
        ? [
              { text: "Trang chủ", link: "/", isActive: true },
              { text: "Khách sạn", link: "/hotel", isActive: false },
              ...(transformedHotel?.cityName
                  ? [
                        {
                            text: `Khách sạn ${transformedHotel.cityName}`,
                            link: `/city/${transformedHotel.city_id}`,
                            isActive: false,
                        },
                    ]
                  : []),
              {
                  text: transformedHotel?.name || "Chi tiết khách sạn",
                  link: `/hotel/${hotelId}`,
                  isActive: false,
              },
          ]
        : [
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
        text:
            isDetailPage && transformedHotel?.cityName
                ? `Xem tất cả khách sạn tại ${transformedHotel.cityName}.`
                : "Xem tất cả khách sạn.",
        link:
            isDetailPage && transformedHotel?.cityName
                ? `/city/${transformedHotel.cityName
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                : "/hotel",
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const highlights = hotelData?.mostFeature
        ? stripHtml(hotelData.mostFeature)
              .split(",")
              .map((item) => ({
                  icon: icTable, // icon bạn muốn hiển thị cho mỗi tính năng
                  text: item.trim(),
              }))
        : [];

    const promotionCategories = [
        {
            title: "Tiện ích chính",
            items: hotelData?.facilities?.slice(0, 3) || [
                "Quán cà phê",
                "Dịch vụ phòng",
                "Quán bar",
            ],
        },
        {
            title: "Dịch vụ",
            items: hotelData?.facilities?.slice(3, 6) || [
                "Phòng tập",
                "Phòng xông ướt",
                "Xông khô",
            ],
        },
        {
            title: "Hoạt động",
            items: hotelData?.facilities?.slice(6) || [
                "Bể bơi",
                "CLB trẻ em",
                "Bãi biển",
            ],
        },
        {
            title: "Vị trí",
            items:
                isDetailPage && hotelData?.cityName
                    ? [
                          `Tại ${hotelData.cityName}`,
                          "Gần trung tâm",
                          "Thuận tiện di chuyển",
                      ]
                    : ["Đi bộ đường dài"],
        },
    ];

    return (
        <div className="hotel-page relative">
            <HeaderClient />
            <SearchBar
                onSearch={handleSearch}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                focusDatePicker={focusDatePicker}
                setFocusDatePicker={setFocusDatePicker}
            />
            <BreadcrumbSection
                breadcrumbs={breadcrumbs}
                viewAllLink={viewAllLink}
            />
            {/* </div> */}
            <GallerySection images={hotelData?.images} />
            <NavigationBar
                scrollToSection={scrollToSection}
                hotel={hotelData}
            />
            <div className="w-full max-w-6xl mx-auto px-4">
                <div
                    id="overview"
                    className="section flex flex-col lg:flex-row items-start"
                >
                    <div className="lg:w-2/3">
                        <HotelOverviewSection
                            title={hotelData?.name}
                            address={hotelData?.address}
                            mapLink={
                                hotelData?.lat && hotelData?.lng
                                    ? `https://maps.google.com/?q=${hotelData.lat},${hotelData.lng}`
                                    : "#"
                            }
                            tags={[
                                { text: "Domestic Deal", color: "bg-blue-600" },
                                {
                                    text: isDetailPage
                                        ? `${
                                              hotelData?.avgStar?.toFixed(1) ||
                                              0
                                          } sao`
                                        : "SCUBA DIVING SALE",
                                    color: isDetailPage
                                        ? "bg-yellow-500"
                                        : "bg-purple-600",
                                },
                                { text: "Căn hộ", color: "bg-green-600" },
                            ]}
                            highlights={highlights}
                            roomDetails={
                                isDetailPage
                                    ? []
                                    : [
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
                                      ]
                            }
                            promotionTitle={
                                isDetailPage
                                    ? "Tiện ích và dịch vụ"
                                    : "Đang có khuyến mãi kỳ nghỉ ngắn"
                            }
                            promotionCategories={promotionCategories}
                            facilities={hotelData?.facilities || []}
                            aboutText={hotelData?.withUs}
                            aboutLink="#"
                            hotSaleText={
                                isDetailPage
                                    ? "Phòng ở đây đang được quan tâm!"
                                    : "Phòng ở đây đang bán rất chạy!"
                            }
                            hotSaleCount={
                                isDetailPage
                                    ? "Nhiều du khách đã xem hôm nay."
                                    : "8 du khách đã đặt hôm nay."
                            }
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
                            <HostProfileLink host={hotelData?.owner} />
                        </div>
                    </div>
                </div>
                <div id="rooms" className="section mt-5">
                    <FilterSection hotelId={hotelId} />
                    {isDetailPage && (
                        <div className="section mt-3">
                            <RoomOptionsSection
                                title={`Phòng tại ${hotelData?.name || ""}`}
                                room_type={`Phòng tiêu chuẩn ${
                                    hotelData?.room_type || ""
                                }`}
                                roomImage={getImageUrl(
                                    hotelData?.images?.[0]?.image
                                )}
                                roomDetails={[
                                    "Phòng tiện nghi đầy đủ",
                                    hotelData?.mostFeature || "Tiện ích cơ bản",
                                    "Dịch vụ chất lượng cao",
                                    "Wi-Fi miễn phí",
                                    "Dịch vụ phòng 24/7",
                                ]}
                                cancellationPolicy="Chính sách hủy theo quy định của khách sạn"
                                perks={["Bãi đậu xe", "WiFi miễn phí"]}
                                price="Liên hệ"
                                bookingInfo="Đặt phòng ngay"
                                additionalInfo={[
                                    {
                                        text: `Điểm đánh giá: ${
                                            hotelData?.avgStar?.toFixed(1) || 0
                                        }`,
                                        highlight: true,
                                    },
                                    {
                                        text: "Chất lượng phục vụ tốt!",
                                        highlight: false,
                                    },
                                ]}
                                hotelId={hotelId}
                                capacity={searchParams.capacity}
                                startDate={searchParams.startDate}
                                endDate={searchParams.endDate}
                                roomsCount={searchParams.roomsCount}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                                focusDatePicker={focusDatePicker}
                                setFocusDatePicker={setFocusDatePicker}
                            />
                        </div>
                    )}
                </div>
                <div id="activity" className="section mt-5">
                    <ActivitySlider
                        cityId={hotelData?.city_id}
                        cityName={hotelData?.cityName}
                    />
                </div>

                <div id="host" className="section mt-5">
                    <HostAndAmenitiesSection />
                </div>
                <div id="facilities" className="section mt-5">
                    <ExperienceSection hotelData={hotelData} />
                </div>

                <div id="facilities-ami" className="section mt-5">
                    <Facilities
                        facilitiesString={hotelData?.amenitiesAndFacilities}
                        usefulInformation={hotelData?.usefulInformation}
                        withUs={hotelData?.withUs}
                    />
                </div>
                <div id="nearby" className="section mt-5">
                    {hotelDetail && hotelDetail.nearbyLocation && (
                        <NearbyPlaces
                            locations={stripHtml(hotelDetail.nearbyLocation)
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean)}
                        />
                    )}
                </div>

                <div id="rules" className="section mt-5">
                    {hotelData ? (
                        <HotelRules regulation={hotelData.regulation} />
                    ) : (
                        "Loading..."
                    )}
                </div>

                <div id="policy" className="section mt-5">
                    <FlightBookingSection />
                </div>
                <div id="reviews" className="section mt-5">
                    <ReviewTabView hotelId={isDetailPage ? hotelId : null} />
                </div>
            </div>
            <FooterClient />
            {focusDatePicker && (
                <div className="absolute bg-[rgba(0,0,0,0.4)] z-[4] top-0 left-0 right-0 bottom-0"></div>
            )}
        </div>
    );
};

export default HotelPage;
