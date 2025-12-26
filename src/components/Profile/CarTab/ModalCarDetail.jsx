import { Button, ConfigProvider, Modal, Steps } from "antd";
import vi_VN from "antd/locale/vi_VN";
import { haversine } from "utils/googleMap";
import { getImage, getUserAvatar } from "utils/imageUrl";
import { Icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import markerImg from "../../../images/booking-vehicles/google-map/marker.webp";
import _ from "lodash";
import "leaflet/dist/leaflet.css";
import MapUpdater from "./MapUpdater";
import dayjs from "dayjs";

const ModalCarDetail = (props) => {
    const { selectedPayment, setSelectedPayment, isModalOpen, setIsModalOpen } =
        props;

    const carBookingDetail = selectedPayment?.booking?.car_detail?.[0];

    const lat1 = carBookingDetail?.lat1;
    const lng1 = carBookingDetail?.lng1;
    const lat2 = carBookingDetail?.lat2;
    const lng2 = carBookingDetail?.lng2;

    const isValidCoords = lat1 && lng1 && lat2 && lng2;

    const distance = isValidCoords ? haversine(lat1, lng1, lat2, lng2) : 0;

    let zoomLevel = 11;
    if (distance < 100) zoomLevel = 10;
    else if (distance < 500) zoomLevel = 8;
    else if (distance < 1500) zoomLevel = 5;
    else zoomLevel = 3;

    const center = isValidCoords
        ? [(lat1 + lat2) / 2, (lng1 + lng2) / 2]
        : [0, 0];

    const handleCloseModal = () => {
        setSelectedPayment({});
        setIsModalOpen(false);
    };

    return (
        <ConfigProvider locale={vi_VN}>
            <Modal
                title="🚕 Chi tiết chuyến taxi"
                open={isModalOpen}
                onCancel={handleCloseModal}
                width={1000}
                footer={
                    <Button type="primary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                }
            >
                <div className="space-y-6">
                    {/* TOP SECTION */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* LEFT INFO */}
                        <div className="col-span-4 bg-white rounded-xl border p-4 space-y-6 shadow-sm">
                            {/* DRIVER */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">
                                    🚕 Tài xế
                                </p>
                                {carBookingDetail?.driver && (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={getUserAvatar(
                                                carBookingDetail.driver.avatar
                                            )}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {
                                                    carBookingDetail.driver
                                                        .first_name
                                                }{" "}
                                                {
                                                    carBookingDetail.driver
                                                        .last_name
                                                }
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                @
                                                {
                                                    carBookingDetail.driver
                                                        .username
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CAR */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">
                                    🚗 Xe taxi
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getImage(
                                            carBookingDetail?.car?.image
                                        )}
                                        alt=""
                                        className="w-16 h-10 object-contain"
                                    />
                                    <p className="font-medium text-sm">
                                        {carBookingDetail?.car?.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MAP */}
                        <div className="col-span-8 bg-white rounded-xl border shadow-sm overflow-hidden">
                            <div className="px-4 py-2 border-b text-sm font-medium text-gray-600">
                                🗺️ Lộ trình chuyến đi
                            </div>

                            {isValidCoords && (
                                <MapContainer
                                    center={center}
                                    zoom={zoomLevel}
                                    scrollWheelZoom
                                    className="w-full h-[280px]"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                    <MapUpdater
                                        center={center}
                                        zoom={zoomLevel}
                                        bounds={[
                                            [lat1, lng1],
                                            [lat2, lng2],
                                        ]}
                                        isModalOpen={isModalOpen}
                                    />

                                    <Marker
                                        position={[lat1, lng1]}
                                        icon={
                                            new Icon({
                                                iconUrl: markerImg,
                                                iconSize: [36, 36],
                                                iconAnchor: [18, 36],
                                            })
                                        }
                                    />

                                    <Marker
                                        position={[lat2, lng2]}
                                        icon={
                                            new Icon({
                                                iconUrl: markerImg,
                                                iconSize: [36, 36],
                                                iconAnchor: [18, 36],
                                            })
                                        }
                                    />
                                </MapContainer>
                            )}
                        </div>
                    </div>

                    {/* STEPS */}
                    {!_.isEmpty(carBookingDetail) && (
                        <div className="bg-white rounded-xl border p-6 shadow-sm">
                            <p className="font-medium mb-4 text-gray-700">
                                📍 Trạng thái chuyến đi
                            </p>

                            <Steps
                                progressDot
                                current={carBookingDetail.status}
                                items={[
                                    { title: "Bắt đầu" },
                                    {
                                        title: "Đã đón khách",
                                        description: (
                                            <div className="space-y-2">
                                                <p>
                                                    📍{" "}
                                                    <strong>
                                                        {
                                                            carBookingDetail.pickup_location
                                                        }
                                                    </strong>
                                                </p>
                                                <p>
                                                    🕒{" "}
                                                    {dayjs(
                                                        carBookingDetail.pickup_datetime
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                </p>
                                            </div>
                                        ),
                                    },
                                    { title: "Đang di chuyển" },
                                    {
                                        title: "Đã đến nơi",
                                        description:
                                            carBookingDetail.dropoff_datetime && (
                                                <div className="space-y-2">
                                                    <p>
                                                        📍{" "}
                                                        <strong>
                                                            {
                                                                carBookingDetail.dropoff_location
                                                            }
                                                        </strong>
                                                    </p>
                                                    <p>
                                                        🕒{" "}
                                                        {dayjs(
                                                            carBookingDetail.dropoff_datetime
                                                        ).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default ModalCarDetail;
