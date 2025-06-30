import Hotel from "components/Profile/Hotel";
import ProfileClientLayout from "layouts/ProfileClientLayout";
import React from "react";

const ProfileHotelPage = () => {
    return (
        <ProfileClientLayout>
            <Hotel />
        </ProfileClientLayout>
    );
};

export default ProfileHotelPage;
