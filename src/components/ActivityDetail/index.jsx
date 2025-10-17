import { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Card,
    Badge,
    Breadcrumb,
    Divider,
    Calendar,
    Collapse,
    Typography,
    Tag,
} from "antd";
import {
    DownOutlined,
    EnvironmentOutlined,
    PlusOutlined,
    MinusOutlined,
    UpOutlined,
} from "@ant-design/icons";
import { FaClock, FaTicketAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosStar } from "react-icons/io";
import { BsLightningChargeFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { callFetchDetailActivity } from "config/api";
import { ACTIVITY_TYPE } from "constants/activity";
import { callFetchActivity } from "config/api";
import { formatCurrency } from "utils/formatCurrency";
import { callFetchActivityPackageByActivityIdAndDateLaunch } from "config/api";
import _ from "lodash";
import { INF } from "constants/activity";
import { useAppSelector } from "../../redux/hooks";
import { callBook } from "config/api";
import { toast } from "react-toastify";
import { SERVICE_TYPE } from "constants/booking";
const { Panel } = Collapse;
const { Text } = Typography;

export default function ActivityDetail() {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.account.user);
    const bigCalendarWrapperRef = useRef(null);
    const activityPackageWrapperRef = useRef(null);

    const [activities, setActivities] = useState([]);
    const [activity, setActivity] = useState({});
    const [activityPackages, setActivityPackages] = useState([]);
    const [minPrice, setMinPrice] = useState(INF);
    const [activeKey, setActiveKey] = useState(["1"]);

    const handleGetListActivities = async (query) => {
        const res = await callFetchActivity(query);
        if (res.isSuccess) {
            setActivities(res.data);
        }
    };

    const handleGetActivity = async (id) => {
        const res = await callFetchDetailActivity(id);
        if (res.isSuccess) {
            setActivity(res.data);
            if (res.data.city.id) {
                await handleGetListActivities(
                    `current=1&pageSize=10&city_id=${res.data.city.id}`
                );
            }
        }
    };

    const handleGetActivityPackageByActivityIdAndDateLaunch = async (query) => {
        const res = await callFetchActivityPackageByActivityIdAndDateLaunch(
            query
        );
        if (res.isSuccess) {
            setActivityPackages(res.data);
        }
    };

    const groupById = (data) => {
        return _(data)
            .groupBy((x) => x.id)
            .map((value, key) => {
                return { id: key, activity_package: value[0] };
            })
            .value();
    };

    const [dateSelectedGeneral, setDateSelectedGeneral] = useState(
        dayjs(new Date()).format("YYYY-MM-DD")
    );
    const [adultTickets, setAdultTickets] = useState(
        groupById(activityPackages).map((item) => 1)
    );
    const [childTickets, setChildTickets] = useState(
        groupById(activityPackages).map((item) => 0)
    );
    const [dateTickets, setDateTickets] = useState(
        groupById(activityPackages).map((item) => dateSelectedGeneral)
    );
    const [selectedTickerOption, setSelectedTickerOption] = useState({
        id: -1,
        activity_package: {},
    });
    const [selectedIndexTicket, setSelectedIndexTicket] = useState(-1);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (activityId) {
            handleGetActivity(activityId);
        }
    }, [activityId]);

    useEffect(() => {
        if (activityId) {
            handleGetActivityPackageByActivityIdAndDateLaunch(
                `activity_id=${activityId}&date_launch=${dateSelectedGeneral}`
            );
        }
    }, [activityId, dateSelectedGeneral]);

    useEffect(() => {
        setAdultTickets(groupById(activityPackages).map((item) => 1));
        setChildTickets(groupById(activityPackages).map((item) => 0));
        setDateTickets(
            groupById(activityPackages).map((item) => dateSelectedGeneral)
        );
    }, [activityPackages]);

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

    const getPrice = (item, index) => {
        const activity_date = item.activity_package.activities_dates.find(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) ===
                dateTickets[index]
        );

        const price =
            (activity_date?.price_adult || 0) * adultTickets[index] +
            (activity_date?.price_child || 0) * childTickets[index];

        if (price < minPrice) {
            setMinPrice(price);
        }

        return price;
    };

    const getSinglePriceAdult = (item, index) => {
        const activity_date = item.activity_package.activities_dates.find(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) ===
                dateTickets[index]
        );

        const price = activity_date?.price_adult || 0;

        return price;
    };

    const getSinglePriceChild = (item, index) => {
        const activity_date = item.activity_package.activities_dates.find(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) ===
                dateTickets[index]
        );

        const price = activity_date?.price_child || 0;

        return price;
    };

    const getActivityDate = (item, index) => {
        const activity_date = item.activity_package.activities_dates.find(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) ===
                dateTickets[index]
        );

        return activity_date;
    };

    const handleDisableDate = (currentDate, item) => {
        const activity_date = item.activity_package.activities_dates.some(
            (activities_date) =>
                activities_date.date_launch.substring(0, 10) ===
                dayjs(new Date(currentDate)).format("YYYY-MM-DD")
        );
        return !activity_date;
    };

    const handleScrollToChoose = () => {
        if (minPrice < INF) {
            activityPackageWrapperRef.current.scrollIntoView({
                behavior: "smooth", // Optional: for a smooth scrolling animation
                block: "start", // Optional: aligns the top of the element with the top of the viewport
                inline: "nearest", // Optional: aligns the element horizontally if needed
            });
        } else {
            bigCalendarWrapperRef.current.scrollIntoView({
                behavior: "smooth", // Optional: for a smooth scrolling animation
                block: "start", // Optional: aligns the top of the element with the top of the viewport
                inline: "nearest", // Optional: aligns the element horizontally if needed
            });
        }
    };

    const handleGoToBooking = async () => {
        try {
            // console.log("dataSend", {
            //     activity,
            //     activity_date: {
            //         ...selectedTickerOption,
            //     },
            //     adult_quantity_booking: adultTickets[selectedIndexTicket],
            //     child_quantity_booking: childTickets[selectedIndexTicket],
            //     date_launch: dateTickets[selectedIndexTicket],
            // });

            const body = {
                service_type: SERVICE_TYPE.ACTIVITY,
                // service_ref_id: getActivityDate(
                //     selectedTickerOption,
                //     selectedIndexTicket
                // ).id,
                total_price: getPrice(
                    selectedTickerOption,
                    selectedIndexTicket
                ),
                activity_detail: {
                    room: 2,
                    activity_date: getActivityDate(
                        selectedTickerOption,
                        selectedIndexTicket
                    ).id,
                    price_adult: getSinglePriceAdult(
                        selectedTickerOption,
                        selectedIndexTicket
                    ),
                    price_child: getSinglePriceChild(
                        selectedTickerOption,
                        selectedIndexTicket
                    ),
                    adult_quantity_booking: adultTickets[selectedIndexTicket],
                    child_quantity_booking: childTickets[selectedIndexTicket],
                    date_launch: dateTickets[selectedIndexTicket],
                    activity_package_name:
                        selectedTickerOption.activity_package.name,
                    activity_name: activity.name,
                    activity_image: activity?.images?.[0]?.image,
                    avg_price: activity.avg_price,
                    avg_star: activity.avg_star,
                    city_name: activity.city.name,
                },
            };

            // console.log("body", body);

            const res = await callBook(body);
            if (res.isSuccess) {
                navigate(
                    `/book?booking_id=${res.booking_id}&type=${body.service_type}&ref=${res.data.id}`,
                    {
                        state: {
                            activity,
                            activity_date: {
                                ...selectedTickerOption,
                            },
                            adult_quantity_booking:
                                adultTickets[selectedIndexTicket],
                            child_quantity_booking:
                                childTickets[selectedIndexTicket],
                            date_launch: dateTickets[selectedIndexTicket],
                        },
                    }
                );
            }
        } catch (e) {
            toast.error(e.message, {
                position: "bottom-right",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ Hoạt động</Breadcrumb.Item>
                    <Breadcrumb.Item>{activity?.city?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {ACTIVITY_TYPE[activity?.category || ""] || ""}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{activity?.name}</Breadcrumb.Item>
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
                                {activity?.name}
                            </h1>
                            <p className="text-gray-600">1001 người đã đặt</p>
                        </div>

                        {/* Main Image */}
                        <div className="mb-6">
                            <div className="relative h-[450px] rounded-lg overflow-hidden">
                                <Swiper
                                    className="h-full"
                                    slidesPerView={1}
                                    spaceBetween={8}
                                    navigation={true}
                                    modules={[Navigation]}
                                >
                                    {activity?.images?.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={`${process.env.REACT_APP_BE_URL}${image.image}`}
                                                alt={image.image}
                                                fill
                                                className="object-cover w-full h-full"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <Card className="mb-6">
                            <h3 className="font-semibold mb-3 flex items-center">
                                <EnvironmentOutlined className="mr-2" />
                                Thông tin nhanh
                            </h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: activity.short_description || "",
                                }}
                            ></div>
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
                            <div className="mb-6" ref={bigCalendarWrapperRef}>
                                <h4 className="font-medium mb-3">
                                    Các lựa chọn gói
                                </h4>
                                <Calendar
                                    onSelect={(val) =>
                                        setDateSelectedGeneral(
                                            dayjs(
                                                new Date(val.toString())
                                            ).format("YYYY-MM-DD")
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Ticket Options */}
                        <div
                            className="space-y-4"
                            ref={activityPackageWrapperRef}
                        >
                            {groupById(activityPackages).map((item, index) => (
                                <Card
                                    key={item.id}
                                    className={`hover:shadow-md cursor-pointer ${
                                        selectedTickerOption.id === item.id
                                            ? "border border-[2px] border-blue-500"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedTickerOption(item);
                                        setSelectedIndexTicket(index);
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium mb-1 text-[24px]">
                                                    {item.activity_package.name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-blue-500 font-semibold">
                                                    <p className="w-max">
                                                        Xem chi tiết
                                                    </p>
                                                    <MdOutlineKeyboardArrowRight className="text-[22px]" />
                                                </div>
                                            </div>

                                            {selectedTickerOption.id !==
                                                item.id && (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-500 line-through">
                                                            {formatCurrency(
                                                                getPrice(
                                                                    item,
                                                                    index
                                                                )
                                                            )}{" "}
                                                            ₫
                                                        </p>
                                                        <div className="flex items-center">
                                                            <span className="text-red-600 font-semibold text-[22px]">
                                                                {formatCurrency(
                                                                    getPrice(
                                                                        item,
                                                                        index
                                                                    )
                                                                )}{" "}
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

                                    {selectedTickerOption.id === item.id && (
                                        <div>
                                            <Divider className="my-4" />

                                            {/* Calendar */}
                                            <div className="flex justify-between gap-[30px]">
                                                <div className="w-[300px]">
                                                    <span>Chọn ngày</span>
                                                    <Calendar
                                                        fullscreen={false}
                                                        onSelect={(val) => {
                                                            setDateTickets(
                                                                (prev) => {
                                                                    const newArr =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    newArr[
                                                                        index
                                                                    ] = dayjs(
                                                                        new Date(
                                                                            val.toString()
                                                                        )
                                                                    ).format(
                                                                        "YYYY-MM-DD"
                                                                    );

                                                                    return newArr;
                                                                }
                                                            );
                                                        }}
                                                        disabledDate={(
                                                            currentDate
                                                        ) =>
                                                            handleDisableDate(
                                                                currentDate,
                                                                item
                                                            )
                                                        }
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
                                                                    adultTickets[
                                                                        index
                                                                    ] <= 0
                                                                }
                                                                onClick={() =>
                                                                    setAdultTickets(
                                                                        (
                                                                            prev
                                                                        ) => {
                                                                            const newArr =
                                                                                [
                                                                                    ...prev,
                                                                                ];
                                                                            newArr[
                                                                                index
                                                                            ] =
                                                                                Math.max(
                                                                                    0,
                                                                                    newArr[
                                                                                        index
                                                                                    ] -
                                                                                        1
                                                                                );
                                                                            return newArr;
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <MinusOutlined />
                                                            </Button>
                                                            <span className="w-8 text-center">
                                                                {
                                                                    adultTickets[
                                                                        index
                                                                    ]
                                                                }
                                                            </span>
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    setAdultTickets(
                                                                        (
                                                                            prev
                                                                        ) => {
                                                                            const newArr =
                                                                                [
                                                                                    ...prev,
                                                                                ];
                                                                            newArr[
                                                                                index
                                                                            ] =
                                                                                newArr[
                                                                                    index
                                                                                ] +
                                                                                1;
                                                                            return newArr;
                                                                        }
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
                                                                    childTickets[
                                                                        index
                                                                    ] <= 0
                                                                }
                                                                onClick={() =>
                                                                    setChildTickets(
                                                                        (
                                                                            prev
                                                                        ) => {
                                                                            const newArr =
                                                                                [
                                                                                    ...prev,
                                                                                ];
                                                                            newArr[
                                                                                index
                                                                            ] =
                                                                                Math.max(
                                                                                    0,
                                                                                    newArr[
                                                                                        index
                                                                                    ] -
                                                                                        1
                                                                                );
                                                                            return newArr;
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <MinusOutlined />
                                                            </Button>
                                                            <span className="w-8 text-center">
                                                                {
                                                                    childTickets[
                                                                        index
                                                                    ]
                                                                }
                                                            </span>
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    setChildTickets(
                                                                        (
                                                                            prev
                                                                        ) => {
                                                                            const newArr =
                                                                                [
                                                                                    ...prev,
                                                                                ];
                                                                            newArr[
                                                                                index
                                                                            ] =
                                                                                newArr[
                                                                                    index
                                                                                ] +
                                                                                1;
                                                                            return newArr;
                                                                        }
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
                                                        {formatCurrency(
                                                            getPrice(
                                                                item,
                                                                index
                                                            )
                                                        )}{" "}
                                                        ₫
                                                    </p>
                                                    <div className="flex items-center">
                                                        <span className="text-red-600 font-semibold text-[22px]">
                                                            {formatCurrency(
                                                                getPrice(
                                                                    item,
                                                                    index
                                                                )
                                                            )}{" "}
                                                            ₫
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end items-center gap-3">
                                                {/* <Button
                                                    size="large"
                                                    className="bg-white text-[#2067da] border-[#050a0f69] rounded-full h-12 font-medium"
                                                    onClick={() => {}}
                                                >
                                                    Thêm vào xe đẩy hàng
                                                </Button> */}
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-full h-12 font-medium"
                                                    onClick={handleGoToBooking}
                                                >
                                                    Bước tiếp theo
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
                                {[
                                    ...activities.filter(
                                        (item) => item.id !== activity.id
                                    ),
                                ].map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className="rounded-[16px] overflow-hidden border-[1px] border-[#d5d9e2]">
                                                <Link
                                                    to={`/activity/detail/${item.id}`}
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_BE_URL}${item.images[0].image}`}
                                                        className="w-full h-[170px] object-cover"
                                                    />
                                                    <div className="pt-[12px] px-[16px] pb-[16px]">
                                                        <p className="font-semibold text-[20px] leading-[24px] line-clamp-2 min-h-[48px]">
                                                            {item.name}
                                                        </p>
                                                        <div className="flex items-center gap-[4px]">
                                                            <IoIosStar className="text-[#b54c01] text-[12px]" />
                                                            <p className="font-semibold">
                                                                {item.avg_star}
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
                                                                Giảm 0%
                                                            </Tag>
                                                        </div>
                                                        <div className="mt-[4px] flex items-center justify-end gap-[4px]">
                                                            <p className="text-[13px] text-end line-through">
                                                                {formatCurrency(
                                                                    item.avg_price
                                                                )}{" "}
                                                                ₫
                                                            </p>
                                                            <div className="flex items-center justify-end gap-[8px]">
                                                                <p className="text-[16px] font-bold text-end text-[#c53829]">
                                                                    {formatCurrency(
                                                                        item.avg_price
                                                                    )}
                                                                </p>
                                                                <p className="text-[12px] mt-[2px] font-semibold text-end text-[#c53829]">
                                                                    ₫
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
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
                                <div
                                    className="pb-4 space-y-4 px-[36px]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            activity?.departure_information ||
                                            "",
                                    }}
                                ></div>
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
                                <div
                                    className="pb-4 space-y-3 px-[36px]"
                                    dangerouslySetInnerHTML={{
                                        __html: activity.more_information || "",
                                    }}
                                ></div>
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
                                <div
                                    className="pb-4 space-y-3 px-[36px]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            activity.cancellation_policy || "",
                                    }}
                                ></div>
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
                            {selectedTickerOption.id === -1 ? (
                                <>
                                    {minPrice < INF && (
                                        <div className="flex justify-between items-end">
                                            <h1 className="text-2xl font-bold">
                                                Từ
                                            </h1>

                                            <div>
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(minPrice)} ₫
                                                </p>
                                                <div className="flex items-center">
                                                    <span className="text-red-600 font-semibold text-[22px]">
                                                        {formatCurrency(
                                                            minPrice
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="primary"
                                        size="large"
                                        className="w-full mt-[10px] bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-full h-12 font-medium"
                                        onClick={handleScrollToChoose}
                                    >
                                        Xem mọi lựa chọn
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Header with title and image */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 pr-4">
                                            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                                                {
                                                    selectedTickerOption
                                                        ?.activity_package?.name
                                                }
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                <img
                                                    src={`${process.env.REACT_APP_BE_URL}${activity?.images?.[0]?.image}`}
                                                    alt={
                                                        selectedTickerOption
                                                            ?.activity_package
                                                            ?.name
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
                                            <span className="font-medium">
                                                Ngày:
                                            </span>{" "}
                                            {dateTickets[selectedIndexTicket]}
                                        </span>
                                    </div>

                                    {/* Pricing breakdown */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">
                                                Người lớn (độ tuổi 0-99)
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {adultTickets[
                                                    selectedIndexTicket
                                                ] === 0
                                                    ? 0
                                                    : `${formatCurrency(
                                                          getSinglePriceAdult(
                                                              selectedTickerOption,
                                                              selectedIndexTicket
                                                          )
                                                      )} ₫ X
                                                
                                                    ${
                                                        adultTickets[
                                                            selectedIndexTicket
                                                        ]
                                                    }
                                                `}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">
                                                Trẻ em (độ tuổi 0-99)
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {childTickets[
                                                    selectedIndexTicket
                                                ] === 0
                                                    ? 0
                                                    : `${formatCurrency(
                                                          getSinglePriceChild(
                                                              selectedTickerOption,
                                                              selectedIndexTicket
                                                          )
                                                      )} ₫ X
                                                
                                                    ${
                                                        childTickets[
                                                            selectedIndexTicket
                                                        ]
                                                    }
                                                `}
                                            </span>
                                        </div>
                                    </div>

                                    <Divider className="my-4" />

                                    {/* Action buttons */}
                                    {(adultTickets[selectedIndexTicket] >= 1 ||
                                        childTickets[selectedIndexTicket] >=
                                            1) && (
                                        <div className="space-y-3">
                                            <Button
                                                type="primary"
                                                size="large"
                                                className="w-full bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-full h-12 font-medium"
                                                onClick={handleGoToBooking}
                                            >
                                                Bước tiếp theo
                                            </Button>

                                            {/* <Button
                                                size="large"
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 rounded-full h-12 font-medium"
                                                onClick={() => {}}
                                            >
                                                Thêm vào xe đẩy hàng
                                            </Button> */}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
