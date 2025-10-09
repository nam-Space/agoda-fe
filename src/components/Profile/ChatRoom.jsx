import { callFetchMessage } from "config/api";
import React, { useEffect, useState, useRef } from "react";

const ChatRoom = ({ conversationId, userId, otherUserId }) => {
    const chatRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);

    const handleGetMessages = async () => {
        const res = await callFetchMessage(conversationId);
        if (res.isSuccess) {
            setMessages(res.data);
        }
    };

    const scrollToBottom = () => {
        if (chatRef.current) {
            requestAnimationFrame(() => {
                chatRef.current.scrollTo({
                    top: chatRef.current.scrollHeight,
                    behavior: "smooth",
                });
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!conversationId) return;
        handleGetMessages();

        // (2) tạo kết nối WebSocket tới đúng phòng (conversationId là UUID string)
        const ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${conversationId}/`
        );
        socketRef.current = ws;

        ws.onopen = () => {
            console.log(`✅ Connected to conversation ${conversationId}`);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 Message received:", data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onclose = () => {
            console.log(`❌ Disconnected from conversation ${conversationId}`);
        };

        ws.onerror = (error) => {
            console.error("⚠️ WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [conversationId]);

    const sendMessage = () => {
        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
        ) {
            const payload = {
                sender_id: userId,
                receiver_id: otherUserId, // user id (int)
                message: input,
                // optional: conversation_id: conversationId
            };
            socketRef.current.send(JSON.stringify(payload));
            setInput("");
            // không cần push ngay — server sẽ broadcast lại message cho room (nếu socket đang ở room đúng)
            // nhưng bạn có thể optimistic-update nếu muốn
        } else {
            console.warn("⚠️ Socket chưa sẵn sàng!");
        }
    };

    return (
        <div>
            <h2>💬 Chat Room #{conversationId}</h2>
            <div
                ref={chatRef}
                style={{
                    border: "1px solid #ccc",
                    height: "300px",
                    overflowY: "auto",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <b>
                            {msg.sender.id === userId
                                ? "Bạn"
                                : `${msg.sender.first_name} ${msg.sender.last_name}`}
                            :
                        </b>{" "}
                        {msg.text}
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    style={{ flex: 1 }}
                    type="text"
                    value={input}
                    placeholder="Nhập tin nhắn..."
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatRoom;
