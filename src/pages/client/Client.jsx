import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { BASE_URL, CLIENT_IMAGE_URL, NO_IMAGE_URL } from '../../config/BaseUrl';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import { Loader } from 'lucide-react';
import { Helmet } from 'react-helmet-async';


const Client = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

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

  const getImageUrl = (imageName) => {
    if (!imageName) {
      return `${NO_IMAGE_URL}`;
    }
    return `${CLIENT_IMAGE_URL}/${imageName}`;
  };

  return (
    <>
   <Helmet>
                  <title>
                  Our Clients | Affordable Cleaning Services
                  </title>
                
                    <meta name="title" content='Our Clients | Affordable Cleaning Services' />
                
              
                    <meta name="description" content='Discover why clients trust V3Care for affordable cleaning services. We deliver quality, reliability, and spotless results every time.' />
        
                 
                </Helmet>
     
      <BreadCrumb title='Our Partners' item1='Client' />
      
      {/* Page Wrapper */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center mb-10">
         <div className="flex flex-col text-center items-center">
           <Loader className='text-gray-500 animate-spin'/>
            <p className="mt-3 text-gray-500">Loading Partner...</p>
          </div>
              
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex justify-center mb-10">
              <div className="w-full md:w-2/3 lg:w-1/2 text-center">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                  <button 
                    className="ml-3 px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center"
                    onClick={fetchClients}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Partners Grid */}
          {!isLoading && !error && clients.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
              {clients.map((client, index) => (
                <div key={index} className="h-full">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                    <div className="p-4 flex items-center justify-center h-full">
                      <div className="h-20 flex items-center">
                        <img
                          src={getImageUrl(client.client_image)}
                          alt={client.client_name}
                          className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Client;