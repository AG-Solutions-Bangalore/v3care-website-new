import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import * as Icon from 'react-feather';

import './ServiceList.css';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL, SERVICE_SUPER_IMAGE_URL } from '../../config/BaseUrl';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';
import { Loader } from 'lucide-react';
import LoadingPlaceholder from '../../components/LoadingPlaceholder/LoadingPlaceholder';




const ServiceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const branchId = localStorage.getItem("branch_id");
  const city = localStorage.getItem("city");
  const [activeSuperCategory, setActiveSuperCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [fetchSubServicesEnabled, setFetchSubServicesEnabled] = useState(false);

  
  const { 
    data: serviceSupers, 
    isLoading: isServiceSupersLoading, 
    error: serviceSupersError,
    refetch: refetchServiceSupers
  } = useQuery({
    queryKey: ['serviceSupers', branchId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      return response.data.serviceSuper || [];
    },
    staleTime: 60 * 60 * 1000, 
    retry: 2,
  });

  
  const { 
    data: servicesData, 
    isLoading: isServicesLoading, 
    error: servicesError,
    refetch: refetchServices 
  } = useQuery({
    queryKey: ['services', activeSuperCategory, branchId],
    queryFn: async () => {
      if (!activeSuperCategory) return { services: [], serviceSuper: null };
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-out/${activeSuperCategory}/${branchId}`);
      return {
        services: response.data.service || [],
        serviceSuper: response.data.serviceSuper || null
      };
    },
    enabled: !!activeSuperCategory,
    staleTime: 60 * 60 * 1000, 
    retry: 2,
  });

 
  const { 
    data: subServices, 
    isLoading: isSubServicesLoading,
    isFetching: isSubServicesFetching,
    error: subServicesError
  } = useQuery({
    queryKey: ['subServices', selectedService?.service_slug, branchId],
    queryFn: async () => {
      if (!selectedService) return [];
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${selectedService.service_slug}/${branchId}`
      );
      return response.data.servicesub || [];
    },
    enabled: fetchSubServicesEnabled && !!selectedService, 
    retry: 2,
  });

 
  useEffect(() => {
    if (serviceSupers && serviceSupers.length > 0 && !activeSuperCategory) {
      setActiveSuperCategory(serviceSupers[0].serviceSuper_url);
    }
  }, [serviceSupers, activeSuperCategory]);

 
  useEffect(() => {
    if (fetchSubServicesEnabled && selectedService && subServices !== undefined) {
      if (subServices && subServices.length > 0) {
        setShowSubServiceModal(true);
      } else {
       
        navigateToServiceDetails(selectedService.id, selectedService.service, selectedService.service_slug);
      }
      setFetchSubServicesEnabled(false); 
    }
  }, [subServices, fetchSubServicesEnabled, selectedService]);

  
  useEffect(() => {
    if (fetchSubServicesEnabled && selectedService && subServicesError) {
    
      navigateToServiceDetails(selectedService.id, selectedService.service, selectedService.service_slug);
      setFetchSubServicesEnabled(false); 
    }
  }, [subServicesError, fetchSubServicesEnabled, selectedService]);

  const SkeletonLoader = () => {
    return (
      <div className="service-grid-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="service-grid-card skeleton">
            <div className="service-grid-card-image shimmer"></div>
            <div className="service-grid-card-content">
              <div className="service-grid-card-title shimmer"></div>
              <div className="service-grid-card-footer shimmer">
                <div className="shimmer-circle"></div>
                <div className="shimmer-button"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowSubServiceModal(false);
    setFetchSubServicesEnabled(true); 
  };

  const navigateToServiceDetails = (serviceId, serviceName, serviceUrl) => {
    navigate(`/${activeSuperCategory}-in-${city.toLowerCase()}/${encodeURIComponent(serviceUrl)}/pricing`);
  };

  const navigateToSubServiceDetails = (subService) => {
    if (!selectedService || !activeSuperCategory) return;
    
    navigate(`/${activeSuperCategory}-in-${city.toLowerCase()}/${encodeURIComponent(selectedService.service_slug)}/${encodeURIComponent(subService.service_sub_slug)}/pricing`);
  };

  const handleSuperCategoryClick = (superCategoryId) => {
    setActiveSuperCategory(superCategoryId);
    setShowSubServiceModal(false);
    setSelectedService(null);
    setFetchSubServicesEnabled(false); 
  };

  const handleCloseModal = () => {
    setShowSubServiceModal(false);
    setSelectedService(null);
    setFetchSubServicesEnabled(false); 
  };

  const getImageUrl = (imageName, isSubService = false) => {
    if (!imageName) return `${NO_IMAGE_URL}`;
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const getImageUrlCategory = (image) => {
    if (!image) return `${NO_IMAGE_URL}`;
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };

  if (isServiceSupersLoading) {
    return (
      <>
        <DefaultHelmet/>
  
        {/* <div className="service-grid-loading-container">
          <div className="service-grid-loading-content">
          <div className="flex flex-col text-center items-center">
           <Loader className='text-gray-500 animate-spin'/>
            <p className="mt-3 text-gray-500">Loading services...</p>
          </div>
          </div>
        </div> */}
        <LoadingPlaceholder/>
      </>
    );
  }

  if (serviceSupersError) {
    return (
      <>
        <DefaultHelmet/>
   
        <div className="service-grid-error-container">
          <div className="service-grid-error-content">
            <Icon.AlertCircle className="service-grid-error-icon" size={18} />
            <div className="service-grid-error-message">{(serviceSupersError).message}</div>
            <button 
              className="service-grid-error-button"
              onClick={() => refetchServiceSupers()}
            >
              <Icon.RefreshCw className="me-1" size={14} />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DefaultHelmet/>
  
      
      <div className="service-grid-container">
        <div className="service-grid-content">
          <div className="service-grid-header">
            <div className="service-grid-title-wrapper">
              <h1 className="service-grid-main-title">{servicesData?.serviceSuper?.serviceSuper || "Our Services"}</h1>
              <p className="service-grid-subtitle">Choose from our wide range of professional services</p>
            </div>
            <div className="service-grid-nav-and-list">
              <div className="service-grid-nav">
                <button className="service-grid-nav-button" onClick={() => {
                  const container = document.querySelector('.service-grid-list');
                  if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                }}>
                  <Icon.ChevronLeft size={16} />
                </button>
                <button className="service-grid-nav-button" onClick={() => {
                  const container = document.querySelector('.service-grid-list');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}>
                  <Icon.ChevronRight size={16} />
                </button>
              </div>
              <div className="service-grid-list">
                {serviceSupers?.map((superCat) => (
                  <div 
                    key={superCat.id}
                    className={`service-grid-category-item ${activeSuperCategory === superCat.serviceSuper_url ? 'active' : ''}`}
                    onClick={() => handleSuperCategoryClick(superCat.serviceSuper_url)}
                  >
                    <div className="service-grid-category-card">
                      <LazyLoadImage
                        src={getImageUrlCategory(superCat.serviceSuper_image)}
                        alt={superCat.serviceSuper}
                        className="service-grid-category-image"
                        effect="blur"
                        width="100%"
                        height="100%"
                        onError={(e) => {
                          const target = e.target;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
                      <span className="service-grid-category-name">{superCat.serviceSuper}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isServicesLoading ? (
            <SkeletonLoader />
          ) : servicesError ? (
            <div className="service-grid-error-container">
              <div className="service-grid-error-content">
                <Icon.AlertCircle className="service-grid-error-icon" size={18} />
                <div className="service-grid-error-message">{(servicesError).message}</div>
                <button
                  className="service-grid-error-button"
                  onClick={() => refetchServices()}
                >
                  <Icon.RefreshCw className="me-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          ) : servicesData?.services?.length === 0 ? (
            <div className="service-grid-empty-container">
              <div className="service-grid-empty-content">
                <LazyLoadImage
                  src={`${NO_IMAGE_URL}`}
                  alt="No services found"
                  effect="blur"
                  className="service-grid-empty-image"
                />
                <h4 className="service-grid-empty-title">No services found Service List</h4>
                <p className="service-grid-empty-text">We could not find any services in this category.</p>
              </div>
            </div>
          ) : (
            <div className="service-grid-grid">
              {servicesData?.services?.map((service) => (
                <div key={service.id} className="service-grid-card-wrapper">
                  <div 
                    className="service-grid-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="service-grid-card-image-container">
                      <LazyLoadImage
                        src={getImageUrl(service.service_image)}
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
                          <span>{city}</span>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Service Modal */}
      {showSubServiceModal && selectedService && (
  <div className="fixed inset-0 z-[9999] overflow-y-auto">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      aria-hidden="true"
      onClick={handleCloseModal}
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
            onClick={handleCloseModal}
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
          {(isSubServicesLoading || isSubServicesFetching) ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {subServices.map((subService) => (
                <div
                  key={subService.id}
                  className="group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => navigateToSubServiceDetails(subService)}
                >
                  {/* Image */}
                  <div className="relative  overflow-hidden">
                  <LazyLoadImage
                        src={getImageUrl(subService.service_sub_image, true)}
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
              onClick={handleCloseModal}
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

export default ServiceList;