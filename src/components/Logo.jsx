import React from 'react';

const Logo = ({ className = "", showText = true, size = "medium", variant = "default", noWrapTagline = false }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16",
    xlarge: "w-20 h-20"
  };

  // Main text size classes (for "Royal Thread")
  const textSizeClasses = {
    small: "text-xs sm:text-sm",
    medium: "text-sm sm:text-base", 
    large: "text-base sm:text-lg",
    xlarge: "text-lg sm:text-xl"
  };

  // Tagline size classes (for "Carpet Rugs & Home Decor") - always smaller than above
  const subtextSizeClasses = {
    small: "text-xs",
    medium: "text-xs",
    large: "text-sm",
    xlarge: "text-base"
  };
  

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex items-center ${className.includes('justify-start') ? 'justify-start' : 'justify-center'}`}>
        <img
          src="/logo9.png"
          alt="Royal Thread Logo"
          className={`${sizeClasses[size]} object-contain`}
        />
        {showText && (
          <div className={`ml-2 flex flex-col ${className.includes('justify-start') ? 'items-start text-left' : 'items-center text-center'}`}>
            <h1 className={`font-bold tracking-wide ${variant === 'white' ? 'text-white' : 'text-[#8B4513]'} ${textSizeClasses[size]} leading-tight`}>
              Royal Thread
            </h1>
            <p className={`font-medium ${variant === 'white' ? 'text-white' : 'text-gray-600'} ${subtextSizeClasses[size]} leading-tight mt-0.5 ${noWrapTagline ? 'whitespace-nowrap' : ''}`}>
              Carpet Rugs & Home Decor
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
