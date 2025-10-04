// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Spin, Empty, Pagination, message } from "antd";
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
// import { 
//   fetchHotelsByCity, 
//   setFilters, 
//   setSortBy, 
//   setCurrentPage 
// } from "../../../redux/slice/hotelSlice";
// import FilterGroup from './FilterGroup';
// import SortBar from './SortBar';
// import HotelCard from './HotelCard';

// // HotelList component
// const HotelList = ({ hotels, loading }) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <Spin size="large" />
//       </div>
      
//     );
//   }

//   if (!hotels || hotels.length === 0) {
//     return (
//       <div className="py-8">
//         <Empty 
//           description="Không tìm thấy khách sạn nào"
//           image={Empty.PRESENTED_IMAGE_SIMPLE}
//         />
//       </div>
//     );
//   }

//   return (
//     <div>
//       {hotels.map((hotel, idx) => (
//         <HotelCard key={hotel.id || idx} hotel={hotel} />
//       ))}
//     </div>
//   );
// };

// // Transform API data to match component format
// const transformHotelData = (apiHotel) => {
//   // Helper function to strip HTML tags
//   const stripHtml = (html) => {
//     if (!html) return "";
//     return html.replace(/<[^>]*>/g, '').trim();
//   };

//   // Helper function to extract facilities from HTML table
//   const extractFacilities = (htmlTable) => {
//     if (!htmlTable) return [];
//     const matches = htmlTable.match(/>([^<]+)</g);
//     return matches ? matches
//       .map(match => match.replace(/[><]/g, '').trim())
//       .filter(text => text && text !== '' && text.length > 1)
//       .slice(0, 4) : []; // Limit to 4 for card display
//   };

//   // Helper function to get full image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return "/default-hotel.jpg";
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${process.env.REACT_APP_BE_URL}${imagePath}`;
//   };

//   // Helper function to create hotel slug
//   const createHotelSlug = (hotelName, hotelId) => {
//     if (!hotelName) return hotelId;
    
//     return hotelName
//       .toLowerCase()
//       .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
//       .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
//       .replace(/ì|í|ị|ỉ|ĩ/g, "i")
//       .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
//       .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
//       .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
//       .replace(/đ/g, "d")
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .trim()
//       + `-${hotelId}`;
//   };

//   return {
//     id: apiHotel.id,
//     name: apiHotel.name || "Khách sạn",
//     image: getImageUrl(apiHotel.images?.[0]?.image),
//     thumbnails: apiHotel.images?.map(img => getImageUrl(img.image)) || [],
//     stars: Math.floor(apiHotel.avg_star || 0),
//     area: apiHotel.location || "N/A",
//     mapUrl: apiHotel.lat && apiHotel.lng ? 
//       `https://maps.google.com/?q=${apiHotel.lat},${apiHotel.lng}` : null,
//     facilities: extractFacilities(apiHotel.facilities),
//     review: stripHtml(apiHotel.description) || "",
//     rating: apiHotel.avg_star?.toFixed(1) || "N/A",
//     ratingText: getRatingText(apiHotel.avg_star || 0),
//     ratingCount: Math.floor(Math.random() * 1000) + 100, // Mock data
//     price: "Liên hệ", // Mock data - có thể thêm field price vào API
//     url: `/hotel/${createHotelSlug(apiHotel.name, apiHotel.id)}`, // Use slug instead of ID
//     // Additional data for better display
//     cityName: apiHotel.city?.name || "",
//     point: apiHotel.point || 0,
//     withUs: stripHtml(apiHotel.withUs) || "",
//     slug: createHotelSlug(apiHotel.name, apiHotel.id)
//   };
// };

// const getRatingText = (rating) => {
//   if (rating >= 9) return "Tuyệt hảo";
//   if (rating >= 8) return "Rất tốt"; 
//   if (rating >= 7) return "Tốt";
//   if (rating >= 6) return "Ổn";
//   return "Trung bình";
// };

// const TopHotel = () => {
//   const { cityName } = useParams(); // Lấy cityName từ URL
//   const dispatch = useAppDispatch();
  
