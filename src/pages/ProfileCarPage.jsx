import Car from "components/Profile/Car";
import ProfileClientLayout from "layouts/ProfileClientLayout";
import React from "react";

const ProfileCarPage = () => {
    return (
        <ProfileClientLayout>
            <Car />
        </ProfileClientLayout>
    );
};

export default ProfileCarPage;
