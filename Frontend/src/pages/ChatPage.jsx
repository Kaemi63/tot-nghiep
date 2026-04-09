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
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';

const ChatPage = () => {
  const [chatKey, setChatKey] = useState(0);
  const [activeSection, setActiveSection] = useState('chat');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cartItems, loading, fetchCart, addToCart, updateCartQuantity, removeCartItem,clearCart } = useCart();
  const coupons = [];
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [previousSection, setPreviousSection] = useState('storeHome');
  

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
    setPreviousSection(activeSection);
    setSelectedProduct(product);
    setActiveSection('productDetail');
  };
  const handleBack = () => {
  setActiveSection(previousSection);
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


const addToWishlist = async (product) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    const userId = session.user.id;

    // 1. Kiểm tra xem sản phẩm đã có trong wishlist chưa
    // Lưu ý: Bạn cần fetch wishlist từ backend hoặc quản lý wishlistItems trong state của ChatPage
    const responseCheck = await fetch(`http://localhost:3001/api/wishlist/${userId}`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });
    const currentWishlist = await responseCheck.json();

    // Tìm xem sản phẩm hiện tại có trong danh sách chưa (so khớp product_id)
    const existingItem = currentWishlist.find(item => 
      (item.products?.id === product.id) || (item.product_id === product.id)
    );

    if (existingItem) {
      // 2. NẾU ĐÃ CÓ -> THỰC HIỆN XÓA (REMOVE)
      const removeResponse = await fetch(`http://localhost:3001/api/wishlist/remove/${existingItem.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (removeResponse.ok) {
        toast.success("Đã xóa khỏi danh sách yêu thích");
        // Cập nhật lại state nếu bạn có dùng wishlistItems để UI đổi màu icon ngay lập tức
        setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
      }
    } else {
      // 3. NẾU CHƯA CÓ -> THỰC HIỆN THÊM (ADD)
      const addResponse = await fetch('http://localhost:3001/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id
        })
      });

      if (addResponse.ok) {
        const result = await addResponse.json();
        // Cập nhật state
        setWishlistItems(prev => [...prev, result.data[0]]);
      } else {
        const errorData = await addResponse.json();
        toast.error(errorData.error || "Không thể thêm vào yêu thích");
      }
    }
  } catch (error) {
    console.error("Lỗi Wishlist Toggle:", error);
    toast.error("Có lỗi xảy ra, vui lòng thử lại");
  }
};
  const handleOrderSuccess = () => {
    clearCart(); 
    fetchCart(); 
    setActiveSection('orderHistory');
    toast.success("Đơn hàng đã được hệ thống tiếp nhận!");
  };
  const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Gọi API lấy orders (Backend đã sửa để join order_status_histories)
          const data = await orderService.getMyOrders(session.access_token);
          setOrders(data || []);
        }
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    useEffect(() => {
    if (activeSection === 'orderHistory') {
      fetchOrders();
    }
  }, [activeSection]);
  const handleApplyCoupon = (coupon) => {
    console.log('applied coupon', coupon);
  };

  const viewSearchResults = (query) => {
    setSearchQuery(query);
    setActiveSection('productListing');
  };
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unit_price ?? item.products?.base_price ?? 0;
      return acc + (price * item.quantity);
    }, 0);
  }, [cartItems]);
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
        {activeSection === 'storeHome' && <StoreHome onFilterCategory={openProductListing} onOpenListing={openProductListing} onSearch={viewSearchResults} onSelectProduct={openProductDetail} />}
        {activeSection === 'productListing' && <ProductListing categorySlug={selectedCategory} searchQuery={searchQuery} onSelectProduct={openProductDetail} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'productDetail' && <ProductDetail product={selectedProduct} onBack={handleBack} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'cart' && (<CartPage cartItems={cartItems} loading={loading} updateCartQuantity={updateCartQuantity} removeCartItem={removeCartItem} onApplyCoupon={handleApplyCoupon} onCheckout={openCheckout}/>)}
        {activeSection === 'checkout' && (<CheckoutPage cartItems={cartItems}subtotal={subtotal}onPlaceOrder={handleOrderSuccess} onBack={openCart} availableCoupons={coupons} />)}
        {activeSection === 'orderHistory' && <OrderHistoryPage orders={orders} loading={loadingOrders} onRefresh={fetchOrders}/>}
        {activeSection === 'wishlist' && <WishlistPage onAddToCart={addToCart} />}
        {activeSection === 'myAccount' && <MyAccount />}
      </main>
    </div>
  );
};

export default ChatPage;