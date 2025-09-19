import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider data - you can customize these with your actual images and content
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1646592491854-6caaaf4d8ee7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8",
      title: "Bedside Runners Mats",
      subtitle: "Discover our exclusive collection",
      description: "Transform your home with our beautifully crafted rugs and mats",
      buttonText: "Shop Now",
      buttonLink: "/cotton-yoga-mats",
      overlay: "rgba(0, 0, 0, 0.4)"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80",
      title: "Cotton Yoga Mats",
      subtitle: "Perfect for your practice",
      description: "Premium quality yoga mats designed for comfort and durability",
      buttonText: "Explore Collection",
      buttonLink: "/cotton-yoga-mats",
      overlay: "rgba(0, 0, 0, 0.3)"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1726463450351-4b603da0f507?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGFyZWElMjBydWd8ZW58MHx8MHx8fDA%3D",
      title: "Area Rugs Collection",
      subtitle: "Elevate your space",
      description: "Beautiful area rugs to enhance any room in your home",
      buttonText: "View Rugs",
      buttonLink: "/area-rugs",
      overlay: "rgba(0, 0, 0, 0.35)"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1587527901949-ab0341697c1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
      title: "Bath Mats Collection",
      subtitle: "Luxury for your bathroom",
      description: "Soft and absorbent bath mats and bedside runners",
      buttonText: "Shop Bath Mats",
      buttonLink: "/bath-mats",
      overlay: "rgba(0, 0, 0, 0.4)"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cnVnJTIwbWF0cyUyMGNvbGxlY3Rpb25zfGVufDB8fDB8fHww",
      title: "Mats Collection",
      subtitle: "Luxury for your home",
      description: "Soft and absorbent mats collections",
      buttonText: "Shop Mats Collection",
      buttonLink: "/mats-collection",
      overlay: "rgba(0, 0, 0, 0.4)"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: slide.overlay }}
              />
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-light mb-6 animate-fade-in-delay">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-delay-2">
                    {slide.description}
                  </p>
                  <Link
                    to={slide.buttonLink}
                    className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-3"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;
