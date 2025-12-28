import React, { useState } from "react";
import logoImg from "../images/header/logo.png";
import viImg from "../images/header/vi.svg";
import enImg from "../images/header/en.svg";
import koreanImg from "../images/header/korea.png";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Badge, Empty, Modal, Popover, Spin } from "antd";
import {
    CheckOutlined,
    DownOutlined,
    EllipsisOutlined,
    MenuOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { FaBell } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { callLogout } from "config/api";
import { setLogoutAction } from "../redux/slice/accountSlide";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { getUserAvatar } from "utils/imageUrl";
import { ROLE_VI } from "constants/role";
import { useSocket } from "contexts/SocketProvider";

const HeaderClient = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        setOnlineUsers,
        conversations,
        setConversations,
        setMessages,
        setSelectedConversation,
        notifications,
        notifHasNext,
        totalUnseenNotif,
        loadingNotifications,
        loadMoreNotifications,
        markNotificationAsRead,
    } = useSocket();

    const user = useAppSelector((state) => state.account.user);

    const [openVehicle, setOpenVehicle] = useState(false);
    const [openMore, setOpenMore] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openMenuProfile, setOpenMenuProfile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const unseenTotal = conversations.reduce((total, conv) => {
        if (conv?.latest_message?.sender?.id === user?.id) return total;
        return total + conv.unseen_count;
    }, 0);

    const handleLogout = async () => {
        const res = await callLogout({
            refresh: Cookies.get("refresh_token_agoda"),
        });
        if (res.isSuccess) {
            dispatch(setLogoutAction({}));
            setOnlineUsers((prev) => {
                return [...prev].filter(
                    (onlineUser) => onlineUser.id !== user.id
                );
            });
            setConversations([]);
            setMessages([]);
            setSelectedConversation({});

            toast.success("Đăng xuất thành công!", {
                position: "bottom-right",
            });
        }
    };

    return (
        <div className="h-[60px] flex items-center justify-between px-[16px] shadow-[rgba(0,0,0,0.2)_0px_1px_3px_1px]">
            <div className="px-[16px] flex items-center gap-[12px]">
                <Link to={"/"}>
                    <img src={logoImg} alt="logo" className="h-[37px]" />
                </Link>
                <div className="px-[16px] flex items-center gap-[28px]">
                    <div>
                        <Badge.Ribbon
                            text="Đặt gói để tiết kiệm!"
                            color="red"
                            placement="start"
                            className="top-[-12px] h-[18px] text-[10px] leading-[18px]"
                        ></Badge.Ribbon>
                        <Link>Máy bay + K. sạn</Link>
                    </div>
                    <div>
                        <Link>Chỗ ở</Link>
                    </div>
                    <div>
                        <Popover
                            content={
                                <div>
                                    <div className="py-[20px]">
                                        <Link>Vé máy bay</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link>Xe buýt</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link>Tàu hỏa</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link>Phà</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link>Taxi sân bay</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link>Thuê xe</Link>
                                    </div>
                                </div>
                            }
                            title=""
                            trigger="click"
                            open={openVehicle}
                            onOpenChange={(val) => setOpenVehicle(val)}
                        >
                            <Badge.Ribbon
                                text="Mới!"
                                color="red"
                                placement="start"
                                className="top-[-12px] h-[18px] text-[10px] leading-[18px]"
                            ></Badge.Ribbon>
                            Phương tiện di chuyển
                            <DownOutlined className="text-[12px] ml-[8px]" />
                        </Popover>
                    </div>
                    <div>
                        <Link to={"/activity"}>Hoạt động</Link>
                    </div>
                    <div>
                        <Link>Phiếu giảm giá và ưu đãi</Link>
                    </div>
                    <div>
                        <Popover
                            content={
                                <div>
                                    <div className="py-[20px]">
                                        <Link>eSim</Link>
                                    </div>
                                    <div className="py-[20px]">
                                        <Link to={"/travel-guide"}>
                                            Cẩm nang du lịch
                                        </Link>
                                    </div>
                                </div>
                            }
                            title=""
                            trigger="click"
                            open={openMore}
                            onOpenChange={(val) => setOpenMore(val)}
                        >
                            <EllipsisOutlined className="text-[26px]" />
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="px-[16px] flex items-center gap-[12px]">
                <div
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <img
                        src={viImg}
                        alt="viImg"
                        className="w-[30px] h-[24px]"
                    />
                </div>
                {user?.id ? (
                    <>
                        {/* <Link
                            to="/cart"
                            className="font-semibold relative flex justify-center items-center p-[10px] rounded-[50px] border-[1px] border-white after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                        >
                            <Badge count={6} size="small">
                                <FaShoppingCart className="text-[22px] text-[#2067da]" />
                            </Badge>
                        </Link> */}
                        <div className="px-[10px] flex items-center justify-center">
                            <Popover
                                content={
                                    <div>
                                        <div
                                            className={`w-[400px] max-h-[500px] overflow-y-auto`}
                                        >
                                            {/* <div className="bg-gray-100 hover:bg-gray-200  cursor-pointer">
                                                <div className="border-t-[1px] border-[#f0f0f0] px-[10px] py-[10px] flex gap-[10px]">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src="http://localhost:8000/media/airline_logo_images/bamboo-airways.png"
                                                            alt="Xe manivan độc nhất"
                                                            className="w-[50px] h-[50px] object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="text-gray-900 mb-[6px] leading-[18px]">
                                                            <div>
                                                                Mã:
                                                                <span className="text-blue-500 font-semibold">
                                                                    {" "}
                                                                    AGD9E3286
                                                                </span>
                                                            </div>
                                                            <span>
                                                                Chuyến bay{" "}
                                                            </span>
                                                            <span className="font-bold text-yellow-600">
                                                                một chiều
                                                            </span>
                                                            :{" "}
                                                            <span className="font-bold">
                                                                Tân Sơn Nhất
                                                            </span>{" "}
                                                            →{" "}
                                                            <span className="font-bold">
                                                                Đà Nẵng
                                                            </span>
                                                        </h3>
                                                        <div className="flex gap-[20px]">
                                                            <div>
                                                                <p className="text-gray-600 text-[12px]">
                                                                    Thời điểm
                                                                    cất cánh
                                                                </p>
                                                                <p className="font-semibold text-[12px] text-gray-900">
                                                                    2025-12-04
                                                                    00:00:00
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-gray-600 text-[12px]">
                                                                    Thời gian hạ
                                                                    cánh
                                                                </p>
                                                                <p className="font-semibold text-[12px] text-gray-900">
                                                                    2025-12-04
                                                                    02:00:00
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {!loadingNotifications &&
                                                notifications.length === 0 && (
                                                    <Empty
                                                        description="Chưa có thông báo"
                                                        className="bg-[#abb6cb1f] mx-0 py-[24px] rounded-[16px]"
                                                    />
                                                )}
                                            {!loadingNotifications &&
                                                notifications.length > 0 &&
                                                notifications.map(
                                                    (noti, index) => (
                                                        <div
                                                            onClick={() => {
                                                                markNotificationAsRead(
                                                                    noti
                                                                );
                                                                if (noti.link) {
                                                                    navigate(
                                                                        noti.link
                                                                    );
                                                                }
                                                            }}
                                                            key={index}
                                                            className={`
                                                            ${
                                                                !noti.is_read
                                                                    ? "bg-gray-100 hover:bg-gray-200"
                                                                    : "hover:bg-gray-200"
                                                            } ${
                                                                noti.is_error
                                                                    ? "bg-red-100 hover:bg-red-200"
                                                                    : ""
                                                            } cursor-pointer`}
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    noti?.message ||
                                                                    "",
                                                            }}
                                                        ></div>
                                                    )
                                                )}
                                        </div>
                                        <div
                                            onClick={() =>
                                                !loadingNotifications &&
                                                notifHasNext &&
                                                loadMoreNotifications()
                                            }
                                            className={`${
                                                loadingNotifications
                                                    ? "select-none opacity-35"
                                                    : ""
                                            } ${
                                                !notifHasNext
                                                    ? "opacity-50 select-none"
                                                    : "cursor-pointer"
                                            } text-center pt-[12px] font-semibold`}
                                        >
                                            {loadingNotifications && <Spin />}
                                            Xem thêm
                                        </div>
                                    </div>
                                }
                                title="Thông báo"
                                trigger="click"
                                placement="bottomRight"
                            >
                                <Badge count={totalUnseenNotif} size="small">
                                    <FaBell className="text-[22px] text-[#2067da] cursor-pointer" />
                                </Badge>
                            </Popover>
                        </div>
                        <Popover
                            content={
                                <div className="w-[250px]">
                                    <p className="bg-[#f8f7f9] px-[24px] py-[12px]">
                                        Tài khoản của tôi
                                    </p>
                                    <div className="mt-[16px]">
                                        <div className="py-[8px] px-[12px] hover:bg-[#f8f7f9] duration-150 transition-all">
                                            <Link to={"/profile/hotel"}>
                                                Chuyến đi
                                            </Link>
                                        </div>
                                        <div className="flex items-center justify-between py-[8px] px-[12px] hover:bg-[#f8f7f9] duration-150 transition-all">
                                            <Link to={"/profile/chat"}>
                                                Tin nhắn từ chỗ nghỉ
                                            </Link>
                                            {unseenTotal > 0 && (
                                                <Badge
                                                    count={unseenTotal}
                                                    showZero
                                                    color="#fa2314"
                                                />
                                            )}
                                        </div>
                                        <div className="py-[8px] px-[12px] hover:bg-[#f8f7f9] duration-150 transition-all">
                                            <Link>Danh sách yêu thích</Link>
                                        </div>
                                        <div className="py-[8px] px-[12px] hover:bg-[#f8f7f9] duration-150 transition-all">
                                            <Link to={"/profile"}>
                                                Hồ sơ của tôi
                                            </Link>
                                        </div>
                                        <div
                                            onClick={handleLogout}
                                            className="mt-[24px] cursor-pointer text-center py-[6px] rounded-[3px] text-[#2067da] border-[1px] border-[#2067da]"
                                        >
                                            Thoát
                                        </div>
                                    </div>
                                    <p className="bg-[#f8f7f9] px-[24px] py-[12px] mt-[24px]">
                                        Cài đặt
                                    </p>
                                    <div className="flex items-center gap-[12px] font-bold p-[12px] border-[1px] rounded-[10px] border-white">
                                        <div className="flex items-center gap-[12px]">
                                            <img
                                                src={viImg}
                                                alt="viImg"
                                                className="w-[30px] h-[24px]"
                                            />
                                            <span className="text-[16px]">
                                                {" "}
                                                Tiếng Việt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                            title=""
                            trigger="click"
                            open={openMenuProfile}
                            placement="topRight"
                            onOpenChange={(val) => setOpenMenuProfile(val)}
                        >
                            <div className="flex p-[5px] relative items-center gap-[8px] cursor-pointer border-[1px] border-white after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[8px]">
                                <Avatar
                                    size="large"
                                    src={getUserAvatar(user?.avatar)}
                                >
                                    {user?.first_name?.substring(0, 1)}
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className="text-[13px]">
                                        {ROLE_VI[user?.role]}
                                    </p>
                                </div>
                            </div>
                        </Popover>
                    </>
                ) : (
                    <>
                        <Link
                            to={"/login"}
                            className="text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-white after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to={"/register"}
                            className="text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                        >
                            Đăng ký
                        </Link>
                        <div className="w-[44px] h-[44px] text-[#2067da] font-semibold relative flex justify-center items-center rounded-[50px] border-[1px] border-white after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                            <ShoppingCartOutlined className="text-[24px]" />
                        </div>
                        <Popover
                            content={
                                <div className="w-[250px]">
                                    <p className="bg-[#f8f7f9] px-[24px] py-[12px]">
                                        Đăng nhập
                                    </p>
                                    <div className="mt-[12px]">
                                        <div className="text-center py-[6px] rounded-[3px] text-[#2067da] border-[1px] border-[#2067da]">
                                            <Link>Đăng nhập</Link>
                                        </div>
                                        <div className="mt-[20px] text-center py-[6px] rounded-[3px] text-white bg-[#2067da] border-[1px] border-[#2067da]">
                                            <Link>Tạo tài khoản</Link>
                                        </div>
                                    </div>
                                    <p className="bg-[#f8f7f9] px-[24px] py-[12px] mt-[12px]">
                                        Cài đặt
                                    </p>
                                    <div className="flex items-center gap-[12px] font-bold p-[12px] border-[1px] rounded-[10px] border-white">
                                        <div className="flex items-center gap-[12px]">
                                            <img
                                                src={viImg}
                                                alt="viImg"
                                                className="w-[30px] h-[24px]"
                                            />
                                            <span className="text-[16px]">
                                                {" "}
                                                Tiếng Việt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                            title=""
                            trigger="click"
                            open={openMenu}
                            placement="topRight"
                            onOpenChange={(val) => setOpenMenu(val)}
                        >
                            <div className="w-[44px] h-[44px] text-[#2067da] font-semibold relative flex justify-center items-center rounded-[50px] border-[1px] border-white after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                                <MenuOutlined className="text-[24px]" />
                            </div>
                        </Popover>
                    </>
                )}
            </div>
            <Modal
                title=""
                width={800}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
            >
                <h1 className="text-[24px] font-bold">Chọn ngôn ngữ</h1>
                <hr className="my-[16px]"></hr>
                <h1 className="text-[22px] font-semibold">Ngôn ngữ gợi ý</h1>
                <div className="grid grid-cols-3 mt-[16px]">
                    <div className="flex items-center gap-[12px] text-[#2067da] font-bold p-[12px] border-[1px] rounded-[10px] border-black">
                        <CheckOutlined className="text-[18px]" />
                        <div className="flex items-center gap-[12px]">
                            <img
                                src={viImg}
                                alt="viImg"
                                className="w-[30px] h-[24px]"
                            />
                            <span className="text-[16px]"> Tiếng Việt</span>
                        </div>
                    </div>
                </div>
                <h1 className="mt-[16px] text-[22px] font-semibold">
                    Tất cả ngôn ngữ
                </h1>
                <div className="grid grid-cols-3 mt-[16px] gap-[2px]">
                    <div className="flex items-center gap-[12px] text-[#2067da] font-bold p-[12px] border-[1px] rounded-[10px] border-black">
                        <CheckOutlined className="text-[18px]" />
                        <div className="flex items-center gap-[12px]">
                            <img
                                src={viImg}
                                alt="viImg"
                                className="w-[30px] h-[24px]"
                            />
                            <span className="text-[16px]"> Tiếng Việt</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-[12px] text-[#2067da] font-bold p-[12px] border-[1px] rounded-[10px] border-white hover:border-[#2067da14]">
                        <div className="w-[18px] h-[18px]"></div>
                        <div className="flex items-center gap-[12px]">
                            <img
                                src={enImg}
                                alt="enImg"
                                className="w-[30px] h-[24px]"
                            />
                            <span className="text-[16px]"> English</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-[12px] text-[#2067da] font-bold p-[12px] border-[1px] rounded-[10px] border-white hover:border-[#2067da14]">
                        <div className="w-[18px] h-[18px]"></div>
                        <div className="flex items-center gap-[12px]">
                            <img
                                src={koreanImg}
                                alt="koreanImg"
                                className="w-[30px] h-[24px]"
                            />
                            <span className="text-[16px]"> 한국어</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default HeaderClient;
