// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key) => {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setValue(localStorage.getItem(key));
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (changes from same tab)
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, [key]);

  return value;
};