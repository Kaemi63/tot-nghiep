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
import { useAuthProfile } from '../hooks/useAuthProfile';
import { chatbotService } from '../services/chatbotService';

const ChatPage = () => {
  const [chatKey, setChatKey] = useState(0);
  const { userProfile, token} = useAuthProfile();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
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
// Hàm fetch danh sách session từ DB
  const fetchSessions = async () => {
    if (!token) return;
    try {
      const data = await chatbotService.getSessions(token);
      setSessions(data);
    } catch (err) {
      console.error("Lỗi lấy session:", err);
    }
  };

  // Load session khi vào trang
  useEffect(() => {
    fetchSessions();
  }, [token]);

  // Tính subtotal từ cartItems
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unit_price ?? item.products?.base_price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleNewChat = async () => {
    setActiveSection('chat');
    try {
      const newSession = await chatbotService.createSession(token);
      setActiveSessionId(newSession.id); // Set session mới làm active
      setChatKey((prev) => prev + 1); // Reset ChatWindow
      fetchSessions(); // Cập nhật lại list sidebar
    } catch (err) {
      toast.error("Không thể tạo chat mới");
    }
  };

  const handleDeleteSession = async (sessionId) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc hội thoại này không?")) return;

  try {
    await chatbotService.deleteSession(sessionId, token);
    toast.success("Đã xóa cuộc trò chuyện");

    // 1. Cập nhật lại danh sách sessions (loại bỏ session vừa xóa khỏi state)
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // 2. Nếu session bị xóa là session đang active, hãy reset về null
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setActiveSection('chat'); // Quay về màn hình chào của chat
      setChatKey((prev) => prev + 1);
    }
  } catch (err) {
    toast.error("Không thể xóa cuộc trò chuyện");
    console.error(err);
  }
};

  const handleSessionSelect = (id) => {
    setActiveSessionId(id); // Thay đổi session đang chọn
    setActiveSection('chat');
    setChatKey((prev) => prev + 1); // Force render lại ChatWindow để load lịch sử mới
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
        userProfile={userProfile}
        onOpenStore={openStoreHome}
        onOpenAccount={openMyAccount}
        onOpenCart={openCart}
        onOpenOrderHistory={openOrderHistory}
        sessions={sessions} 
        activeSessionId={activeSessionId}
        onDeleteSession={handleDeleteSession}
        onSessionSelect={handleSessionSelect}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenWishlist={openWishlist}
        isStore={activeSection !== 'chat'}
        showCategories={activeSection !== 'chat' && activeSection !== 'myAccount'}
        onCategorySelect={openProductListing}
      />
      <main className="flex-1 flex flex-col relative">
        

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
        {activeSection === 'chat' && (
          <ChatWindow 
            key={`${chatKey}-${activeSessionId}`}
            token={token } 
            userProfile={userProfile} 
            sessionId={activeSessionId}
          />
        )}

        {activeSection === 'myAccount' && <MyAccount />}
      </main>
    </div>
  );
};

export default ChatPage;
