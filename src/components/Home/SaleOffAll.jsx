// import { Navigation } from "swiper/modules";
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Link } from "react-router-dom";
// import { getPromotions } from "../../config/api";

// const SaleOffFlight = () => {
//     const type = "flight";
//     const [promotions, setPromotions] = useState([]);

//     useEffect(() => {
//         const fetchPromotions = async () => {
//             try {
//                 const res = await getPromotions({ promotion_type: 2 });
//                 setPromotions(res.results || []);
//             } catch (error) {
//                 console.error("Lỗi khi load promotions:", error);
//             }
//         };
//         fetchPromotions();
//     }, []);

//     return (
//         <div>
//             <div className="w-[1124px] mx-auto mt-[64px]">
//                 <h2 className="text-[24px] font-bold">
//                     Khuyến mại Chuyến bay
//                 </h2>
//                 <Swiper
//                     slidesPerView={4}
//                     spaceBetween={30}
//                     navigation={true}
//                     loop={true}
//                     modules={[Navigation]}
//                     className="mt-[24px]"
//                 >
//                     {promotions.map((promo) => (
//                         <SwiperSlide key={promo.id}>
//                             <Link to={`/promotions/${promo.id}?type=${type}`}>
//                                 <img
//                                     src={promo.image || "/default-promo.jpg"}
//                                     alt={promo.title}
//                                     className="w-full h-[154px] rounded-[16px] object-cover"
//                                 />
//                             </Link>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </div>
//     );
// };

// export default SaleOffFlight;

// không sửa file, chỉ ví dụ
import React, { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { getPromotions } from "../../config/api";
import "swiper/css";
import "swiper/css/navigation";

const extractList = (res) => {
    return res?.data || res?.results || [];
};

const SaleOffSection = ({ title, typeQuery, typeParam = "", promotions }) => (
    <div className="w-[1124px] mx-auto mt-[32px]">
        <h2 className="text-[24px] font-bold">{title}</h2>
        <Swiper
            slidesPerView={4}
            spaceBetween={30}
            navigation={true}
            loop={Boolean(promotions && promotions.length > 4)}
            modules={[Navigation]}
            className="mt-[24px]"
        >
            {promotions.map((promo) => (
                <SwiperSlide key={promo.id}>
                    <Link
                        to={`/promotions/${promo.id}?type=${
                            typeParam || typeQuery
                        }`}
                    >
                        <img
                            src={promo.image || "/default-promo.jpg"}
                            alt={promo.title}
                            className="w-full h-[154px] rounded-[16px] object-cover"
                        />
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
);

const SaleOffAll = () => {
    const [accom, setAccom] = useState([]);
    const [flight, setFlight] = useState([]);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [r1, r2, r3] = await Promise.all([
                    getPromotions({ promotion_type: 1 }),
                    getPromotions({ promotion_type: 2 }),
                    getPromotions({ promotion_type: 3 }),
                ]);
                setAccom(extractList(r1));
                setFlight(extractList(r2));
                setActivity(extractList(r3));
            } catch (err) {
                console.error("Lỗi khi load promotions:", err);
            }
        };
        fetchAll();
    }, []);

    return (
        <div>
            <SaleOffSection
                title="Chương trình khuyến mại chỗ ở"
                typeQuery="accommodation"
                typeParam="accommodation"
                promotions={accom}
            />
            <SaleOffSection
                title="Khuyến mại Chuyến bay"
                typeQuery="flight"
                typeParam="flight"
                promotions={flight}
            />
            <SaleOffSection
                title="Khuyến mại Hoạt động"
                typeQuery="activity"
                typeParam="activity"
                promotions={activity}
            />
        </div>
    );
};

export default SaleOffAll;
