// src/utils/getCurrentDate.js
export const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  