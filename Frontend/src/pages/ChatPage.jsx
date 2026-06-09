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
import PaymentHistoryPage from './PaymentHistory';
import CODPayment from '../components/PaymentMethods/CODPayment';
import BankTransferPayment from '../components/PaymentMethods/BankTransferPayment';
import MomoPayment from '../components/PaymentMethods/MomoPayment';
import VNPayPayment from '../components/PaymentMethods/VNPayPayment';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { useNavigation } from '../hooks/useNavigation';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { chatbotService } from '../services/chatbotService';
import ChatWidgetPopup from '../components/ChatPage/ChatPopup';

const ChatPage = ({ onLogout, theme, setTheme }) => {
  const [chatKey, setChatKey] = useState(0);
  const { userProfile, token } = useAuthProfile();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  // --- Hooks ---
  const {
    activeSection, setActiveSection,
    selectedProduct, selectedCategory, selectedCategoryLabel, searchQuery,
    paymentMethod, paymentOrder,
    openProductDetail, handleBack,
    openStoreHome, openMyAccount, openCart,
    openCheckout, openOrderHistory, openWishlist,
    openProductListing, viewSearchResults,
    openPaymentHistory,
    openCODPayment, openBankTransferPayment, openMomoPayment, openVNPayPayment,
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
    if (token) {
      fetchSessions();
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [token]);

  // Tự động chọn session đầu tiên nếu chưa có session active
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  // Tính subtotal từ cartItems
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unit_price ?? item.products?.base_price ?? 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleNewChat = async () => {
    if (isCreatingChat) return; // Prevent multiple clicks
    setIsCreatingChat(true);
    setActiveSection('chat');
    try {
      const newSession = await chatbotService.createSession(token);
      setActiveSessionId(newSession.id); // Set session mới làm active
      setChatKey((prev) => prev + 1); // Reset ChatWindow
      fetchSessions(); // Cập nhật lại list sidebar
    } catch (err) {
      toast.error("Không thể tạo chat mới");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc hội thoại này không?")) return;

    try {
      await chatbotService.deleteSession(sessionId, token);
      toast.success("Đã xóa cuộc trò chuyện");
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setActiveSection('chat');
        setChatKey((prev) => prev + 1);
      }
    } catch (err) {
      toast.error("Không thể xóa cuộc trò chuyện");
      console.error(err);
    }
  };

  const handleRenameSession = async (sessionId, newTitle) => {
    try {
      await chatbotService.renameSession(sessionId, newTitle, token);
      // Cập nhật state trực tiếp, không cần gọi lại API
      setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, title: newTitle } : s));
      toast.success("Đã đổi tên cuộc trò chuyện");
    } catch (err) {
      toast.error("Không thể đổi tên cuộc trò chuyện");
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

  // Handle payment method selection after checkout
  const handlePaymentMethodSelected = ({ paymentMethod, order, totalAmount }) => {
    switch(paymentMethod) {
      case 'cod':
        openCODPayment(order);
        break;
      case 'bank_transfer':
        openBankTransferPayment(order);
        break;
      case 'momo':
        openMomoPayment(order);
        break;
      case 'vnpay':
        openVNPayPayment(order);
        break;
      default:
        handleOrderSuccess();
    }
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    handleOrderSuccess();
  };


  return (
    <div className={`flex h-screen w-full ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} ${activeSection === 'myAccount' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
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
        onRenameSession={handleRenameSession}
        onSessionSelect={handleSessionSelect}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenWishlist={openWishlist}
        onOpenPaymentHistory={openPaymentHistory}
        isStore={activeSection !== 'chat'}
        onLogout={onLogout}
        isCreatingChat={isCreatingChat}
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
            categoryLabel={selectedCategoryLabel}
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
            onPaymentMethodSelected={handlePaymentMethodSelected}
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

        {activeSection === 'paymentHistory' && (
          <PaymentHistoryPage />
        )}

        {activeSection === 'codPayment' && paymentOrder && (
          <CODPayment
            order={paymentOrder}
            onComplete={handlePaymentComplete}
            onBack={openCheckout}
          />
        )}

        {activeSection === 'bankTransferPayment' && paymentOrder && (
          <BankTransferPayment
            order={paymentOrder}
            onComplete={handlePaymentComplete}
            onBack={openCheckout}
          />
        )}

        {activeSection === 'momoPayment' && paymentOrder && (
          <MomoPayment
            order={paymentOrder}
            onComplete={handlePaymentComplete}
            onBack={openCheckout}
          />
        )}

        {activeSection === 'vnpayPayment' && paymentOrder && (
          <VNPayPayment
            order={paymentOrder}
            onComplete={handlePaymentComplete}
            onBack={openCheckout}
          />
        )}

        {activeSection === 'chat' && (
          <ChatWindow
            key={`${chatKey}-${activeSessionId}`}
            token={token}
            userProfile={userProfile}
            sessionId={activeSessionId}
            theme={theme}
            setTheme={setTheme}
            onSelectProduct={openProductDetail}
          />
        )}
        {activeSection === 'myAccount' && <MyAccount />}
      </main>
      <ChatWidgetPopup 
        token={token} 
        userProfile={userProfile} 
        currentSection={activeSection} 
        onSelectProduct={openProductDetail}
      />
    </div>
  );
};

export default ChatPage;
