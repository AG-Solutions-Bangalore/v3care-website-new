import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import logoNav from "../../../public/assets/img/services/v3logo.png"
import { useSelector } from 'react-redux';
import axios from 'axios';
import CityModal from '../CityModal/CityModal';
import { BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL, SERVICE_SUB_IMAGE_URL } from '../../config/BaseUrl';
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
        <div className="flex items-center p-2 gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <span>Searching...</span>
        </div>
      ) : searchError ? (
        <div className="flex items-center p-2 gap-2 text-red-500">
          <Icon.AlertCircle size={16} />
          <span>{searchError}</span>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="py-1">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
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
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <LazyLoadImage
                  src={getImageUrlService(service.service_image)}
                  alt={service.service}
                  effect="blur"
                  width="40"
                  height="40"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-medium text-gray-800">{highlightMatch(service.service, searchQuery)}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center p-2 gap-2 text-gray-500">
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

      

      <header className="bg-white shadow-md w-full sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-2 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link title="Home" to="/" className="flex items-center">
                <img 
                  src={logoNav} 
                  className="h-16 w-auto" 
                  alt="Company Logo"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-black px-3 py-2 text-sm font-medium ${isRouteActive('/') ? 'text-black font-semibold border-b-2 border-black' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/service" 
                className={`text-gray-700 hover:text-black px-3 py-2 text-sm font-medium ${isRouteActive('/service') ? 'text-black font-semibold border-b-2 border-black' : ''}`}
              >
                Services
              </Link>
              
              {/* Search Bar */}
              <div className="relative ">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
                    ref={searchInputRef}
                  />
                  <Icon.Search size={18} className="absolute right-3 text-gray-400" />
                </div>
                
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 max-h-96 overflow-y-auto">
                    {renderSearchResults()}
                  </div>
                )}
              </div>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* City Selector */}
             <div className="hidden lg:flex flex-row items-center gap-2">
    <Icon.Phone size={14} className="text-black" />
    <a 
      href="tel:+919880778585" 
      className="text-sm hover:text-gray-900 text-gray-700 transition-colors"
    >
      +91 98807 78585
    </a>
  </div>
              <button 
                onClick={handleCityClick}
                className="hidden hover:cursor-pointer md:flex items-center text-gray-700 hover:text-black px-3 py-2 text-sm font-medium"
              >
                <Icon.MapPin size={16} className="mr-1" />
                <span>{currentCity || 'Select City'}</span>
              </button>

              {/* Become Partner */}
              <Link 
                title="Book Now" 
                to="/service" 
                className="hidden lg:flex items-center bg-black text-white border border-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors"
              >
                <Icon.Calendar size={16} className="mr-1" />
                <span>Book Now</span>
              </Link>
              <Link 
                title="Become Partner" 
                to="/become-partner" 
                className="hidden md:flex lg:hidden items-center bg-black text-white border border-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors"
              >
                <Icon.Briefcase size={16} className="mr-1" />
                <span>Become Partner</span>
              </Link>

              {/* Cart */}
              <Link 
                title="Cart" 
                to="/cart" 
                className="relative p-2 text-gray-700 bg-black rounded-full hover:text-black"
              >
                <Icon.ShoppingCart size={24} className='text-white' />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black border text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Search Button */}
              <button 
                className="md:hidden p-2 text-gray-700 hover:text-black"
                onClick={toggleMobileSearch}
                aria-label="Search"
              >
                <Icon.Search size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-700 hover:text-black"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                ref={toggleButtonRef}
              >
                <Icon.Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Modal */}
        {showMobileSearchModal && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="flex items-center p-4 border-b">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  ref={mobileSearchInputRef}
                  autoFocus
                />
                <Icon.Search size={18} className="absolute right-3 top-3 text-gray-400" />
              </div>
              <button 
                className="ml-2 p-2 text-gray-700"
                onClick={toggleMobileSearch}
                aria-label="Close search"
              >
                <Icon.X size={20} />
              </button>
            </div>
            
            <div className="p-4 max-h-screen overflow-y-auto">
              {renderSearchResults()}
            </div>
          </div>
        )}

        {/* Mobile Sidebar */}
        <div 
          className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
          ref={sidebarRef}
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 bg-opacity-50"
            onClick={closeMenu}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-80 max-w-full bg-white h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <Link title="Home" to="/" className="flex items-center" onClick={closeMenu}>
                <img 
                  src={logoNav} 
                  alt="Company Logo"
                  width="60"
                  height="60"
                  loading="lazy"
                  className="h-10 w-auto"
                />
              </Link>
              <button 
                className="p-2 text-gray-700"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <Icon.X size={24} />
              </button>
            </div>
      
            <div className="p-4">
              <div 
                className="flex items-center w-full bg-gray-100 rounded-lg p-3 mb-4 cursor-pointer"
                onClick={() => { handleCityClick(); closeMenu(); }}
              >
                <Icon.MapPin size={18} className="mr-2" />
                <span>{currentCity || 'Select Your City'}</span>
              </div>
      
              <ul className="space-y-2">
                <li className={isRouteActive('/') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    to="/" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.Home size={18} className="mr-3" />
                    <span>Home</span>
                  </Link>
                </li>
                <li className={isRouteActive('/about-us') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    title="About Us" 
                    to="/about-us" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.Info size={18} className="mr-3" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li className={isRouteActive('/service') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    title="Service" 
                    to="/service" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.Settings size={18} className="mr-3" />
                    <span>Services</span>
                  </Link>
                </li>
                <li className={isRouteActive('/client') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    title="Client" 
                    to="/client" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.Users size={18} className="mr-3" />
                    <span>Clients</span>
                  </Link>
                </li>
                <li className={isRouteActive('/blog') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    title="Blog" 
                    to="/blog" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.BookOpen size={18} className="mr-3" />
                    <span>Blog</span>
                  </Link>
                </li>
                <li className={isRouteActive('/contact-us') ? 'bg-gray-100 rounded-lg' : ''}>
                  <Link 
                    title="Contact Us" 
                    to="/contact-us" 
                    onClick={closeMenu}
                    className="flex items-center p-3 text-gray-700 hover:text-black"
                  >
                    <Icon.Mail size={18} className="mr-3" />
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
      
              <div className="mt-8 space-y-3">
                <Link 
                  title="Become Partner" 
                  to="/become-partner" 
                  className="flex items-center justify-center w-full bg-white text-black border border-black rounded-lg p-3 font-medium hover:bg-black hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <Icon.User size={18} className="mr-2" />
                  <span>Become Partner</span>
                </Link>
                
                <Link 
                  title="Service" 
                  to="/service" 
                  className="flex items-center justify-center w-full bg-black text-white rounded-lg p-3 font-medium hover:bg-gray-800 transition-colors"
                  onClick={closeMenu}
                >
                  <Icon.Plus size={18} className="mr-2" />
                  <span>Book Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;