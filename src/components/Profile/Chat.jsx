import React from "react";
import { IoChatboxEllipses } from "react-icons/io5";

const Chat = () => {
    return (
        <div className="bg-white h-[722px] rounded-[16px]">
            <div className="flex items-center justify-center flex-col h-full">
                <IoChatboxEllipses className="text-[100px] text-[#2067da]" />
                <p className="font-semibold">
                    Quý khách không có cuộc trò chuyện nào
                </p>
                <p className="text-[#6b7388] text-[12px]">
                    Bắt đầu cuộc trò chuyện bằng cách viết tin nhắn bên dưới.
                </p>
                <div className="text-[#2067da] mt-[22px] font-semibold relative h-[36px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                    Chuyển đến đặt phòng của tôi
                </div>
            </div>
        </div>
    );
};

export default Chat;
