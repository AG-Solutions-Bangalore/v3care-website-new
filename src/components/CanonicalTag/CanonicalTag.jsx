import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalTag = () => {
  const location = useLocation();
  
  useEffect(() => {
   
    const baseUrl = "https://v3care.in/";
    
   
    
    const path = location.pathname.startsWith('/') 
      ? location.pathname.substring(1) 
      : location.pathname;
    
 
    const canonicalUrl = `${baseUrl}${path}`;
    
  
    let canonicalTag = document.querySelector('link[rel="canonical"]') 
    
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    
  
    canonicalTag.href = canonicalUrl;
    
    
    return () => {
      if (canonicalTag && document.head.contains(canonicalTag)) {
        document.head.removeChild(canonicalTag);
      }
    };
  }, [location.pathname]);

  return null; 
};

export default CanonicalTag;