import { CommentOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import ChatBot from "components/Chatbot/Chatbot";
import FooterClient from "components/FooterClient";
import HeaderClient from "components/HeaderClient";
import React from "react";

const ClientLayout = ({ children }) => {
    return (
        <div>
            <HeaderClient />
            {children}
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ insetInlineEnd: 24 }}
                icon={<CommentOutlined className="text-[30px]" />}
            >
                <ChatBot />
            </FloatButton.Group>
            <FooterClient />
        </div>
    );
};

export default ClientLayout;
