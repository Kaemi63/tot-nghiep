import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Brands from '../components/Brands';
import FAQ from '../components/FAQ';
import BottomCTA from '../components/BottomCTA';
import Footer from '../components/Footer';

function MainPage({ onNavigateToLogin }) { 
  return (
    <div className="app-container">
      <Header onLoginClick={onNavigateToLogin} />
      <main>
        <Hero />
        <Brands />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;