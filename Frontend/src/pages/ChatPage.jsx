import React, { useState } from 'react';
import Sidebar from '../components/ChatPage/SideBar';
import ChatWindow from '../components/ChatPage/ChatWindow';
import StoreHome from './StoreHome';
import ProductListing from './ProductListing';
import ProductDetail from './ProductDetail';
import MyAccount from './MyAccount';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderHistoryPage from './OrderHistoryPage';
import WishlistPage from './WishlistPage';

const ChatPage = () => {
  const [chatKey, setChatKey] = useState(0);
  const [activeSection, setActiveSection] = useState('chat'); // 'chat' | 'storeHome' | 'productListing' | 'productDetail' | 'myAccount' | 'cart' | 'checkout' | 'orderHistory' | 'wishlist'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const coupons = [{ code: 'COOL10', type: 'percent', value: 0.1 }, { code: 'FREESHIP', type: 'fixed', value: 40000 }];

  const handleNewChat = () => {
    setActiveSection('chat');
    setChatKey((prev) => prev + 1);
  };

  const openStoreHome = () => {
    setActiveSection('storeHome');
  };

  const openMyAccount = () => {
    setActiveSection('myAccount');
  };

  const openProductListing = (category = '') => {
    setSelectedCategory(category);
    setActiveSection('productListing');
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setActiveSection('productDetail');
  };

  const backToListing = () => {
    setActiveSection('productListing');
  };

  const openCart = () => {
    setActiveSection('cart');
  };

  const openCheckout = () => {
    setActiveSection('checkout');
  };

  const openOrderHistory = () => {
    setActiveSection('orderHistory');
  };

  const openWishlist = () => {
    setActiveSection('wishlist');
  };

  const findCartItem = (productId) => cartItems.find((i) => i.product.id === productId);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product: { ...product, priceRaw: Number(product.price.toString().replace(/\D/g, '')) || 0 }, quantity: 1 }];
    });
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) => prev
      .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const placeOrder = (order) => {
    setOrders((prev) => [...prev, order]);
    setCartItems([]);
    setActiveSection('orderHistory');
  };

  const handleApplyCoupon = (coupon) => {
    console.log('applied coupon', coupon);
  };

  const viewSearchResults = (query) => {
    setSearchQuery(query);
    setActiveSection('productListing');
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        onOpenStore={openStoreHome}
        onOpenAccount={openMyAccount}
        onOpenCart={openCart}
        onOpenOrderHistory={openOrderHistory}
        onOpenWishlist={openWishlist}
        isStore={activeSection !== 'chat'}
        showCategories={activeSection !== 'chat' && activeSection !== 'myAccount'}
        onCategorySelect={openProductListing}
      />
      <main className="flex-1 flex flex-col relative">
        {activeSection === 'chat' && <ChatWindow key={chatKey} />}
        {activeSection === 'storeHome' && <StoreHome onFilterCategory={openProductListing} onOpenListing={openProductListing} onSearch={viewSearchResults} />}
        {activeSection === 'productListing' && <ProductListing category={selectedCategory} searchQuery={searchQuery} onSelectProduct={openProductDetail} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'productDetail' && <ProductDetail product={selectedProduct} onBack={backToListing} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'cart' && <CartPage cartItems={cartItems} onQuantityChange={updateCartQuantity} onRemoveItem={removeCartItem} onApplyCoupon={handleApplyCoupon} onCheckout={openCheckout} availableCoupons={coupons} />}
        {activeSection === 'checkout' && <CheckoutPage cartItems={cartItems} subtotal={cartItems.reduce((acc, item) => acc + item.product.priceRaw * item.quantity, 0)} onPlaceOrder={placeOrder} onBack={openCart} />}
        {activeSection === 'orderHistory' && <OrderHistoryPage orders={orders} />}
        {activeSection === 'wishlist' && <WishlistPage items={wishlistItems} onAddToCart={(product) => { addToCart(product); setWishlistItems((prev) => prev.filter((item) => item.id !== product.id)); }} onRemove={(id) => setWishlistItems((prev) => prev.filter((item) => item.id !== id))} />}
        {activeSection === 'myAccount' && <MyAccount />}
      </main>
    </div>
  );
};

export default ChatPage;