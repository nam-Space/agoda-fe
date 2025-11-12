// import React from 'react';

// const DualRangeSlider = ({ 
//   min, 
//   max, 
//   step = 1, 
//   minValue, 
//   maxValue, 
//   onMinChange, 
//   onMaxChange,
//   formatLabel 
// }) => {
//   const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

//   const minPercent = getPercent(minValue);
//   const maxPercent = getPercent(maxValue);

//   const sliderStyles = {
//     appearance: 'none',
//     height: '8px',
//     background: 'transparent',
//     outline: 'none',
//     position: 'absolute',
//     width: '100%',
//     pointerEvents: 'none',
//     zIndex: 1
//   };

//   const thumbStyles = {
//     appearance: 'none',
//     height: '16px',
//     width: '16px',
//     borderRadius: '50%',
//     background: '#2563EB',
//     cursor: 'pointer',
//     border: '2px solid white',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//     pointerEvents: 'auto',
//     position: 'relative',
//     zIndex: 2
//   };

//   return (
//     <div className="relative">
//       {/* Label */}
//       {formatLabel && (
//         <div className="flex justify-between text-xs text-gray-600 mb-2">
//           <span>{formatLabel(minValue, maxValue)}</span>
//         </div>
//       )}
      
//       {/* Slider Container */}
//       <div className="relative h-2">
//         {/* Track */}
//         <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
        
//         {/* Active Range */}
//         <div 
//           className="absolute h-2 bg-blue-600 rounded-full"
//           style={{
//             left: `${minPercent}%`,
//             width: `${maxPercent - minPercent}%`
//           }}
//         />
        
//         {/* Min Range Input */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={minValue}
//           onChange={(e) => {
//             const value = Math.min(Number(e.target.value), maxValue - step);
//             onMinChange(value);
//           }}
//           style={{
//             ...sliderStyles,
//             WebkitAppearance: 'none',
//             MozAppearance: 'none'
//           }}
//           onInput={(e) => {
//             e.target.style.setProperty('--webkit-slider-thumb', JSON.stringify(thumbStyles));
//           }}
//         />
        
//         {/* Max Range Input */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={maxValue}
//           onChange={(e) => {
//             const value = Math.max(Number(e.target.value), minValue + step);
//             onMaxChange(value);
//           }}
//           style={{
//             ...sliderStyles,
//             WebkitAppearance: 'none',
//             MozAppearance: 'none'
//           }}
//         />
//       </div>
      
//       <style jsx>{`
//         input[type="range"]::-webkit-slider-thumb {
//           appearance: none;
//           height: 16px;
//           width: 16px;
//           border-radius: 50%;
//           background: #2563EB;
//           cursor: pointer;
//           border: 2px solid white;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//           pointer-events: auto;
//           position: relative;
//           z-index: 2;
//         }
        
//         input[type="range"]::-moz-range-thumb {
//           appearance: none;
//           height: 16px;
//           width: 16px;
//           border-radius: 50%;
//           background: #2563EB;
//           cursor: pointer;
//           border: 2px solid white;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//           pointer-events: auto;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DualRangeSlider;



const DualRangeSlider = ({ 
  min, 
  max, 
  step = 1, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange,
  formatLabel 
}) => {
  const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  const sliderStyles = {
    appearance: 'none',
    height: '8px',
    background: 'transparent',
    outline: 'none',
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
    zIndex: 1
  };

  const thumbStyles = {
    appearance: 'none',
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    background: '#2563EB',
    cursor: 'pointer',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    pointerEvents: 'auto',
    position: 'relative',
    zIndex: 2
  };

  return (
    <div className="relative">
      {/* Label */}
      {formatLabel && (
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>{formatLabel(minValue, maxValue)}</span>
        </div>
      )}
      
      {/* Slider Container */}
      <div className="relative w-full h-2">
  {/* Track */}
  <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>

  {/* Active Range */}
  <div
    className="absolute top-0 h-2 bg-blue-600 rounded-full"
    style={{
      left: `${minPercent}%`,
      width: `${maxPercent - minPercent}%`,
    }}
  ></div>

  {/* Min slider */}
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={minValue}
    onChange={(e) => {
      const value = Math.min(Number(e.target.value), maxValue - step);
      onMinChange(value);
    }}
    className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
    style={{ zIndex: 2 }}
  />

  {/* Max slider */}
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={maxValue}
    onChange={(e) => {
      const value = Math.max(Number(e.target.value), minValue + step);
      onMaxChange(value);
    }}
    className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
    style={{ zIndex: 3 }}
  />
</div>

      
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563EB;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
          position: relative;
          z-index: 2;
        }
        
        input[type="range"]::-moz-range-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563EB;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
};

export default DualRangeSlider;
