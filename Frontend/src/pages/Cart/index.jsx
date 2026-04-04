import React, { useMemo, useState } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';
import { useCart } from '../../hooks/useCart'; // Sử dụng Hook bạn đã có

const CartPage = ({ onApplyCoupon, onCheckout, availableCoupons = [] }) => {
  // 1. Sử dụng Hook để lấy dữ liệu và các hàm xử lý từ Backend
  const { cartItems, loading, removeCartItem, updateCartQuantity } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // 2. Tính toán tổng tiền dựa trên dữ liệu thực (unit_price từ DB)
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      // Backend trả về unit_price cho mỗi item trong giỏ
      const price = item.unit_price || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.floor(subtotal * appliedCoupon.value);
    if (appliedCoupon.type === 'fixed') return appliedCoupon.value;
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal - discount);

  const handleApply = (e) => {
    e.preventDefault();
    setCouponError('');
    const coupon = availableCoupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());
    if (!coupon) {
      setCouponError('Mã giảm giá không hợp lệ.');
      return;
    }
    setAppliedCoupon(coupon);
    onApplyCoupon && onApplyCoupon(coupon);
  };

  // Trạng thái đang tải dữ liệu từ server
  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 animate-pulse">Đang tải giỏ hàng từ hệ thống...</p>
        </div>
      </PageShell>
    );
  }

  // Trạng thái giỏ hàng trống (lấy từ độ dài mảng cartItems của Backend)
  if (cartItems.length === 0) {
    return (
      <PageShell>
        <EmptyState 
          icon="🛒" 
          title="Giỏ hàng trống" 
          desc="Chưa có sản phẩm nào trong giỏ. Hãy khám phá và thêm ngay!"
          action={{ label: 'Tiếp tục mua sắm', onClick: () => window.history.back() }} 
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Giỏ hàng</h1>
        <p className="text-slate-500 text-sm mt-1">{cartItems.length} sản phẩm trong túi đồ của bạn</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onQuantityChange={updateCartQuantity} // Hàm từ useCart
              onRemove={removeCartItem}           // Hàm từ useCart
            />
          ))}
        </div>

        <CartSummary 
          subtotal={subtotal} 
          discount={discount} 
          total={total} 
          appliedCoupon={appliedCoupon}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          onApplyCoupon={handleApply}
          onCheckout={() => onCheckout(cartItems, total)} // Gửi dữ liệu thực đi checkout
          itemCount={cartItems.length}
          couponError={couponError}
        />
      </div>
    </PageShell>
  );
};

export default CartPage;