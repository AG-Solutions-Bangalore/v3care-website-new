import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SkeletonPopularService.css'

const SkeletonPopularService = () => {
  const popularService = {
    dots: false,
    autoplay: true,
    arrows: true,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-8">
        <Slider {...popularService} className="owl-carousel categories-slider-seven">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="service-widget service-two service-seven">
              <div className="service-img">
                <div 
                  className="img-fluid serv-img skeleton-image"
                  style={{
                    height: '200px',
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px'
                  }}
                />
                <div className="fav-item">
                  <span 
                    className="item-cat skeleton-text" 
                    style={{
                      display: 'inline-block',
                      height: '20px',
                      width: '80%',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              <div className="service-content service-content-seven">
                <h3 className="title">
                  <div 
                    className="skeleton-text" 
                    style={{
                      height: '24px',
                      width: '90%',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      margin: '0 auto'
                    }}
                  />
                </h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SkeletonPopularService;