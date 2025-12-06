import React from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

import logoNav from "../../../public/assets/img/services/footer_logo.png";
import Call from "../../../public/assets/img/icons/call-calling.svg";
import Mail from "../../../public/assets/img/icons/sms.svg";
import Location from "../../../public/assets/img/icons/call-calling.svg";
import './Footer.css';

const Footer = () => {

  return (
    <footer className="footer-bottom-footer footer-bottom-footer-seven">
      {/* Footer Top */}
      <div className="footer-bottom-footer-top">
        <div className="footer-bottom-container">
          <div className="footer-bottom-footer-columns">
            {/* Logo and Description Column */}
            <div className="footer-bottom-footer-column">
              <div className="footer-bottom-footer-widget footer-bottom-footer-widget-seven">
                <div className="footer-bottom-footer-logo">
                  <Link to='/'>
                    <img 
                      src={logoNav} 
                      alt="logo_footer" 
                      loading="lazy" 
                      decoding="async"
                      width="160"
                      height="auto"
                    />
                  </Link>
                </div>
                <div className="footer-bottom-footer-content">
                  <p>
                    We are an organisation that cares about our people and our clients – To be the most admired cleaning and facility services partner in our chosen segments in India
                  </p>
                </div>
              
                <div className="footer-bottom-social-links">
                  <ul>
                    <li>
                      <Link title='Facebook' target="_blank" rel="noreferrer" to="https://www.facebook.com/v3care">
                      <Icon.Facebook className='my-1 mx-1'/>
                      </Link>
                    </li>
                    <li>
                      <Link title='Twitter' target="_blank" rel="noreferrer" to="https://x.com/care_v3">
                        <Icon.Twitter className='my-1 mx-1'/>
                      </Link>
                    </li>
                    <li>
                      <Link title='Instagram' target="_blank" rel="noreferrer" to="https://www.instagram.com/v3care/">
                      <Icon.Instagram className='my-1 mx-1'/>
                      </Link>
                    </li>
                    <li>
                      <Link title='LinkedIn' target="_blank" rel="noreferrer" to="https://www.linkedin.com/in/v3-care-15135119b/">
                      <Icon.Linkedin className='my-1 mx-1'/>
                      </Link>
                    </li>
                    <li>
                      <Link title='Youtube' target="_blank" rel="noreferrer" to="https://www.youtube.com/channel/UC3eZ5BXlhuQk_OZ6zXXgW2w">
                      <Icon.Youtube className='my-1 mx-1'/>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* About Links Column */}
            <div className="footer-bottom-footer-column">
              <div className="footer-bottom-footer-widget footer-bottom-footer-menu">
                <h2 className="footer-bottom-footer-title">About</h2>
                <ul>
                  <li>
                    <Link title='About Us' to='/about-us'>About us</Link>
                  </li>
                  <li>
                    <Link title='Contact Us' to='/contact-us'>Contact Us</Link>
                  </li>
                  <li>
                    <Link title='Service' to='/service'>Service</Link>
                  </li>
                  <li>
                    <Link title='Client' to='/client'>Client</Link>
                  </li>
                  <li>
                    <Link title='Blog' to='/blog'>Blog</Link>
                  </li>
                  <li>
                    <Link title='Blog' to='/apply-job'>Apply For Job</Link>
                  </li>
                  <li>
                    <Link title='Become Partner' to='/become-partner'>Become Partner</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="footer-bottom-footer-column">
              <div className="footer-bottom-footer-widget">
                <h2 className="footer-bottom-footer-title">Contact</h2>
                <div className="footer-bottom-contact-info">
                  <div className="footer-bottom-contact-item">
                    <span className="footer-bottom-contact-icon">
                      <img src={Call} alt="phone" />
                    </span>
                    <div className="footer-bottom-contact-details">
                      <span>Phone Number</span>
                      <h6><a title='Call Us' target="_blank" rel="noreferrer" href="tel:+919880778585">+91 98807 78585</a></h6>
                    </div>
                  </div>
                  <div className="footer-bottom-contact-item">
                    <span className="footer-bottom-contact-icon">
                      <img src={Mail} alt="email" />
                    </span>
                    <div className="footer-bottom-contact-details">
                      <span>Mail Address</span>
                      <h6><a title='Mail Us' target="_blank" rel="noreferrer" href="mailto:info@v3care.in">info@v3care.in</a></h6>
                    </div>
                  </div>
                  <div className="footer-bottom-contact-item">
                    <span className="footer-bottom-contact-icon">
                      <img src={Location} alt="location" />
                    </span>
                    <div className="footer-bottom-contact-details">
                      <span>Bangalore Address</span>
                      <h6>286 15th A Cross, 7th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom-footer-bottom footer-bottom-footer-bottom-seven">
        <div className="footer-bottom-container">
          <div className="footer-bottom-footer-bottom-content">
            <div className="footer-bottom-copyright footer-bottom-copyright-centered">
              <p style={{color:"#ffffff"}}>
                Copyright 2025 © <span className="footer-bottom-text-white text-red-400">V3Care</span>. All right reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;