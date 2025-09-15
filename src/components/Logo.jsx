import React from 'react';

const Logo = ({ className = "", showText = true, size = "medium", variant = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16",
    xlarge: "w-20 h-20"
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-xl",
    xlarge: "text-2xl"
  };

  const subtextSizeClasses = {
    small: "text-xs",
    medium: "text-sm", 
    large: "text-base",
    xlarge: "text-lg"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img 
          src="/logo9.png" 
          alt="Royal Thread Logo" 
          className="w-full h-full object-cover rounded-full filter drop-shadow-lg"
          style={{
            filter: variant === 'white' 
              ? 'brightness(0) invert(1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              : 'contrast(1.1) brightness(1.05) saturate(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        {/* Fallback SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full hidden"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Circle Background */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill={variant === 'white' ? '#1f2937' : '#8B4513'} 
            stroke={variant === 'white' ? '#374151' : '#654321'} 
            strokeWidth="3"
          />
          
          {/* Inner Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            fill="none" 
            stroke={variant === 'white' ? '#fbbf24' : '#D2691E'} 
            strokeWidth="2"
          />
          
          {/* Royal Crown - Larger and More Prominent */}
          <path 
            d="M 25 40 L 35 25 L 45 35 L 50 20 L 55 35 L 65 25 L 75 40 L 70 50 L 30 50 Z" 
            fill={variant === 'white' ? '#fbbf24' : '#D2691E'}
            stroke={variant === 'white' ? '#f59e0b' : '#B8860B'}
            strokeWidth="2"
          />
          
          {/* Crown Jewels - More Prominent */}
          <circle cx="50" cy="32" r="3" fill={variant === 'white' ? '#ffffff' : '#FFD700'}/>
          <circle cx="40" cy="38" r="2" fill={variant === 'white' ? '#ffffff' : '#FFD700'}/>
          <circle cx="60" cy="38" r="2" fill={variant === 'white' ? '#ffffff' : '#FFD700'}/>
          
          {/* Thread Spool - More Prominent */}
          <rect 
            x="35" 
            y="55" 
            width="30" 
            height="25" 
            rx="4" 
            fill={variant === 'white' ? '#fbbf24' : '#D2691E'}
            stroke={variant === 'white' ? '#f59e0b' : '#B8860B'}
            strokeWidth="2"
          />
          
          {/* Thread Lines - More Visible */}
          <line x1="40" y1="62" x2="60" y2="62" stroke={variant === 'white' ? '#ffffff' : '#8B4513'} strokeWidth="2"/>
          <line x1="42" y1="68" x2="58" y2="68" stroke={variant === 'white' ? '#ffffff' : '#8B4513'} strokeWidth="2"/>
          <line x1="44" y1="74" x2="56" y2="74" stroke={variant === 'white' ? '#ffffff' : '#8B4513'} strokeWidth="2"/>
          
          {/* Decorative Corner Elements */}
          <circle cx="25" cy="25" r="3" fill={variant === 'white' ? '#fbbf24' : '#D2691E'}/>
          <circle cx="75" cy="25" r="3" fill={variant === 'white' ? '#fbbf24' : '#D2691E'}/>
          <circle cx="25" cy="75" r="3" fill={variant === 'white' ? '#fbbf24' : '#D2691E'}/>
          <circle cx="75" cy="75" r="3" fill={variant === 'white' ? '#fbbf24' : '#D2691E'}/>
        </svg>
      </div>
      
      {/* Logo Text - Hidden */}
      {false && showText && (
        <div className="ml-3 flex items-center">
          <h1 className={`font-black tracking-wider ${variant === 'white' ? 'text-white' : 'text-[#8B4513]'} ${textSizeClasses[size]} leading-none`}>
            ROYAL THREAD
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
