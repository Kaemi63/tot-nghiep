import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/ChatPage/SideBar';
import ChatWindow from '../components/ChatPage/ChatWindow';
import StoreHome from './StoreHome';
import ProductListing from './ProductListing';
import ProductDetail from './ProductDetail';
import MyAccount from './MyAccount';
import CartPage from './Cart';
import CheckoutPage from './Checkout';
import OrderHistoryPage from './OrderHistory';
import WishlistPage from './Wishlist';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { useNavigation } from '../hooks/useNavigation';
import { useWishlist } from '../hooks/useWishlist';

const ChatPage = () => {
  const [chatKey, setChatKey] = useState(0);

  // --- Hooks ---
  const {
    activeSection, setActiveSection,
    selectedProduct, selectedCategory, searchQuery,
    openProductDetail, handleBack,
    openStoreHome, openMyAccount, openCart,
    openCheckout, openOrderHistory, openWishlist,
    openProductListing, viewSearchResults,
  } = useNavigation();

  const { cartItems, loading, fetchCart, addToCart, updateCartQuantity, removeCartItem, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { orderHistory, loading: loadingOrders, fetchOrderHistory } = useOrder();

  // Fetch orders khi chuyển sang trang lịch sử đơn hàng
  useEffect(() => {
    if (activeSection === 'orderHistory') {
      fetchOrderHistory();
    }
  }, [activeSection]);

  // Tính subtotal từ cartItems
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unit_price ?? item.products?.base_price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleNewChat = () => {
    setActiveSection('chat');
    setChatKey((prev) => prev + 1);
  };

  const handleOrderSuccess = () => {
    clearCart();
    fetchCart();
    setActiveSection('orderHistory');
    toast.success("Đơn hàng đã được hệ thống tiếp nhận!");
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        onOpenStore={openStoreHome}
        onOpenAccount={openMyAccount}
        onOpenCart={openCart}
        onOpenOrderHistory={openOrderHistory}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenWishlist={openWishlist}
        isStore={activeSection !== 'chat'}
        showCategories={activeSection !== 'chat' && activeSection !== 'myAccount'}
        onCategorySelect={openProductListing}
      />
      <main className="flex-1 flex flex-col relative">
        {activeSection === 'chat' && <ChatWindow key={chatKey} />}

        {activeSection === 'storeHome' && (
          <StoreHome
            onFilterCategory={openProductListing}
            onOpenListing={openProductListing}
            onSearch={viewSearchResults}
            onSelectProduct={openProductDetail}
          />
        )}

        {activeSection === 'productListing' && (
          <ProductListing
            categorySlug={selectedCategory}
            searchQuery={searchQuery}
            onSelectProduct={openProductDetail}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
          />
        )}

        {activeSection === 'productDetail' && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBack}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
          />
        )}

        {activeSection === 'cart' && (
          <CartPage
            cartItems={cartItems}
            loading={loading}
            updateCartQuantity={updateCartQuantity}
            removeCartItem={removeCartItem}
            onCheckout={openCheckout}
          />
        )}

        {activeSection === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            subtotal={subtotal}
            onPlaceOrder={handleOrderSuccess}
            onBack={openCart}
          />
        )}

        {activeSection === 'orderHistory' && (
          <OrderHistoryPage
            orders={orderHistory}
            loading={loadingOrders}
            onRefresh={fetchOrderHistory}
          />
        )}

        {activeSection === 'wishlist' && (
          <WishlistPage onAddToCart={addToCart} />
        )}

        {activeSection === 'myAccount' && <MyAccount />}
      </main>
    </div>
  );
};

export default ChatPage;
