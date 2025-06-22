import React from "react";
import agodaImg from "../images/footer/agoda.svg";
import priceLineImg from "../images/footer/priceline.svg";
import kayakImg from "../images/footer/kayak.svg";
import bookingImg from "../images/footer/booking.svg";
import openTableImg from "../images/footer/opentable.svg";

const FooterClient = () => {
    return (
        <div>
            <div className="bg-[#2a2a2e] py-[48px]">
                <p className="text-white text-center">
                    Mọi nội dung tại đây © 2005 – 2025 Công ty TNHH Tư nhân
                    Agoda. Bảo Lưu Mọi Quyền.
                </p>
                <p className="text-white text-center">
                    Agoda.com là thành viên của Tập đoàn Booking Holdings, nhà
                    cung cấp dịch vụ du lịch trực tuyến & các dịch vụ có liên
                    quan hàng đầu thế giới.
                </p>
                <div className="grid grid-cols-5 max-w-[1132px] mx-auto mt-[35px]">
                    <div>
                        <img src={agodaImg} />
                    </div>
                    <div>
                        <img src={priceLineImg} />
                    </div>
                    <div>
                        <img src={kayakImg} />
                    </div>
                    <div>
                        <img src={bookingImg} />
                    </div>
                    <div>
                        <img src={openTableImg} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterClient;
