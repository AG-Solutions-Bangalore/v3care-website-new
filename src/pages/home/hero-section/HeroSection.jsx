import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';

import './HeroSection.css';
import { BASE_URL, SERVICE_SUPER_IMAGE_URL, NO_IMAGE_URL } from '../../../config/BaseUrl';

const HeroSection = () => {
  const branchId = localStorage.getItem("branch_id");

 
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['serviceSuperCategories', branchId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      return response.data.serviceSuper?.map((item) => ({
        id: item.id,
        name: item.serviceSuper,
        image: item.serviceSuper_image,
        url: item.serviceSuper_url
      })) || [];
    },
    staleTime: 60 * 60 * 1000, 
    retry: 2,
  });

  const getImageUrl = (image) => {
    if (!image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };

 

  const SkeletonLoader = () => {
    return (
      <div className="hero-section-services">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="hero-section-service-item skeleton-item"
          >
            <div className="hero-section-service-icon skeleton-icon"></div>
            <span className="hero-section-service-title skeleton-title"></span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="hero-section">
      <div className="hero-section-container">
        <div className="hero-section-header">
          <h1 className="hero-section-title">
            Professional Services at Your Doorstep
          </h1>
        </div>
        
        <div className="hero-section-content-wrapper">
          <div className="hero-section-left">
            <div className="hero-section-search">
              <h3 className="hero-section-search-title">Pick the service you need today</h3>
              {isLoading || error ? (
                <SkeletonLoader />
              ) : (
                <div className="hero-section-services">
                  {categories?.map((category, index) => (
                    <React.Fragment key={index}>
                      <Link 
                      title={`${category.name}`}
                        to={`/${encodeURIComponent(category.url)}`}
                        className="hero-section-service-item"
                      >
                        <div className="hero-section-service-icon">
                          <LazyLoadImage
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            effect="blur"
                            width="36"
                            height="36"
                          />
                        </div>
                        <span className="hero-section-service-title">{category.name}</span>
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <div className="hero-section-stats">
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">⭐</div>
                <div className="hero-section-stat-content">
                  <span className="hero-section-stat-number">4.8</span>
                  <span className="hero-section-stat-text">Service Rating*</span>
                </div>
              </div>
              <div className="hero-section-stat">
                <div className="hero-section-stat-icon">
                👥
                </div>
                <div className="hero-section-stat-content">
                  
                  <span className="hero-section-stat-number">12M+</span>
                  <span className="hero-section-stat-text">Customers Globally*</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-section-right">
            <div className="hero-section-images">
              <div className="hero-section-image hero-section-image-1">
                <LazyLoadImage
                  src="assets/img/services/h1.jpeg"
                  alt="Home1"
                  effect="blur"
                  width="240"
                  height="100%"
                />
              </div>
              <div className="hero-section-image hero-section-image-2">
                <LazyLoadImage
                  src="assets/img/services/h2.jpeg"
                  alt="Home2"
                  effect="blur"
                  width="240"
                height="100%"
                />
              </div>
              <div className="hero-section-image hero-section-image-3">
                <LazyLoadImage
                  src="assets/img/services/h3.jpeg"
                  alt="Home3"
                  effect="blur"
                  width="240"
                    height="100%"
                />
              </div>
              <div className="hero-section-image hero-section-image-4">
                <LazyLoadImage
                  src="assets/img/services/h4.jpeg"
                  alt="Home4"
                  effect="blur"
                  width="240"
                     height="100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;