import React, { useMemo, useState } from 'react';
import { PageShell, EmptyState } from '../../shared/ShopUI';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartPage = ({ cartItems, onQuantityChange, onRemoveItem, onApplyCoupon, onCheckout, availableCoupons = [] }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
    const p = item.product.priceRaw ?? item.product.base_price ?? 0;
    return acc + p * item.quantity;
  }, 0), [cartItems]);

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
    if (!coupon) { setCouponError('Mã giảm giá không hợp lệ.'); return; }
    setAppliedCoupon(coupon);
    onApplyCoupon && onApplyCoupon(coupon);
  };

  if (cartItems.length === 0) {
    return (
      <PageShell>
        <EmptyState icon="🛒" title="Giỏ hàng trống" desc="Chưa có sản phẩm nào trong giỏ. Hãy khám phá và thêm ngay!"
          action={{ label: 'Tiếp tục mua sắm', onClick: () => window.history.back() }} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Giỏ hàng</h1>
        <p className="text-slate-500 text-sm mt-1">{cartItems.length} sản phẩm</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => <CartItem key={item.product.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemoveItem} />)}
        </div>
        <CartSummary subtotal={subtotal} discount={discount} total={total} appliedCoupon={appliedCoupon}
          couponCode={couponCode} setCouponCode={setCouponCode} onApplyCoupon={handleApply}
          onCheckout={onCheckout} itemCount={cartItems.length} />
      </div>
      {couponError && <p className="mt-3 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{couponError}</p>}
    </PageShell>
  );
};

export default CartPage;
