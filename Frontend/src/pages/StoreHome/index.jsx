import React, { useState } from 'react';

import SearchBar from '../../components/StoreHome/SearchBar';

import HeroSlider from '../../components/StoreHome/HeroSlider';
import CategoryShowcase from '../../components/StoreHome/CategoryShowcase';
import FlashSaleBanner from '../../components/StoreHome/FlashSaleBanner';
import FeaturedProducts from '../../components/StoreHome/FeaturedProducts';
import TopBrands from '../../components/StoreHome/TopBrands';
import BlogSection from '../../components/StoreHome/BlogSection';
import Testimonials from '../../components/StoreHome/Testimonials';
import NewsletterCTA from '../../components/StoreHome/NewsletterCTA';

const StoreHome = ({ onFilterCategory, onOpenListing, onSelectProduct, onAddToCart }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #fff 100%)' }}>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onFilterCategory={onFilterCategory}
        onOpenListing={onOpenListing}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-14">

        <HeroSlider onOpenListing={onOpenListing} />

        <CategoryShowcase onOpenListing={onOpenListing} onFilterCategory={onFilterCategory} />

        <FlashSaleBanner onOpenListing={onOpenListing} />
        <FeaturedProducts
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
          onOpenListing={onOpenListing}
        />
        <TopBrands onOpenListing={onOpenListing} />
        <BlogSection />
        <Testimonials />
        <NewsletterCTA />

      </div>
    </div>
  );
};

export default StoreHome;
