import { useState } from 'react';
import { getImageUrl } from "../utils/imageUtils";

export default function ImageGallery({ images = [], productName = "Product", onWishlistToggle, isWishlisted = false }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Debug: Log received images (commented out for production)

  // Normalize images array and preserve isPrimary
  const normalizedImages = images.map((img, index) => {
    if (typeof img === 'string') {
      return { 
        url: getImageUrl(img), 
        alt: `${productName} - Image ${index + 1}`,
        isPrimary: index === 0
      };
    }
    return {
      url: getImageUrl(img?.url || img?.src || ''),
      alt: img?.alt || `${productName} - Image ${index + 1}`,
      thumbnail: getImageUrl(img?.thumbnail || img?.url || img?.src || ''),
      isPrimary: Boolean(img?.isPrimary)
    };
  }).filter(img => img.url);

  // Sort images to show primary first
  const sortedImages = normalizedImages.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  // Debug: Log normalized images (commented out for production)

  // If no images, return placeholder
  if (sortedImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = sortedImages[selectedImage];

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <div className="w-full">
      {/* Professional Image Gallery Layout */}
      <div className="flex h-40 sm:h-48 md:h-[300px] lg:h-[90vh] xl:h-[90vh]">
        {/* Left: Thumbnail Strip */}
        {sortedImages.length > 1 && (
          <div className="flex flex-col w-12 sm:w-14 md:w-16 flex-shrink-0 h-full justify-center space-y-1">
            {sortedImages.map((image, index) => {
              const thumbnailHeight = sortedImages.length > 0 ? 
                `${100 / sortedImages.length}%` : '100%';
              return (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                  }`}
                  style={{ height: thumbnailHeight }}
                >
                  {(image.thumbnail || image.url) && (
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Main Image */}
        <div className="flex-1 ml-1.5 sm:ml-2 relative">
          <div 
            className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden relative shadow-sm cursor-pointer"
            onClick={() => {
              console.log('Image container clicked, currentImage.url:', currentImage.url);
              if (currentImage.url) {
                console.log('Setting zoom to true');
                setIsZoomed(true);
              }
            }}
          >
            {currentImage.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Wishlist Button - Top Right Corner */}
            {onWishlistToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWishlistToggle();
                }}
                className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 ${
                  isWishlisted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white bg-opacity-90 hover:bg-opacity-100'
                }`}
              >
                <svg 
                  className={`w-5 h-5 ${
                    isWishlisted 
                      ? 'text-white fill-current' 
                      : 'text-gray-700 hover:text-red-500'
                  }`} 
                  fill={isWishlisted ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            console.log('Modal background clicked, closing zoom');
            setIsZoomed(false);
          }}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => {
                console.log('Close button clicked');
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation in zoom modal */}
            {normalizedImages.length > 1 && (
              <>
                {selectedImage > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(selectedImage - 1);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {selectedImage < normalizedImages.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(selectedImage + 1);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
