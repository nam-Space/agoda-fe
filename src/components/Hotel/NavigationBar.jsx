import { useEffect, useRef } from "react";

const NavigationBar = ({ scrollToSection, hotel }) => {
    const navigationBarRef = useRef(null);
    const sentinelRef = useRef(null);

    const TOP_OFFSET = 88 - 16; // = top: [88px] trong class sticky của bạn

    const displayPrice =
        hotel?.min_price && !isNaN(hotel.min_price)
            ? Number(hotel.min_price).toLocaleString("vi-VN") + " VND"
            : "Liên hệ";

    useEffect(() => {
        const nav = navigationBarRef.current;
        const sentinel = sentinelRef.current;
        if (!nav || !sentinel) return;

        // Chú ý rootMargin âm bằng TOP_OFFSET để trigger đúng lúc nav đến top
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Khi sentinel KHÔNG intersect => đã đi qua vị trí topOffset => add isSticky
                if (!entry.isIntersecting) {
                    nav.classList.add("isSticky");
                } else {
                    nav.classList.remove("isSticky");
                }
            },
            {
                root: null,
                threshold: 0,
                rootMargin: `-${TOP_OFFSET}px 0px 0px 0px`,
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleScrollToRoomOption = () => {
        const roomElement = document.querySelector(".room-options");
        if (roomElement) {
            roomElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* sentinel đặt ngay phía trên nav */}
            <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

            <div
                ref={navigationBarRef}
                className="navigation-bar z-[3] sticky top-[88px] bg-white border border-gray-300 rounded-lg my-4 max-w-6xl mx-auto"
            >
                <div className="p-4 max-w-6xl mx-auto flex items-center justify-between">
                    {/* Navigation Links */}
                    <div className="flex space-x-6 text-gray-600 text-sm">
                        <button
                            onClick={() => scrollToSection("overview")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Tổng quan
                        </button>
                        <button
                            onClick={() => scrollToSection("rooms")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Phòng nghỉ
                        </button>
                        <button
                            onClick={() => scrollToSection("activities")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Làm gì đi đâu
                        </button>
                        <button
                            onClick={() => scrollToSection("host")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Chủ nhà
                        </button>
                        <button
                            onClick={() => scrollToSection("facilities")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Cơ sở vật chất
                        </button>
                        <button
                            onClick={() => scrollToSection("reviews")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Đánh giá
                        </button>
                        <button
                            onClick={() => scrollToSection("location")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Vị trí
                        </button>
                        <button
                            onClick={() => scrollToSection("policy")}
                            className="hover:text-blue-600 font-bold"
                        >
                            Chính sách
                        </button>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center space-x-4">
                        <span className="text-red-600 text-2xl">
                            {displayPrice}
                        </span>
                        <button
                            onClick={handleScrollToRoomOption}
                            className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700"
                        >
                            Xem giá
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavigationBar;
