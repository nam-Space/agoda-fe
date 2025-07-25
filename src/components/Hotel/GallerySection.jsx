import React, { useState } from 'react';

const GallerySection = () => {
    const [isLiked, setIsLiked] = useState(false); // State to track if the heart is clicked

    const toggleHeart = () => {
        setIsLiked(!isLiked); // Toggle the state
    };

    return (
        <div className="gallery-container relative bg-white p-4 w-full max-w-6xl mx-auto">
            {/* Floating Heart Icon */}
            <button
                onClick={toggleHeart} // Handle click event
                className="absolute top-8 right-4 rounded-full shadow-lg p-2 bg-white transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isLiked ? 'red' : 'none'} // Change fill color based on state
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke={isLiked ? 'red' : 'currentColor'} // Change stroke color based on state
                    className={`w-6 h-6 transition-transform duration-200 ${
                        isLiked ? 'scale-125' : 'scale-100'
                    }`} // Add scale animation
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    />
                </svg>
            </button>

            {/* Two-Column Layout with 40% / 60% ratio */}
            <div className="grid grid-cols-[40%_60%] gap-6">
                {/* Column 1: Main Image */}
                <div className="relative">
                    <img
                        src="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                        alt="Main Image"
                        className="rounded-lg w-full h-[272px] object-cover"
                    />
                </div>

                {/* Column 2: 3x2 Grid of Images */}
                <div className="h-[272px] grid grid-cols-3 grid-rows-2 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <img
                            key={index}
                            src="https://pistachiohotel.com/UploadFile/Gallery/Overview/a2.jpg"
                            alt={`Secondary Image ${index + 1}`}
                            className="rounded-lg w-full h-full object-cover"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GallerySection;