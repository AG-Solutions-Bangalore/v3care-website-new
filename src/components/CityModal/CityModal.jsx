import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import axios from "axios";
import './CityModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../config/BaseUrl';
import { clearCart } from '../../redux/slices/CartSlice';
import { Loader } from 'lucide-react';



const CityModal = ({ onSelectCity, onClose, selectedCity }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alreadySelected, setAlreadySelected] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-branch-out`);
      const branchList = response.data?.branch || [];
      setBranches(branchList);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setError('Failed to load cities. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

 const showLoadingOverlay = (city) => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(255, 255, 255, 0.95)";
  overlay.style.backdropFilter = "blur(15px)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.fontFamily = "Arial, sans-serif";
  overlay.style.zIndex = "99999";

  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    @keyframes pulse {
      0% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.15); }
      100% { opacity: 0.3; transform: scale(1); }
    }
    @keyframes pulseShadow {
      0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
      50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); }
      100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .location-pin {
        transform: scale(0.8) translateY(-20px);
      }
      .location-text {
        font-size: 24px !important;
      }
      .location-subtext {
        font-size: 16px !important;
      }
      .radar-circle {
        stroke-width: 2px !important;
      }
    }
    
    @media (max-width: 480px) {
      .location-pin {
        transform: scale(0.6) translateY(-30px);
      }
      .location-text {
        font-size: 20px !important;
      }
      .location-subtext {
        font-size: 14px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  const svgContainer = document.createElement("div");
  svgContainer.style.width = "100%";
  svgContainer.style.height = "100%";
  svgContainer.style.display = "flex";
  svgContainer.style.justifyContent = "center";
  svgContainer.style.alignItems = "center";
  svgContainer.style.overflow = "hidden";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 600 600");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.maxWidth = "600px";
  svg.style.maxHeight = "600px";
  
  svg.innerHTML = `
  <!-- Background -->
  <rect width="600" height="600" fill="#ffffff"/>
  
  <!-- Gradient definitions -->
  <defs>
    <radialGradient id="pinGradient" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="1"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="1"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  
  <!-- Bouncing Location Pin -->
  <g class="location-pin" transform="translate(300, 200)">
    <!-- Shadow -->
    <ellipse cx="0" cy="25" rx="30" ry="8" fill="#000000" opacity="0.1">
      <animate attributeName="ry" values="8;4;8" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="rx" values="30;20;30" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.1;0.05;0.1" dur="1s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Pin body with glow -->
    <path d="M0,-50 C15,-50 30,-35 30,-10 C30,15 0,35 0,35 C0,35 -30,15 -30,-10 C-30,-35 -15,-50 0,-50 Z" 
          fill="url(#pinGradient)" filter="url(#glow)" style="animation: float 1.5s ease-in-out infinite">
      <animate attributeName="fill-opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
    </path>
    
    <!-- Pin circle -->
    <circle cx="0" cy="-15" r="15" fill="#ffffff" style="animation: pulse 2s ease-in-out infinite">
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-15; 0,0" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Dot in center -->
    <circle cx="0" cy="-15" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="1.5">
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-15; 0,0" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="r" values="6;7;6" dur="1s" repeatCount="indefinite"/>
    </circle>
  </g>
  
  <!-- City name and loading text -->
  <g transform="translate(300, 350)">
    <rect x="-150" y="-25" width="300" height="80" rx="15" fill="#ffffff" opacity="0.9" 
          stroke="#ef4444" stroke-width="1.5" style="filter: url(#glow)"/>
    
    <text class="location-text" x="0" y="0" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#dc2626">
      Loading ${city}...
      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
    </text>
    
    <text class="location-subtext" x="0" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#ef4444">
      Please wait while we locate you
    </text>
  </g>
  
  <!-- Pulsing radar circles -->
  <g transform="translate(300, 200)">
    <circle class="radar-circle" cx="0" cy="0" r="40" stroke="#ef4444" stroke-width="2" fill="none" opacity="0.5" 
            style="animation: pulse 3s ease-out infinite"/>
    <circle class="radar-circle" cx="0" cy="0" r="80" stroke="#ef4444" stroke-width="1.5" fill="none" opacity="0.3" 
            style="animation: pulse 3s ease-out infinite 0.5s"/>
    <circle class="radar-circle" cx="0" cy="0" r="120" stroke="#ef4444" stroke-width="1" fill="none" opacity="0.2" 
            style="animation: pulse 3s ease-out infinite 1s"/>
  </g>
  
  <!-- Animated dots -->
  <g transform="translate(300, 450)">
    <circle cx="-20" cy="0" r="5" fill="#ef4444">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0s"/>
    </circle>
    <circle cx="0" cy="0" r="5" fill="#ef4444">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
    </circle>
    <circle cx="20" cy="0" r="5" fill="#ef4444">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
    </circle>
  </g>
  `;

  svgContainer.appendChild(svg);
  overlay.appendChild(svgContainer);
  document.body.appendChild(overlay);

  // Auto-remove after 5 seconds and reload page
  setTimeout(() => {
      document.body.removeChild(overlay);
      document.head.removeChild(styleSheet);
      window.location.reload();
  }, 1200);
};

  const handleCitySelect = (branch) => {
    if (branch.branch_name === selectedCity) {
      setAlreadySelected(true);
      setTimeout(() => setAlreadySelected(false), 2000);
      return;
    }
    
    setSelectedBranch(branch);
    setAlreadySelected(false);
    
    if (cartItems.length > 0) {
      setShowConfirmation(true);
    } else {
      proceedWithCityChange(branch);
    }
  };

  const proceedWithCityChange = (branch) => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
    }
    
    onSelectCity(branch.branch_name, branch.id);
    showLoadingOverlay(branch.branch_name);
  };

  const cancelCityChange = () => {
    setSelectedBranch(null);
    setShowConfirmation(false);
  };

  const getButtonClassName = (branchName) => {
    let className = 'city-location-button';
    if (hoveredCity === branchName || selectedCity === branchName) {
      className += ' city-location-button-selected';
    }
    return className;
  };

 return (
     <div className={`city-location-modal-container ${isVisible ? 'city-location-modal-container-visible' : ''}`}>
       <div className={`city-location-modal-content ${isVisible ? 'city-location-modal-content-visible' : ''}`}>
         {onClose && (
           <button 
             onClick={handleClose}
             className="city-location-close-button"
           >
             <Icon.X size={20} color="#64748b" />
           </button>
         )}
 
         <div className="city-location-header">
           <h3 className="city-location-title">
             <span style={{ marginRight: '8px' }}>📍</span>
             {showConfirmation 
               ? 'Confirm City Change' 
               : alreadySelected 
                 ? 'Already Selected' 
                 : 'Select Your City'}
           </h3>
           <p className="city-location-subtitle">
             {showConfirmation 
               ? `You have ${cartItems.length} item(s) in your cart. Changing city will clear your cart.`
               : alreadySelected
                 ? `${selectedCity} is already your selected city.`
                 : 'Choose your location to see local services'}
           </p>
         </div>
 
         <div className="city-location-content">
           {isLoading ? (
            <div className="flex flex-col text-center items-center">
            <Loader className='text-gray-500 animate-spin'/>
             <p className="mt-3 text-gray-500">Loading cities...</p>
           </div>
           ) : error ? (
             <div className="city-location-error-container">
               <div className="city-location-error-message">
                 <Icon.AlertCircle className="me-2" size={20} />
                 <span>{error}</span>
               </div>
               <button 
                 className="btn btn-sm btn-outline-danger"
                 onClick={fetchCities}
               >
                 <Icon.RefreshCw size={14} className="me-1" />
                 Try Again
               </button>
             </div>
           ) : showConfirmation ? (
             <div className="city-location-confirmation-container">
               <div className="city-location-confirmation-alert">
                 <p className="city-location-confirmation-message">
                   Are you sure you want to switch to {selectedBranch?.branch_name}?
                 </p>
               </div>
               <div className="city-location-confirmation-buttons">
                 <button
                   onClick={cancelCityChange}
                   className="city-location-cancel-button"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => selectedBranch && proceedWithCityChange(selectedBranch)}
                   className="city-location-confirm-button"
                 >
                   Confirm Change
                 </button>
               </div>
             </div>
           ) : (
             <div className="city-location-buttons-container">
               {branches.map(branch => (
                 <button
                   key={branch.id}
                   onClick={() => handleCitySelect(branch)}
                   className={getButtonClassName(branch.branch_name)}
                   onMouseEnter={() => setHoveredCity(branch.branch_name)}
                   onMouseLeave={() => setHoveredCity(null)}
                 >
                   {branch.branch_name}
                 </button>
               ))}
             </div>
           )}
         </div>
 
         <div className="city-location-footer">
           <small className="city-location-footer-text">
             We will remember your selection
           </small>
         </div>
       </div>
     </div>
   );
};

export default CityModal;