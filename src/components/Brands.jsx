import React from 'react';
import './Brands.css';

const Brands = () => {
  return (
    <section className="brands">
      <div className="brands-container">
        <div className="brand-logo">
          {/* Using text for placeholders since no actual SVGs are provided, styling to look like logos */}
          <span className="brand-icon">C</span>
          <span className="brand-name clerk">clerk</span>
        </div>
        
        <div className="brand-logo">
          <span className="brand-name together">together.ai</span>
        </div>
        
        <div className="brand-logo">
          <span className="brand-name inflection">Inflection</span>
        </div>
        
        <div className="brand-logo">
          <span className="brand-icon star">★</span>
          <span className="brand-name trustpilot">Trustpilot</span>
        </div>
        
        <div className="brand-logo">
          <span className="brand-icon mx">X</span>
          <span className="brand-name xstate">STATE</span>
        </div>
        
        <div className="brand-logo">
           <span className="brand-icon algolia-icon">@</span>
          <span className="brand-name algolia">algolia</span>
        </div>

        <div className="brand-logo">
           <span className="brand-icon webdev-icon">W</span>
           <span className="brand-name webdev">web.dev</span>
        </div>
      </div>
    </section>
  );
};

export default Brands;
