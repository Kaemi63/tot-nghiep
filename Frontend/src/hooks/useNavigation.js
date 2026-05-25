import { useState } from 'react';

export const useNavigation = () => {
  const [activeSection, setActiveSection] = useState('chat');
  const [previousSection, setPreviousSection] = useState('storeHome');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);

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
  const openPaymentHistory = () => setActiveSection('paymentHistory');

  const openProductListing = (category = '', label = '') => {
    setSelectedCategory(category);
    setSelectedCategoryLabel(label || category);
    setActiveSection('productListing');
  };

  const viewSearchResults = (query) => {
    setSearchQuery(query);
    setActiveSection('productListing');
  };

  // Payment method routing functions
  const openCODPayment = (order) => {
    setPreviousSection(activeSection);
    setPaymentOrder(order);
    setPaymentMethod('cod');
    setActiveSection('codPayment');
  };

  const openBankTransferPayment = (order) => {
    setPreviousSection(activeSection);
    setPaymentOrder(order);
    setPaymentMethod('bank_transfer');
    setActiveSection('bankTransferPayment');
  };

  const openMomoPayment = (order) => {
    setPreviousSection(activeSection);
    setPaymentOrder(order);
    setPaymentMethod('momo');
    setActiveSection('momoPayment');
  };

  const openVNPayPayment = (order) => {
    setPreviousSection(activeSection);
    setPaymentOrder(order);
    setPaymentMethod('vnpay');
    setActiveSection('vnpayPayment');
  };

  const getPaymentSection = (method) => {
    switch(method?.toLowerCase()) {
      case 'cod': return 'codPayment';
      case 'bank_transfer': return 'bankTransferPayment';
      case 'momo': return 'momoPayment';
      case 'vnpay': return 'vnpayPayment';
      default: return 'checkout';
    }
  };

  return {
    activeSection,
    setActiveSection,
    previousSection,
    selectedProduct,
    selectedCategory,
    selectedCategoryLabel,
    searchQuery,
    paymentMethod,
    paymentOrder,
    openProductDetail,
    handleBack,
    openStoreHome,
    openMyAccount,
    openCart,
    openCheckout,
    openOrderHistory,
    openWishlist,
    openPaymentHistory,
    openProductListing,
    viewSearchResults,
    openCODPayment,
    openBankTransferPayment,
    openMomoPayment,
    openVNPayPayment,
    getPaymentSection,
  };
};