import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Trợ lý AI<br />
          <span className="hero-title-highlight">Tư vấn sản phẩm</span>
        </h1>
        
        <div className="main-chat-widget">
          <p className="widget-subtitle">
            Chat với AI để nhận tư vấn sản phẩm phù hợp với nhu cầu của bạn. 🪄
          </p>
          
          <div className="widget-search-bar">
            <span className="sparkles">✨</span>
            <input type="text" placeholder="Design systems consist of reusable components..." readOnly />
          </div>

          <div className="widget-footer">
            <div className="toggles">
              <span className="toggle">Mobile</span>
              <span className="toggle active">Web</span>
            </div>
            <div className="actions">
              <span className="mic" style={{marginRight: '1rem'}}>🎙️</span>
              <span className="send">➤</span>
            </div>
          </div>

          <button className="hero-cta">
            Tham gia ChatBot của chúng tôi ↗
          </button>
        </div>
      </div>

      <div className="hero-visuals">
        <div className="floating-card left-card">
          <div className="search-box">Search for AI News</div>
          <div className="news-item">
            <span className="dot"></span> Apple AI update
          </div>
          <div className="news-item selected">
            <span className="dot yellow"></span> New AI models
          </div>
        </div>

        <div className="floating-card right-card">
           <div className="list-item">Take Screenshot</div>
           <div className="list-item">Take Photo</div>
           <div className="list-item">Open Env...</div>
        </div>
      </div>
      
      <div className="hero-background-text">
        <p>
          Developers can create more efficient and engaging AI tools related to ChatGPT offer a wide range of functionalities that enhance communication, automate tasks, and improve user experiences across various domains. By leveraging these tools, businesses and developers can create more efficient and engaging applications. AI tools related to ChatGPT offer a wide range of functionalities that enhance communication, automate tasks, and improve user experiences across various domains. 
        </p>
      </div>
    </section>
  );
};

export default Hero;
