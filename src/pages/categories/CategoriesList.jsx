import React, { useEffect, useMemo, useState } from 'react';
import {  useParams, useNavigate, Link,useLocation } from 'react-router-dom';

import axios from 'axios';
import * as Icon from 'react-feather';


import { Helmet } from 'react-helmet-async';
import './Categories.css';


import './ServiceCategory.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL, SERVICE_SUPER_IMAGE_URL } from '../../config/BaseUrl';



const CategoriesList = () => {
  const { id, category_name } = useParams();

 const location = useLocation();
  const branchId = localStorage.getItem("branch_id")
  const city = localStorage.getItem("city")
  /* category start */
   const [categories, setCategories] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [errorCategory, setErrorCategory] = useState(null);
  /* category end */
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [serviceSuper, setServiceSuper] = useState(null);
  const navigate = useNavigate();

  
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-super-out/${branchId}`);
      setCategories(response.data.serviceSuper?.map((item) => ({
        id: item.id,
        name: item.serviceSuper,
        image: item.serviceSuper_image,
        url: item.serviceSuper_url
      })) || []);
    } catch (error) {
      console.error('Failed to fetch  categories:', error);
      setError('Failed to load  categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = id 
        ? `${BASE_URL}/api/panel-fetch-web-service-out/${category_name}/${branchId}`
        : `${BASE_URL}/api/panel-fetch-web-service-out/${category_name}/2`;
      
      const response = await axios.get(url);
      setServices(response.data.service || []);
      setServiceSuper(response.data.serviceSuper || null);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubServices = async (serviceId, serviceUrl, serviceName) => {
    try {
      setSubServiceLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-service-sub-out/${serviceUrl}/${branchId}`
      );
      
      if (response.data.servicesub && response.data.servicesub.length > 0) {
        setSubServices(response.data.servicesub);
        setShowSubServiceModal(true);
      } else {
        navigate(`/${category_name}/${encodeURIComponent(serviceUrl)}/pricing`, {
          state: {
            service_id: serviceId,
            service_name: serviceName
          }
        });
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error);
      navigate(`/${category_name}/${encodeURIComponent(serviceUrl)}/pricing`, {
        state: {
          service_id: serviceId,
          service_name: serviceName
        }
      });
    } finally {
      setSubServiceLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    fetchSubServices(service.id ,service.service_slug, service.service);
  };

  const getImageUrl = (imageName, isSubService = false) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return isSubService 
      ? `${SERVICE_SUB_IMAGE_URL}/${imageName}`
      : `${SERVICE_IMAGE_URL}/${imageName}`;
  };

  const getImageUrlCategory = (image) => {
    if (!image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${SERVICE_SUPER_IMAGE_URL}/${image}`;
  };
 useEffect(() => {
      fetchCategories();
    }, []);
  useEffect(() => {
    fetchServices();
  }, [category_name]);

  const SkeletonLoader = () => {
    return (
      <div className="categories-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="categories-card skeleton">
            <div className="categories-card-image shimmer"></div>
            <div className="categories-card-content">
              <div className="categories-card-title shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <>
     
 
        <div className="categories-error-container">
          <div className="categories-error-content">
            <i className="ri-error-warning-line categories-error-icon"></i>
            <div className="categories-error-message">{error}</div>
            <button 
              className="categories-error-button"
              onClick={fetchServices}
            >
              <i className="ri-loop-right-line me-1"></i>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (services.length === 0 && !loading) {
    return (
      <>
        <Helmet>
          <title>
            {serviceSuper?.serviceSuper && serviceSuper?.serviceSuper !== "null"
              ? serviceSuper.serviceSuper
              : "Best house cleaning service | V3 Care"}
          </title>
          {(serviceSuper?.serviceSuper_meta_title &&
            serviceSuper?.serviceSuper_meta_title !== "null") && (
            <meta name="title" content={serviceSuper.serviceSuper_meta_title} />
          )}
          {(serviceSuper?.serviceSuper_meta_description &&
            serviceSuper?.serviceSuper_meta_description !== "null") && (
            <meta name="description" content={serviceSuper.serviceSuper_meta_description} />
          )}
          {(serviceSuper?.serviceSuper_keywords &&
            serviceSuper?.serviceSuper_keywords !== "null") && (
            <meta name="keywords" content={serviceSuper.serviceSuper_keywords} />
          )}
          {(serviceSuper?.serviceSuper_meta_tags &&
            serviceSuper?.serviceSuper_meta_tags !== "null") && (
            <meta name="tags" content={serviceSuper.serviceSuper_meta_tags} />
          )}
        </Helmet>

        <div className="categories-container">
          <div className="categories-content">
            <div className="categories-header">
              <div className="categories-title-wrapper">
                <h1 className="categories-main-title">{serviceSuper?.serviceSuper || "Our Services"}</h1>
                <p className="categories-subtitle">Choose from our wide range of professional services</p>
              </div>
              <div className="categories-nav-and-list">
                <div className="categories-nav">
                  <button className="categories-nav-button" onClick={() => {
                    const container = document.querySelector('.categories-list');
                    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                  }}>
                    <Icon.ChevronLeft size={16} />
                  </button>
                  <button className="categories-nav-button" onClick={() => {
                    const container = document.querySelector('.categories-list');
                    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                  }}>
                    <Icon.ChevronRight size={16} />
                  </button>
                </div>
                <div className="categories-list">


                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/${encodeURIComponent(category.url)}`}
                      className="category-item"
                    >
                      <div className="category-card">
                          <LazyLoadImage
                          src={getImageUrlCategory(category.image)}
                          alt={category.name}
                          className="category-image"
                          effect="blur"
                          width="100%"
                          height="100%"
                          onError={(e) => {
                            const target = e.target;
                            target.src = `${NO_IMAGE_URL}`;
                          }}
                        />
                        <h1 className="category-name">{category.name}</h1>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="categories-empty-container">
              <div className="categories-empty-content">
                <LazyLoadImage
                  src={`${NO_IMAGE_URL}`}
                  alt="No services found"
                  effect="blur"
                  className="categories-empty-image"
                />
                <h4 className="categories-empty-title">No services found</h4>
                <p className="categories-empty-text">We couldn not find any services matching your criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {serviceSuper?.serviceSuper && serviceSuper?.serviceSuper !== "null"
            ? serviceSuper.serviceSuper
            : "Best house cleaning service | V3 Care"}
        </title>
        {(serviceSuper?.serviceSuper_meta_title &&
          serviceSuper?.serviceSuper_meta_title !== "null") && (
          <meta name="title" content={serviceSuper.serviceSuper_meta_title} />
        )}
        {(serviceSuper?.serviceSuper_meta_description &&
          serviceSuper?.serviceSuper_meta_description !== "null") && (
          <meta name="description" content={serviceSuper.serviceSuper_meta_description} />
        )}
        {(serviceSuper?.serviceSuper_keywords &&
          serviceSuper?.serviceSuper_keywords !== "null") && (
          <meta name="keywords" content={serviceSuper.serviceSuper_keywords} />
        )}
        {(serviceSuper?.serviceSuper_meta_tags &&
          serviceSuper?.serviceSuper_meta_tags !== "null") && (
          <meta name="tags" content={serviceSuper.serviceSuper_meta_tags} />
        )}
      </Helmet>


    
      
      <div className="categories-container">
        <div className="categories-content">
        <div className="categories-header">
  <div className="categories-title-wrapper">
    <h1 className="categories-main-title">{serviceSuper?.serviceSuper || "Our Services"}</h1>
    <p className="categories-subtitle">Choose from our wide range of professional services</p>
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
    {categories.map((category) => (
      <div 
        key={category.id}
        className={`service-grid-category-item ${category_name === category.url ? 'active' : ''}`}
      >
        <Link 
          to={`/${encodeURIComponent(category.url)}`}
          className="service-grid-category-card"
        >
         <LazyLoadImage
                        src={getImageUrlCategory(category.image)}
                        alt={category.name}
                        className="service-grid-category-image"
                        effect="blur"
                        width="100%"
                        height="100%"
                        onError={(e) => {
                          const target = e.target;
                          target.src = `${NO_IMAGE_URL}`;
                        }}
                      />
          <h1 className="service-grid-category-name">{category.name}</h1>
        </Link>
      </div>
    ))}
  </div>
</div>




</div>
          
      

{loading ? (
  <SkeletonLoader />
) : (
  <div className="categories-grid">
              {services.map((service) => (
                <div key={service.id} className="categories-card-wrapper">
                  <div 
                    className="categories-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="categories-card-image-container">
                      <LazyLoadImage
                        src={getImageUrl(service.service_image)}
                        className="categories-card-image"
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
                    <div className="categories-card-content">
                      <h1 className="h5 categories-card-title">{service.service}</h1>
                      <div className="categories-card-footer">
                        <span className="categories-card-city">
                          <Icon.MapPin className="categories-card-icon" size={12} />
                          <span>{city}</span>
                        </span>
                        <button 
                          className="categories-book-now-btn"
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
                  onClick={() => navigate(`/${category_name}/${selectedService?.service_slug}/${subService.service_sub_slug}/pricing`, {
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

export default CategoriesList;



//sajid d
