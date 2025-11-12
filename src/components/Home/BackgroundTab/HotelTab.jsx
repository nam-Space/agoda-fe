import { PlusOutlined, SearchOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Input, InputNumber, Radio, Spin } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoAirplaneOutline } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { LiaChildSolid } from "react-icons/lia";
import { callGetSearchSuggestions, callSaveSearchHistory } from "config/api";

const { RangePicker } = DatePicker;

const HotelTab = () => {
    const [additionFlight, setAdditionFlight] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    
    const [formData, setFormData] = useState({
        option: "night",
        search: "",
        dates: [], 
        room: 1,
        adult: 2,
        child: 0,
        airport: "",
    });
    
    // API data states
    const [recentSearches, setRecentSearches] = useState([]);
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [vietnamDestinations, setVietnamDestinations] = useState([]);
    const [internationalDestinations, setInternationalDestinations] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    
    // Fetch suggestions from API
    const fetchSuggestions = async (query = '') => {
        setLoadingSuggestions(true);
        try {
            const response = await callGetSearchSuggestions(query);
            console.log('🔍 API Response:', response.data);
            if (response.data?.isSuccess) {
                const data = response.data.data;
                console.log('✅ Suggestions data:', {
                    recent: data.recent_searches?.length || 0,
                    featured: data.featured_properties?.length || 0,
                    vietnam: data.vietnam_destinations?.length || 0,
                    international: data.international_destinations?.length || 0
                });
                setRecentSearches(data.recent_searches || []);
                setFeaturedProperties(data.featured_properties || []);
                setVietnamDestinations(data.vietnam_destinations || []);
                setInternationalDestinations(data.international_destinations || []);
                setFilteredSuggestions(data.filtered_suggestions || []);
            }
        } catch (error) {
            console.error('❌ Error fetching suggestions:', error);
        } finally {
            setLoadingSuggestions(false);
        }
    };
    
    // Fetch suggestions when dropdown opens
    useEffect(() => {
        if (showSuggestions) {
            fetchSuggestions(formData.search);
        }
    }, [showSuggestions]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleChangeValue = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const onSearch = async () => {
        const { search, dates, room, adult, child } = formData;

        if (!search || dates.length < 2) {
            alert("Vui lòng nhập đầy đủ thông tin: Điểm đến và Ngày nhận/trả phòng!");
            return;
        }

        // Format dates
        const checkIn = dates[0].format("YYYY-MM-DD");
        const checkOut = dates[1].format("YYYY-MM-DD");
        
        // Save search history to database (KHÔNG dùng mock data)
        try {
            await callSaveSearchHistory({
                destination: search.trim(),
                check_in: checkIn,
                check_out: checkOut,
                adults: adult,
                children: child,
                rooms: room
            });
        } catch (error) {
            console.error('Error saving search history:', error);
            // Continue even if save fails
        }
        
        // Build query params for API
        const params = new URLSearchParams({
            destination: search.trim(),
            check_in: checkIn,
            check_out: checkOut,
            adults: adult,
            rooms: room,
        });

        // Navigate to search page - HotelSearchPage will call API
        const url = `/search?${params.toString()}`;
        window.location.href = url;
    };

    return (
        <div className="relative">
            {additionFlight ? (
                <p className="font-bold">Khách sạn</p>
            ) : (
                <Radio.Group
                    className="flex gap-[8px]"
                    onChange={(e) => handleChangeValue("option", e.target.value)}
                    value={formData.option}
                >
                    <Radio.Button
                        value="night"
                        className="first:rounded-l-[50px] first:rounded-r-[50px]"
                    >
                        Chỗ ở qua đêm
                    </Radio.Button>
                    <Radio.Button
                        value="day"
                        className="last:rounded-l-[50px] last:rounded-r-[50px] before:!hidden"
                    >
                        Chỗ ở trong ngày
                    </Radio.Button>
                </Radio.Group>
            )}
            <div>
                <div className="relative" ref={searchRef}>
                    <Input
                        placeholder="Nhập điểm du lịch hoặc tên khách sạn"
                        size="large"
                        prefix={<SearchOutlined />}
                        className="mt-[12px]"
                        onChange={(e) => handleChangeValue("search", e.target.value)}
                        value={formData.search}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div 
                            ref={dropdownRef}
                            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto"
                            style={{ top: '100%' }}
                        >
                            {loadingSuggestions ? (
                                <div className="flex justify-center items-center p-8">
                                    <Spin tip="Đang tải..." />
                                </div>
                            ) : (
                            <>
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="p-4 border-b">
                                    <div className="text-sm font-semibold text-gray-600 mb-3">Tìm kiếm gần đây</div>
                                    {recentSearches.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer mb-2"
                                            onClick={() => {
                                                handleChangeValue("search", item.city);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">{item.city}</div>
                                                <div className="text-xs text-gray-500">{item.dates}</div>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <UserOutlined className="mr-1" /> {item.guests}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Featured Properties */}
                            <div className="p-4 border-b">
                                <div className="text-sm font-semibold text-gray-600 mb-3">Cơ sở lưu trú nổi bật tại</div>
                                <div className="flex gap-3">
                                    {featuredProperties.map((prop, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex-1 p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                                            onClick={() => {
                                                handleChangeValue("search", prop.name);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div className="text-2xl mb-2">🏨</div>
                                            <div className="font-semibold text-sm mb-1">{prop.name}</div>
                                            <div className="text-xs text-blue-600">{prop.tag}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Destinations */}
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-3">Các điểm đến ở Việt Nam</div>
                                        {vietnamDestinations.map((dest, idx) => (
                                            <div 
                                                key={idx}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer mb-1"
                                                onClick={() => {
                                                    handleChangeValue("search", dest.name);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">
                                                    🏙️
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {dest.name} <span className="text-gray-500 font-normal">{dest.count}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{dest.tags}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-3">Các điểm đến quốc tế</div>
                                        {internationalDestinations.map((dest, idx) => (
                                            <div 
                                                key={idx}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer mb-1"
                                                onClick={() => {
                                                    handleChangeValue("search", dest.name);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl">
                                                    🌏
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {dest.name} <span className="text-gray-500 font-normal">{dest.count}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{dest.tags}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            </>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <RangePicker
                        onChange={(dates) => handleChangeValue("dates", dates)}
                    />
                    <div className="grid grid-cols-3 gap-[12px]">
                        <InputNumber
                            addonBefore={<span>Phòng</span>}
                            prefix={
                                <MdOutlineMeetingRoom className="text-[22px]" />
                            }
                            style={{ width: "100%" }}
                            value={formData.room}
                            onChange={(value) => handleChangeValue("room", value)}
                        />
                        <InputNumber
                            addonBefore={<span>Người lớn</span>}
                            prefix={<HiOutlineUsers className="text-[22px]" />}
                            style={{ width: "100%" }}
                            value={formData.adult}
                            onChange={(value) => handleChangeValue("adult", value)}
                        />
                        <InputNumber
                            addonBefore={<span>Trẻ em</span>}
                            prefix={<LiaChildSolid className="text-[22px]" />}
                            style={{ width: "100%" }}
                            value={formData.child}
                            onChange={(value) => handleChangeValue("child", value)}
                        />
                    </div>
                </div>
                <div>
                    {additionFlight ? (
                        <div>
                            <div className="flex items-center gap-[16px]">
                                <p className="font-bold">Chuyến bay</p>
                                <div
                                    onClick={() => setAdditionFlight(false)}
                                    className="w-fit gap-[3px] text-[#2067da] font-semibold relative h-[36px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                                >
                                    Loại bỏ
                                </div>
                            </div>
                            <Input
                                placeholder="Tên thành phố hoặc sân bay"
                                size="large"
                                prefix={
                                    <IoAirplaneOutline className="text-[20px]" />
                                }
                                className="mt-[12px]"
                                value={formData.airport}
                                onChange={(e) => handleChangeValue("airport", e.target.value)}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() => setAdditionFlight(true)}
                            className="mt-[24px] w-fit gap-[3px] text-[#2067da] font-semibold relative h-[44px] flex justify-center items-center px-[16px] rounded-[50px] border-[1px] border-[#f8f7f9] after:bg-[#2067da] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-0 hover:after:opacity-10 after:transition-all after:duration-300 after:rounded-[50px]"
                        >
                            <PlusOutlined className="text-[20px]" /> Bổ sung
                            chuyến bay
                        </div>
                    )}
                </div>
                <div 
                className="absolute left-[50%] translate-x-[-50%] w-[466px] mt-[20px] text-center py-[12px] text-white bg-[#5392f9] border-[1px] border-[#5392f9] text-[20px] rounded-[8px] cursor-pointer"
                onClick={onSearch}
                >
                    Tìm
                </div>
            </div>
        </div>
    );
};

export default HotelTab;
