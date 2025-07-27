"use client";

import { useCallback, useState } from "react";
import {
    DatePicker,
    Select,
    Button,
    Card,
    Rate,
    Tag,
    Input,
    Divider,
    Badge,
    InputNumber,
    Checkbox,
} from "antd";
import {
    SearchOutlined,
    UserOutlined,
    CalendarOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ShieldCheckOutlined,
    CreditCardOutlined,
    MinusOutlined,
    PlusOutlined,
    HeartOutlined,
    CarryOutOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import visaImg from "../../images/booking-vehicles/payment/visa.png";
import paypalImg from "../../images/booking-vehicles/payment/paypal.png";
import masterCardImg from "../../images/booking-vehicles/payment/mastercard.png";
import maestroImg from "../../images/booking-vehicles/payment/maestro.png";
import applePayImg from "../../images/booking-vehicles/payment/apple-pay.png";
import googlePayImg from "../../images/booking-vehicles/payment/google-pay.png";
import alipayImg from "../../images/booking-vehicles/payment/alipay.png";
import idealImg from "../../images/booking-vehicles/payment/ideal.png";
import discovercardImg from "../../images/booking-vehicles/payment/discovercard.png";
import dinersclubImg from "../../images/booking-vehicles/payment/dinersclub.png";
import amexImg from "../../images/booking-vehicles/payment/amex.png";
import madaImg from "../../images/booking-vehicles/payment/mada.png";
import markerImg from "../../images/booking-vehicles/google-map/marker.webp";

import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { IoAirplaneOutline, IoLocationOutline } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi2";
import { Link } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;

const vehicleData = [
    {
        id: 1,
        name: "Xe sedan",
        description: "Toyota Vios, Nissan Sunny, Kia Soluto hoặc tương tự",
        price: "403.176",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.5,
        passengers: 4,
        luggage: 2,
        category: "Superb",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 2,
        name: "Xe sedan hạng phổ thông",
        description: "Toyota Vios, Nissan Sunny hoặc tương tự",
        price: "403.176",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.1,
        passengers: 4,
        luggage: 2,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 3,
        name: "Xe minivan",
        description:
            "Toyota Hiace, Mercedes-Benz Vito, Peugeot Traveller hoặc tương tự",
        price: "450.132",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.1,
        passengers: 8,
        luggage: 4,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 4,
        name: "Xe ôtô điện tiêu chuẩn 🔋",
        description: "VinFast VF5 hoặc Toyota Prius hoặc tương tự",
        price: "542.578",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.1,
        passengers: 4,
        luggage: 2,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 5,
        name: "Minibus",
        description:
            "Toyota Hiace, Mercedes-Benz Vito, Buick GL8 hoặc tương tự",
        price: "669.947",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.0,
        passengers: 10,
        luggage: 6,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 6,
        name: "Xe buýt",
        description: "Mercedes-Benz Sprinter hoặc Iveco Daily hoặc tương tự",
        price: "776.773",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.0,
        passengers: 16,
        luggage: 8,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 7,
        name: "Xe ôtô điện cao cấp 🔋",
        description: "Tesla Model 3, Tesla Model Y, MG 5 hoặc tương tự",
        price: "794.968",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.1,
        passengers: 4,
        luggage: 2,
        category: "Exceptional",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
    {
        id: 8,
        name: "Xe sedan thương mại",
        description:
            "Mercedes-Benz E-klasse AMG, Lexus IS, Volvo Model 3 hoặc Tesla Model 3, Tesla Model Y, MG 5 hoặc tương tự",
        price: "1.870.563",
        image: "https://agoda.transferz.com/transferz/vehicles/SEDAN.jpg",
        rating: 4.1,
        passengers: 4,
        luggage: 2,
        category: "Superb",
        features: ["Ăn phụ thu miễn phí", "Bảo hiểm Giao gỡ & Chủ hộ miễn phí"],
    },
];

export default function BookingVehicles() {
    const [selectedItem, setSelectedItem] = useState(vehicleData[0]);
    const [openExtra, setOpenExtra] = useState(false);
    const [extras, setExtras] = useState({
        childSeat: 0,
        boosterSeat: 0,
        additionalStop: false,
        pets: false,
        specialLuggage: false,
    });

    const lat1 = 21.211; // Tọa độ của Noi Bai Airport (Hà Nội)
    const long1 = 105.797;

    const lat2 = 21.019; // Tọa độ của Mỹ Đình
    const long2 = 105.7583;

    // Tính toán trung tâm của hai địa điểm
    const center = [(lat1 + lat2) / 2, (long1 + long2) / 2];

    // Tính khoảng cách giữa hai địa điểm (sử dụng công thức Haversine)
    const toRad = (deg) => deg * (Math.PI / 180);
    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // bán kính trái đất (km)
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // khoảng cách tính bằng km
    };

    // Tính khoảng cách giữa hai địa điểm
    const distance = haversine(lat1, long1, lat2, long2);

    // Quyết định mức zoom dựa trên khoảng cách
    let zoomLevel;
    if (distance < 100) {
        zoomLevel = 10; // Gần nhau
    } else if (distance < 500) {
        zoomLevel = 8; // Khoảng cách vừa
    } else if (distance < 1500) {
        zoomLevel = 5; // Xa nhau, zoom thấp
    } else {
        zoomLevel = 3; // Cách xa nhau nhiều, zoom thấp
    }

    const paymentMethods = [
        {
            img: visaImg,
            name: "Visa",
        },
        {
            img: paypalImg,
            name: "Paypal",
        },
        {
            img: masterCardImg,
            name: "Master Card",
        },
        {
            img: maestroImg,
            name: "Maestro",
        },
        {
            img: applePayImg,
            name: "Apple Pay",
        },
        {
            img: googlePayImg,
            name: "Google Pay",
        },
        {
            img: alipayImg,
            name: "Alipay",
        },
        {
            img: idealImg,
            name: "Ideal",
        },
        {
            img: discovercardImg,
            name: "Discover Card",
        },
        {
            img: dinersclubImg,
            name: "Dinersclub",
        },
        {
            img: amexImg,
            name: "Amex",
        },
        {
            img: madaImg,
            name: "Mada",
        },
    ];

    const getCategoryColor = (category) => {
        switch (category) {
            case "Superb":
                return "green";
            case "Exceptional":
                return "blue";
            default:
                return "default";
        }
    };

    const handleExtrasChange = (key, value) => {
        setExtras((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const incrementQuantity = (key) => {
        setExtras((prev) => ({
            ...prev,
            [key]: Math.max(0, prev[key] + 1),
        }));
    };

    const decrementQuantity = (key) => {
        setExtras((prev) => ({
            ...prev,
            [key]: Math.max(0, prev[key] - 1),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Map and Trip Details */}
                    <div className="lg:col-span-1">
                        <Card className="mb-4">
                            <MapContainer
                                center={center}
                                zoom={zoomLevel}
                                className="w-full h-[300px]"
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MarkerClusterGroup chunkedLoading>
                                    <Marker
                                        position={[lat1, long1]}
                                        icon={
                                            new Icon({
                                                iconUrl: markerImg,
                                                iconSize: [38, 38],
                                            })
                                        }
                                        title="Noi Bai International Airport (HAN)"
                                    >
                                        <Popup>
                                            Noi Bai International Airport (HAN)
                                        </Popup>
                                    </Marker>
                                    <Marker
                                        position={[lat2, long2]}
                                        icon={
                                            new Icon({
                                                iconUrl: markerImg,
                                                iconSize: [38, 38],
                                            })
                                        }
                                        title="BT Homestay 120 Phu My - My Dinh"
                                    >
                                        <Popup>
                                            BT Homestay 120 Phu My - My Dinh
                                        </Popup>
                                    </Marker>
                                </MarkerClusterGroup>
                            </MapContainer>
                        </Card>

                        {/* Trip Details */}
                        <Card title="Chuyến đi của bạn" className="mb-4">
                            <div className="space-y-3">
                                <div>
                                    <div className="font-medium">
                                        Noi Bai International Airport (HAN)
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Bà hạ, 28 tháng 7 năm 2025, 13:00
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        Thời gian đi lấy: 3 phút
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium">
                                        BT Homestay 120 Phố Mỹ - Mỹ Đình
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <UserOutlined />
                                        <span>2 Hành khách</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined />
                                        <span>2 Ngày</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Search and Vehicle List */}
                    <div className="lg:col-span-2">
                        {/* Search Form */}
                        <Card className="mb-6">
                            <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                                <Input
                                    placeholder="Sân bay đón khách"
                                    size="large"
                                    prefix={
                                        <IoAirplaneOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                />
                                <Input
                                    placeholder="Địa điểm đến"
                                    size="large"
                                    prefix={
                                        <IoLocationOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                />
                            </div>
                            <div className="mt-[12px] grid grid-cols-3 gap-[12px]">
                                <DatePicker
                                    showTime
                                    onChange={(value, dateString) => {
                                        console.log("Selected Time: ", value);
                                        console.log(
                                            "Formatted Selected Time: ",
                                            dateString
                                        );
                                    }}
                                    onOk={(val) => {
                                        console.log(val);
                                    }}
                                />
                                <InputNumber
                                    addonBefore={<span>Người lớn</span>}
                                    prefix={
                                        <HiOutlineUsers className="text-[22px]" />
                                    }
                                    style={{ width: "100%", height: "100%" }}
                                />
                                <div className="text-center text-white bg-[#5392f9] text-[20px] rounded-[8px] cursor-pointer">
                                    Tìm
                                </div>
                            </div>
                        </Card>

                        {/* Vehicle Selection Header */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Chọn loại xe mong muốn
                            </h2>
                            <div className="flex space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span>Hủy chuyến miễn phí</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>Cập nhật chuyến bay</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    <span>Hỗ trợ khách hàng 24/7</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle List */}
                        <div className="space-y-4">
                            {vehicleData.map((vehicle) => (
                                <Card
                                    key={vehicle.id}
                                    onClick={() => setSelectedItem(vehicle)}
                                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                                        selectedItem.id === vehicle.id
                                            ? "border-blue-500 border-2"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-24 h-16 relative">
                                                <img
                                                    src={vehicle.image}
                                                    alt={vehicle.name}
                                                    fill
                                                    className="object-cover w-full"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-medium text-lg">
                                                        {vehicle.name}
                                                    </h3>
                                                    {vehicle.highlighted && (
                                                        <Badge
                                                            count="Được đề xuất"
                                                            className="bg-blue-500"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {vehicle.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <Tag
                                                        color={getCategoryColor(
                                                            vehicle.category
                                                        )}
                                                    >
                                                        {vehicle.category}
                                                    </Tag>
                                                    <div className="flex items-center space-x-1">
                                                        <Rate
                                                            disabled
                                                            defaultValue={
                                                                vehicle.rating
                                                            }
                                                            size="small"
                                                        />
                                                        <span>
                                                            {vehicle.rating}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center space-x-1">
                                                            <UserOutlined />
                                                            <span>
                                                                Tối đa{" "}
                                                                {
                                                                    vehicle.passengers
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <CarOutlined />
                                                            <span>
                                                                Tối đa{" "}
                                                                {
                                                                    vehicle.luggage
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 space-y-1">
                                                    {vehicle.features.map(
                                                        (feature, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center space-x-1 text-sm text-green-600"
                                                            >
                                                                <CheckCircleOutlined />
                                                                <span>
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold w-max">
                                                {vehicle.price} ₫
                                            </div>
                                            {/* <Button
                                                type="primary"
                                                className="mt-2 bg-blue-500"
                                            >
                                                Chọn
                                            </Button> */}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Extra Services */}
                        <Card className="mt-6">
                            {openExtra ? (
                                <div className="space-y-4">
                                    {/* Welcome and Pickup - Free */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <TeamOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Chào đón và đưa đón
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    Bao gồm miễn phí
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                            <CheckCircleOutlined className="text-white text-sm" />
                                        </div>
                                    </div>

                                    {/* Child Seat */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <UserOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Chỗ ngồi cho trẻ em
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    293.477 ₫
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="small"
                                                disabled={
                                                    extras.childSeat === 0
                                                }
                                                onClick={() =>
                                                    decrementQuantity(
                                                        "childSeat"
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center"
                                            >
                                                <MinusOutlined />
                                            </Button>
                                            <div className="w-12 h-8 border rounded flex items-center justify-center bg-white">
                                                {extras.childSeat}
                                            </div>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    incrementQuantity(
                                                        "childSeat"
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center"
                                            >
                                                <PlusOutlined />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Booster Seat */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <CarOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Ghế nâng
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    293.477 ₫
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="small"
                                                disabled={
                                                    extras.boosterSeat === 0
                                                }
                                                onClick={() =>
                                                    decrementQuantity(
                                                        "boosterSeat"
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center"
                                            >
                                                <MinusOutlined />
                                            </Button>
                                            <div className="w-12 h-8 border rounded flex items-center justify-center bg-white">
                                                {extras.boosterSeat}
                                            </div>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    incrementQuantity(
                                                        "boosterSeat"
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center"
                                            >
                                                <PlusOutlined />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Additional Stop */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <PlusOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Điểm dừng thêm
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    146.739 ₫
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={extras.additionalStop}
                                            onChange={(e) =>
                                                handleExtrasChange(
                                                    "additionalStop",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Pets */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <HeartOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Vật nuôi
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    146.739 ₫
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={extras.pets}
                                            onChange={(e) =>
                                                handleExtrasChange(
                                                    "pets",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Special Luggage */}
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                <CarryOutOutlined className="text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    Hành lý đặc biệt
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    146.739 ₫
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={extras.specialLuggage}
                                            onChange={(e) =>
                                                handleExtrasChange(
                                                    "specialLuggage",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between rounded-[8px] p-[16px] bg-[#e6f4f8]">
                                    <div className="flex items-center gap-[4px]">
                                        <BsFillLightningChargeFill className="text-[#0083A8] text-[20px]" />
                                        Do you need extras like a child seat or
                                        special luggage? We got you covered!
                                    </div>
                                    <Button
                                        type="link"
                                        className="px-0"
                                        onClick={() => setOpenExtra(true)}
                                    >
                                        <span className="text-[#0083a8]">
                                            Add extras
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </Card>

                        {/* Continue Button */}
                        <div className="mt-6 text-right">
                            <Link to={"/booking-contact-information"}>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-purple-600 px-8"
                                >
                                    Continue →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Features */}
                <div className="mt-12 grid grid-cols-1 gap-8">
                    {/* Free Cancellation */}
                    <Card>
                        <div className="flex items-start space-x-3">
                            <div className="w-[50px] h-[50px] bg-green-100 rounded-[50%] flex items-center justify-center">
                                <MdOutlineFreeCancellation className="text-green-600 text-[24px]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Free cancellation
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Book today, have peace of mind! You can
                                    cancel your reservation for free up to 24
                                    hours before your pickup time and get a full
                                    refund.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Easy Payment */}
                    <Card>
                        <div className="flex items-start space-x-3">
                            <div className="w-[50px] h-[50px] bg-blue-100 rounded-[50%] flex items-center justify-center">
                                <CreditCardOutlined className="text-blue-600 text-[24px]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Easy and reliable payment
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span>Confirmed immediately</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span>
                                            No surprise costs - all fees and
                                            taxes included
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span>
                                            Secure payment by credit card, Apple
                                            Pay, Google Pay, PayPal and more
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {paymentMethods.map((item, index) => (
                                        <img
                                            key={index}
                                            className="h-5"
                                            src={item.img}
                                            alt={item.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
