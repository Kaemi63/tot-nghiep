import React, { useState } from 'react';
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
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

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

  const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find((item) => item.product.id === product.id);
    if (existing) {
      return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    }
    // Dùng base_price từ Backend
    return [...prev, { product: { ...product, priceRaw: product.base_price || 0 }, quantity: 1 }];
  });
};

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
        toast.success("Đã thêm vào danh sách yêu thích");
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
        {activeSection === 'storeHome' && <StoreHome onFilterCategory={openProductListing} onOpenListing={openProductListing} onSearch={viewSearchResults} onSelectProduct={openProductDetail} />}
        {activeSection === 'productListing' && <ProductListing categorySlug={selectedCategory} searchQuery={searchQuery} onSelectProduct={openProductDetail} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'productDetail' && <ProductDetail product={selectedProduct} onBack={handleBack} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />}
        {activeSection === 'cart' && <CartPage cartItems={cartItems} onQuantityChange={updateCartQuantity} onRemoveItem={removeCartItem} onApplyCoupon={handleApplyCoupon} onCheckout={openCheckout} availableCoupons={coupons} />}
        {activeSection === 'checkout' && <CheckoutPage cartItems={cartItems} subtotal={cartItems.reduce((acc, item) => acc + item.product.priceRaw * item.quantity, 0)} onPlaceOrder={placeOrder} onBack={openCart} />}
        {activeSection === 'orderHistory' && <OrderHistoryPage orders={orders} />}
        {activeSection === 'wishlist' && <WishlistPage onAddToCart={addToCart} />}
        {activeSection === 'myAccount' && <MyAccount />}
      </main>
    </div>
  );
};

export default ChatPage;