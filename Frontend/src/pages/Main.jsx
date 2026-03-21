import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Brands from '../components/Brands';
import FAQ from '../components/FAQ';
import BottomCTA from '../components/BottomCTA';
import Footer from '../components/Footer';

function MainPage({ onNavigateToLogin, onNavigateToRegister }) { 
  return (
    <div className="app-container">
      <Header onLoginClick={onNavigateToLogin} onRegisterClick={onNavigateToRegister} />
      <main>
        <Hero onRegisterClick={onNavigateToRegister} />
        <Brands />
        <FAQ />
        <BottomCTA onRegisterClick={onNavigateToRegister} />
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;