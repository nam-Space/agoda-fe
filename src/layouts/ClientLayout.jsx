import FooterClient from "components/FooterClient";
import HeaderClient from "components/HeaderClient";
import React from "react";

const ClientLayout = ({ children }) => {
    return (
        <div>
            <HeaderClient />
            {children}
            <FooterClient />
        </div>
    );
};

export default ClientLayout;
