import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SkeletonTestimonials.css'
const SkeletonTestimonials = () => {
  
  const testimonialSlider = {
    dots: true,
    autoplay: true,
    slidesToShow: 1,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 1,
          dots: false,
          autoplay: true,
          arrows: false,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          dots: false,
          autoplay: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Slider {...testimonialSlider} className="testimonals-seven-slider">
      {[...Array(3)].map((_, index) => (
        <div className="testimonials-main-ryt" key={index}>
          <div className="testimonials-content-seven">
            <div className="testimonials-seven-img">
              <div 
                className="skeleton-image"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0'
                }}
              />
              <div className="testimonials-img-content">
                <h6>
                  <div 
                    className="skeleton-text"
                    style={{
                      width: '120px',
                      height: '20px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px'
                    }}
                  />
                </h6>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-star"
                      style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '50%',
                        marginRight: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div 
              className="skeleton-image"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px'
              }}
            />
          </div>
          <p>
            <div 
              className="skeleton-text"
              style={{
                width: '100%',
                height: '16px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                marginBottom: '8px'
              }}
            />
            <div 
              className="skeleton-text"
              style={{
                width: '80%',
                height: '16px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px'
              }}
            />
          </p>
        </div>
      ))}
    </Slider>
  );
};

export default SkeletonTestimonials;