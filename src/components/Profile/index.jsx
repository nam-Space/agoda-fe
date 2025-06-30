import { Avatar } from "antd";
import React from "react";

const Profile = () => {
    return (
        <div>
            <h1 className="text-[24px] font-semibold">Thông tin người dùng</h1>
            <div
                style={{
                    backgroundImage: "linear-gradient(90deg, #ffcc7b, #ffd899)",
                }}
                className="flex items-center shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] gap-[20px] bg-white mt-[20px] px-[20px] py-[24px]"
            >
                <Avatar size="large">N</Avatar>
                <div className="flex items-center justify-between w-full">
                    <div>
                        <p>Họ và tên</p>
                        <p>Nam Nguyễn Viết</p>
                    </div>
                    <p className="cursor-pointer">Chỉnh sửa</p>
                </div>
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Email</p>
                <p>namhello2003@gmail.com</p>
            </div>
            <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] bg-white mt-[20px] px-[20px] py-[24px]">
                <p className="font-semibold">Số điện thoại</p>
                <p>+84354319176</p>
            </div>
        </div>
    );
};

export default Profile;
