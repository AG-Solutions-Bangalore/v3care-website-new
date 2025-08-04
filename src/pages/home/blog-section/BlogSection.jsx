import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BASE_URL, BLOG_IMAGE_URL } from '../../../config/BaseUrl';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-blogs-out`);
      setBlogs(response.data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Skeleton loader component
  const BlogSkeleton = () => (
    <div className="p-2 h-full">
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-blue-100">
        <div className="animate-pulse bg-gray-100 h-48 w-full"></div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-200 h-8 w-8 mr-2"></div>
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
            </div>
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-5 w-full rounded"></div>
            <div className="bg-gray-200 h-5 w-4/5 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className="flex justify-center items-center min-h-[300px] text-center p-5 bg-white rounded-lg border border-gray-100">
      <div className="max-w-md">
        <p className="text-red-500 mb-5">{error}</p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors" 
          onClick={fetchBlogs}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-2 relative inline-block">
          Cleaning Tips, Trends & Service Guides from Our Experts
            <span className="absolute bottom-0 left-0 w-14 h-1 bg-gradient-to-r from-[#f63b3b] to-[#d81d1d] rounded-full"></span>
          </h1>
          <p className="text-gray-600 text-base font-normal">
          Stay informed with expert insights, practical cleaning tips, and the latest updates from the home and office cleaning industry in India.
          </p>
        </div>

        <div className="relative group">
          {error ? (
            <ErrorComponent />
          ) : loading ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={4}
              navigation={{
                nextEl: '.blog-swiper-button-next',
                prevEl: '.blog-swiper-button-prev',
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
            >
              {[...Array(4)].map((_, index) => (
                <SwiperSlide key={index}>
                  <BlogSkeleton />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <>
              <button className="blog-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white text-black rounded-full shadow-md  items-center justify-center hover:bg-black hover:text-white transition-colors hidden md:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="blog-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white text-black rounded-full shadow-md  items-center justify-center hover:bg-black hover:text-white transition-colors hidden md:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={4}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation={{
                  nextEl: '.blog-swiper-button-next',
                  prevEl: '.blog-swiper-button-prev',
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
              >
                {blogs.slice(0, 6).map((blog) => (
                  <SwiperSlide key={blog.id}>
                    <div className="p-2 h-full">
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-blue-100">
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <Link to={`/blog-details/${blog.blogs_slug}`}>
                            <LazyLoadImage
                              src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              alt={blog.blogs_heading}
                              effect="blur"
                              width="100%"
                              height="100%"
                            />
                          </Link>
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className="rounded-full overflow-hidden mr-2 border border-gray-200">
                                <LazyLoadImage
                                  src="assets/img/services/v3logo.png"
                                  className="w-8 h-8 object-cover"
                                  alt="user"
                                  effect="blur"
                                  width="32"
                                  height="32"
                                />
                              </div>
                              <span className="text-sm text-gray-600">V3 Care</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="ri-calendar-line mr-1"></i>
                              <span>{moment(blog.blogs_created_date).format("DD MMM")}</span>
                            </div>
                          </div>
                          <h3 className="text-md font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-black transition-colors">
                            <Link to={`/blog-details/${blog.blogs_slug}`}>
                              {blog.blogs_heading}
                            </Link>
                          </h3>
                        </div>
                      </div>
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

export default BlogSection;