import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


import html2pdf from "html2pdf.js";
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  Home, 
  Printer, 
  Phone, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Settings 
} from 'lucide-react';

const PaymentSuccess = () => {
  const { state } = useLocation();
  const receiptRef = useRef(null);
  const {
    payment_id,
    amount,
    originalAmount,
    service_name,
    service_sub_name,
    payment_mode,
    payment_status = 'success',
    booking_status = 'confirmed',
    booking_data,
    selected_prices,
    groupedItems,
    customer_details,
    payment_details,
    bookingId
  } = state || {};

  const booking = Array.isArray(booking_data) ? booking_data[0] : booking_data;
  const customer = customer_details || booking;

  const getStatusDetails = () => {
    if (amount === 0) {
      return {
        icon: <Search className="w-10 h-10 mx-auto mb-2" />,
        title: 'On Inspection',
        subtitle: 'You will be given the price after inspection.',
        className: 'bg-yellow-400 text-gray-800'
      };
    }
    if (payment_status === 'success' && booking_status === 'confirmed') {
      return {
        icon: <CheckCircle className="w-10 h-10 mx-auto mb-2" />,
        title: 'Booking Confirmed!',
        subtitle: 'Your payment was successful and booking is confirmed.',
        className: 'bg-green-500 text-white'
      };
    } else if (payment_status === 'failed' && booking_status === 'confirmed') {
      return {
        icon: <AlertTriangle className="w-10 h-10 mx-auto mb-2" />,
        title: 'Booking Confirmed - Payment Pending',
        subtitle: 'Your booking is confirmed but payment is pending.',
        className: 'bg-yellow-500 text-gray-800'
      };
    } else if (payment_status === 'success' && booking_status === 'failed') {
      return {
        icon: <AlertCircle className="w-10 h-10 mx-auto mb-2" />,
        title: 'Payment Successful - Booking Failed',
        subtitle: 'Payment was successful but booking confirmation failed.',
        className: 'bg-red-500 text-white'
      };
    } else {
      return {
        icon: <CheckCircle className="w-10 h-10 mx-auto mb-2" />,
        title: 'Booking Confirmed',
        subtitle: 'You will pay later for this service.',
        className: 'bg-blue-500 text-white'
      };
    }
  };

  const status = getStatusDetails();
  const getBookingStatusBadge = () => {
    if (amount === 0) {
      return {
        text: 'ON INSPECTION',
        className: 'bg-yellow-400 text-gray-800',
      };
    }

    if (booking_status === 'confirmed') {
      return {
        text: 'CONFIRMED',
        className: 'bg-green-500 text-white',
      };
    }

    if (booking_status === 'failed') {
      return {
        text: 'FAILED',
        className: 'bg-red-500 text-white',
      };
    }

    return {
      text: booking_status.toUpperCase() || 'UNKNOWN',
      className: '',
    };
  };
  const statusBadge = getBookingStatusBadge();
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  

  const hasNoServices = !groupedItems || Object.keys(groupedItems).length === 0;
  const downloadReceipt = () => {
    const customerName = customer?.order_customer || "Customer";
    const filename = `${customerName}_Receipt_${payment_id || Date.now()}.pdf`;
  
    // Services table data - CONTENT KEPT ORIGINAL
    const servicesTableBody = [
      [
        { text: 'SERVICE DESCRIPTION', style: 'tableHeader' },
        { text: 'RATE', style: 'tableHeader', alignment: 'right' },
        { text: 'AMOUNT', style: 'tableHeader', alignment: 'right' }
      ]
    ];
  
    if (groupedItems) {
      Object.entries(groupedItems).forEach(([_, group]) => {
        servicesTableBody.push([
          { 
            text: `${group.service_name}${group.service_sub_name ? ` - ${group.service_sub_name}` : ''}`, 
            style: 'serviceHeader', 
            colSpan: 3,
            fillColor: '#f3f4f6'
          }, 
          {}, 
          {}
        ]);
  
        group.items.forEach(item => {
          servicesTableBody.push([
            { 
              text: [
                { text: item.service_price_for, style: 'serviceItem' },
                item.service_label !== "Normal" ? 
                  { text: ` [${item.service_label}]`, style: 'labelBadge' } : ''
              ],
              margin: [5, 4, 0, 4]
            },
            { 
              text: `₹${parseFloat(item.service_price_rate).toLocaleString('en-IN')}`, 
              alignment: 'right',
              margin: [0, 4, 5, 4]
            },
            { 
              text: `₹${parseFloat(item.service_price_amount).toLocaleString('en-IN')}`, 
              alignment: 'right',
              margin: [0, 4, 5, 4]
            }
          ]);
        });
      });
    }
  
    // Payment summary - CONTENT LABELS KEPT ORIGINAL
    const paymentSummary = [
      [
        { text: 'Total Amount:', style: 'summaryLabel' },
        { text: `₹${parseFloat(originalAmount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, 
         style: 'summaryValue', alignment: 'right' }
      ]
    ];
  
    if (originalAmount > amount) {
      paymentSummary.push([
        { text: 'Discount:', style: 'summaryLabel' }, // Original label kept
        { text: `-₹${parseFloat(originalAmount - amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, 
         style: 'discountValue', alignment: 'right' }
      ]);
    }
  
    paymentSummary.push(
      [
        { text: '', border: [false, true, false, false], margin: [0, 3, 0, 3] },
        { text: '', border: [false, true, false, false], margin: [0, 3, 0, 3] }
      ],
      [
        { text: 'Amount to be Paid:', style: 'summaryTotal' }, // Original label kept
        { text: `₹${parseFloat(amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, 
         style: 'summaryTotalAmount', alignment: 'right' }
      ]
    );
  
    // PDF definition - more compact but with original content
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40], // Reduced margins
      content: [
        // Header (content kept original)
        {
          text: 'V3 CARE',
          style: 'companyName',
          alignment: 'center',
          margin: [0, 0, 0, 5] // Reduced margin
        },
        {
          text: 'Professional Cleaning & Facility Services',
          style: 'companySubtitle',
          alignment: 'center',
          margin: [0, 0, 0, 3] // Reduced margin
        },
        {
          text: 'H. No. 2296, 24th Main Road, HSR Layout, Bangalore - 560102',
          style: 'companyAddress',
          alignment: 'center',
          margin: [0, 0, 0, 15] // Reduced margin
        },
        { 
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }],
          margin: [0, 0, 0, 15] // Reduced margin
        },
  
        // Transaction info (content kept original)
        {
          columns: [
            { 
              text: bookingId ? `Booking ID: ${bookingId}` : '', 
              style: 'bookingId',
              width: '70%'
            },
            { 
              text: statusBadge.text, 
              style: 'statusBadge',
              background: statusBadge.text === 'CONFIRMED' ? '#10b981' : 
                         statusBadge.text === 'FAILED' ? '#ef4444' : '#fbbf24'
            }
          ],
          margin: [0, 0, 0, 15] // Reduced margin
        },
  
        // Customer & Service details (content kept original)
        {
          columns: [
            {
              width: '48%',
              stack: [
                { text: 'CUSTOMER DETAILS', style: 'sectionHeader' },
                { text: customer?.order_customer || '', style: 'customerName' },
                { text: customer?.order_customer_mobile || '', style: 'customerInfo' },
                { text: customer?.order_customer_email || '', style: 'customerInfo' }
              ]
            },
            {
              width: '48%',
              stack: [
                { text: 'SERVICE DETAILS', style: 'sectionHeader' },
                { 
                  text: customer?.order_service_date ? 
                    `${formatDate(customer.order_service_date)}${customer?.order_time ? ` at ${customer.order_time}` : ''}` : '',
                  style: 'serviceInfo'
                },
                { 
                  text: customer?.order_address ? 
                    `${[
                      customer.order_address,
                      customer?.order_flat ? `, ${customer.order_flat}` : '',
                      customer?.order_landmark ? ` (Near ${customer.order_landmark})` : ''
                    ].join('')}` : '',
                  style: 'serviceInfo'
                }
              ]
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 15] // Reduced margin
        },
  
        // Services table (content kept original)
        {
          table: {
            headerRows: 1,
            widths: ['*', 70, 70], // Slightly narrower columns
            body: servicesTableBody
          },
          layout: {
            fillColor: (rowIndex) => {
              if (rowIndex === 0) return '#1f2937'; // Darker header
              if (servicesTableBody[rowIndex]?.[0]?.style === 'serviceHeader') return '#f3f4f6';
              return rowIndex % 2 === 0 ? '#fafafa' : null;
            },
            hLineWidth: (i) => i === 0 ? 0.8 : 0.3, // Thinner lines
            vLineWidth: () => 0.3,
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb'
          },
          margin: [0, 0, 0, 15] 
        },
  
       



{
  columns: [
    { width: '55%', text: '' },
    {
      width: '45%',
      stack: [
        { text: 'PAYMENT SUMMARY', style: 'sectionHeader', alignment: 'center' },
        {
          table: {
            widths: ['*', 'auto'],
            body: paymentSummary
          },
          layout: {
            fillColor: function(rowIndex) {
              return rowIndex === paymentSummary.length - 1 ? '#f8fafc' : null;
            },
            hLineWidth: (i, node) => i === node.table.body.length - 3 ? 0.5 : 0,
            hLineColor: () => '#d1d5db',
            vLineWidth: function() { return 0; }
          },
          margin: [0, 10, 0, 0]
        }
      ]
    }
  ],
  margin: [0, 0, 0, 30]
},











        // Footer (content kept original)
        {
          text: 'Thank you for choosing V3 CARE',
          style: 'footer',
          alignment: 'center',
          margin: [0, 20, 0, 0] // Reduced margin
        }
      ],
  
      // Styles - made more compact but kept original feel
      styles: {
        companyName: { fontSize: 20, bold: true, color: '#111827' },
        companySubtitle: { fontSize: 11, color: '#4b5563', italics: true },
        companyAddress: { fontSize: 10, color: '#6b7280' },
        bookingId: { fontSize: 10, color: '#374151', bold: true },
        statusBadge: { fontSize: 10, bold: true, color: 'white', alignment: 'center' },
        sectionHeader: { fontSize: 11, bold: true, color: '#111827', margin: [0, 0, 0, 5] },
        customerName: { fontSize: 11, bold: true, color: '#111827', margin: [0, 0, 0, 2] },
        customerInfo: { fontSize: 10, color: '#6b7280', margin: [0, 0, 0, 2] },
        serviceInfo: { fontSize: 10, color: '#4b5563', margin: [0, 0, 0, 2] },
        tableHeader: { fontSize: 10, bold: true, color: 'white', margin: [5, 3, 5, 3] },
        serviceHeader: { fontSize: 10, bold: true, color: '#111827', margin: [5, 3, 5, 3] },
        serviceItem: { fontSize: 9, color: '#374151' },
        labelBadge: { fontSize: 8, bold: true, color: '#92400e', italics: true },
        summaryLabel: { fontSize: 10, color: '#4b5563' },
        summaryValue: { fontSize: 10, color: '#111827' },
        discountValue: { fontSize: 10, color: '#dc2626', bold: true },
        summaryTotal: { fontSize: 11, bold: true, color: '#111827' },
        summaryTotalAmount: { fontSize: 11, bold: true, color: '#111827' },
        footer: { fontSize: 10, color: '#6b7280', italics: true }
      },
      defaultStyle: {  }
    };
  
    pdfMake.createPdf(docDefinition).download(filename);
  };
  return (
    <>
      <DefaultHelmet />
      <div className="max-w-4xl mx-auto p-5 font-sans text-gray-800">
        {hasNoServices ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h1 className="text-xl font-semibold text-gray-800 mb-2">No Services Selected</h1>
              <p className="text-gray-600 mb-6">You haven't selected any services yet.</p>
              <Link 
                to="/service" 
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Select Services
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={`rounded-lg mb-5 text-center p-5 ${status.className}`}>
              {status.icon}
              <h3 className="text-xl font-bold mb-2">{status.title}</h3>
              <p>{status.subtitle}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden" ref={receiptRef}>
              {/* Company Header */}
              <div className="bg-gray-100 p-5 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">V3 CARE</h1>
                <p className="text-gray-700 text-md mt-1">Professional Cleaning & Facility Services</p>
                <p className="text-gray-700 text-dm mt-1">H. No. 2296, 24th Main Road, HSR Layout, Bangalore - 560102</p>
              </div>

              {/* Transaction Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex text-sm justify-between items-center">
                  <div>
                    {bookingId && <p>Booking ID: {bookingId}</p>}
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Service Details */}
              <div className="p-4 border-b border-gray-200">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-1/2 pr-4 border-r border-gray-200">
                        <div className="text-sm font-bold text-gray-700 mb-2">CUSTOMER DETAILS</div>
                        <p className="font-medium text-gray-800">{customer?.order_customer}</p>
                        <p className="text-gray-500 text-sm">{customer?.order_customer_mobile}</p>
                        <p className="text-gray-500 text-sm">{customer?.order_customer_email}</p>
                      </td>
                      <td className="pl-4">
                        <div className="text-sm font-bold text-gray-700 mb-2">SERVICE DETAILS</div>
                       <p className="flex items-center text-sm">
                                                 <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                 {customer?.order_service_date && (
                                                   <>
                                                     {formatDate(customer.order_service_date)}
                                                     {customer?.order_time && ` at ${(customer.order_time)}`}
                                                   </>
                                                 )}
                                               </p>
                                               <p className="flex items-center mt-2 text-sm">
                                                 <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                 <span className="text-gray-600">
                                                   {customer?.order_address}
                                                   {customer?.order_flat && `, ${customer.order_flat}`}
                                                   {customer?.order_landmark && ` (Near ${customer.order_landmark})`}
                                                 </span>
                                               </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Services Table */}
              <div className="p-0 border-b border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 text-sm font-semibold">SERVICE</th>
                      <th className="text-right p-2 text-sm font-semibold">RATE</th>
                      <th className="text-right p-2 text-sm font-semibold">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedItems && Object.entries(groupedItems).map(([key, group]) => (
                      <React.Fragment key={key}>
                        <tr className="bg-gray-50">
                          <td colSpan={1} className="p-2 font-semibold text-sm">
                             <div className="flex items-center">
                                                         <Settings className="w-3.5 h-3.5 mr-2 text-red-500" />
                                                         {group.service_name}
                                                         {group.service_sub_name && ` - ${group.service_sub_name}`}
                                                       </div>
                          </td>
                        </tr>
                        {group.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-2 text-sm" >
                              {item.service_price_for}
                              {item.service_label !== "Normal" && (
                                <span className="inline-block px-1 ml-1 rounded text-xs font-bold bg-yellow-400 text-gray-800">
                                  {item.service_label} Price
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-right text-sm">₹{item.service_price_rate}</td>
                            <td className="p-2 text-right text-sm">₹{item.service_price_amount}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-gray-50">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-1/2 pr-4 border-r border-gray-200">
                        {/* Empty left column as per original design */}
                      </td>
                      <td className="pl-4">
                        <div className="text-sm font-bold text-gray-700 mb-2">PAYMENT SUMMARY</div>
                        <div className=" text-sm flex justify-between mb-1">
                          <span>Total Amount:</span>
                          <span className=" text-sm font-semibold">₹{originalAmount?.toFixed(2)}</span>
                        </div>
                        {originalAmount > amount && (
                          <div className=" text-sm flex justify-between mb-1">
                            <span>  Discount:</span>
                            <span className="text-green-600 font-semibold text-sm">
                              -₹{(originalAmount - amount).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                          <span className="font-semibold">Amount to be Paid:</span>
                          <span className="font-semibold text-gray-800">₹{amount?.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Customer Remarks */}
              {customer?.order_remarks && (
                <div className="p-4">
                  <div className="text-sm font-bold text-gray-700 mb-2">CUSTOMER REMARKS</div>
                  <div className="bg-gray-100 p-3 rounded text-sm">{customer.order_remarks}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-5 print-hide">
          {!hasNoServices && (
            <>
              <Link 
                to="/service" 
                className="inline-flex items-center justify-center flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors min-w-[120px]"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
            
              <button 
                className="inline-flex items-center justify-center flex-1 px-4 py-2 bg-white text-gray-800 border border-gray-800 rounded-md hover:bg-gray-100 transition-colors min-w-[120px]"
                onClick={downloadReceipt}
              >
                <Printer className="w-5 h-5 mr-2" />
                Download
              </button>
            </>
          )}
          {(payment_status === 'failed' || booking_status === 'failed') && (
            <a 
              href="tel:+919880778585" 
              className="inline-flex items-center justify-center flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors min-w-[120px]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Support
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;