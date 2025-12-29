import {
    DatePicker,
    Empty,
    Input,
    InputNumber,
    Popover,
    Radio,
    Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline, IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
    callFetchAirport,
    callFetchHotelQuery,
    callFetchLocationMapInAllWorld,
} from "../../../config/api";
import { toast } from "react-toastify";

const AirportTab = () => {
    const navigate = useNavigate();
    const [option, setOption] = useState("from-airport");
    const [popoverFromAirportIn, setPopoverFromAirportIn] = useState({
        airportIn: false,
        locationTo: false,
    });
    const [popoverFromLocationIn, setPopoverFromLocationIn] = useState({
        locationIn: false,
        airportTo: false,
    });

    const [loadingFromAirportIn, setLoadingFromAirportIn] = useState({
        airportIn: false,
        locationTo: false,
    });
    const [loadingFromLocationIn, setLoadingFromLocationIn] = useState({
        locationIn: false,
        airportTo: false,
    });

    const [formFromAirportIn, setFormFromAirportIn] = useState({
        airportIn: {
            lat: null,
            lng: null,
            name: "",
        },
        locationTo: {
            lat: null,
            lng: null,
            name: "",
        },
        timeStart: null,
        capacity: null,
    });
    const [formFromLocationIn, setFormFromLocationIn] = useState({
        locationIn: {
            lat: null,
            lng: null,
            name: "",
        },
        airportTo: {
            lat: null,
            lng: null,
            name: "",
        },
        timeStart: null,
        capacity: null,
    });

    const [resultFromAirportIn, setResultFromAirportIn] = useState({
        resultsAirportIn: [],
        resultsLocationTo: [],
    });
    const [resultFromLocationIn, setResultFromLocationIn] = useState({
        resultsLocationIn: [],
        resultsAirportTo: [],
    });

    const handleGetLocation = async (type) => {
        try {
            if (type === "location-in") {
                setLoadingFromLocationIn({
                    ...loadingFromLocationIn,
                    locationIn: true,
                });
                const res = await callFetchLocationMapInAllWorld(
                    encodeURIComponent(formFromLocationIn.locationIn.name)
                );
                if (res?.data?.features && res?.data?.features?.length > 0) {
                    setResultFromLocationIn({
                        ...resultFromLocationIn,
                        resultsLocationIn: res.data.features,
                    });
                }
                setLoadingFromLocationIn({
                    ...loadingFromLocationIn,
                    locationIn: false,
                });
            } else {
                setLoadingFromAirportIn({
                    ...loadingFromAirportIn,
                    locationTo: true,
                });
                const res = await callFetchHotelQuery(
                    `current=1&pageSize=10&name=${formFromAirportIn.locationTo.name}`
                );
                if (res.isSuccess) {
                    setResultFromAirportIn({
                        ...resultFromAirportIn,
                        resultsLocationTo: res.data,
                    });
                }
                setLoadingFromAirportIn({
                    ...loadingFromAirportIn,
                    locationTo: false,
                });
            }
        } catch (e) {
            toast.error(e.message, {
                position: "bottom-right",
            });
        }
    };

    const handleGetAirport = async (type) => {
        try {
            if (type === "location-in") {
                setLoadingFromLocationIn({
                    ...loadingFromLocationIn,
                    airportTo: true,
                });
                const res = await callFetchAirport(
                    `current=1&pageSize=10&name=${formFromLocationIn.airportTo.name}`
                );
                if (res.isSuccess) {
                    setResultFromLocationIn({
                        ...resultFromLocationIn,
                        resultsAirportTo: res.data,
                    });
                }
                setLoadingFromLocationIn({
                    ...loadingFromLocationIn,
                    airportTo: false,
                });
            } else {
                setLoadingFromAirportIn({
                    ...loadingFromAirportIn,
                    airportIn: true,
                });
                const res = await callFetchAirport(
                    `current=1&pageSize=10&name=${formFromAirportIn.airportIn.name}`
                );
                if (res.isSuccess) {
                    setResultFromAirportIn({
                        ...resultFromAirportIn,
                        resultsAirportIn: res.data,
                    });
                }
                setLoadingFromAirportIn({
                    ...loadingFromAirportIn,
                    airportIn: false,
                });
            }
        } catch (e) {
            toast.error(e.message, {
                position: "bottom-right",
            });
        }
    };

    useEffect(() => {
        if (!popoverFromAirportIn.airportIn) return;
        if (!formFromAirportIn.airportIn.name) {
            setResultFromAirportIn({
                ...resultFromAirportIn,
                resultsAirportIn: [],
            });
            return;
        }

        setLoadingFromAirportIn({
            ...loadingFromAirportIn,
            airportIn: true,
        });

        const timeoutId = setTimeout(() => {
            handleGetAirport("airport-in");
        }, 500); // debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [formFromAirportIn.airportIn.name]);

    useEffect(() => {
        if (!popoverFromAirportIn.locationTo) return;
        if (!formFromAirportIn.locationTo.name) {
            setResultFromAirportIn({
                ...resultFromAirportIn,
                resultsAirportIn: [],
            });
            return;
        }

        setLoadingFromAirportIn({
            ...loadingFromAirportIn,
            locationTo: true,
        });

        const timeoutId = setTimeout(() => {
            handleGetLocation("airport-in");
        }, 500); // debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [formFromAirportIn.locationTo.name]);

    useEffect(() => {
        if (!popoverFromLocationIn.locationIn) return;
        if (!formFromLocationIn.locationIn.name) {
            setResultFromLocationIn({
                ...resultFromLocationIn,
                resultsLocationIn: [],
            });
            return;
        }

        setLoadingFromLocationIn({
            ...loadingFromLocationIn,
            locationIn: true,
        });

        const timeoutId = setTimeout(() => {
            handleGetLocation("location-in");
        }, 500); // debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [formFromLocationIn.locationIn.name]);

    useEffect(() => {
        if (!popoverFromLocationIn.airportTo) return;
        if (!formFromLocationIn.airportTo.name) {
            setResultFromLocationIn({
                ...resultFromLocationIn,
                resultsLocationIn: [],
            });
            return;
        }

        setLoadingFromLocationIn({
            ...loadingFromLocationIn,
            airportTo: true,
        });

        const timeoutId = setTimeout(() => {
            handleGetAirport("location-in");
        }, 500); // debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [formFromLocationIn.airportTo.name]);

    const handleSubmit = () => {
        if (option === "from-airport") {
            if (
                !formFromAirportIn.airportIn.lat ||
                !formFromAirportIn.airportIn.lng ||
                !formFromAirportIn.locationTo.lat ||
                !formFromAirportIn.locationTo.lng
            ) {
                toast.error("Vui lòng chọn địa điểm", {
                    position: "bottom-right",
                });
                return;
            }

            if (!formFromAirportIn.timeStart) {
                toast.error("Vui lòng nhập thời gian khởi hành", {
                    position: "bottom-right",
                });
                return;
            }
            if (!formFromAirportIn.capacity) {
                toast.error("Vui lòng điền số lượng người đi", {
                    position: "bottom-right",
                });
                return;
            }

            navigate("/booking-vehicles", {
                state: {
                    option,
                    formFromAirportIn,
                },
            });
        } else {
            if (
                !formFromLocationIn.airportTo.lat ||
                !formFromLocationIn.airportTo.lng ||
                !formFromLocationIn.locationIn.lat ||
                !formFromLocationIn.locationIn.lng
            ) {
                toast.error("Vui lòng chọn địa điểm", {
                    position: "bottom-right",
                });
                return;
            }

            if (!formFromLocationIn.timeStart) {
                toast.error("Vui lòng nhập thời gian khởi hành", {
                    position: "bottom-right",
                });
                return;
            }
            if (!formFromLocationIn.capacity) {
                toast.error("Vui lòng điền số lượng người đi", {
                    position: "bottom-right",
                });
                return;
            }

            navigate("/booking-vehicles", {
                state: {
                    option,
                    formFromLocationIn,
                },
            });
        }
    };

    return (
        <div className="relative">
            <Radio.Group
                className="flex gap-[8px]"
                value={option}
                onChange={(e) => setOption(e.target.value)}
            >
                <Radio.Button
                    value="from-airport"
                    className="first:rounded-l-[50px] first:rounded-r-[50px]"
                >
                    Từ sân bay
                </Radio.Button>
                <Radio.Button
                    value="from-location"
                    className="last:rounded-l-[50px] last:rounded-r-[50px] before:!hidden"
                >
                    Đến sân bay
                </Radio.Button>
            </Radio.Group>
            <div>
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    {option === "from-airport" ? (
                        <>
                            <Popover
                                content={
                                    <div>
                                        {loadingFromAirportIn.airportIn ? (
                                            <div className="flex justify-center items-center py-[20px]">
                                                <Spin size="large" />
                                            </div>
                                        ) : resultFromAirportIn.resultsAirportIn
                                              .length === 0 ? (
                                            <Empty
                                                description="Chưa có thông tin"
                                                className="bg-[#abb6cb1f] mx-0 px-[90px] py-[24px] rounded-[16px] mt-[24px] w-full"
                                            />
                                        ) : (
                                            resultFromAirportIn.resultsAirportIn.map(
                                                (place, idx) => (
                                                    <li
                                                        key={idx}
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom:
                                                                "1px solid #eee",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            setFormFromAirportIn(
                                                                {
                                                                    ...formFromAirportIn,
                                                                    airportIn: {
                                                                        lat: place.lat, // lat
                                                                        lng: place.lng, // lng
                                                                        name: place.name,
                                                                    },
                                                                }
                                                            );
                                                            setPopoverFromAirportIn(
                                                                {
                                                                    ...popoverFromAirportIn,
                                                                    airportIn: false,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {place.name}
                                                    </li>
                                                )
                                            )
                                        )}
                                    </div>
                                }
                                title="Sân bay đón khách"
                                trigger="click"
                                open={popoverFromAirportIn.airportIn}
                                onOpenChange={(val) =>
                                    setPopoverFromAirportIn({
                                        ...popoverFromAirportIn,
                                        airportIn: val,
                                    })
                                }
                                placement="bottomLeft"
                            >
                                <Input
                                    placeholder="Sân bay đón khách"
                                    size="large"
                                    prefix={
                                        <IoAirplaneOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                    value={formFromAirportIn.airportIn.name}
                                    onChange={(e) => {
                                        setFormFromAirportIn({
                                            ...formFromAirportIn,
                                            airportIn: {
                                                lat: null, // lat
                                                lng: null, // lng
                                                name: e.target.value,
                                            },
                                        });
                                        setPopoverFromAirportIn({
                                            ...popoverFromAirportIn,
                                            airportIn: !!e.target.value,
                                        });
                                    }}
                                />
                            </Popover>
                            <Popover
                                content={
                                    <div>
                                        {loadingFromAirportIn.locationTo ? (
                                            <div className="flex justify-center items-center py-[20px]">
                                                <Spin size="large" />
                                            </div>
                                        ) : resultFromAirportIn
                                              .resultsLocationTo.length ===
                                          0 ? (
                                            <Empty
                                                description="Chưa có thông tin"
                                                className="bg-[#abb6cb1f] mx-0 px-[90px] py-[24px] rounded-[16px] mt-[24px] w-full"
                                            />
                                        ) : (
                                            resultFromAirportIn.resultsLocationTo.map(
                                                (place, idx) => (
                                                    <li
                                                        key={idx}
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom:
                                                                "1px solid #eee",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            setFormFromAirportIn(
                                                                {
                                                                    ...formFromAirportIn,
                                                                    locationTo:
                                                                        {
                                                                            lat: place.lat, // lat
                                                                            lng: place.lng, // lng
                                                                            name: place.name,
                                                                        },
                                                                }
                                                            );
                                                            setPopoverFromAirportIn(
                                                                {
                                                                    ...popoverFromAirportIn,
                                                                    locationTo: false,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {place.name}
                                                    </li>
                                                )
                                            )
                                        )}
                                    </div>
                                }
                                title="Địa điểm đến"
                                trigger="click"
                                open={popoverFromAirportIn.locationTo}
                                onOpenChange={(val) =>
                                    setPopoverFromAirportIn({
                                        ...popoverFromAirportIn,
                                        locationTo: val,
                                    })
                                }
                                placement="bottomLeft"
                            >
                                <Input
                                    placeholder="Địa điểm đến"
                                    size="large"
                                    prefix={
                                        <IoLocationOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                    value={formFromAirportIn.locationTo.name}
                                    onChange={(e) => {
                                        setFormFromAirportIn({
                                            ...formFromAirportIn,
                                            locationTo: {
                                                lat: null, // lat
                                                lng: null, // lng
                                                name: e.target.value,
                                            },
                                        });
                                        setPopoverFromAirportIn({
                                            ...popoverFromAirportIn,
                                            locationTo: !!e.target.value,
                                        });
                                    }}
                                />
                            </Popover>
                        </>
                    ) : (
                        <>
                            <Popover
                                content={
                                    <div>
                                        {loadingFromLocationIn.locationIn ? (
                                            <div className="flex justify-center items-center py-[20px]">
                                                <Spin size="large" />
                                            </div>
                                        ) : resultFromLocationIn
                                              .resultsLocationIn.length ===
                                          0 ? (
                                            <Empty
                                                description="Chưa có thông tin"
                                                className="bg-[#abb6cb1f] mx-0 px-[90px] py-[24px] rounded-[16px] mt-[24px] w-full"
                                            />
                                        ) : (
                                            resultFromLocationIn.resultsLocationIn.map(
                                                (place, idx) => (
                                                    <li
                                                        key={idx}
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom:
                                                                "1px solid #eee",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            setFormFromLocationIn(
                                                                {
                                                                    ...formFromLocationIn,
                                                                    locationIn:
                                                                        {
                                                                            lat: place
                                                                                .geometry
                                                                                .coordinates[1], // lat
                                                                            lng: place
                                                                                .geometry
                                                                                .coordinates[0], // lng
                                                                            name:
                                                                                place
                                                                                    .properties
                                                                                    .name ||
                                                                                place
                                                                                    .properties
                                                                                    .city ||
                                                                                "Unknown",
                                                                        },
                                                                }
                                                            );
                                                            setPopoverFromLocationIn(
                                                                {
                                                                    ...popoverFromLocationIn,
                                                                    locationIn: false,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {place.properties
                                                            .name ||
                                                            place.properties
                                                                .city ||
                                                            "Unknown"}
                                                        ,{" "}
                                                        {
                                                            place.properties
                                                                .country
                                                        }
                                                    </li>
                                                )
                                            )
                                        )}
                                    </div>
                                }
                                title="Địa điểm đón khách"
                                trigger="click"
                                open={popoverFromLocationIn.locationIn}
                                onOpenChange={(val) =>
                                    setPopoverFromLocationIn({
                                        ...popoverFromLocationIn,
                                        locationIn: val,
                                    })
                                }
                                placement="bottomLeft"
                            >
                                <Input
                                    placeholder="Địa điểm đón khách"
                                    size="large"
                                    prefix={
                                        <IoLocationOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                    value={formFromLocationIn.locationIn.name}
                                    onChange={(e) => {
                                        setFormFromLocationIn({
                                            ...formFromLocationIn,
                                            locationIn: {
                                                lat: null, // lat
                                                lng: null, // lng
                                                name: e.target.value,
                                            },
                                        });
                                        setPopoverFromLocationIn({
                                            ...popoverFromLocationIn,
                                            locationIn: !!e.target.value,
                                        });
                                    }}
                                />
                            </Popover>
                            <Popover
                                content={
                                    <div>
                                        {loadingFromLocationIn.airportTo ? (
                                            <div className="flex justify-center items-center py-[20px]">
                                                <Spin size="large" />
                                            </div>
                                        ) : resultFromLocationIn
                                              .resultsAirportTo.length === 0 ? (
                                            <Empty
                                                description="Chưa có thông tin"
                                                className="bg-[#abb6cb1f] mx-0 px-[90px] py-[24px] rounded-[16px] mt-[24px] w-full"
                                            />
                                        ) : (
                                            resultFromLocationIn.resultsAirportTo.map(
                                                (place, idx) => (
                                                    <li
                                                        key={idx}
                                                        style={{
                                                            padding: "8px",
                                                            borderBottom:
                                                                "1px solid #eee",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            setFormFromLocationIn(
                                                                {
                                                                    ...formFromLocationIn,
                                                                    airportTo: {
                                                                        lat: place.lat, // lat
                                                                        lng: place.lng, // lng
                                                                        name: place.name,
                                                                    },
                                                                }
                                                            );
                                                            setPopoverFromLocationIn(
                                                                {
                                                                    ...popoverFromLocationIn,
                                                                    airportTo: false,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {place.name}
                                                    </li>
                                                )
                                            )
                                        )}
                                    </div>
                                }
                                title="Sân bay đến"
                                trigger="click"
                                open={popoverFromLocationIn.airportTo}
                                onOpenChange={(val) =>
                                    setPopoverFromLocationIn({
                                        ...popoverFromLocationIn,
                                        airportTo: val,
                                    })
                                }
                                placement="bottomLeft"
                            >
                                <Input
                                    placeholder="Sân bay đến"
                                    size="large"
                                    prefix={
                                        <IoAirplaneOutline className="text-[22px]" />
                                    }
                                    className="mt-[12px]"
                                    value={formFromLocationIn.airportTo.name}
                                    onChange={(e) => {
                                        setFormFromLocationIn({
                                            ...formFromLocationIn,
                                            airportTo: {
                                                lat: null, // lat
                                                lng: null, // lng
                                                name: e.target.value,
                                            },
                                        });
                                        setPopoverFromLocationIn({
                                            ...popoverFromLocationIn,
                                            airportTo: !!e.target.value,
                                        });
                                    }}
                                />
                            </Popover>
                        </>
                    )}
                </div>
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    {option === "from-airport" ? (
                        <>
                            <DatePicker
                                showTime
                                onChange={(value, dateString) => {
                                    console.log("Selected Time: ", value);
                                    console.log(
                                        "Formatted Selected Time: ",
                                        dateString
                                    );
                                    setFormFromAirportIn({
                                        ...formFromAirportIn,
                                        timeStart: value.toString(),
                                    });
                                }}
                                placeholder="Chọn thời gian"
                            />
                            <InputNumber
                                addonBefore={<span>Người lớn</span>}
                                prefix={
                                    <HiOutlineUsers className="text-[22px]" />
                                }
                                style={{ width: "100%" }}
                                value={formFromAirportIn.capacity}
                                onChange={(val) =>
                                    setFormFromAirportIn({
                                        ...formFromAirportIn,
                                        capacity: val,
                                    })
                                }
                            />
                        </>
                    ) : (
                        <>
                            <DatePicker
                                showTime
                                onChange={(value, dateString) => {
                                    console.log("Selected Time: ", value);
                                    console.log(
                                        "Formatted Selected Time: ",
                                        dateString
                                    );
                                    setFormFromLocationIn({
                                        ...formFromLocationIn,
                                        timeStart: value.toString(),
                                    });
                                }}
                                onOk={(val) => {
                                    console.log(val);
                                }}
                                placeholder="Chọn thời gian"
                            />
                            <InputNumber
                                addonBefore={<span>Người lớn</span>}
                                prefix={
                                    <HiOutlineUsers className="text-[22px]" />
                                }
                                style={{ width: "100%" }}
                                value={formFromLocationIn.capacity}
                                onChange={(val) =>
                                    setFormFromLocationIn({
                                        ...formFromLocationIn,
                                        capacity: val,
                                    })
                                }
                            />
                        </>
                    )}
                </div>
                <div
                    onClick={handleSubmit}
                    className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
                >
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default AirportTab;
