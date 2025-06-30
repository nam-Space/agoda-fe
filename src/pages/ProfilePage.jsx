import Profile from "components/Profile";
import ProfileClientLayout from "layouts/ProfileClientLayout";
import React from "react";

const ProfilePage = () => {
    return (
        <ProfileClientLayout>
            <Profile />
        </ProfileClientLayout>
    );
};

export default ProfilePage;
