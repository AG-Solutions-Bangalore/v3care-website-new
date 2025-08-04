import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL } from '../../../config/BaseUrl';




const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-clients-out`);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setError('Failed to load partners. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getClientImageUrl = (imageName) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${CLIENT_IMAGE_URL}/${imageName}`;
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Skeleton loader component
  const ClientSkeleton = () => (
    <div className="flex items-center justify-center h-32 p-4">
      <div className="animate-pulse bg-gray-100 rounded-lg w-full h-full"></div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-2 relative inline-block">
            Our Clients
            <span className="absolute bottom-0 left-0 w-14 h-1 bg-gradient-to-r from-[#f63b3b] to-[#d81d1d] rounded-full"></span>
          </h1>
          <p className="text-gray-600 text-base font-normal mb-2">
            We are proud to partner with industry leaders and trusted brands
          </p>
          <Link
            to="/client"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors group"
          >
            See all Clients
            <Icon.ArrowRight 
              size={16} 
              className="ml-1 transition-transform group-hover:translate-x-1" 
            />
          </Link>
        </div>

        <div className="relative">
          {error && !isLoading && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-5 py-3 bg-red-50 text-red-600 rounded-lg">
                <Icon.AlertCircle className="mr-2" size={18} />
                <span>{error}</span>
                <button
                  className="ml-4 px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center"
                  onClick={fetchClients}
                >
                  <Icon.RefreshCw className="mr-1" size={14} />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, index) => (
                <ClientSkeleton key={index} />
              ))}
            </div>
          ) : clients.length > 0 && (
            <>
              <button className="client-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white  text-black rounded-full shadow-md flex items-center justify-center hover:bg-black hover:text-white transition-colors hidden md:flex">
                <Icon.ChevronLeft size={20} />
              </button>
              <button className="client-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white text-black rounded-full shadow-md flex items-center justify-center hover:bg-black hover:text-white transition-colors hidden md:flex">
                <Icon.ChevronRight size={20} />
              </button>

              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={30}
                slidesPerView={5}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  nextEl: '.client-swiper-button-next',
                  prevEl: '.client-swiper-button-prev',
                }}
                breakpoints={{
                  0: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 }
                }}
                className="py-4"
              >
                {clients.map((client, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex items-center justify-center h-32 p-2 transition-all duration-300 hover:-translate-y-1">
                      <LazyLoadImage
                        src={getClientImageUrl(client.client_image)}
                        alt={client.client_name}
                        className="max-h-20 w-auto object-contain  hover:border hover:border-black/20 transition-all duration-300 hover:scale-105"
                        effect="blur"
                        width="80"
                        height="80"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;