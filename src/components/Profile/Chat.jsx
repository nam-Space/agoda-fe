import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { v4 as uuidv4 } from "uuid";
import { callGetOrCreateConversation } from "config/api";
import { fetchConversation } from "../../redux/slice/conversationSlide";
import { IoChatboxEllipses } from "react-icons/io5";

function Chat() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.account.user);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [selectedOtherUserId, setSelectedOtherUserId] = useState(null);
    const conversations = useAppSelector((state) => state.conversation.data);

    useEffect(() => {
        dispatch(fetchConversation({ query: `current=1&pageSize=100` }));
    }, [dispatch]);

    const handleOpenChat = async (conv) => {
        try {
            const clientConvId = uuidv4(); // tạo uuid phía client (tùy chọn)

            const res = await callGetOrCreateConversation({
                user_id: getOtherUser(conv).id,
                conversation_id: clientConvId,
            });

            if (res?.isSuccess) {
                const conv = res.data;
                setSelectedConversation(conv.id); // ID là UUID string
                setSelectedOtherUserId(getOtherUser(conv).id);
            } else {
                console.error("Failed get/create conversation", res.data);
            }
        } catch (err) {
            console.error("Error getting/creating conversation", err);
        }
    };

    const getOtherUser = (conversation) => {
        if (conversation.user1.id === user.id) return conversation.user2;
        return conversation.user1;
    };

    return (
        <div>
            {conversations.length > 0 ? (
                <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                        <h3>Danh sách cuộc trò chuyện</h3>
                        <div className="h-[300px] overflow-y-auto">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleOpenChat(conv)}
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        marginBottom: "5px",
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedOtherUserId ===
                                            getOtherUser(conv).id
                                                ? "#f0f0f0"
                                                : "white",
                                    }}
                                >
                                    {getOtherUser(conv).first_name}{" "}
                                    {getOtherUser(conv).last_name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {selectedConversation ? (
                            <ChatRoom
                                conversationId={selectedConversation}
                                userId={user.id}
                                otherUserId={selectedOtherUserId}
                            />
                        ) : (
                            <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white h-[722px] rounded-[16px]">
                    <div className="flex items-center justify-center flex-col h-full">
                        <IoChatboxEllipses className="text-[100px] text-[#2067da]" />
                        <p className="font-semibold">
                            Quý khách không có cuộc trò chuyện nào
                        </p>
                        <p className="text-[#6b7388] text-[12px]">
                            Bắt đầu cuộc trò chuyện bằng cách viết tin nhắn bên
                            dưới.
                        </p>
                        <div className="text-[#2067da] mt-[22px] font-semibold relative h-[36px] flex justify-center items-center px-[24px] rounded-[50px] border-[1px] border-[#050a0f69] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]">
                            Chuyển đến đặt phòng của tôi
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