//   // Get state from Redux - với safe destructuring
//   const hotelState = useAppSelector(state => state.hotel || {});
//   const {
//     hotels = [],
//     isLoadingHotels = false,
//     totalHotels = 0,
//     currentPage = 1,
//     pageSize = 10,
//     totalPages = 0,
//     sortBy = 0,
//     filters = {},
//     error = null
//   } = hotelState;

//   // Local state cho cityId
//   const [cityId, setCityId] = useState(null);

//   // Filter options (có thể customize theo nhu cầu)
//   const filterOptions = [
//     { 
//       title: "Đánh giá sao", 
//       key: "avg_star",
//       options: [
//         { label: "5 sao", value: "5" },
//         { label: "4 sao", value: "4" },
//         { label: "3 sao", value: "3" },
//         { label: "2 sao", value: "2" },
//         { label: "1 sao", value: "1" }
//       ] 
//     },
//     { 
//       title: "Điểm đánh giá", 
//       key: "rating_range",
//       options: [
//         { label: "Trên cả tuyệt vời 9+", value: "9+" },
//         { label: "Rất tốt 8+", value: "8+" },
//         { label: "Tốt 7+", value: "7+" },
//         { label: "Dễ chịu 6+", value: "6+" }
//       ] 
//     },
//   ];

//   const sortOptions = [
//     "Lựa chọn hàng đầu của chúng tôi",
//     "Giá thấp nhất trước", 
//     "Gần nhất với",
//     "Được đánh giá tốt nhất",
//   ];

//   // Fetch hotels when component mounts or dependencies change
//   useEffect(() => {
//     if (cityId) {
//       dispatch(fetchHotelsByCity({
//         cityId,
//         currentPage,
//         pageSize,
//         filters
//       }));
//     }
//   }, [dispatch, cityId, currentPage, pageSize, filters]);

//   // Mock function để lấy cityId từ cityName
//   // Trong thực tế, bạn có thể cần API để convert cityName -> cityId
//   useEffect(() => {
//     const getCityIdFromName = async (cityName) => {
//       // Mock implementation
//       // Bạn có thể tạo API mapping cityName -> cityId
//       const cityMapping = {
//         'da-nang': 1,
//         'ho-chi-minh': 2, 
//         'ha-noi': 3,
//         // ... thêm mapping khác
//       };
      
//       const id = cityMapping[cityName] || 1; // Default to 1 if not found
//       setCityId(id);
//     };

//     if (cityName) {
//       getCityIdFromName(cityName);
//     }
//   }, [cityName]);

//   // Handle sort change
//   const handleSortChange = (sortIndex) => {
//     dispatch(setSortBy(sortIndex));
//     // Có thể implement logic sort tại đây hoặc trong API call
//   };

//   // Handle pagination change
//   const handlePageChange = (page, size) => {
//     dispatch(setCurrentPage(page));
//     if (size !== pageSize) {
//       // Handle page size change if needed
//     }
//   };

//   // Handle filter change
//   const handleFilterChange = (filterKey, values) => {
//     dispatch(setFilters({
//       [filterKey]: values
//     }));
//   };

//   // Transform API hotels to component format
//   const transformedHotels = hotels.map(transformHotelData);

//   // Show error message
//   useEffect(() => {
//     if (error) {
//       message.error(error);
//     }
//   }, [error]);

//   return (
//     <div className="bg-white rounded-xl shadow p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-6">
//         {totalHotels > 0 ? `${totalHotels} khách sạn tốt nhất` : "Khách sạn"} 
//         {cityName ? ` ở ${cityName.replace('-', ' ')}` : ""}
//       </h2>
      
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filter Panel */}
//         <div className="md:w-1/6">
//           {filterOptions.map((group, idx) => (
//             <FilterGroup 
//               key={idx} 
//               title={group.title} 
//               options={group.options.map(opt => opt.label)}
//               onFilterChange={(values) => handleFilterChange(group.key, values)}
//             />
//           ))}
//         </div>
        
