import { useState } from 'react';

export default function ImageGallery({ images = [], productName = "Product" }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Debug: Log received images (commented out for production)

  // Normalize images array
  const normalizedImages = images.map((img, index) => {
    if (typeof img === 'string') {
      return { url: img, alt: `${productName} - Image ${index + 1}` };
    }
    return {
      url: img?.url || img?.src || '',
      alt: img?.alt || `${productName} - Image ${index + 1}`,
      thumbnail: img?.thumbnail || img?.url || img?.src || ''
    };
  }).filter(img => img.url);

  // Debug: Log normalized images (commented out for production)

  // If no images, return placeholder
  if (normalizedImages.length === 0) {
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

  const currentImage = normalizedImages[selectedImage];

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <div className="w-full">
      {/* Flipkart Style Layout - Full Height Thumbnails */}
      <div className="flex h-64 md:h-[360px] mb-0">
        {/* Left: Thumbnail Strip - Full Height */}
        {normalizedImages.length > 1 && (
          <div className="flex flex-col w-12 flex-shrink-0 h-full">
            {normalizedImages.map((image, index) => {
              const thumbnailHeight = normalizedImages.length > 0 ? 
                `${100 / normalizedImages.length}%` : '100%';
              return (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-12 rounded border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'border-orange-500 ring-1 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300'
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

        {/* Right: Main Image - Fixed Position */}
        <div className="flex-1 ml-1 relative">
          <div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden relative">
            {currentImage.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onClick={() => {
                  // Simple click to view larger image
                  window.open(currentImage.url, '_blank');
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Image counter - Top Right Corner */}
            {normalizedImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                {selectedImage + 1} / {normalizedImages.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
