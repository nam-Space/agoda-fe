import Chat from "components/Profile/Chat";
import ProfileClientLayout from "layouts/ProfileClientLayout";
import React from "react";

const ProfileChatPage = () => {
    return (
        <ProfileClientLayout>
            <Chat />
        </ProfileClientLayout>
    );
};

export default ProfileChatPage;
