/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import axios from 'axios'



import './ApplyJob.css';
import { BASE_URL } from '../../config/BaseUrl';
import DefaultHelmet from '../../components/DefaultHelmet/DefaultHelmet';



const ApplyJob = () => {
  const [applyJob, setApplyJob] = useState({
    fullname: "",
    mobile_no: "",
    email_id: "",
    branch_city: "",
    job_skills: "",
    job_experience: "",
    resume: "",
  });

  const [notifications, setNotifications] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const showNotification = (message, type) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "mobile_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setApplyJob({ ...applyJob, [name]: value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        showNotification("Only PDF files are allowed", 'error');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        showNotification("Only PDF files are allowed", 'error');
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    return (
      !!applyJob.fullname &&
      !!applyJob.mobile_no &&
      applyJob.mobile_no.length === 10 &&
      !!applyJob.email_id &&
      !!applyJob.job_skills &&
      !!applyJob.job_experience &&
      !!applyJob.branch_city &&
      !!selectedFile
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      showNotification("Please fill all required fields", 'error');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("fullname", applyJob.fullname);
    data.append("mobile_no", applyJob.mobile_no);
    data.append("email_id", applyJob.email_id);
    data.append("branch_city", applyJob.branch_city);
    data.append("job_skills", applyJob.job_skills);
    data.append("job_experience", applyJob.job_experience);
    if (selectedFile) data.append("resume", selectedFile);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-web-apply-job-out`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        showNotification(response.data.msg, 'success');
        setApplyJob({
          fullname: "",
          mobile_no: "",
          email_id: "",
          branch_city: "",
          job_skills: "",
          job_experience: "",
          resume: "",
        });
        setSelectedFile(null);
      } else {
        showNotification(response.data.msg, 'error');
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      showNotification("Error submitting job application", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DefaultHelmet/>
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
     
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
     
      <div className="apply-job-wrapper">
        <div className="apply-job-content">
          <div className="apply-job-container">
            <div className="apply-job-card apply-job-main-card">
              <div className="apply-job-service-info">
                <span className="apply-job-avatar">
                  <img
                    src="assets/img/job-app.png"
                    className="apply-job-avatar-img"
                    alt="Job Application"
                  />
                </span>
                <div>
                  <h1 className="apply-job-title">Job Application</h1>
                </div>
              </div>
              
              <form onSubmit={onSubmit} className="apply-job-form">
                <div className="apply-job-section">
                  <h5 className="apply-job-section-title">Personal Details</h5>
                  <div>
                    <h6 className="apply-job-subtitle">Basic Information</h6>
                    <div className="apply-job-row">
                      <div className="apply-job-col">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Full Name <span className="apply-job-required">*</span>
                          </label>
                          <input
                            type="text"
                            className="apply-job-input"
                            name="fullname"
                            value={applyJob.fullname}
                            onChange={onInputChange}
                            placeholder='Enter Full Name'
                            required
                          />
                        </div>
                      </div>
                      <div className="apply-job-col">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Mobile No <span className="apply-job-required">*</span>
                          </label>
                          <input
                            type="tel"
                            className="apply-job-input"
                            minLength={10}
                            maxLength={10}
                            name="mobile_no"
                            value={applyJob.mobile_no}
                            onChange={onInputChange}
                            placeholder='9876543210'
                            required
                          />
                        </div>
                      </div>
                      <div className="apply-job-col">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Email Address <span className="apply-job-required">*</span>
                          </label>
                          <input
                            type="email"
                            className="apply-job-input"
                            name="email_id"
                            value={applyJob.email_id}
                            onChange={onInputChange}
                            placeholder='abc@gmail.com'
                            required
                          />
                        </div>
                      </div>
                      <div className="apply-job-col">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Branch City <span className="apply-job-required">*</span>
                          </label>
                          <input
                            type="text"
                            className="apply-job-input"
                            name="branch_city"
                            value={applyJob.branch_city}
                            onChange={onInputChange}
                            placeholder='eg. Bengaluru'
                            required
                          />
                        </div>
                      </div>
                      <div className="apply-job-col">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Job Experience <span className="apply-job-required">*</span>
                          </label>
                          <input
                            type="text"
                            className="apply-job-input"
                            name="job_experience"
                            value={applyJob.job_experience}
                            onChange={onInputChange}
                            placeholder='Enter your experience'
                            required
                          />
                        </div>
                      </div>
                      <div className="apply-job-col-full">
                        <div className="apply-job-form-group">
                          <label className="apply-job-label">
                            Job Skills <span className="apply-job-required">*</span>
                          </label>
                          <textarea
                            className="apply-job-textarea"
                            name="job_skills"
                            value={applyJob.job_skills}
                            onChange={onInputChange}
                            rows={5}
                            placeholder='Enter Job Skills'
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="apply-job-section">
                  <h5 className="apply-job-section-title">Resume Upload</h5>
                  <div className="apply-job-upload-container">
                    <label className="apply-job-upload-label">
                      Please upload your resume (PDF only) <span className="apply-job-required">*</span>
                    </label>
                    <div 
                      className={`apply-job-upload-area ${isDragging ? 'apply-job-upload-area-dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="apply-job-selected-file">
                          <div className="apply-job-file-info">
                            <span className="apply-job-file-name">{selectedFile.name}</span>
                            <span className="apply-job-file-size">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                          <button 
                            type="button" 
                            className="apply-job-remove-file"
                            onClick={removeSelectedFile}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="apply-job-upload-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                          </div>
                          <p className="apply-job-upload-text">
                            Drag & drop your resume here or
                          </p>
                          <label className="apply-job-upload-button">
                            Browse Files
                            <input 
                              type="file" 
                              accept="application/pdf" 
                              onChange={handleFileChange}
                              required
                              hidden
                            />
                          </label>
                          <p className="apply-job-upload-hint">
                            Only PDF files are accepted (Max size: 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="apply-job-submit-container">
                  <button
                    type="submit"
                    className="apply-job-submit-button"
                    disabled={loading || !validateForm()}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplyJob;