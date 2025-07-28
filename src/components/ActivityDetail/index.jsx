import { useState } from "react";
import {
    Input,
    Button,
    Card,
    Select,
    Rate,
    Badge,
    Breadcrumb,
    Avatar,
    Dropdown,
    Menu,
    Divider,
    Calendar,
    Collapse,
    Typography,
    Tag,
} from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    BellOutlined,
    DownOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    PlusOutlined,
    MinusOutlined,
    HeartOutlined,
    UpOutlined,
} from "@ant-design/icons";
import {
    FaMapMarkerAlt,
    FaClock,
    FaTicketAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import dayjs from "dayjs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosStar } from "react-icons/io";
import { BsLightningChargeFill } from "react-icons/bs";

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Text, Link } = Typography;

export default function ActivityDetail() {
    const ticketOptions = [
        {
            id: 1,
            name: "Vé Công Viên Rồng",
            originalPrice: "316.080",
            salePrice: "316.080",
            discount: "339.142,00",
        },
        {
            id: 2,
            name: "Vé Cáp Treo Nữ Hoàng",
            originalPrice: "344.665",
            salePrice: "344.665",
            discount: "339.142,00",
        },
        {
            id: 3,
            name: "Combo Vé Công Viên Nước + Công Viên Rồng",
            originalPrice: "456.243",
            salePrice: "456.243",
            discount: "339.142,00",
        },
        {
            id: 4,
            name: "Combo Vé Cáp Treo + Công Viên Nước + Công Viên Rồng",
            originalPrice: "548.922",
            salePrice: "548.922",
            discount: "339.142,00",
        },
    ];

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [adultTickets, setAdultTickets] = useState(1);
    const [childTickets, setChildTickets] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedTickerOption, setSelectedTickerOption] = useState(
        ticketOptions[0]
    );

    const relatedActivities = [
        {
            id: 1,
            name: "Sun World Halong Admission Ticket",
            rating: 4.5,
            reviews: 1263,
            originalPrice: "298.013",
            salePrice: "298.013",
            image: "https://image.kkday.com/v2/image/get/w_960,c_fit,q_55,wm_auto/s1.kkday.com/product_100416/20250725101629_Z4sWB/png",
            badge: "Bán chạy nhất",
        },
        {
            id: 2,
            name: "Yoko Onsen Quang Hanh Mineral Bath Ticket",
            rating: 5.0,
            reviews: 1263,
            originalPrice: "501.409",
            salePrice: "501.409",
            image: "https://image.kkday.com/v2/image/get/w_960,c_fit,q_55,wm_auto/s1.kkday.com/product_100416/20250725101629_Z4sWB/png",
            badge: "Giảm 15%",
        },
        {
            id: 3,
            name: "Vé Ngày Tham Quan Vịnh Hạ Long, Sông Sốt & Ti...",
            originalPrice: "497.971",
            salePrice: "497.971",
            image: "https://image.kkday.com/v2/image/get/w_960,c_fit,q_55,wm_auto/s1.kkday.com/product_100416/20250725101629_Z4sWB/png",
            badge: "Giảm 5%",
        },
    ];

    const [activeKey, setActiveKey] = useState(["1"]);

    const handleChange = (key) => {
        setActiveKey(key);
    };

    const customExpandIcon = ({ isActive }) => (
        <div className="flex items-center justify-center w-6 h-6">
            {isActive ? (
                <UpOutlined className="text-gray-600 text-sm" />
            ) : (
                <DownOutlined className="text-gray-600 text-sm" />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ Hoạt động</Breadcrumb.Item>
                    <Breadcrumb.Item>Hạ Long</Breadcrumb.Item>
                    <Breadcrumb.Item>Điểm tham quan</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Vé Sun World Hạ Long Quảng Ninh
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Title and Badges */}
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Badge
                                    count="Bán chạy nhất"
                                    style={{ backgroundColor: "#52c41a" }}
                                />
                                <Badge
                                    count="Xác nhận tức thì"
                                    style={{ backgroundColor: "#1890ff" }}
                                />
                                <Badge
                                    count="Hủy miễn phí trong ngày"
                                    style={{ backgroundColor: "#722ed1" }}
                                />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">
                                Vé Sun World Hạ Long Quảng Ninh
                            </h1>
                            <p className="text-gray-600">1001 người đã đặt</p>
                        </div>

                        {/* Main Image */}
                        <div className="mb-6">
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <img
                                    src="https://r-xx.bstatic.com/xdata/images/xphoto/800x800/186620062.jpg?k=20fdd96841afb43a88ed84ec3dec0114aa5ef4b07dddb7f60d3fdb4675dee789&o="
                                    alt="Sun World Ha Long"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Quick Info */}
                        <Card className="mb-6">
                            <h3 className="font-semibold mb-3 flex items-center">
                                <EnvironmentOutlined className="mr-2" />
                                Thông tin nhanh
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <FaMapMarkerAlt className="text-gray-500" />
                                <span className="text-sm">Không hoàn tiền</span>
                            </div>
                            <ul className="text-sm space-y-1 mb-4">
                                <li>
                                    • Buổi vào thể giới của những chuyến đi đầy
                                    vui tâm nghiệm miễn vui tại Khu Vui Chơi Sun
                                    World Hạ Long
                                </li>
                                <li>
                                    • Ngắm nhìn toàn cảnh vịnh Hạ Long và Vịnh
                                    Hạ Long từ trên cao với hệ thống Cáp treo
                                    hiện đại nhất tại Việt Nam
                                </li>
                            </ul>
                            <Button type="link" className="p-0">
                                Đọc thêm
                            </Button>
                        </Card>

                        {/* Ticket Selection Tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-4 mb-4 border-b">
                                <button className="pb-2 border-b-2 border-blue-500 text-blue-500 font-medium">
                                    Các lựa chọn gói
                                </button>
                                <button className="pb-2 text-gray-500">
                                    Ngày & giờ khởi hành và vé trở
                                </button>
                                <button className="pb-2 text-gray-500">
                                    Thông tin thêm
                                </button>
                                <button className="pb-2 text-gray-500">
                                    Chính sách hủy
                                </button>
                                <button className="pb-2 text-gray-500">
                                    Câu hỏi thường gặp
                                </button>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">
                                    Các lựa chọn gói
                                </h4>
                                <Calendar
                                    onPanelChange={(val, mode) => {
                                        console.log(val, mode);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Ticket Options */}
                        <div className="space-y-4">
                            {ticketOptions.map((ticket) => (
                                <Card
                                    key={ticket.id}
                                    className={`hover:shadow-md cursor-pointer ${
                                        selectedTickerOption.id === ticket.id
                                            ? "border border-[2px] border-blue-500"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedTickerOption(ticket)
                                    }
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium mb-1 text-[24px]">
                                                    {ticket.name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-blue-500 font-semibold">
                                                    Xem chi tiết
                                                    <MdOutlineKeyboardArrowRight className="text-[22px]" />
                                                </div>
                                            </div>

                                            {selectedTickerOption.id !==
                                                ticket.id && (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-500 line-through">
                                                            {ticket.discount} ₫
                                                        </p>
                                                        <div className="flex items-center">
                                                            <span className="text-red-600 font-semibold text-[22px]">
                                                                {
                                                                    ticket.salePrice
                                                                }{" "}
                                                                ₫
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="large"
                                                        className="bg-white text-[#2067da] border-[#050a0f69] rounded-full h-12 font-medium"
                                                        onClick={() => {}}
                                                    >
                                                        Chọn
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedTickerOption.id === ticket.id && (
                                        <div>
                                            <Divider className="my-4" />

                                            {/* Calendar */}
                                            <div className="flex justify-between gap-[30px]">
                                                <div className="w-[300px]">
                                                    <span>Chọn ngày</span>
                                                    <Calendar
                                                        fullscreen={false}
                                                        onPanelChange={(
                                                            val,
                                                            mode
                                                        ) => {
                                                            console.log(
                                                                val,
                                                                mode
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                {/* Guest Selection */}
                                                <div className="space-y-3 flex-1">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span>
                                                                Du khách
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 mb-2">
                                                            Trẻ nhỏ: 1 người từ
                                                            4-11 tuổi
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span>
                                                            Người lớn (từ tuổi
                                                            0-99)
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                size="small"
                                                                disabled={
                                                                    adultTickets <=
                                                                    0
                                                                }
                                                                onClick={() =>
                                                                    setAdultTickets(
                                                                        Math.max(
                                                                            0,
                                                                            adultTickets -
                                                                                1
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                <MinusOutlined />
                                                            </Button>
                                                            <span className="w-8 text-center">
                                                                {adultTickets}
                                                            </span>
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    setAdultTickets(
                                                                        adultTickets +
                                                                            1
                                                                    )
                                                                }
                                                            >
                                                                <PlusOutlined />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span>
                                                            Trẻ em (từ tuổi
                                                            0-99)
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                size="small"
                                                                disabled={
                                                                    childTickets <=
                                                                    0
                                                                }
                                                                onClick={() =>
                                                                    setChildTickets(
                                                                        Math.max(
                                                                            0,
                                                                            childTickets -
                                                                                1
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                <MinusOutlined />
                                                            </Button>
                                                            <span className="w-8 text-center">
                                                                {childTickets}
                                                            </span>
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    setChildTickets(
                                                                        childTickets +
                                                                            1
                                                                    )
                                                                }
                                                            >
                                                                <PlusOutlined />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Divider className="my-4" />
                                            <div className="flex justify-between">
                                                <div className="text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1 mb-1">
                                                        <FaClock />
                                                        <span>
                                                            Giá hiển thị bằng
                                                            VND
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FaTicketAlt />
                                                        <span>
                                                            Giá trên áp dụng cho
                                                            số người tối thiểu
                                                            mà đơn đặt chỗ này
                                                            yêu cầu
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <p className="text-sm text-gray-500 line-through">
                                                        {ticket.discount} ₫
                                                    </p>
                                                    <div className="flex items-center">
                                                        <span className="text-red-600 font-semibold text-[22px]">
                                                            {ticket.salePrice} ₫
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end items-center gap-3">
                                                <Button
                                                    size="large"
                                                    className="bg-white text-[#2067da] border-[#050a0f69] rounded-full h-12 font-medium"
                                                    onClick={() => {}}
                                                >
                                                    Thêm vào xe đẩy hàng
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-full h-12 font-medium"
                                                    onClick={() => {}}
                                                >
                                                    Cập nhật giá
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        {/* Related Activities */}
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold mb-6">
                                Các hoạt động hấp dẫn khác tại Hạ Long
                            </h3>
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={8}
                                navigation={true}
                                modules={[Navigation]}
                            >
                                {new Array(15).fill(0).map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="rounded-[16px] overflow-hidden border-[1px] border-[#d5d9e2] hover:shadow-[rgba(4,7,10,0.24)_0px_4px_10px_0px] transition-all duration-200">
                                            <img
                                                src="https://q-xx.bstatic.com/xdata/images/xphoto/2500x1600/227832255.jpg?k=386d20ee8736141176d14c1754c924ae102b3b1ce9a6059115f388f1038f2ef8&o="
                                                className="w-full h-[170px] object-cover"
                                            />
                                            <div className="pt-[12px] px-[16px] pb-[16px]">
                                                <p className="font-semibold text-[20px] leading-[24px] line-clamp-2">
                                                    Da Nang Airport Transfer to
                                                    Da Nang Hotel by Private Car
                                                </p>
                                                <div className="flex items-center gap-[4px]">
                                                    <IoIosStar className="text-[#b54c01] text-[12px]" />
                                                    <p className="font-semibold">
                                                        5
                                                    </p>
                                                    <p className="text-[13px] text-[#5e6b82]">
                                                        (49)
                                                    </p>
                                                    <p className="text-[#5e6b82]">
                                                        •
                                                    </p>
                                                    <p className="text-[13px] text-[#5e6b82]">
                                                        298 người đã đặt
                                                    </p>
                                                </div>
                                                <div className="flex items-center mt-[4px]">
                                                    <Tag
                                                        color="blue"
                                                        className="p-[4px]"
                                                    >
                                                        <BsLightningChargeFill className="text-[14px]" />
                                                    </Tag>
                                                    <Tag
                                                        color="blue"
                                                        className="p-[4px] text-[13px] leading-[14px]"
                                                    >
                                                        Hủy miễn phí
                                                    </Tag>
                                                </div>
                                                <div className="flex justify-end mt-[52px]">
                                                    <Tag
                                                        color="#c53829"
                                                        className="p-[4px] text-[13px] leading-[14px] mr-0"
                                                    >
                                                        Giảm 5%
                                                    </Tag>
                                                </div>
                                                <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                                    <p className="text-[13px] text-end line-through">
                                                        678.497 ₫
                                                    </p>
                                                    <div className="flex items-center justify-end gap-[8px]">
                                                        <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                            540.762
                                                        </p>
                                                        <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                            ₫
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <Collapse
                            activeKey={activeKey}
                            onChange={handleChange}
                            expandIcon={customExpandIcon}
                            expandIconPosition="end"
                            ghost
                            className="booking-info-accordion"
                        >
                            {/* Departure and Return Times */}
                            <Panel
                                header={
                                    <div className="text-base font-medium text-gray-900">
                                        Ngày & giờ khởi hành và trở về
                                    </div>
                                }
                                key="1"
                                className="border-b border-gray-200"
                            >
                                <div className="pb-4 space-y-4 px-[36px]">
                                    {/* Departure Point */}
                                    <div>
                                        <Text className="text-blue-600 font-medium block mb-2">
                                            Điểm xuất phát
                                        </Text>
                                        <div className="ml-4">
                                            <Text strong className="block mb-1">
                                                Địa chỉ
                                            </Text>
                                            <ul className="list-disc list-inside ml-4">
                                                <li className="text-gray-700">
                                                    <Link
                                                        href="#"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Sun World Ha Long
                                                        Complex
                                                    </Link>
                                                </li>
                                            </ul>
                                            <Text className="text-gray-600 ml-6 block mt-1">
                                                Bãi Cháy, Hạ Long, Quảng Ninh
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Return Point */}
                                    <div>
                                        <Text className="text-blue-600 font-medium block mb-2">
                                            Điểm trả khách
                                        </Text>
                                        <div className="ml-4">
                                            <Text className="text-gray-600">
                                                Xin lỗi, thông tin này không có
                                                sẵn
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Panel>

                            {/* Additional Information */}
                            <Panel
                                header={
                                    <div className="text-base font-medium text-gray-900">
                                        Thông tin thêm
                                    </div>
                                }
                                key="2"
                                className="border-b border-gray-200"
                            >
                                <div className="pb-4 space-y-3 px-[36px]">
                                    <div>
                                        <Text strong className="block mb-2">
                                            Thông tin quan trọng:
                                        </Text>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>
                                                • Vé có hiệu lực trong ngày được
                                                chọn
                                            </li>
                                            <li>
                                                • Trẻ em dưới 1m được miễn phí
                                                vé (cần có người lớn đi cùng)
                                            </li>
                                            <li>
                                                • Trẻ em từ 1m - 1.4m được giảm
                                                giá vé
                                            </li>
                                            <li>
                                                • Vui lòng mang theo giấy tờ tùy
                                                thân khi tham quan
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <Text strong className="block mb-2">
                                            Tiện ích:
                                        </Text>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Bãi đỗ xe miễn phí</li>
                                            <li>• Nhà vệ sinh công cộng</li>
                                            <li>• Khu vực ăn uống</li>
                                            <li>• Cửa hàng lưu niệm</li>
                                        </ul>
                                    </div>
                                </div>
                            </Panel>

                            {/* Cancellation Policy */}
                            <Panel
                                header={
                                    <div className="text-base font-medium text-gray-900">
                                        Chính sách hủy
                                    </div>
                                }
                                key="3"
                                className="border-b border-gray-200"
                            >
                                <div className="pb-4 space-y-3 px-[36px]">
                                    <div>
                                        <Text
                                            strong
                                            className="block mb-2 text-green-600"
                                        >
                                            Hủy miễn phí:
                                        </Text>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>
                                                • Hủy trước 24 giờ: Hoàn tiền
                                                100%
                                            </li>
                                            <li>
                                                • Hủy trước 12 giờ: Hoàn tiền
                                                50%
                                            </li>
                                            <li>
                                                • Hủy trong vòng 12 giờ: Không
                                                hoàn tiền
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <Text
                                            strong
                                            className="block mb-2 text-orange-600"
                                        >
                                            Lưu ý:
                                        </Text>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>
                                                • Thời gian tính theo múi giờ
                                                Việt Nam (GMT+7)
                                            </li>
                                            <li>
                                                • Phí hoàn tiền sẽ được xử lý
                                                trong 3-5 ngày làm việc
                                            </li>
                                            <li>
                                                • Vé đã sử dụng không thể hủy
                                                hoặc hoàn tiền
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Panel>

                            {/* FAQ */}
                            <Panel
                                header={
                                    <div className="text-base font-medium text-gray-900">
                                        Câu hỏi thường gặp
                                    </div>
                                }
                                key="4"
                                className="border-b border-gray-200"
                            >
                                <div className="pb-4 space-y-4 px-[36px]">
                                    <div>
                                        <Text strong className="block mb-2">
                                            Q: Vé có thể sử dụng vào ngày khác
                                            không?
                                        </Text>
                                        <Text className="text-gray-700 block ml-4">
                                            A: Vé chỉ có hiệu lực trong ngày
                                            được chọn khi đặt. Nếu muốn thay đổi
                                            ngày, bạn cần hủy vé hiện tại và đặt
                                            vé mới.
                                        </Text>
                                    </div>

                                    <div>
                                        <Text strong className="block mb-2">
                                            Q: Có cần đặt vé trước hay có thể
                                            mua tại chỗ?
                                        </Text>
                                        <Text className="text-gray-700 block ml-4">
                                            A: Khuyến khích đặt vé trước để đảm
                                            bảo có chỗ, đặc biệt vào cuối tuần
                                            và ngày lễ. Tuy nhiên, bạn cũng có
                                            thể mua vé tại cổng vào.
                                        </Text>
                                    </div>

                                    <div>
                                        <Text strong className="block mb-2">
                                            Q: Thời gian tham quan kéo dài bao
                                            lâu?
                                        </Text>
                                        <Text className="text-gray-700 block ml-4">
                                            A: Thời gian tham quan trung bình là
                                            4-6 giờ tùy thuộc vào sở thích và số
                                            lượng trò chơi bạn tham gia.
                                        </Text>
                                    </div>

                                    <div>
                                        <Text strong className="block mb-2">
                                            Q: Có dịch vụ đưa đón không?
                                        </Text>
                                        <Text className="text-gray-700 block ml-4">
                                            A: Hiện tại chúng tôi không cung cấp
                                            dịch vụ đưa đón. Bạn có thể tự di
                                            chuyển bằng xe cá nhân hoặc
                                            taxi/grab.
                                        </Text>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky mt-[108px] top-4">
                            {/* Header with title and image */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-4">
                                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                                        Combo Vé Công Viên Nước + Công Viên Rồng
                                    </h2>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                "https://r-xx.bstatic.com/xdata/images/xphoto/800x800/186620062.jpg?k=20fdd96841afb43a88ed84ec3dec0114aa5ef4b07dddb7f60d3fdb4675dee789&o="
                                            }
                                            alt={
                                                "Combo Vé Công Viên Nước + Công Viên Rồng"
                                            }
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <span className="text-gray-700">
                                    <span className="font-medium">Ngày:</span>
                                    30 tháng 7 năm 2025
                                </span>
                            </div>

                            {/* Pricing breakdown */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">
                                        Người lớn (độ tuổi 0-99)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        456.243,00 ₫ X 2
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">
                                        Trẻ em (độ tuổi 0-99)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        2
                                    </span>
                                </div>
                            </div>

                            <Divider className="my-4" />

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="w-full bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-full h-12 font-medium"
                                    onClick={() => {}}
                                >
                                    Cập nhật giá
                                </Button>

                                <Button
                                    size="large"
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 rounded-full h-12 font-medium"
                                    onClick={() => {}}
                                >
                                    Thêm vào xe đẩy hàng
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
