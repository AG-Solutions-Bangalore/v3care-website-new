import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Carousel = ({ children, title }) => {
  const carouselContainer = useRef();

  const navigation = (dir) => {
    const container = carouselContainer.current;
    if (!container) return;
    
    const scrollAmount = 
      dir === "left" 
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mb-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Title */}
        {title && (
          <div className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </div>
        )}
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => navigation("left")}
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg text-gray-800 hover:text-primary transition-all"
          aria-label="Previous"
        >
          <FiChevronLeft size={24} />
        </button>
        <button 
          onClick={() => navigation("right")}
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg text-gray-800 hover:text-primary transition-all"
          aria-label="Next"
        >
          <FiChevronRight size={24} />
        </button>
        
        {/* Carousel Items */}
        <div 
          ref={carouselContainer}
          className="flex gap-5 overflow-x-auto overflow-y-hidden -mx-5 px-5 py-2 scrollbar-hide"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Carousel;