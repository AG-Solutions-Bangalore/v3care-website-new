import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronDown, ChevronUp } from "lucide-react"; 
import axios from "axios";
import * as Icon from "react-feather";
import {
  BASE_URL,
  NO_IMAGE_URL,
  TESTIMONIAL_IMAGE_URL,
} from "../../config/BaseUrl";
import DefaultHelmet from "../../components/DefaultHelmet/DefaultHelmet";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
const promisesData = [
  {
    title: "Trained Staff",
    content:
      "Our cleaning and technical staff undergo rigorous hands-on training in modern tools, advanced cleaning techniques, safety protocols, and customer interaction standards. We ensure every job is performed with professionalism, precision, and care.",
  },
  {
    title: "Complete Background Check",
    content:
      "Your safety is our priority. All V3care employees are verified through strict background checks, including police verification and identity validation, before joining the field team.",
  },
  {
    title: "Complete Staff Profiling",
    content:
      "Every staff member has a detailed service profile, including training certifications, service history, and performance ratings. This helps us deploy the right professional for every service requirement.",
  },
  {
    title: "Character Verification",
    content:
      "We uphold a strict character screening process to ensure only trustworthy and respectful individuals represent V3care in your home or workplace. This ensures peace of mind for our clients and builds long-term trust.",
  },
  {
    title: "Why It Matters",
    content:
      "When you choose V3care, you're not just booking a cleaning service — you're inviting a trusted, well-trained, and verified professional who treats your space with respect, care, and excellence.",
  },
];
const AboutUs = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };
  const fetchTestimonials = async () => {
    try {
      setIsTestimonialsLoading(true);
      setTestimonialsError(null);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-web-testimonial-out`
      );
      setTestimonials(response.data.testimonial || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      setTestimonialsError("Failed to load testimonials. Please try again.");
    } finally {
      setIsTestimonialsLoading(false);
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
    <>
      <DefaultHelmet />

      <BreadCrumb title="About Us" item1="About Us" />

      {/* Page Wrapper */}
      <div className="bg-white">
        <div className="p-0">
          {/* About */}
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center">
                {/* <div className="w-full lg:w-1/2">
                  <div className="hidden md:block relative">
                    <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-2 rounded z-10">
                      <span>12+ years of experiences</span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src="assets/img/providers/about1.jpg"
                        className="w-full h-auto"
                        alt="Best Solution For Cleaning Services"
                      />
                    </div>
                  </div>
                </div> */}

                <div className="w-full hidden lg:block relative lg:w-1/2">
                  {/* Image Card */}
                  <div className="relative z-10 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src="assets/img/providers/about1.jpg"
                      className="w-full h-auto rounded-lg"
                      alt="Best Solution For Cleaning Services"
                    />
                  </div>

                  {/* Overlapping Experience Card */}
                  <div className="absolute top-1/2 left-0 transform -translate-x-10 -translate-y-1/2 z-0 bg-black text-white rounded-lg shadow-xl h-[60vh] w-[65%] max-w-[300px]">
                    <div className="absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-lg md:text-2xl font-semibold px-4 py-2">
                      12+ Years of Experience
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                  <div className="lg:pl-8">
                    <h6 className="text-sm font-medium mb-2">ABOUT V3 CARE</h6>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                      Best Solution For Cleaning Services
                    </h1>
                    <p className="text-justify text-sm text-gray-600 mb-4">
                      Welcome to V3 care. the best cleaning service provider
                      from South India- Bangalore. We take great pride in
                      offering all of our clients a reliable, trustworthy and
                      affordable service. we've steadily grown and built a
                      reputation for excellence. We guarantee that you will
                      receive the highest standard of service for the best
                      possible price. V3 care offers impeccable service from
                      start to finish. We offer a broad range of cleaning
                      services for Residential, corporate ,Industrial and
                      others, throughout the Bangalore.
                    </p>
                    <p className="text-justify text-sm text-gray-600 mb-6">
                      We take the time to understand each of our client's needs,
                      in order to ensure that they receive the best possible
                      bespoke cleaning services for their premises. Our cleaning
                      staff are well trained, motivated and supported by a team
                      of local, knowledgable and experienced operational
                      managers.
                    </p>
                    <div className="flex flex-wrap text-sm ">
                      <div className="w-full md:w-1/2">
                        <ul className="space-y-2">
                          <li className="flex items-center  truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            We prioritize quality and reliability
                          </li>
                          <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            WeSaving your time and effort.
                          </li>
                        </ul>
                      </div>
                      <div className="w-full md:w-1/2 mt-4 md:mt-0">
                        <ul className="space-y-2">
                          <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            Clear, detailed service listings & reviews
                          </li>
                          <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            Smooth and satisfactory experience.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /About */}

          {/* Work Section */}
          {/* <section className="py-16 bg-gray-50 relative overflow-hidden">
            <div className="hidden md:block absolute top-0 left-0">
              <img
                src="assets/img/bg/dotted.png"
                alt="img"
                className="w-full h-auto"
              />
            </div>
            <div className="hidden md:block absolute bottom-0 right-0">
              <img
                src="assets/img/bg/bg-13.png"
                alt="img"
                className="w-full h-auto"
              />
            </div>
            <div className="container mx-auto px-4 bg-[url('assets/img/bg/lines.png')] ">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">How It Works</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                We follow a seamless and reliable process that ensures satisfaction at every touchpoint — from booking to service completion.
                </p>
              </div>
              <div className="flex flex-wrap -mx-4 ">
                <div className="relative w-full  md:w-1/2 lg:w-1/4 px-4 mb-8 ">
                  <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow-md  h-full p-6">
                    <div className="mb-4 bg-gray-100 p-3 rounded-md">
                      <span className="inline-block">
                        <img
                          src="assets/img/icons/about-hands.svg"
                          alt="How It Works"
                        />
                      </span>
                    </div>
                    <h5 className="font-bold mb-2">Employees</h5>
                    <p className="text-gray-600 text-sm  text-center mb-4">
                      Customers can browse or search for specific products or
                      services using categories, filters, or search bars.
                    </p>
                    <h4 className="absolute  -top-6 left-2 text-6xl font-bold opacity-10 ">
                      01
                    </h4>
                  </div>
                </div>

                <div className="relative w-full  md:w-1/2 lg:w-1/4 px-4 mb-8 ">
                  <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow-md  h-full p-6">
                    <div className="mb-4 bg-gray-100 p-3 rounded-md">
                      <span className="inline-block">
                        <img
                          src="assets/img/icons/about-documents.svg"
                          alt="How It Works"
                        />
                      </span>
                    </div>
                    <h5 className="font-bold mb-2">Offices</h5>
                    <p className="text-gray-600 text-sm  text-center mb-4">
                      Customers can add items to their shopping cart. For
                      services, they may select a service and proceed to book.
                    </p>
                    <h4 className="absolute  -top-6 left-2 text-6xl font-bold opacity-10 ">
                      02
                    </h4>
                  </div>
                </div>

                <div className="relative w-full  md:w-1/2 lg:w-1/4 px-4 mb-8 ">
                  <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow-md  h-full p-6">
                    <div className="mb-4 bg-gray-100 p-3 rounded-md">
                      <span className="inline-block">
                        <img
                          src="assets/img/icons/about-book.svg"
                          alt="How It Works"
                        />
                      </span>
                    </div>
                    <h5 className="font-bold mb-2">Clients</h5>
                    <p className="text-gray-600 text-sm  text-center mb-4">
                      The Customer fulfills the order by either providing the
                      service to the buyer.
                    </p>
                    <h4 className="absolute  -top-6 left-2 text-6xl font-bold opacity-10 ">
                      03
                    </h4>
                  </div>
                </div>

                <div className="relative w-full  md:w-1/2 lg:w-1/4 px-4 mb-8 ">
                  <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow-md  h-full p-6">
                    <div className="mb-4 bg-gray-100 p-3 rounded-md">
                      <span className="inline-block">
                        <img
                          src="assets/img/icons/about-book.svg"
                          alt="How It Works"
                        />
                      </span>
                    </div>
                    <h5 className="font-bold mb-2">Completed</h5>
                    <p className="text-gray-600 text-sm  text-center mb-4">
                      The Customer fulfills the order by either providing the
                      service to the buyer.
                    </p>
                    <h4 className="absolute  -top-6 left-2 text-6xl font-bold opacity-10 ">
                      04
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </section> */}



<section className="py-16 bg-gray-50 relative overflow-hidden">
  {/* Background elements */}
  <div className="hidden md:block absolute top-0 left-0">
    <img src="assets/img/bg/dotted.png" alt="img" className="w-full h-auto" />
  </div>
  <div className="hidden md:block absolute bottom-0 right-0">
    <img src="assets/img/bg/bg-13.png" alt="img" className="w-full h-auto" />
  </div>

  <div className="container mx-auto px-4 bg-[url('assets/img/bg/lines.png')]">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">How It Works</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        We follow a seamless and reliable process that ensures satisfaction at every touchpoint — from booking to service completion.
      </p>
    </div>

    {/* New Accordion-style layout */}
    <div className="max-w-7xl mx-auto space-y-4">
    
     

      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-start p-6">
          <div className="bg-gray-100 p-3 rounded-md mr-4 flex-shrink-0">
            <img   src="assets/img/icons/about-hands.svg" alt="Clients" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Employees – Empowering Customer Support Excellence</h3>
              <span className="text-[#900201] font-bold text-2xl ml-4">01</span>
            </div>
            <div className="mt-4 text-gray-600 space-y-3 text-sm">
              <p>At V3care, our employees are the heart of our operations. Every team member undergoes rigorous training in cleaning protocols, safety compliance, hygiene standards, and customer interaction.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px]  font-semibold text-[#900201] mb-2">Trained Professionals</h4>
                  <p>Technicians are skilled in deep cleaning, disinfection, pest control, and polishing services using industry-grade tools and eco-friendly products.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="  text-[16px] font-semibold text-[#900201] mb-2">Customer Support Executives</h4>
                  <p>Our support team is available via phone, email, or WhatsApp to help clients with bookings, service queries, rescheduling, and feedback.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Verified & Background Checked</h4>
                  <p>We ensure all field staff are thoroughly vetted for safety and professionalism.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Digital Readiness</h4>
                  <p>Staff are equipped with mobile devices to update service status, share images, and capture real-time feedback — enhancing transparency and accountability.</p>
                </div>
                
              </div>
          
            </div>
          </div>
        </div>
      </div>
      {/* 2  */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-start p-6">
          <div className="bg-gray-100 p-3 rounded-md mr-4 flex-shrink-0">
            <img       src="assets/img/icons/about-documents.svg" alt="Clients" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Offices – Serving Corporates & Commercial Spaces Professionally</h3>
              <span className="text-[#900201] font-bold text-2xl ml-4">02</span>
            </div>
            <div className="mt-4 text-gray-600 space-y-3 text-sm">
              <p>V3care serves a wide array of corporate clients, startups, co-working hubs, and commercial properties with scalable and flexible cleaning solutions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Customized Cleaning Plans</h4>
                  <p>From daily office maintenance to quarterly deep cleaning, we provide services tailored to each business need.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Eco-Safe & Standardized Practices</h4>
                  <p>We follow standard operating procedures (SOPs) that align with corporate hygiene expectations and workplace safety norms.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Service Reports & Audits</h4>
                  <p>Corporate clients receive documented service reports, cleaning checklists, and performance dashboards.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">After-Hours Scheduling</h4>
                  <p>Services are scheduled to minimize workplace disruption — early mornings, evenings, or weekends.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Facility Support Add-ons</h4>
                  <p>Includes carpet shampooing, workstation disinfection, pantry cleaning, pest control AMC, etc.</p>
                </div>
              </div>
          
            </div>
          </div>
        </div>
      </div>
      {/* 3  */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-start p-6">
          <div className="bg-gray-100 p-3 rounded-md mr-4 flex-shrink-0">
            <img src="assets/img/icons/about-book.svg" alt="Clients" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Clients – Who We Serve</h3>
              <span className="text-[#900201] font-bold text-2xl ml-4">03</span>
            </div>
            <div className="mt-4 text-gray-600 space-y-3 text-sm">
              <p>We proudly cater to a diverse clientele across India's metro cities and growing urban centers:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Residential Clients</h4>
                  <p>Premium homeowners, gated societies, villa owners, and apartment residents seeking deep cleaning, kitchen/bathroom sanitation, and sofa shampooing.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Corporate Clients</h4>
                  <p>MNCs, SMEs, IT parks, and co-working spaces in need of routine upkeep and specialized services.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Commercial Property Owners</h4>
                  <p>Builders, facility managers, and developers hiring post-construction or pre-handover deep cleaning.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Senior Citizens & Families</h4>
                  <p>Customers who prioritize convenience, health, and hygiene in daily living.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Metro City Customers</h4>
                  <p>Located across Bengaluru, Mumbai, Delhi, Pune, Hyderabad, Chennai, Ahmedabad, and more.</p>
                </div>
              </div>
          
            </div>
          </div>
        </div>
      </div>
      {/* 4  */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-start p-6">
          <div className="bg-gray-100 p-3 rounded-md mr-4 flex-shrink-0">
            <img src="assets/img/icons/about-book.svg" alt="Clients" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Completed – Delivering Quality with Every Visit</h3>
              <span className="text-[#900201] font-bold text-2xl ml-4">04</span>
            </div>
            <div className="mt-4 text-gray-600 space-y-3 text-sm">
              <p>The final stage of our process is where customer satisfaction meets service excellence.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="  text-[16px] font-semibold text-[#900201] mb-2">Post-Service Verification</h4>
                  <p>Our team ensures all checklist items are completed and verified on-site.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Photo Logs</h4>
                  <p>Before and after images are recorded for transparency and shared with clients (when applicable).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Feedback Collection</h4>
                  <p>Clients are encouraged to provide ratings and reviews to continually improve our services.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">E-Bill & Completion Report</h4>
                  <p>Customers receive a digital service report and invoice for their records.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className=" text-[16px] font-semibold text-[#900201] mb-2">Best Practice Approach</h4>
                  <p>Each completed service helps us raise the bar — cleaner homes, happier customers, stronger reputation.</p>
                </div>
              </div>
          
            </div>
          </div>
        </div>
      </div>

   
    </div>
  </div>
</section>




          {/* /Work Section */}























          {/* Choose Us Section */}
          <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-start">
          {/* Text + Accordion */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="lg:pr-8">
              <h1 className="text-3xl font-bold mb-4">V3care Promises</h1>
              <p className="text-gray-600 mb-8">
              Choose V3care for reliable, personalized service and exceptional results — every single time. We’re committed to setting the benchmark in professional home and commercial care services across India.
              </p>

              <div className="space-y-4">
                {promisesData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex justify-between items-center text-left p-4 bg-gray-50 font-medium"
                    >
                      <span>{item.title}</span>
                      {activeIndex === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    {activeIndex === index && (
                      <div className="p-4 bg-white text-gray-600 text-sm">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="assets/img/providers/promisesabout.jpg"
                className="w-full h-auto"
                alt="V3 care Promises"
              />
            </div>
          </div>
        </div>

        
      </div>
    </div>

          {/* Our Team */}
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-1/2 order-2 lg:order-1 mt-8 lg:mt-0">
                  <div className="lg:pr-8">
                    <h6 className="text-sm font-medium mb-2">OUR TEAM</h6>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                      Best Solution For Cleaning Services
                    </h1>
                    <p className="text-justify text-gray-600 mb-6 text-sm">
                      Our team are highly trained, full-time professional
                      cleaners,totally reliable,providing quality cleaning
                      services in Bangalore at affordable prices. We pride
                      ourselves in listening to our customers, ensuring they
                      receive a cleaning service they can trust and rely on
                      whether it is Residential, commercial or corporate clean,
                      we will be there when you need us.You need a professional
                      service which provides consistent high quality cleaning to
                      meet your own very high standards. We can customize our
                      services based on your needs.
                    </p>
                    <div className="flex flex-wrap text-sm">
                      <div className="w-full md:w-1/2">
                        <ul className="space-y-2">
                        <li className="flex items-center  truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            We prioritize quality and reliability
                          </li>
                          <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            WeSaving your time and effort.
                          </li>
                        </ul>
                      </div>
                      <div className="w-full md:w-1/2 mt-4 md:mt-0">
                        <ul className="space-y-2">
                        <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            Clear, detailed service listings & reviews
                          </li>
                          <li className="flex items-center truncate">
                            <Icon.CheckSquare className="w-4 h-4 mr-2" />
                            Smooth and satisfactory experience.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 order-1 lg:order-2">
                  <div className="hidden md:block relative">
                    
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src="assets/img/providers/teamabout.jpg"
                        className="w-full h-auto"
                        alt="Best Solution For Cleaning Services"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <section className="py-16 bg-[url('assets/img/bg/lines.png')] bg-gray-50 relative overflow-hidden"
          
          >
            <div className="hidden md:block absolute top-0 left-0">
              <img
                src="assets/img/bg/transperent-circle.png"
                alt="img"
                className="w-full h-auto"
              />
            </div>
            <div className="hidden md:block absolute bottom-0 right-0">
              <img
                src="assets/img/bg/bg-graphics.png"
                alt="img"
                className="w-full h-auto"
              />
            </div>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">Testimonials</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our clients rave about our seamless service, exceptional
                  quality, and unmatched customer support.
                </p>
              </div>
              <div className="px-4">
                {/* Testimonials Loading State */}
                {isTestimonialsLoading && (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-3 text-gray-600">
                      Loading testimonials...
                    </p>
                  </div>
                )}

                {/* Testimonials Error State */}
                {testimonialsError && !isTestimonialsLoading && (
                  <div className="flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <Icon.AlertCircle className="mr-2" size={18} />
                    <span>{testimonialsError}</span>
                    <button
                      className="ml-3 text-sm bg-transparent hover:bg-red-200 text-red-700 font-semibold py-1 px-2 border border-red-500 rounded"
                      onClick={fetchTestimonials}
                    >
                      <Icon.RefreshCw className="inline mr-1" size={14} />
                      Try Again
                    </button>
                  </div>
                )}

                {/* Testimonials Slider */}
                {!isTestimonialsLoading &&
                  !testimonialsError &&
                  testimonials.length > 0 && (
                    <Swiper
                      modules={[Navigation, Autoplay]}
                      spaceBetween={30}
                      slidesPerView={2}
                      navigation
                      autoplay={{ delay: 3000 }}
                      breakpoints={{
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 30,
                        },
                      }}
                      className="pb-12"
                    >
                      {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                          <div className="bg-white rounded-lg shadow-md p-6 h-full">
                            <div className="flex flex-col items-center text-center">
                              <div className="mb-4">
                                <img
                                  src={getTestimonialImageUrl(
                                    testimonial.testimonial_image
                                  )}
                                  alt={testimonial.testimonial_user}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-20 h-20 rounded-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-gray-600 mb-4">
                                  {testimonial.testimonial_description}
                                </p>
                                <h5 className="font-bold">
                                  {testimonial.testimonial_user}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
