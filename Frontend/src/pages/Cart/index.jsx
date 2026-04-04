import React, { useMemo, useState } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';


const CartPage = ({ cartItems,loading,updateCartQuantity,removeCartItem,onApplyCoupon,onCheckout,availableCoupons = []}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // 1. Tính tổng tiền tạm tính (Subtotal)
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unit_price || 0;
      return acc + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // 2. Tính tổng số lượng sản phẩm
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // 3. Tính số tiền được giảm giá
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.floor(subtotal * appliedCoupon.value);
    if (appliedCoupon.type === 'fixed') return appliedCoupon.value;
    return 0;
  }, [appliedCoupon, subtotal]);

  // 4. Tổng tiền cuối cùng sau giảm giá
  const total = Math.max(0, subtotal - discount);

  // Hàm xử lý khi người dùng nhấn "Áp dụng" mã giảm giá
  const handleApply = (e) => {
    e.preventDefault();
    setCouponError('');
    
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      setCouponError('Mã giảm giá không hợp lệ.');
      return;
    }

    setAppliedCoupon(coupon);
    if (onApplyCoupon) onApplyCoupon(coupon);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 animate-pulse">Đang tải giỏ hàng từ hệ thống...</p>
        </div>
      </PageShell>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <PageShell>
        <EmptyState 
          icon="🛒" 
          title="Giỏ hàng trống" 
          desc="Chưa có sản phẩm nào trong giỏ. Hãy khám phá và thêm ngay!"
          action={{ 
            label: 'Tiếp tục mua sắm', 
            onClick: () => window.history.back() 
          }} 
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Giỏ hàng</h1>
        <p className="text-slate-500 text-sm mt-1">
          {totalQuantity} sản phẩm trong túi đồ của bạn
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onQuantityChange={updateCartQuantity}
              onRemove={removeCartItem}
            />
          ))}
        </div>

        {/* Cột phải: Tổng kết thanh toán */}
        <CartSummary 
          subtotal={subtotal} 
          discount={discount} 
          total={total} 
          appliedCoupon={appliedCoupon}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          onApplyCoupon={handleApply}
          onCheckout={() => onCheckout(cartItems, total)} 
          itemCount={totalQuantity}
          couponError={couponError}
        />
      </div>
    </PageShell>
  );
};

export default CartPage;