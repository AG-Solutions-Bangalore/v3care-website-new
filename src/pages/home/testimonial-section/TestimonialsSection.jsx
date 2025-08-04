import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import { BASE_URL, TESTIMONIAL_IMAGE_URL, NO_IMAGE_URL } from '../../../config/BaseUrl';
import SkeletonTestimonials from './SkeletonTestimonials';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-testimonial-out`);
      setTestimonials(response.data.testimonial || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTestimonialImageUrl = (testimonial_image) => {
    if (!testimonial_image) {
      return `${NO_IMAGE_URL}`;
    }
    return `${TESTIMONIAL_IMAGE_URL}/${testimonial_image}`;
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-3xl font-bold text-black relative inline-block mb-2">
              Top Testimonials
              <span className="absolute left-0 bottom-[-8px] w-14 h-1 bg-gradient-to-r from-[#f63b3b] to-[#d81d1d] rounded"></span>
            </h1> 
            <p className="text-gray-600 text-base font-normal">
              Description highlights the value of client feedback,
              showcases real testimonials
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="flex justify-center">
              <img
                src="assets/img/testimonials-seven.png"
                alt="testimonials"
                className="max-w-full h-auto"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            {isLoading && <SkeletonTestimonials />}
            
            {error && !isLoading && (
              <div className="flex items-center justify-center bg-red-50 text-red-700 rounded-lg p-4 mb-6">
                <Icon.AlertCircle className="mr-2" size={18} />
                <span>{error}</span>
                <button 
                  className="ml-3 px-3 py-1 text-sm border border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white transition-colors"
                  onClick={fetchTestimonials}
                >
                  <Icon.RefreshCw className="mr-1 inline" size={14} />
                  Try Again
                </button>
              </div>
            )}
            
            {!isLoading && !error && testimonials.length > 0 && (
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                loop={true}
                className="testimonial-swiper "
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white rounded-xl p-6 border border-blue-100">
                      <div className="flex items-start gap-4 mb-4">
                        <LazyLoadImage
                          src={getTestimonialImageUrl(testimonial.testimonial_image)}
                          alt={testimonial.testimonial_user}
                          className="w-14 h-14 rounded-full object-cover border-2 border-red-900"
                          effect="blur"
                          width="56"
                          height="56"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {testimonial.testimonial_user}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <svg
                          className="w-10 h-10 text-red-900 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 pl-2 border-l-2 border-red-200">
                        {testimonial.testimonial_description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;