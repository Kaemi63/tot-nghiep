import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <div className="footer-logo-icon"></div>
            <span className="footer-logo-text">ChatBot</span>
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="footer-heading">ChatGPT</h4>
            <ul className="footer-list">
              <li><a href="#">Explore ChatGPT</a></li>
              <li><a href="#">Teams</a></li>
              <li><a href="#">Education</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Download</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Latest Ad</h4>
            <ul className="footer-list">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Help center</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Career</a></li>
              <li><a href="#">Our charter</a></li>
              <li><a href="#">Brand</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">More</h4>
            <ul className="footer-list">
              <li><a href="#">News</a></li>
              <li><a href="#">Stories</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-legal">
             <a href="#">Privacy policy</a>
             <a href="#">Security</a>
             <a href="#">Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
