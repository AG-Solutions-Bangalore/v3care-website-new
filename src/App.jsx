import { useEffect, useState } from 'react'

import Home from './pages/home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CanonicalTag from './components/CanonicalTag/CanonicalTag';
import JoinUs from './components/JoinUs/JoinUs';
import SmoothScroll from './components/SmoothScroll/SmoothScroll';
import CityModal from './components/CityModal/CityModal';
import Client from './pages/client/Client';
import Blog from './pages/blog/Blog';
import BlogDetails from './pages/blog/BlogDetails';
import ApplyJob from './pages/apply-job/ApplyJob';
import ContactUs from './pages/contact-us/ContactUs';
import ServiceList from './pages/service/ServiceList';
import CategoriesList from './pages/categories/CategoriesList';
import BecomeVendor from './pages/became-vendor/BecomeVendor';
import ServiceDetails from './pages/service-details/ServiceDetails';
import Cart from './pages/cart/Cart';
import AboutUs from './pages/about-us/AboutUs';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';
// import Categories from './pages/categories/Categories';
// import ProductDetails from './pages/product/ProductDetails';
// import Cart from './pages/cart/Cart';

function App() {
    const [showCityModal, setShowCityModal] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);
    
    useEffect(() => {
      const city = localStorage.getItem('city');
      setCurrentCity(city);
      if (!city) {
        setShowCityModal(true);
      }
    }, []);
  
    const handleCitySelect = (city, branchId) => {
      localStorage.setItem('city', city);
      localStorage.setItem('branch_id', branchId.toString());
      setCurrentCity(city);
      setShowCityModal(false);
    
     
      window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
    };
    
    const handleCloseModal = () => {
      if (currentCity) {
        setShowCityModal(false);
      }
    };
  
  return (
    <>
      <CanonicalTag/>
       <JoinUs/>
    
          <SmoothScroll/>
           {showCityModal && (
                  <CityModal 
                    onSelectCity={handleCitySelect} 
                    onClose={currentCity ? handleCloseModal : undefined}
                    selectedCity={currentCity}
                  />
                )}
    <MainLayout>
      
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/client" element={<Client />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-details/:blogs_slug" element={<BlogDetails />} />
      <Route path="/apply-job" element={<ApplyJob />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/service" element={<ServiceList />} />
       <Route path="/:category_name" element={<CategoriesList />} />
       <Route path="/become-partner" element={<BecomeVendor />} />
       <Route path="/:category_name/:service_name/:service_sub_name/pricing" element={<ServiceDetails />} />
       <Route path="/:category_name/:service_name/pricing" element={<ServiceDetails />} />
       <Route path="/cart" element={<Cart />} />
     
       
        <Route path="/about-us" element={<AboutUs />} />
      
      
        
      
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/booking-failed" element={<PaymentFailed />} />


       
      
        
  
     
      </Routes>
    </MainLayout>
  </>
  )
}

export default App