//         {/* Main Panel */}
//         <div className="md:w-3/4">
//           <SortBar 
//             sorts={sortOptions} 
//             activeSort={sortBy} 
//             onSort={handleSortChange} 
//           />
          
//           <HotelList hotels={transformedHotels} loading={isLoadingHotels} />
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-6">
//               <Pagination
//                 current={currentPage}
//                 total={totalHotels}
//                 pageSize={pageSize}
//                 showSizeChanger={false}
//                 showQuickJumper
//                 showTotal={(total, range) => 
//                   `${range[0]}-${range[1]} của ${total} khách sạn`
//                 }
//                 onChange={handlePageChange}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHotel;

// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Spin, Empty, Pagination, message } from "antd";
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
// import { 
//   fetchHotelsByCity, 
//   setFilters, 
//   setSortBy, 
//   setCurrentPage 
// } from "../../../redux/slice/hotelSlice";
// import FilterGroup from './FilterGroup';
// import SortBar from './SortBar';
// import HotelCard from './HotelCard';

// // HotelList component
// const HotelList = ({ hotels, loading }) => {
//   if (loading) return <div className="flex justify-center py-8"><Spin size="large" /></div>;
//   if (!hotels || hotels.length === 0)
//     return <div className="py-8"><Empty description="Không tìm thấy khách sạn nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>;
//   return <div>{hotels.map((hotel, idx) => <HotelCard key={hotel.id || idx} hotel={hotel} />)}</div>;
// };

// // Transform API data
// const transformHotelData = (apiHotel) => {
//   const stripHtml = html => html ? html.replace(/<[^>]*>/g, '').trim() : "";
//   const extractFacilities = htmlTable => {
//     if (!htmlTable) return [];
//     const matches = htmlTable.match(/>([^<]+)</g);
//     return matches ? matches.map(m => m.replace(/[><]/g,'').trim()).filter(t => t.length>1).slice(0,4) : [];
//   };
//   const getImageUrl = imagePath => !imagePath ? "/default-hotel.jpg" : (imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_BE_URL}${imagePath}`);
//   const createHotelSlug = (name, id) => name ? name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim() + `-${id}` : id;
//   return {
//     id: apiHotel.id,
//     name: apiHotel.name || "Khách sạn",
//     image: getImageUrl(apiHotel.images?.[0]?.image),
//     thumbnails: apiHotel.images?.map(img => getImageUrl(img.image)) || [],
//     stars: Math.floor(apiHotel.avg_star || 0),
//     area: apiHotel.location || "N/A",
//     mapUrl: apiHotel.lat && apiHotel.lng ? `https://maps.google.com/?q=${apiHotel.lat},${apiHotel.lng}` : null,
//     facilities: extractFacilities(apiHotel.facilities),
//     review: stripHtml(apiHotel.description) || "",
//     rating: apiHotel.avg_star?.toFixed(1) || "N/A",
//     ratingText: getRatingText(apiHotel.avg_star || 0),
//     ratingCount: Math.floor(Math.random()*1000)+100,
//     price: "Liên hệ",
//     url: `/hotel/${createHotelSlug(apiHotel.name, apiHotel.id)}`,
//     cityName: apiHotel.city?.name || "",
//     point: apiHotel.point || 0,
//     withUs: stripHtml(apiHotel.withUs) || "",
//     slug: createHotelSlug(apiHotel.name, apiHotel.id)
//   };
// };

// const getRatingText = rating => rating>=9 ? "Tuyệt hảo" : rating>=8 ? "Rất tốt" : rating>=7 ? "Tốt" : rating>=6 ? "Ổn" : "Trung bình";

// const TopHotel = () => {
//   const { cityId } = useParams(); // string
//   const dispatch = useAppDispatch();
//   const { hotels, isLoadingHotels, totalHotels, currentPage, pageSize, totalPages, sortBy, filters, error } = useAppSelector(state => state.hotel || {});

