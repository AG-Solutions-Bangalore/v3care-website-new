import React from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../routes/all_routes';
import { Home } from 'feather-icons-react';

const BreadCrumb = ({ title, item1, item2 }) => {
  const routes = all_routes;

  return (
    <div className="relative py-8 bg-white text-center">
   
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="assets/img/bg/breadcrumb-bg-01.png"
          className="absolute top-0 left-0 h-full object-cover"
          alt="Background decoration"
        />
        <img
          src="assets/img/bg/breadcrumb-bg-02.png"
          className="absolute top-0 right-0 h-full object-cover"
          alt="Background decoration"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          
          <nav className="mb-0">
            <ol className="flex justify-center items-center ">
              <li className="breadcrumb-item">
                <Link 
                  to={routes.index} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Home className='text-black w-4 h-4'/>
                </Link>
              </li>
              
              {item2 ? (
                <>
                  <li className="text-gray-600 px-2">/</li>
                  <li className="text-gray-600">
                    {item1}
                  </li>
                  <li className="text-gray-600 px-2">/</li>
                  <li className="text-black font-medium">
                    {item2}
                  </li>
                </>
              ) : (
                <>
                  <li className="text-gray-600 px-2">/</li>
                  <li className="text-black font-medium">
                    {item1}
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;