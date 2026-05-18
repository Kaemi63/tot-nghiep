import { useState } from 'react';

export const useNavigation = () => {
  const [activeSection, setActiveSection] = useState('chat');
  const [previousSection, setPreviousSection] = useState('storeHome');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const openProductDetail = (product) => {
    setPreviousSection(activeSection);
    setSelectedProduct(product);
    setActiveSection('productDetail');
  };

  const handleBack = () => {
    setActiveSection(previousSection);
  };

  const openStoreHome = () => setActiveSection('storeHome');
  const openMyAccount = () => setActiveSection('myAccount');
  const openCart = () => setActiveSection('cart');
  const openCheckout = () => setActiveSection('checkout');
  const openOrderHistory = () => setActiveSection('orderHistory');
  const openWishlist = () => setActiveSection('wishlist');

  const openProductListing = (category = '', label = '') => {
    setSelectedCategory(category);
    setSelectedCategoryLabel(label || category);
    setActiveSection('productListing');
  };

  const viewSearchResults = (query) => {
    setSearchQuery(query);
    setActiveSection('productListing');
  };

  return {
    activeSection,
    setActiveSection,
    previousSection,
    selectedProduct,
    selectedCategory,
    selectedCategoryLabel,
    searchQuery,
    openProductDetail,
    handleBack,
    openStoreHome,
    openMyAccount,
    openCart,
    openCheckout,
    openOrderHistory,
    openWishlist,
    openProductListing,
    viewSearchResults,
  };
};