//   const filterOptions = [
//     { title: "Đánh giá sao", key: "avg_star", options: [{ label:"5 sao", value:"5"},{ label:"4 sao", value:"4"},{ label:"3 sao", value:"3"},{ label:"2 sao", value:"2"},{ label:"1 sao", value:"1"}]},
//     { title: "Điểm đánh giá", key:"rating_range", options:[{label:"Trên 9+", value:"9+"},{label:"Rất tốt 8+", value:"8+"},{label:"Tốt 7+", value:"7+"},{label:"Dễ chịu 6+", value:"6+"}]}
//   ];

//   const sortOptions = ["Lựa chọn hàng đầu","Giá thấp nhất trước","Gần nhất với","Được đánh giá tốt nhất"];

//   useEffect(() => {
//     if (cityId) {
//       dispatch(fetchHotelsByCity({ cityId, currentPage, pageSize, filters }));
//     }
//   }, [dispatch, cityId, currentPage, pageSize, filters]);

//   const handleSortChange = idx => dispatch(setSortBy(idx));
//   const handlePageChange = page => dispatch(setCurrentPage(page));
//   const handleFilterChange = (key, values) => dispatch(setFilters({ [key]: values }));

//   const transformedHotels = hotels.map(transformHotelData);

//   useEffect(() => { if(error) message.error(error); }, [error]);

//   return (
//     <div className="bg-white rounded-xl shadow p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-6">{totalHotels>0 ? `${totalHotels} khách sạn tốt nhất`:"Khách sạn"}</h2>
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="md:w-1/6">
//           {filterOptions.map((group, idx)=>(
//             <FilterGroup key={idx} title={group.title} options={group.options.map(o=>o.label)} onFilterChange={vals=>handleFilterChange(group.key, vals)} />
//           ))}
//         </div>
//         <div className="md:w-3/4">
//           <SortBar sorts={sortOptions} activeSort={sortBy} onSort={handleSortChange} />
//           <HotelList hotels={transformedHotels} loading={isLoadingHotels} />
//           {totalPages>1 && <div className="flex justify-center mt-6">
//             <Pagination current={currentPage} total={totalHotels} pageSize={pageSize} showSizeChanger={false} showQuickJumper showTotal={(total,range)=>`${range[0]}-${range[1]} của ${total} khách sạn`} onChange={handlePageChange} />
//           </div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHotel;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty, Pagination, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { 
  fetchHotelsByCity, 
  setFilters, 
  setSortBy, 
  setCurrentPage 
} from "../../../redux/slice/hotelSlice";
import FilterGroup from './FilterGroup';
import SortBar from './SortBar';
import HotelCard from './HotelCard';
import icPL from '../../../images/hotel/placeholder.jpg';
// HotelList component
const HotelList = ({ hotels, loading }) => {
  if (loading) return <div className="flex justify-center py-8"><Spin size="large" /></div>;
  if (!hotels || hotels.length === 0)
    return <div className="py-8"><Empty description="Không tìm thấy khách sạn nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>;
  return <div>{hotels.map((hotel, idx) => <HotelCard key={hotel.id || idx} hotel={hotel} />)}</div>;
};

