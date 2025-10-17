import { useState } from "react";

const GallerySection = ({ images = [] }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleHeart = () => {
    setIsLiked(!isLiked);
  };

  // Fallback ảnh nếu khách sạn chưa có ảnh nào
  const fallbackImages = Array(6).fill(
    "https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
  );

  // Gộp ảnh API hoặc ảnh mặc định
  const displayImages = images.length > 0
    ? images.map(img => img.image?.startsWith("http")
        ? img.image
        : `${process.env.REACT_APP_BE_URL}${img.image}`
      )
    : fallbackImages;

  // Ảnh chính là ảnh đầu tiên
  const mainImage = displayImages[0] || fallbackImages[0];
  // Các ảnh phụ (tối đa 6)
  const subImages = displayImages.slice(1, 7);

  return (
    <div className="gallery-container relative bg-white p-4 w-full max-w-6xl mx-auto rounded-lg shadow-sm">
      {/* Floating Heart Icon */}
      <button
        onClick={toggleHeart}
        className="absolute top-8 right-4 rounded-full shadow-lg p-2 bg-white hover:scale-110 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isLiked ? "red" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke={isLiked ? "red" : "currentColor"}
          className={`w-6 h-6 transition-transform duration-200 ${
            isLiked ? "scale-125" : "scale-100"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 
            5.5 0 00-7.78 7.78l1.06 1.06L12 
            20.23l7.78-7.78 1.06-1.06a5.5 
            5.5 0 000-7.78z"
          />
        </svg>
      </button>

      {/* Two-Column Layout with 40% / 60% ratio */}
      <div className="grid grid-cols-[40%_60%] gap-6">
        {/* Column 1: Main Image */}
        <div className="relative">
          <img
            src={mainImage}
            alt="Main"
            className="rounded-lg w-full h-[272px] object-cover"
          />
        </div>

        {/* Column 2: Grid of Images */}
        <div className="h-[272px] grid grid-cols-3 grid-rows-2 gap-4">
          {subImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Gallery ${index + 1}`}
              className="rounded-lg w-full h-full object-cover hover:opacity-90 transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
