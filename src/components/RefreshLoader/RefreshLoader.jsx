import React, { useEffect, useState } from 'react';
import logoNav from "../../logo/v3.png"
const RefreshLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   
    const wasRefreshed = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (wasRefreshed) {
      setIsLoading(true);
    }

    const handleBeforeUnload = () => {
      setIsLoading(true);

      const loader = document.getElementById('refresh-loader');
      if (loader) loader.style.display = 'flex';
    };

    const handleLoad = () => {
   
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Also hide loader when component mounts (fallback)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      id="refresh-loader"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
         backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        gap: '20px'
      }}
    >
      {/* Logo */}
      <img 
        src={logoNav} 
        alt="Logo" 
        style={{
          width: '120px',
          height: 'auto',
          marginBottom: '10px'
        }}
      />
      
      {/* Loading spinner */}
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      
      {/* Loading text */}
      <p style={{
        margin: 0,
        fontSize: '16px',
        color: '#666',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading...
      </p>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RefreshLoader;