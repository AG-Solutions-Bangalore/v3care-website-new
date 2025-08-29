import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';
import axios from 'axios';
import moment from 'moment';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import { BASE_URL, BLOG_IMAGE_URL } from '../../config/BaseUrl';
import { all_routes } from '../../routes/all_routes';
import { Loader } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Blog = () => {
  const routes = all_routes;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-web-blogs-out`);
      setBlogs(response.data.blogs || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Pagination logic remains the same
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(blogs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blogs.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNumbers = 4;
  let displayPageNumbers = [];

  if (pageNumbers.length <= maxPageNumbers) {
    displayPageNumbers = pageNumbers;
  } else {
    if (currentPage <= 2) {
      displayPageNumbers = [1, 2, 3, '...', pageNumbers.length];
    } else if (currentPage >= pageNumbers.length - 1) {
      displayPageNumbers = [
        1,
        '...',
        pageNumbers.length - 2,
        pageNumbers.length - 1,
        pageNumbers.length,
      ];
    } else {
      displayPageNumbers = [
        1,
        currentPage - 1 > 2 ? '...' : 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2 < pageNumbers.length - 1 ? '...' : pageNumbers.length - 1,
        pageNumbers.length,
      ].filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  if (loading && blogs.length === 0) {
    return (
      <>
        <DefaultHelmet/>
        <BreadCrumb title="Services" item1="Services" />
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col text-center items-center">
           <Loader className='text-gray-500 animate-spin'/>
            <p className="mt-3 text-gray-500">Loading services...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DefaultHelmet/>
        <BreadCrumb title="Services" item1="Services" />
        <div className="flex justify-center items-center h-1/2">
          <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <Icon.AlertCircle className="w-5 h-5 mr-2" />
            <div>{error}</div>
            <button 
              className="ml-3 px-3 py-1 text-sm text-red-700 border border-red-700 rounded hover:bg-red-200"
              onClick={fetchBlogs}
            >
              <Icon.RefreshCw className="w-4 h-4 mr-1 inline" />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <DefaultHelmet/>
      <BreadCrumb title="Blog" item1="Blog" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((blog) => (
            <div key={blog.id} className="group">
              {/* Sleek Card Design */}
              <div className="h-full flex flex-col bg-white rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Image Container with hover effect */}
                <div className="relative overflow-hidden ">
                  <Link to={`${routes.blogDetails}/${blog.blogs_slug}`}>
                   

 <LazyLoadImage
 src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
 alt={blog.blogs_heading}
                            effect="blur"
                            width="100%"
                            height="100%"
                          
                          />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
                
                {/* Card Content */}
                <div className="flex-1 p-4 flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center mr-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <img
                          src="assets/img/services/v3logo.png"
                          className="w-full h-full object-cover"
                          alt="V3 Care"
                        />
                      </div>
                      <span>V3 Care</span>

                    </div>
                    <div className='mr-2 text-gray-400'>
                        |
                    </div>
                    <div className="flex items-center">
                      <Icon.Calendar className="w-4 h-4 mr-1" />
                      <span>{moment(blog.blogs_created_date).format("DD-MMM-YYYY")}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-md font-semibold text-gray-800  line-clamp-3">
                    <Link 
                    title={`${blog.blogs_heading}`}
                      to={`${routes.blogDetails}/${blog.blogs_slug}`}
                      className="hover:text-black transition-colors duration-200"
                    >
                      {blog.blogs_heading}
                    </Link>
                  </h1>
                  
                
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-16 flex justify-center">
  <nav className="flex items-center gap-1">
    {/* Previous Button */}
    <button
      onClick={prevPage}
      disabled={currentPage === 1}
      className={`px-3 py-1 flex items-center gap-1 rounded-md ${
        currentPage === 1
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon.ChevronLeft className="w-4 h-4" />
      <span className="text-sm">Previous</span>
    </button>

    {/* Page Numbers */}
    {displayPageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === 'number' ? paginate(number) : null}
        className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm font-medium ${
          currentPage === number
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100'
        } ${
          number === '...' ? 'pointer-events-none' : ''
        }`}
      >
        {number}
      </button>
    ))}

    {/* Next Button */}
    <button
      onClick={nextPage}
      disabled={currentPage === Math.ceil(blogs.length / itemsPerPage)}
      className={`px-3 py-1 flex items-center gap-1 rounded-md ${
        currentPage === Math.ceil(blogs.length / itemsPerPage)
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-sm">Next</span>
      <Icon.ChevronRight className="w-4 h-4" />
    </button>
  </nav>
</div>
      </div>
    </>
  );
};

export default Blog;