// Transform API data
const transformHotelData = (apiHotel) => {
  const stripHtml = html => html ? html.replace(/<[^>]*>/g, '').trim() : "";
  const extractFacilities = htmlTable => {
    if (!htmlTable) return [];
    const matches = htmlTable.match(/>([^<]+)</g);
    return matches ? matches.map(m => m.replace(/[><]/g,'').trim()).filter(t => t.length>1).slice(0,4) : [];
  };
  const getImageUrl = imagePath => {
    if (!imagePath) return "/default-hotel.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    const base = process.env.REACT_APP_BE_URL?.endsWith('/') ? process.env.REACT_APP_BE_URL : process.env.REACT_APP_BE_URL + '/';
    return `${base}${imagePath.replace(/^\/+/,'')}`;
  };
  
  // Hàm slug giữ chữ tiếng Việt có dấu nhưng chuyển sang không dấu
  const createHotelSlug = (name, id) => {
    if (!name) return id;
    const removeVietnameseTones = str => {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/\s+/g, "-");
      str = str.replace(/[^a-zA-Z0-9-]/g, "");
      str = str.replace(/-+/g, "-");
      return str;
    };
    return removeVietnameseTones(name.toLowerCase()) + `-${id}`;
  };

  return {
    id: apiHotel.id,
    name: apiHotel.name || "Khách sạn",
    image: getImageUrl(apiHotel.images?.[0]?.image),
    thumbnails: apiHotel.images?.map(img => getImageUrl(img.image)) || [],
    stars: Math.floor(apiHotel.avg_star || 0),
    area: apiHotel.location || "N/A",
    mapUrl: apiHotel.lat && apiHotel.lng ? `https://maps.google.com/?q=${apiHotel.lat},${apiHotel.lng}` : null,
    facilities: extractFacilities(apiHotel.facilities),
    review: stripHtml(apiHotel.description) || "",
    rating: apiHotel.avg_star?.toFixed(1) || "N/A",
    ratingText: getRatingText(apiHotel.avg_star || 0),
    ratingCount: Math.floor(Math.random()*1000)+100,
    price: "Liên hệ",
    url: `/hotel/${createHotelSlug(apiHotel.name, apiHotel.id)}`,
    cityName: apiHotel.city?.name || "",
    point: apiHotel.point || 0,
    withUs: stripHtml(apiHotel.withUs) || "",
    slug: createHotelSlug(apiHotel.name, apiHotel.id)
  };
};

const getRatingText = rating => rating>=9 ? "Tuyệt hảo" : rating>=8 ? "Rất tốt" : rating>=7 ? "Tốt" : rating>=6 ? "Ổn" : "Trung bình";

const TopHotel = () => {
  const { cityId } = useParams(); // string
  const dispatch = useAppDispatch();
  const { hotels, isLoadingHotels, totalHotels, currentPage, pageSize, totalPages, sortBy, filters, error } = useAppSelector(state => state.hotel || {});

  const filterOptions = [
    { title: "Đánh giá sao", key: "avg_star", options: [{ label:"5 sao", value:"5"},{ label:"4 sao", value:"4"},{ label:"3 sao", value:"3"},{ label:"2 sao", value:"2"},{ label:"1 sao", value:"1"}]},
    { title: "Điểm đánh giá", key:"rating_range", options:[{label:"Trên 9+", value:"9+"},{label:"Rất tốt 8+", value:"8+"},{label:"Tốt 7+", value:"7+"},{label:"Dễ chịu 6+", value:"6+"}]}
  ];

  const sortOptions = ["Lựa chọn hàng đầu","Giá thấp nhất trước","Gần nhất với","Được đánh giá tốt nhất"];

  useEffect(() => {
    if (cityId) {
      dispatch(fetchHotelsByCity({ cityId, currentPage, pageSize, filters }));
    }
  }, [dispatch, cityId, currentPage, pageSize, filters]);

  const handleSortChange = idx => dispatch(setSortBy(idx));
  const handlePageChange = page => dispatch(setCurrentPage(page));
  const handleFilterChange = (key, values) => dispatch(setFilters({ [key]: values }));

  const transformedHotels = hotels.map(transformHotelData);

  useEffect(() => { if(error) message.error(error); }, [error]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {totalHotels>0 ? `${totalHotels} khách sạn tốt nhất` : "Khách sạn"}
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/6">
          {filterOptions.map((group, idx) => (
            <FilterGroup 
              key={idx} 
              title={group.title} 
              options={group.options.map(o=>o.label)} 
              onFilterChange={vals => handleFilterChange(group.key, vals)} 
            />
          ))}
        </div>
        <div className="md:w-3/4">
          <SortBar sorts={sortOptions} activeSort={sortBy} onSort={handleSortChange} />
          <HotelList hotels={transformedHotels} loading={isLoadingHotels} />
          {totalPages>1 && (
            <div className="flex justify-center mt-6">
              <Pagination 
                current={currentPage} 
                total={totalHotels} 
                pageSize={pageSize} 
                showSizeChanger={false} 
                showQuickJumper 
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} khách sạn`} 
                onChange={handlePageChange} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHotel;
