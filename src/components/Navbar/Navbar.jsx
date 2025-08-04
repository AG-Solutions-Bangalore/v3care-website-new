import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import logoNav from "../../../public/assets/img/services/v3logo.png"
import { useSelector } from 'react-redux';
import axios from 'axios';
import CityModal from '../CityModal/CityModal';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../config/BaseUrl';
import './Navbar.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  
  // Subservice modal states
  const [selectedService, setSelectedService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [showSubServiceModal, setShowSubServiceModal] = useState(false);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  
  const cartItems = useSelector((state) => state.cart.items);
  
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const [hasFetchedServices, setHasFetchedServices] = useState(false);

  useEffect(() => {
    const storedCity = localStorage.getItem('city');
    setCurrentCity(storedCity);

    const handleCityChange = (event) => {
      const city = (event).detail;
      setCurrentCity(city);
    };

    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

  useEffect(() => {
    if (isMenuOpen || showMobileSearchModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileSearchModal, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleCityClick = () => setShowCityModal(true);
  
  const handleCitySelect = (city, branchId) => {
    localStorage.setItem('city', city);
    localStorage.setItem('branch_id', branchId.toString());
    setCurrentCity(city);
    setShowCityModal(false);
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
  };

  const handleCloseModal = () => setShowCityModal(false);

  const isRouteActive = (path) => location.pathname === path;

  const fetchServices = async () => {
    try {
      setIsSearching(true);
      setSearchError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-service-all-out`);
      setServices(response.data.service);
      setHasFetchedServices(true);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setSearchError('Failed to load services. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchSubServices = async (serviceId, serviceName,serviceUrl,serviceSuperUrl, superServiceId) => {
    try {
      setSubServiceLoading(true);
      const branchId = localStorage.getItem("branch_id");
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

  const handleSearchFocus = () => {
    if (!hasFetchedServices) {
      fetchServices();
    }
    setShowSearchResults(true);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      if (hasFetchedServices) {
        const filtered = services.filter(service => 
          service.service.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredServices(filtered);
        setShowSearchResults(true);
      }
    } else {
      setShowSearchResults(false);
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

  const handleServiceClick = (service, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedService(service);
    fetchSubServices(service.id, service.service,service.service_slug, service.serviceSuper_url, service.super_service_id);
    
    setShowSearchResults(false);
    setShowMobileSearchModal(false);
    setSearchQuery('');
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  const toggleMobileSearch = () => {
    setShowMobileSearchModal(!showMobileSearchModal);
    if (!showMobileSearchModal && !hasFetchedServices) {
      fetchServices();
    }
    if (!showMobileSearchModal && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
    }
  };
  const handleSubServiceClick = (subService) => {
    navigate(`/${selectedService?.serviceSuper_url}/${selectedService?.service_slug}/${subService.service_sub_slug}/pricing`, {
      state: {
        service_id: selectedService?.id,
        service_name: selectedService?.service,
        service_sub_id: subService.id,
        service_sub_name: subService.service_sub
      }
    });
    setShowSubServiceModal(false); 
  };
  const renderSearchResults = () => (
    <>
      {isSearching ? (
        <div className="home-header-nav-search-loading">
          <div className="home-header-nav-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : searchError ? (
        <div className="home-header-nav-search-error">
          <Icon.AlertCircle size={16} />
          <span>{searchError}</span>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="home-header-nav-search-results-list">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="home-header-nav-search-result-item"
              onClick={(e) => handleServiceClick(service, e)}
              role="button" 
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleServiceClick(service);
                }
              }}
            >
              <div className="home-header-nav-search-result-image">
                <LazyLoadImage
                  src={getImageUrlService(service.service_image)}
                  alt={service.service}
                  effect="blur"
                  width="40"
                  height="40"
                />
              </div>
              <div className="home-header-nav-search-result-content">
                <h4>{highlightMatch(service.service, searchQuery)}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="home-header-nav-no-results">
          <Icon.Search size={18} />
          <span>No services found</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {showCityModal && (
        <CityModal
          onSelectCity={handleCitySelect}
          onClose={handleCloseModal}
          selectedCity={currentCity}
        />
      )}

      {/* Subservice Modal */}
    
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
                  onClick={() => handleSubServiceClick(subService)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
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

      <header className={`home-header-nav `}>
        <div className="home-header-nav-container">
          <div className="home-header-nav-brand">
            <Link to="/" className="home-header-nav-logo-link">
              <img 
                src={logoNav} 
                className="home-header-nav-logo-img" 
                alt="Company Logo"
                width="60"
                height="60"
                loading="eager"
              />
            </Link>
          </div>

          <div className="home-header-nav-top-content">
            <div className="home-header-nav-contact-info">
              <button className="home-header-nav-city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
                <span className="home-header-nav-contact-text">{currentCity || 'Select City'}</span>
              </button>
              
              <div className="home-header-nav-contact-item">
                <Icon.Phone size={16} />
                <a href="tel:+919880778585"      target="_blank"
            rel="noreferrer" className="home-header-nav-contact-text">+91 9880778585</a>
              </div>
              
              <div className="home-header-nav-contact-item">
                <Icon.Mail size={16} />
                <a href="mailto:info@v3care.in"      target="_blank"
            rel="noreferrer" className="home-header-nav-contact-text">info@v3care.in</a>
              </div>
            </div>

            <div className="home-header-nav-contact-icons">
              <button className="home-header-nav-city-selector" onClick={handleCityClick}>
                <Icon.MapPin size={16} />
              </button>
              <a href="tel:+919880778585" className="home-header-nav-contact-icon-btn">
                <Icon.Phone size={18} />
              </a>
              <a href="mailto:info@v3care.in" className="home-header-nav-contact-icon-btn">
                <Icon.Mail size={18} />
              </a>
            </div>

            <div className="home-header-nav-top-actions">
            <Link to="/apply-job" className="home-header-nav-vendor-btn">
                <Icon.Briefcase size={16} />
                <span className="home-header-nav-btn-text">Apply For Job</span>
              </Link>
              <Link to="/become-partner" className="home-header-nav-vendor-btn">
                <Icon.User size={16} />
                <span className="home-header-nav-btn-text">Become Partner</span>
              </Link>
              
            </div>
          </div>

          <div className="home-header-nav-bottom-content">
            <div className="home-header-nav-actions-container">
              <nav className="home-header-nav-desktop-nav">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
                  </li>
                  <li className="home-header-nav-search-nav-item">
                    <div className="home-header-nav-search-container">
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        className="home-header-nav-search-input"
                        ref={searchInputRef}
                      />
                      <Icon.Search size={18} className="home-header-nav-search-icon" />
                      {showSearchResults && (
                        <div className="home-header-nav-search-results-dropdown" ref={searchResultsRef}>
                          {renderSearchResults()}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>

              <nav className="home-header-nav-medium-nav">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
                  </li>
                  <li className="home-header-nav-search-nav-item">
                    <div className="home-header-nav-search-container">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        className="home-header-nav-search-input"
                        ref={searchInputRef}
                      />
                      <Icon.Search size={18} className="home-header-nav-search-icon" />
                      {showSearchResults && (
                        <div className="home-header-nav-search-results-dropdown" ref={searchResultsRef}>
                          {renderSearchResults()}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>

              <nav className="home-header-nav-medium-nav-for-sevenone">
                <ul className="home-header-nav-links">
                  <li className={isRouteActive('/') ? 'active' : ''}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={isRouteActive('/service') ? 'active' : ''}>
                    <Link to="/service">Services</Link>
                  </li>
                </ul>
              </nav>

              <div className="home-header-nav-bottom-actions">
                <button 
                  className="home-header-nav-search-icon-trigger" 
                  onClick={toggleMobileSearch}
                  aria-label="Search"
                >
                  <Icon.Search size={20} />
                </button>
                <Link to="/cart" className="home-header-nav-cart-icon">
                  <Icon.ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="home-header-nav-cart-count">{cartItems.length}</span>
                  )}
                </Link>
                
                <Link to="/service" className="home-header-nav-book-now-btn">
                  <span className="home-header-nav-btn-text">Book Now</span>
                </Link>

                <Link to="/become-partner" className="home-header-nav-vendor-btn-mobile">
                  <Icon.User size={16} />
                </Link>

                <button 
                  className="home-header-nav-menu-toggle" 
                  onClick={toggleMenu} 
                  aria-label="Toggle menu" 
                  ref={toggleButtonRef}
                >
                  <Icon.Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Modal */}
        {showMobileSearchModal && (
          <div className="home-header-nav-mobile-search-modal">
            <div className="home-header-nav-mobile-search-container">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus} 
                className="home-header-nav-mobile-search-input"
                ref={mobileSearchInputRef}
                autoFocus
              />
              <button 
                className="home-header-nav-mobile-search-close" 
                onClick={toggleMobileSearch}
                aria-label="Close search"
              >
                <Icon.X size={20} />
              </button>
            </div>
            
            <div className="home-header-nav-mobile-search-results">
              {renderSearchResults()}
            </div>
          </div>
        )}

        <div className={`home-header-nav-sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        <div className={`home-header-nav-mobile-sidebar ${isMenuOpen ? 'open' : ''}`} ref={sidebarRef}>
          <div className="home-header-nav-sidebar-header">
            <Link to="/" className="home-header-nav-sidebar-logo" onClick={closeMenu}>
              <img 
                src={logoNav} 
                alt="Company Logo"
                width="60"
                height="60"
                loading="lazy"
              />
            </Link>
            <button className="home-header-nav-sidebar-close" onClick={closeMenu} aria-label="Close menu">
              <Icon.X size={24} />
            </button>
          </div>
    
          <div className="home-header-nav-sidebar-content">
            <div className="home-header-nav-sidebar-city-selector" onClick={() => { handleCityClick(); closeMenu(); }}>
              <Icon.MapPin size={18} />
              <span>{currentCity || 'Select Your City'}</span>
            </div>
    
            <ul className="home-header-nav-sidebar-links">
              <li className={isRouteActive('/') ? 'active' : ''}>
                <Link to="/" onClick={closeMenu}>
                  <Icon.Home size={18} />
                  <span>Home</span>
                </Link>
              </li>
              <li className={isRouteActive('/about-us') ? 'active' : ''}>
                <Link to="/about-us" onClick={closeMenu}>
                  <Icon.Info size={18} />
                  <span>About Us</span>
                </Link>
              </li>
              <li className={isRouteActive('/service') ? 'active' : ''}>
                <Link to="/service" onClick={closeMenu}>
                  <Icon.Settings size={18} />
                  <span>Services</span>
                </Link>
              </li>
              <li className={isRouteActive('/client') ? 'active' : ''}>
                <Link to="/client" onClick={closeMenu}>
                  <Icon.Users size={18} />
                  <span>Clients</span>
                </Link>
              </li>
              <li className={isRouteActive('/blog') ? 'active' : ''}>
                <Link to="/blog" onClick={closeMenu}>
                  <Icon.BookOpen size={18} />
                  <span>Blog</span>
                </Link>
              </li>
              <li className={isRouteActive('/contact-us') ? 'active' : ''}>
                <Link to="/contact-us" onClick={closeMenu}>
                  <Icon.Mail size={18} />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
    
            <div className="home-header-nav-sidebar-actions">
              <Link to="/become-partner" className="home-header-nav-sidebar-vendor-btn" onClick={closeMenu}>
                <Icon.User size={18} />
                <span>Become Partner</span>
              </Link>
              
              <Link to="/service" className="home-header-nav-sidebar-header-book-now-btn" onClick={closeMenu}>
                <Icon.Plus size={18} />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;