import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, XCircle, Phone, Mail } from 'lucide-react';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const {
    error = 'We encountered an issue processing your booking.',
    booking_id,
    payment_id,
    payment_status = 'failed',
    booking_status = 'failed',
    
  } = state;



  const getStatusDetails = () => {
    if (payment_status === 'failed' && booking_status === 'failed') {
      return {
        icon: <XCircle className="w-10 h-10 text-white mb-3" />,
        title: 'Booking Failed',
        subtitle: 'We couldn\'t process your booking or payment.',
        className: 'bg-red-600 text-white opacity-80'
      };
    } else if (payment_status === 'failed') {
      return {
        icon: <AlertTriangle className="w-10 h-10 text-yellow-800 mb-3" />,
        title: 'Payment Failed',
        subtitle: 'Your booking is pending due to payment failure.',
        className: 'bg-yellow-400 text-black opacity-80'
      };
    } else {
      return {
        icon: <AlertCircle className="w-10 h-10 text-white mb-3" />,
        title: 'Booking Failed',
        subtitle: 'Payment succeeded but booking confirmation failed.',
        className: 'bg-blue-600 text-white opacity-80'
      };
    }
  };

  const status = getStatusDetails();

  return (
    <>
      <DefaultHelmet />
      <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
        {/* Status Header */}
        <div className={`rounded-lg text-center p-6 mb-6 ${status.className}`}>
          <div className="flex justify-center">{status.icon}</div>
          <h3 className="text-2xl font-semibold mb-1">{status.title}</h3>
          <p className="text-sm">{status.subtitle}</p>
          {error && (
            <p className="mt-4 text-sm bg-white/20 p-3 rounded-md">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center border-t pt-6 w-full">
            <h1 className="text-lg font-semibold text-gray-700 mb-4">
              Need immediate assistance?
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919880778585"
                className="inline-flex items-center px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                <Phone className="w-4 h-4 mr-2" /> Call Support
              </a>
              <a
                href={`mailto:info@v3care.in?subject=Booking%20Issue%20${booking_id || ''}&body=Booking ID: ${booking_id || 'N/A'}%0APayment ID: ${payment_id || 'N/A'}%0AIssue: ${encodeURIComponent(error)}`}
                className="inline-flex items-center px-5 py-2 rounded-md border border-gray-800 text-gray-800 hover:bg-gray-100 transition"
              >
                <Mail className="w-4 h-4 mr-2" /> Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailed;