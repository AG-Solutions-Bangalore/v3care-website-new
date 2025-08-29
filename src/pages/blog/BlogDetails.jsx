import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import * as Icon from "react-feather";
import logoNav from "../../../public/assets/img/services/v3logo.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogDetails.css";
import axios from "axios";
import moment from "moment";
import DefaultHelmet from "../../components/DefaultHelmet/DefaultHelmet";
import { all_routes } from "../../routes/all_routes";
import { BASE_URL, BLOG_IMAGE_URL } from "../../config/BaseUrl";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const BlogDetails = () => {
  const routes = all_routes;
  const { blogs_slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-web-blogs-out-by-id/${blogs_slug}`
        );
        setBlog(response.data.blogs || null);
        setOtherBlogs(response.data.otherblogs || []);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog not found");
      }
    };

    if (blogs_slug) fetchBlogDetails();
  }, [blogs_slug]);

  if (error || !blog) {
    return (
      <>
        <DefaultHelmet />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    Cleaning
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src={logoNav}
                      alt="Post Author"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">V3 Care</span>
                  </div>
                </div>
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">BLOG NOT FOUND</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">
                  Latest News
                </h4>
                <ul className="space-y-4">
                  {otherBlogs.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                          <img
                            className="w-16 h-16 object-cover rounded"
                            src={`${BLOG_IMAGE_URL}/${item.blogs_image}`}
                            alt="Blog Image"
                          />
                        </Link>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {moment(item.blogs_created_date).format(
                            "DD-MMM-YYYY"
                          )}
                        </p>
                        <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition">
                          <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                            {item.blogs_heading}
                          </Link>
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {blog?.blogs_meta_title && blog?.blogs_meta_title !== "null"
            ? blog.blogs_meta_title
            : "Best house cleaning service | V3 Care"}
        </title>
        {blog?.blogs_meta_title && blog?.blogs_meta_title !== "null" && (
          <meta name="title" content={blog.blogs_meta_title} />
        )}
        {blog?.blogs_meta_description &&
          blog?.blogs_meta_description !== "null" && (
            <meta name="description" content={blog.blogs_meta_description} />
          )}

        <script type="application/ld+json">
          {`
                 {
                   "@context": "https://schema.org",
                   "@type": "BlogPosting",
                   "mainEntityOfPage": {
                     "@type": "WebPage",
                     "@id": "https://v3care.in/blog-details/${blog.blogs_slug}"
                   },
                   "headline": "${blog.blogs_meta_title}",
                   "description": "${blog.blogs_meta_description}",
                   "image": "https://v3care.in/crmapi/storage/app/public/blog/${
                     blog.blogs_image
                   }",
                   "author": {
                     "@type": "Organization",
                     "name": "V3Care"
                   },
                   "publisher": {
                     "@type": "Organization",
                     "name": "V3Care",
                     "logo": {
                       "@type": "ImageObject",
                       "url": "https://v3care.in/assets/img/services/v3logo.png"
                     }
                   },
                   "datePublished": "${moment(blog.blogs_created_date).format(
                     "DD-MM-YYYY"
                   )}",
                   "dateModified": "${moment(blog.blogs_created_date).format(
                     "DD-MM-YYYY"
                   )}"
                 }
                 `}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Blog Header */}
              <div className="p-3 bg-gray-100">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
                  <span className="bg-red-100 text-gray-800 px-3 py-1 rounded-lg">
                    Cleaning
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon.Calendar className="w-4 h-4 mr-1" />
                    {moment(blog.blogs_created_date).format("DD-MMM-YYYY")}
                  </span>
                  <span className="flex items-center gap-2">
                    <img
                      src={logoNav}
                      alt="Post Author"
                      className="w-5 h-5 rounded-lg"
                    />
                    <span>V3 Care</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 ">
                  {blog.blogs_heading}
                </h1>
              </div>

              {/* Blog Image */}
              <div className="w-full  h-auto ">
               

 <LazyLoadImage
 src={`${BLOG_IMAGE_URL}/${blog.blogs_image}`}
                            c   className="w-full h-full object-cover"
                            alt={blog.blogs_heading}
                            effect="blur"
                            width="100%"
                            height="100%"
                          
                          />
              </div>

              {/* Blog Content */}
<div className="p-3">
              <div
                dangerouslySetInnerHTML={{ __html: blog?.blogs_description }}
                className="read-only-quill ql-editor "
              />
            </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-gray-100 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  Latest News
                </h4>
                <ul className="space-y-5">
                  {otherBlogs.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 h-20">
                        <Link to={`${routes.blogDetails}/${item.blogs_slug}`}>
                        

 <LazyLoadImage
 className="w-full h-full object-cover rounded-lg"
 src={`${BLOG_IMAGE_URL}/${item.blogs_image}`}
 alt={item.blogs_heading}
                            effect="blur"
                            width="100%"
                            height="100%"
                          
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {moment(item.blogs_created_date).format(
                            "DD-MMM-YYYY"
                          )}
                        </p>
                        <h4 className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition">
                          <Link
                          title={`${item.blogs_heading}`}
                            to={`${routes.blogDetails}/${item.blogs_slug}`}
                            className="hover:underline"
                          >
                            {item.blogs_heading}
                          </Link>
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
