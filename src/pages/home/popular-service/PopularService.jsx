import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './PopularService.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../../config/BaseUrl';
import SkeletonPopularService from './SkeletonPopularService';

const PopularService = () => {
  const navigate = useNavigate();
  const branchId = localStorage.getItem("branch_id");

  const [services, setServices] = useState([]);
  const [servicesTwo, setServicesTwo] = useState([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  
  const swiperRef1 = useRef(null);
  const swiperRef2 = useRef(null);
  const [isBeginning1, setIsBeginning1] = useState(true);
  const [isEnd1, setIsEnd1] = useState(false);
  const [isBeginning2, setIsBeginning2] = useState(true);
  const [isEnd2, setIsEnd2] = useState(false);

  const fetchServices = async () => {
    try {
      setIsServicesLoading(true);
      setServicesError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
     
      const filteredServices = response.data.service.filter((service) => 
        service.service_show_website && service.service_show_website.includes("1")
      );
      const filteredServicesTwo = response.data.service.filter((service) => 
        service.service_show_website && service.service_show_website.includes("2")
      );
    
      setServices(filteredServices);
      setServicesTwo(filteredServicesTwo);
  
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServicesError('Failed to load services. Please try again.');
    } finally {
      setIsServicesLoading(false);
    }
  };
  
  const fetchSubServices = async (serviceId, serviceName, serviceUrl, serviceSuperUrl, superServiceId) => {
    try {
      setSubServiceLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceUrl}/${branchId}`
      );
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
      } else {
        navigate(`/${serviceSuperUrl}/${encodeURIComponent(serviceUrl)}/pricing`, {
          state: {
            service_id: serviceId,
            service_name: serviceName
          }
        });
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      navigate(`/${serviceSuperUrl}/${encodeURIComponent(serviceUrl)}/pricing`, {
        state: {
          service_id: serviceId,
          service_name: serviceName
        }
      });
    } finally {
      setSubServiceLoading(false);
    }
  };

  const getImageUrlService = (imageName, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    fetchSubServices(service.id, service.service, service.service_slug, service.serviceSuper_url, service.super_service_id);
  };

  const sliderSettings = (swiperRef, setIsBeginning, setIsEnd) => ({
    modules: [Navigation, Autoplay],
    spaceBetween: 20,
    slidesPerView: 'auto',
    centeredSlides: false,
    navigation: {
      nextEl: `.swiper-button-next-${swiperRef === swiperRef1 ? '1' : '2'}`,
      prevEl: `.swiper-button-prev-${swiperRef === swiperRef1 ? '1' : '2'}`,
      disabledClass: 'swiper-button-disabled'
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    onSlideChange: (swiper) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    },
    breakpoints: {
      320: {
        spaceBetween: 10,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15
      },
      768: {
        spaceBetween: 20,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0
      }
    }
  });

  const handleMouseEnter = (swiperRef) => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };
  
  const handleMouseLeave = (swiperRef) => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <>
      {/* First Section - Centered Header */}
      <section className="popular-service-home-section">
        <div className="popular-service-home-container">
          <div className="popular-service-home-header text-center">
            <h1 className="popular-service-home-title">Most Popular Services</h1>
            <p className="popular-service-home-subtitle">What do you need to find?</p>
          </div>

          {isServicesLoading && <SkeletonPopularService />}

          {servicesError && !isServicesLoading && (
            <div className="popular-service-home-error">
              <Icon.AlertCircle className="popular-service-home-error-icon" size={18} />
              <span>{servicesError}</span>
              <button
                className="popular-service-home-retry-btn"
                onClick={fetchServices}
              >
                <Icon.RefreshCw className="popular-service-home-retry-icon" size={14} />
                Try Again
              </button>
            </div>
          )}

          {!isServicesLoading && !servicesError && services.length > 0 && (
            <div className="popular-service-home-slider-wrapper">
              <div className="popular-service-home-slider-container">
                <Swiper 
                  {...sliderSettings(swiperRef1, setIsBeginning1, setIsEnd1)} 
                  className="popular-service-home-slider-1"
                >
                  {services.map((service) => (
                    <SwiperSlide key={service.id} className="popular-service-slide">
                      <div
                        className="service-grid-card"
                        onClick={() => handleServiceClick(service)}
                        onMouseEnter={() => handleMouseEnter(swiperRef1)}
                        onMouseLeave={() => handleMouseLeave(swiperRef1)}
                      >
                        <div className="service-grid-card-image-container">
                          <LazyLoadImage
                            src={getImageUrlService(service.service_image)}
                            className="service-grid-card-image"
                            alt={service.service}
                            effect="blur"
                            width="100%"
                            height="100%"
                            onError={(e) => {
                              const target = e.target;
                              target.src = `${NO_IMAGE_URL}`;
                            }}
                          />
                        </div>
                        <div className="service-grid-card-content">
                          <h1 className="service-grid-card-title">{service.service}</h1>
                          <div className="service-grid-card-footer">
                            <span className="service-grid-card-city">
                              <Icon.MapPin className="service-grid-card-icon" size={12} />
                              <span>{localStorage.getItem('city') || 'Your City'}</span>
                            </span>
                            <button 
                              className="service-grid-book-now-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleServiceClick(service);
                              }} 
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button 
                  className={`swiper-button-prev-1 ${isBeginning1 ? 'swiper-button-disabled' : ''}`}
                  onClick={() => swiperRef1.current?.slidePrev()}
                >
                  <Icon.ChevronLeft size={20} />
                </button>
                <button 
                  className={`swiper-button-next-1 ${isEnd1 ? 'swiper-button-disabled' : ''}`}
                  onClick={() => swiperRef1.current?.slideNext()}
                >
                  <Icon.ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Second Section - Left Aligned Header */}
      {servicesTwo.length >= 7 && (
        <section className="popular-service-home-featured-section">
          <div className="popular-service-home-container">
            <div className="popular-service-home-header text-left">
              <h1 className="popular-service-home-title">Featured Services</h1>
              <p className="popular-service-home-subtitle">Discover our premium offerings</p>
            </div>

            {!isServicesLoading && !servicesError && servicesTwo.length > 0 && (
              <div className="popular-service-home-slider-wrapper">
                <div className="popular-service-home-slider-container">
                  <Swiper 
                    {...sliderSettings(swiperRef2, setIsBeginning2, setIsEnd2)} 
                    className="popular-service-home-slider-2"
                  >
                    {servicesTwo.map((service) => (
                      <SwiperSlide key={service.id} className="popular-service-slide">
                        <div
                          className="service-grid-card"
                          onClick={() => handleServiceClick(service)}
                          onMouseEnter={() => handleMouseEnter(swiperRef2)}
                          onMouseLeave={() => handleMouseLeave(swiperRef2)}
                        >
                          <div className="service-grid-card-image-container">
                            <LazyLoadImage
                              src={getImageUrlService(service.service_image)}
                              className="service-grid-card-image"
                              alt={service.service}
                              effect="blur"
                              width="100%"
                              height="100%"
                              onError={(e) => {
                                const target = e.target;
                                target.src = `${NO_IMAGE_URL}`;
                              }}
                            />
                          </div>
                          <div className="service-grid-card-content">
                            <h1 className="service-grid-card-title">{service.service}</h1>
                            <div className="service-grid-card-footer">
                              <span className="service-grid-card-city">
                                <Icon.MapPin className="service-grid-card-icon" size={12} />
                                <span>{localStorage.getItem('city') || 'Your City'}</span>
                              </span>
                              <button 
                                className="service-grid-book-now-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleServiceClick(service);
                                }} 
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button 
                    className={`swiper-button-prev-2 ${isBeginning2 ? 'swiper-button-disabled' : ''}`}
                    onClick={() => swiperRef2.current?.slidePrev()}
                  >
                    <Icon.ChevronLeft size={20} />
                  </button>
                  <button 
                    className={`swiper-button-next-2 ${isEnd2 ? 'swiper-button-disabled' : ''}`}
                    onClick={() => swiperRef2.current?.slideNext()}
                  >
                    <Icon.ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal remains unchanged */}
      {showSubServiceModal && selectedService && (
  <div className="fixed inset-0 z-[9999] overflow-y-auto">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      aria-hidden="true"
      onClick={() => setShowSubServiceModal(false)}
    />

    {/* Modal container */}
    <div className="flex min-h-screen items-center justify-center p-2 text-center">
      <div className="relative w-full max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300 ease-out sm:w-full sm:max-w-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
              <Icon.Grid className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Select <span className="bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">{selectedService?.service}</span>
            </h3>
          </div>
          <button
            type="button"
            className="group cursor-pointer rounded-full p-1 text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setShowSubServiceModal(false)}
          >
            <span className="sr-only">Close</span>
            <svg 
              className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {subServiceLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {subServices.map((subService) => (
                <div
                  key={subService.id}
                  className="group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => navigate(`/${selectedService?.serviceSuper_url}/${selectedService?.service_slug}/${subService.service_sub_slug}/pricing`, {
                    state: {
                      service_id: selectedService?.id,
                      service_name: selectedService?.service,
                      service_sub_id: subService.id,
                      service_sub_name: subService.service_sub
                    }
                  })}
                >
                  {/* Image */}
                  <div className="relative  overflow-hidden">
                  <LazyLoadImage
                        src={getImageUrlService(subService.service_sub_image, true)}
                        alt={subService.service_sub}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        effect="blur"
                        width="100%"
                        height="100%"
                        placeholderSrc={NO_IMAGE_URL}
                        onError={(e) => {
                          e.target.src = NO_IMAGE_URL;
                        }}
                      />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-2 text-center">
                    <h6 className="text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {subService.service_sub}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={() => setShowSubServiceModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default PopularService;