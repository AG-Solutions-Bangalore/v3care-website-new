import React, { useState } from 'react';


import axios from 'axios';
import { BASE_URL } from '../../config/BaseUrl';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import { Mail, Phone } from 'react-feather';


const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    mobile_no: '',
    email_id: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    fullname: '',
    mobile_no: '',
    email_id: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullname: '',
      mobile_no: '',
      email_id: '',
      description: ''
    };

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Name is required';
      valid = false;
    }

    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    if (!formData.email_id.trim()) {
      newErrors.email_id = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
      newErrors.email_id = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/panel-create-web-enquiry-out`, {
        fullname: formData.fullname,
        mobile_no: formData.mobile_no,
        email_id: formData.email_id,
        description: formData.description
      });

      if (response.status === 200) {
        setSubmitStatus({ success: true, message: 'Thank you! Your message has been sent successfully.' });
       
        setFormData({
          fullname: '',
          mobile_no: '',
          email_id: '',
          description: ''
        });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: response.data.message || 'Failed to send message. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <DefaultHelmet/>

      <BreadCrumb title='Contact Us' item1='Contact Us'/>
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <div className="relative">
       
            

            {/* Contact Details */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center -mx-3">
                {/* Phone Card */}
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <a href="tel:+919880778585" className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full text-decoration-none text-current">
                    <div className="p-4 h-full">
                      <div className="flex items-center">
                        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                     <Phone/>
                        </div>
                        <div>
                          <h6 className="text-lg font-medium text-black mb-1">Phone Number</h6>
                          <p className="text-sm">+91 98807 78585</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Email Card */}
                <div className="w-full md:w-1/2 px-3">
                  <a href="mailto:info@v3care.in" className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full text-decoration-none text-current">
                    <div className="p-4 h-full">
                      <div className="flex items-center">
                        <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                         <Mail/>
                        </div>
                        <div>
                          <h6 className="text-lg font-medium text-black mb-1">Email Address</h6>
                          <p className="text-sm">info@v3care.in</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Get In Touch */}
            <div className="flex flex-wrap -mx-3">
              <div className="w-full md:w-1/2 px-3 flex items-center">
                <div className="w-full space-y-4">
                  {/* Address Cards */}
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-800 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="min-w-[18px] min-h-[18px]"
                        >
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Bangalore Address</h6>
                        <p className="text-sm text-gray-500">
                          286 15th A Cross, 7th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-800 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="min-w-[18px] min-h-[18px]"
                        >
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Hyderabad Address</h6>
                        <p className="text-sm text-gray-500">
                          V3 CARE H. No. 1-101, 1st Floor, Old Hapeezpet, Miyapur, Hyderabad, Telangana - 500049
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-800 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="min-w-[18px] min-h-[18px]"
                        >
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Gurugram Address</h6>
                        <p className="text-sm text-gray-500">
                          V3 CARE Opposite Raj Bhawan Main Market H no 384, near End of Flyover, Sukhrali, Sector 17, Gurugram, Haryana 122001
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-800 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="min-w-[18px] min-h-[18px]"
                        >
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Pune Address</h6>
                        <p className="text-sm text-gray-500">
                          V3 CARE Thite Nagar, Chandan Nagar, Pune, Maharashtra 411014, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3 flex items-center justify-center mt-8 md:mt-0">
                <div className="w-full max-w-lg bg-white p-6 ">
                  <h1 className="text-2xl font-bold mb-6">Get In Touch</h1>
                  {submitStatus && (
                    <div className={`mb-4 p-3 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <div className="relative">
                          <input
                            className={`w-full px-4 py-3 border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all`}
                            type="text"
                            name="fullname"
                            placeholder="Your Name"
                            value={formData.fullname}
                            onChange={handleChange}
                          />
                          {errors.fullname && <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>}
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            className={`w-full px-4 py-3 border ${errors.email_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all`}
                            type="email"
                            name="email_id"
                            placeholder="Your Email Address"
                            value={formData.email_id}
                            onChange={handleChange}
                          />
                          {errors.email_id && <p className="mt-1 text-sm text-red-600">{errors.email_id}</p>}
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            className={`w-full px-4 py-3 border ${errors.mobile_no ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all`}
                            type="text"
                            name="mobile_no"
                            placeholder="Your Phone Number"
                            value={formData.mobile_no}
                            onChange={handleChange}
                          />
                          {errors.mobile_no && <p className="mt-1 text-sm text-red-600">{errors.mobile_no}</p>}
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <textarea
                            className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all`}
                            name="description"
                            placeholder="Type Message"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                          />
                          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>
                      </div>
                      <div>
                        <button
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-colors"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <i className="ri-arrow-right-circle-line text-xl ml-2"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-96 mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.909593458343!2d77.633275!3d12.913531899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1483494c719f%3A0xd95476be691e0257!2sV3%20CARE!5e0!3m2!1sen!2sin!4v1744352225780!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
};

export default ContactUs;