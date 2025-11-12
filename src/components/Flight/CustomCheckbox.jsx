import React from 'react';

/**
 * Custom Checkbox Component - 100% visual control
 * Uses inline SVG for maximum reliability
 * Designed to match Agoda's checkbox UI
 */
const CustomCheckbox = ({ checked, onChange, label, className = '' }) => {
  // Debug: Log when component renders
  console.log(`✅ CustomCheckbox render: "${label}" - checked: ${checked}`);

  const handleClick = (e) => {
    e.preventDefault();
    const newValue = !checked;
    console.log(`👆 Checkbox clicked: "${label}" - ${checked} → ${newValue}`);
    onChange(newValue);
  };

  return (
    <label 
      className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${className}`}
      onClick={handleClick}
    >
      {/* Custom Checkbox Box */}
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          minWidth: '18px',
          minHeight: '18px',
          borderRadius: '3px',
          border: checked ? '3px solid #2563eb' : '3px solid #9ca3af',
          backgroundColor: checked ? '#2563eb' : '#ffffff',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          cursor: 'pointer',
          boxShadow: checked ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none'
        }}
        title={`Checkbox: ${checked ? 'CHECKED' : 'UNCHECKED'}`}
      >
        {/* Checkmark SVG - Inline for reliability */}
        {checked && (
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            style={{ display: 'block' }}
          >
            <path 
              d="M2 6L5 9L10 3" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      
      {/* Label Text */}
      <span style={{ 
        fontSize: '14px', 
        color: '#374151',
        userSelect: 'none',
        cursor: 'pointer'
      }}>
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;
