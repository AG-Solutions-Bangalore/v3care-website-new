/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { BASE_URL, BASE_URL_PINCODE } from "../../config/BaseUrl";
import DefaultHelmet from "../../components/DefaultHelmet/DefaultHelmet";

const BecomeVendor = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [vendor, setVendor] = useState({
    vendor_short: "",
    branch_id: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_job_skills: "",
    vendor_images: "",
    vendor_aadhar_front: "",
    vendor_aadhar_back: "",
    vendor_aadhar_gst: "",
    vendor_service_no_count: "",
    vendor_branch_no_count: "",
    vendor_area_no_count: "",
    vendor_service_data: "",
    vendor_branch_data: "",
    vendor_area_data: "",
    vendor_ref_name_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_1: "",
    vendor_ref_mobile_2: "",
  });

  const [notifications, setNotifications] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);

  const [test, setTest] = useState([]);

  const [vendor_ser_count, setSerCount] = useState(1);
  const [vendor_branc_count, setBrancCount] = useState(1);
  const [vendor_area_count, setAreaCount] = useState(1);

  const useTemplate = { vendor_service: "" };
  const [users, setUsers] = useState([useTemplate]);

  const useTemplate1 = {
    vendor_branch_flat: "",
    vendor_branch_building: "",
    vendor_branch_landmark: "",
    vendor_branch_pincode: "",
    vendor_branch_location: "",
    vendor_branch_city: "",
    vendor_branch_district: "",
    vendor_branch_state: "",
  };
  const [users1, setUsers1] = useState([useTemplate1]);

  const useTemplate2 = { vendor_area: "" };
  const [users2, setUsers2] = useState([useTemplate2]);
  const showNotification = (message, type) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-branch-out`
        );
        setBranches(response.data.branch);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-out`
        );
        setServices(response.data.service);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchBranches();
    fetchServices();
  }, []);

  const validateCurrentStep = (step) => {
    switch (step) {
      case 1: // Basic Information
        return (
          !!vendor.vendor_company &&
          !!vendor.vendor_mobile &&
          vendor.vendor_mobile.length === 10 &&
          !!vendor.vendor_email &&
          !!vendor.branch_id &&
          !!vendor.vendor_aadhar_no &&
          vendor.vendor_aadhar_no.length === 12
        );
      case 2: // Documentation
        return !!selectedFile1 && !!selectedFile2 && !!selectedFile3;
      case 3: // Collection Reference - no required fields
        return true;
      case 4: // Service
        return test.length > 0;
      case 5: // Address
        return users1.every(
          (user) =>
            !!user.vendor_branch_pincode &&
            user.vendor_branch_pincode.length === 6 &&
            !!user.vendor_branch_city &&
            !!user.vendor_branch_district &&
            !!user.vendor_branch_state &&
            !!user.vendor_branch_location
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep(currentStep)) {
      showNotification(
        "Please fill all required fields before proceeding",
        "error"
      );
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "vendor_mobile" ||
        name === "vendor_ref_mobile_1" ||
        name === "vendor_ref_mobile_2" ||
        name === "vendor_aadhar_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setVendor({ ...vendor, [name]: value });
  };

  const handleServiceChange = (selectedOptions) => {
    const selectedServices = selectedOptions
      ? selectedOptions.map((option) => option.label)
      : [];
    setTest(selectedServices);
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = (setFile) => {
    setFile(null);
  };

  const onChange1 = (e, index) => {
    const { name, value } = e.target;
    const updatedUsers = users1.map((user, i) =>
      index === i ? { ...user, [name]: value } : user
    );
    setUsers1(updatedUsers);
  };

  const checkPincode = (e, index) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetch(`${BASE_URL_PINCODE}/api/external/pin/${pincode}`)
        .then((response) => response.json())
        .then((response) => {
          const updatedUsers = [...users1];
          updatedUsers[index] = {
            ...updatedUsers[index],
            vendor_branch_city: response.city,
            vendor_branch_district: response.district,
            vendor_branch_state: response.state,
            vendor_branch_pincode: pincode,
          };
          setUsers1(updatedUsers);

          if (response.areas) {
            setLocations(
              response.areas.map((area, idx) => ({
                id: idx.toString(),
                name: area,
              }))
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching pincode data:", error);
          showNotification(
            "Error fetching location data for this pincode",
            "error"
          );
        });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      showNotification("Please fill all required fields", "error");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("vendor_short", vendor.vendor_short);
    data.append("vendor_company", vendor.vendor_company);
    data.append("vendor_mobile", vendor.vendor_mobile);
    data.append("vendor_email", vendor.vendor_email);
    data.append("branch_id", vendor.branch_id);
    data.append("vendor_aadhar_no", vendor.vendor_aadhar_no);
    data.append("vendor_gst_no", vendor.vendor_gst_no);
    data.append("vendor_job_skills", vendor.vendor_job_skills);
    data.append("vendor_ref_name_1", vendor.vendor_ref_name_1);
    data.append("vendor_ref_mobile_1", vendor.vendor_ref_mobile_1);
    data.append("vendor_ref_name_2", vendor.vendor_ref_name_2);
    data.append("vendor_ref_mobile_2", vendor.vendor_ref_mobile_2);

    if (selectedFile1) data.append("vendor_images", selectedFile1);
    if (selectedFile2) data.append("vendor_aadhar_front", selectedFile2);
    if (selectedFile3) data.append("vendor_aadhar_back", selectedFile3);
    if (selectedFile4) data.append("vendor_aadhar_gst", selectedFile4);

    data.append("vendor_area_no_count", vendor_area_count.toString());
    data.append("vendor_service_no_count", vendor_ser_count.toString());
    data.append("vendor_branch_no_count", vendor_branc_count.toString());
    data.append("vendor_service", test.join(", "));

    // Function to append user data to FormData
    const appendUserData = (users, prefix) => {
      users.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          data.append(`${prefix}[${index}][${key}]`, user[key]);
        });
      });
    };

    appendUserData(users, "vendor_service_data");
    appendUserData(users1, "vendor_branch_data");
    appendUserData(users2, "vendor_area_data");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-vendor-out`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        showNotification(response.data.msg, "success");

        setVendor({
          vendor_short: "",
          branch_id: "",
          vendor_company: "",
          vendor_mobile: "",
          vendor_email: "",
          vendor_aadhar_no: "",
          vendor_gst_no: "",
          vendor_job_skills: "",
          vendor_images: "",
          vendor_aadhar_front: "",
          vendor_aadhar_back: "",
          vendor_aadhar_gst: "",
          vendor_service_no_count: "",
          vendor_branch_no_count: "",
          vendor_area_no_count: "",
          vendor_service_data: "",
          vendor_branch_data: "",
          vendor_area_data: "",
          vendor_ref_name_1: "",
          vendor_ref_name_2: "",
          vendor_ref_mobile_1: "",
          vendor_ref_mobile_2: "",
        });
        setTest([]);
        setUsers([useTemplate]);
        setUsers1([useTemplate1]);
        setUsers2([useTemplate2]);
        setSelectedFile1(null);
        setSelectedFile2(null);
        setSelectedFile3(null);
        setSelectedFile4(null);
        setCurrentStep(1);
      } else {
        if (response.data.code == "402") {
          showNotification(response.data.msg, "error");
        } else if (response.data.code == "403") {
          showNotification(response.data.msg, "error");
        } else if (response.data.code == "400") {
          showNotification(response.data.msg, "error");
        } else {
          showNotification(response.data.msg, "error");
        }
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      showNotification("Error submitting service request", "error");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "lightgray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "lightgray",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "blue" : "white",
      color: state.isSelected ? "black" : "black",
      "&:hover": {
        backgroundColor: "lightgray",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "blue",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      "&:hover": {
        backgroundColor: "darkred",
        color: "white",
      },
    }),
  };

  return (
    <>
      <DefaultHelmet />

      <div
        className={`fixed z-[1000] max-w-[300px] w-full ${
          isSmallScreen
            ? "top-[105px] left-1/2 -translate-x-1/2"
            : "top-[110px] right-5"
        }`}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-2 mb-2 w-full rounded text-sm flex justify-between items-center shadow-md ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span className="flex-1">{notification.message}</span>
            <button
              type="button"
              className="p-1 text-xs"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="w-full">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4">
                  <div className="bg-gray-200/70 rounded-lg shadow-sm p-3 mb-4 lg:mb-0">
                    <div className="flex items-center mb-6 bg-white p-2 rounded">
                      <div className="w-12 h-12 mr-3 flex-shrink-0">
                        <img
                          src="assets/img/partner-request.png"
                          className="w-full h-full object-contain"
                          alt="Partner Request"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg text-gray-900 font-semibold">Partner Request</h1>
                      </div>
                    </div>

                    <div className="w-full">
                      <h6 className="mb-4 text-lg font-sembold">Steps</h6>
                      <div className="relative">
                        {/* Vertical line connecting the dots */}
                        <div className="absolute left-[11px] top-0 h-full w-0.5 bg-blue-400"></div>

                        <ul className="space-y-4">
                          {/* Step 1 */}
                          <li className="flex items-start">
                            <div className="flex-shrink-0 z-10">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full 
            ${
              currentStep === 1
                ? "bg-blue-600 ring-4 ring-blue-200"
                : currentStep > 1
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
                              >
                                {currentStep > 1 ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : (
                                  <span
                                    className={`text-xs ${
                                      currentStep === 1
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    1
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`ml-4 ${
                                currentStep === 1
                                  ? "text-blue-600 font-medium"
                                  : currentStep > 1
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Basic Information
                            </div>
                          </li>

                          {/* Step 2 */}
                          <li className="flex items-start">
                            <div className="flex-shrink-0 z-10">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full 
            ${
              currentStep === 2
                ? "bg-blue-600 ring-4 ring-blue-200"
                : currentStep > 2
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
                              >
                                {currentStep > 2 ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : (
                                  <span
                                    className={`text-xs ${
                                      currentStep === 2
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    2
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`ml-4 ${
                                currentStep === 2
                                  ? "text-blue-600 font-medium"
                                  : currentStep > 2
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Documentation
                            </div>
                          </li>

                          {/* Step 3 */}
                          <li className="flex items-start">
                            <div className="flex-shrink-0 z-10">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full 
            ${
              currentStep === 3
                ? "bg-blue-600 ring-4 ring-blue-200"
                : currentStep > 3
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
                              >
                                {currentStep > 3 ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : (
                                  <span
                                    className={`text-xs ${
                                      currentStep === 3
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    3
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`ml-4 ${
                                currentStep === 3
                                  ? "text-blue-600 font-medium"
                                  : currentStep > 3
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Collection Reference Details
                            </div>
                          </li>

                          {/* Step 4 */}
                          <li className="flex items-start">
                            <div className="flex-shrink-0 z-10">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full 
            ${
              currentStep === 4
                ? "bg-blue-600 ring-4 ring-blue-200"
                : currentStep > 4
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
                              >
                                {currentStep > 4 ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : (
                                  <span
                                    className={`text-xs ${
                                      currentStep === 4
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    4
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`ml-4 ${
                                currentStep === 4
                                  ? "text-blue-600 font-medium"
                                  : currentStep > 4
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Service
                            </div>
                          </li>

                          {/* Step 5 */}
                          <li className="flex items-start">
                            <div className="flex-shrink-0 z-10">
                              <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full 
            ${
              currentStep === 5
                ? "bg-blue-600 ring-4 ring-blue-200"
                : currentStep > 5
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
                              >
                                {currentStep > 5 ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : (
                                  <span
                                    className={`text-xs ${
                                      currentStep === 5
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    5
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`ml-4 ${
                                currentStep === 5
                                  ? "text-blue-600 font-medium"
                                  : currentStep > 5
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Address Details
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-3/4">
                  <form onSubmit={onSubmit}>
                    {currentStep === 1 && (
                      <fieldset>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h1 className="text-lg font-semibold mb-4">
                            Personal Details
                          </h1>
                          <div>
                            <h6 className="mb-4 text-base font-medium">
                              Basic Information
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nick Name
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    name="vendor_short"
                                    value={vendor.vendor_short}
                                    onChange={onInputChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    name="vendor_company"
                                    value={vendor.vendor_company}
                                    onChange={onInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile No{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    minLength={10}
                                    maxLength={10}
                                    name="vendor_mobile"
                                    value={vendor.vendor_mobile}
                                    onChange={onInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    name="vendor_email"
                                    value={vendor.vendor_email}
                                    onChange={onInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-span-full">
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    name="branch_id"
                                    value={vendor.branch_id}
                                    onChange={onInputChange}
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  >
                                    <option value="">Select</option>
                                    {branches.map((branch) => (
                                      <option key={branch.id} value={branch.id}>
                                        {branch.branch_name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Aadhar No{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    minLength={12}
                                    maxLength={12}
                                    name="vendor_aadhar_no"
                                    value={vendor.vendor_aadhar_no}
                                    onChange={onInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    GST No
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=""
                                    name="vendor_gst_no"
                                    value={vendor.vendor_gst_no}
                                    onChange={onInputChange}
                                    minLength={15}
                                    maxLength={15}
                                  />
                                </div>
                              </div>
                              <div className="col-span-full">
                                <div >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor Job Skills
                                  </label>
                                  <textarea
                                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                                    placeholder=""
                                    name="vendor_job_skills"
                                    value={vendor.vendor_job_skills}
                                    onChange={onInputChange}
                                    rows={5}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    )}

                    {currentStep === 2 && (
                      <fieldset>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h1 className="text-lg font-semibold mb-4">
                            Documentation
                          </h1>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Please add Pictures{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                                  {selectedFile1 ? (
                                    <div className="w-full">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm truncate">
                                          {selectedFile1.name}
                                        </span>
                                        <button
                                          type="button"
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() =>
                                            removeSelectedFile(setSelectedFile1)
                                          }
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 mb-2">
                                        Browse Files
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFileChange(
                                              e,
                                              setSelectedFile1
                                            )
                                          }
                                          required
                                        />
                                      </label>
                                      <p className="text-center text-xs text-gray-500">
                                        Only .jpg .png file types allowed
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Please add Aadhar Card Front Side{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                                  {selectedFile2 ? (
                                    <div className="w-full">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm truncate">
                                          {selectedFile2.name}
                                        </span>
                                        <button
                                          type="button"
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() =>
                                            removeSelectedFile(setSelectedFile2)
                                          }
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 mb-2">
                                        Browse Files
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFileChange(
                                              e,
                                              setSelectedFile2
                                            )
                                          }
                                          required
                                        />
                                      </label>
                                      <p className="text-center text-xs text-gray-500">
                                        Only .jpg .png file types allowed
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Please add Aadhar Card Back Side{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                                  {selectedFile3 ? (
                                    <div className="w-full">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm truncate">
                                          {selectedFile3.name}
                                        </span>
                                        <button
                                          type="button"
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() =>
                                            removeSelectedFile(setSelectedFile3)
                                          }
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 mb-2">
                                        Browse Files
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFileChange(
                                              e,
                                              setSelectedFile3
                                            )
                                          }
                                          required
                                        />
                                      </label>
                                      <p className="text-center text-xs text-gray-500">
                                        Only .jpg .png file types allowed
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Please add GST Certificate
                                </label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                                  {selectedFile4 ? (
                                    <div className="w-full">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm truncate">
                                          {selectedFile4.name}
                                        </span>
                                        <button
                                          type="button"
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() =>
                                            removeSelectedFile(setSelectedFile4)
                                          }
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 mb-2">
                                        Browse Files
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFileChange(
                                              e,
                                              setSelectedFile4
                                            )
                                          }
                                        />
                                      </label>
                                      <p className="text-center text-xs text-gray-500">
                                        Only .jpg .png file types allowed
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    )}

                    {currentStep === 3 && (
                      <fieldset>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h1 className="text-lg font-semibold mb-4">
                            Collection Reference Details
                          </h1>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reference Name 1
                                </label>
                                <input
                                  type="text"
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder=""
                                  name="vendor_ref_name_1"
                                  value={vendor.vendor_ref_name_1}
                                  onChange={onInputChange}
                                />
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reference Name 2
                                </label>
                                <input
                                  type="text"
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder=""
                                  name="vendor_ref_name_2"
                                  value={vendor.vendor_ref_name_2}
                                  onChange={onInputChange}
                                />
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reference Mobile No 1
                                </label>
                                <input
                                  type="tel"
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder=""
                                  minLength={10}
                                  maxLength={10}
                                  name="vendor_ref_mobile_1"
                                  value={vendor.vendor_ref_mobile_1}
                                  onChange={onInputChange}
                                />
                              </div>
                            </div>
                            <div>
                              <div >
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reference Mobile No 2
                                </label>
                                <input
                                  type="tel"
                                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder=""
                                  minLength={10}
                                  maxLength={10}
                                  name="vendor_ref_mobile_2"
                                  value={vendor.vendor_ref_mobile_2}
                                  onChange={onInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    )}

                    {currentStep === 4 && (
                      <fieldset>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h1 className="text-lg font-semibold mb-4">Service</h1>
                          <div className="w-full">
                            <div >
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service <span className="text-red-500">*</span>
                              </label>
                              <Select
                                isMulti
                                name="service_id"
                                options={services.map((service) => ({
                                  value: service.id,
                                  label: service.service,
                                }))}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleServiceChange}
                                styles={customStyles}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    )}

                    {currentStep === 5 && (
                      <fieldset>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h1 className="text-lg font-semibold mb-4">
                            Address Details
                          </h1>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {users1.map((user, index) => (
                              <React.Fragment key={index}>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Pincode{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="tel"
                                      minLength={6}
                                      maxLength={6}
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_pincode"
                                      value={user.vendor_branch_pincode}
                                      onChange={(e) => {
                                        onChange1(e, index);
                                        checkPincode(e, index);
                                      }}
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      City{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_city"
                                      value={user.vendor_branch_city}
                                      onChange={(e) => onChange1(e, index)}
                                      readOnly
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      District{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_district"
                                      value={user.vendor_branch_district}
                                      onChange={(e) => onChange1(e, index)}
                                      readOnly
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      State{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_state"
                                      value={user.vendor_branch_state}
                                      onChange={(e) => onChange1(e, index)}
                                      readOnly
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Street/Location/Village{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      name="vendor_branch_location"
                                      value={user.vendor_branch_location}
                                      onChange={(e) => onChange1(e, index)}
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      required
                                    >
                                      <option value="">Select</option>
                                      {locations.map((location) => (
                                        <option
                                          key={location.id}
                                          value={location.name}
                                        >
                                          {location.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      House/Flat/Plot
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_flat"
                                      value={user.vendor_branch_flat}
                                      onChange={(e) => onChange1(e, index)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Apartment/Building
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_building"
                                      value={user.vendor_branch_building}
                                      onChange={(e) => onChange1(e, index)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Landmark
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                      placeholder=""
                                      name="vendor_branch_landmark"
                                      value={user.vendor_branch_landmark}
                                      onChange={(e) => onChange1(e, index)}
                                    />
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </fieldset>
                    )}

                    <div className="flex justify-end items-center  space-x-2">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-4 py-2 border border-black text-black rounded-md hover:bg-blue-50"
                        >
                          Back
                        </button>
                      )}
                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-black text-white rounded-md hover:bg-black"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-4 py-2 bg-black text-white rounded-md hover:bg-black disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeVendor;
