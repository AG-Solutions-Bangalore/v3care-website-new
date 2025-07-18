// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth', 
//     });
//   }, [pathname]);

//   return null;
// };

// export default ScrollToTop;


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

// Kick off the polyfill
smoothscroll.polyfill();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
