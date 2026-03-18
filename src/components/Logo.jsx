import React from 'react';

const Logo = ({ className = '', style = {}, textColor = '#000000' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ height: '100%', ...style }}>
      <svg 
        viewBox="0 0 350 150" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{ height: '100%', width: 'auto' }}
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
              .logo-text {
                font-family: 'Caveat', cursive, sans-serif;
                font-size: 80px;
                font-weight: 700;
              }
            `}
          </style>
        </defs>

        {/* House Outline (Dark Muted Blue) */}
        <path 
          d="M 180 135 L 70 135 Q 40 135 40 105 L 40 70 L 120 10 L 190 60" 
          fill="none" 
          stroke="#416187" 
          strokeWidth="14" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Circle Window */}
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="22" fill="#E8F0F8" stroke="#416187" strokeWidth="4" />
          {/* Inner window panes (cross inside the circle) */}
          <path d="M -22 0 L 22 0 M 0 -22 L 0 22" stroke="#416187" strokeWidth="3" />
        </g>
        
        {/* Text '2nd Home' */}
        <text 
          x="75" 
          y="125" 
          className="logo-text"
          fill={textColor}
        >
          2nd Home
        </text>
      </svg>
    </div>
  );
};

export default Logo;
