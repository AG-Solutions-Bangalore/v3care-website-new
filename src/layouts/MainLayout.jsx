import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import * as Icon from 'react-feather';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* CTA Header */}
     
      <div className="fixed top-0 left-0 w-full z-50  bg-white">
         <div className="w-full  lg:hidden bg-black text-white py-2">
        <div className="max-w-8xl mx-auto px-2">
          <div className="flex items-center justify-between">
            {/* Mobile Number */}
            <div className="flex items-center space-x-2">
              <Icon.Phone size={14} className="text-gray-300" />
              <a 
                href="tel:+919880778585" 
                className="text-sm hover:text-gray-300 transition-colors"
              >
                +91 98807 78585
              </a>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => navigate('/service')}
              className="flex items-center bg-white text-black border border-white rounded-md px-3 py-1 text-xs font-medium hover:bg-black hover:text-white hover:border-white transition-colors"
            >
              <Icon.Calendar size={12} className="mr-1" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
             <Navbar />
           </div>
      <main className="flex-grow  pt-32  lg:pt-24">
        <div className="bg-[#FFFFFF]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;