// SmoothScroll.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';


smoothscroll.polyfill();


const SmoothScroll = ({
  children = null,
  scrollToTop = true,
  targetId,
  behavior = 'smooth'
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior,
      });
    } else if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior });
      }
    }
  }, [pathname, scrollToTop, targetId, behavior]);

  return children;
};

export default SmoothScroll;