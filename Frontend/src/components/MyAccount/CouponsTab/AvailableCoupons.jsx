import React from 'react';

const AvailableCoupons = ({ coupons, loading }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-800 mb-4">Mã giảm giá khả dụng</h3>
      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
          Đang tải mã giảm giá...
        </div>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-slate-500">Hiện tại không có mã giảm giá nào khả dụng.</p>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-[0.18em]">{coupon.code}</p>
                  <p className="text-sm text-slate-600">{coupon.name || 'Giảm giá đặc biệt'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-indigo-600">
                    {coupon.discount_type === 'percent'
                      ? `${coupon.discount_value}%`
                      : `${coupon.discount_value.toLocaleString('vi-VN')}₫`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tối đa {coupon.max_discount ? `${Number(coupon.max_discount).toLocaleString('vi-VN')}₫` : 'không giới hạn'}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-[13px] text-slate-600">
                <p>Đơn tối thiểu: {coupon.min_order_value ? `${Number(coupon.min_order_value).toLocaleString('vi-VN')}₫` : 'Không yêu cầu'}</p>
                <p>Đã dùng: {coupon.used_count ?? 0}/{coupon.usage_limit ?? '∞'}</p>
              </div>
              <p className="mt-3 text-[13px] text-slate-500">
                Hết hạn: {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('vi-VN') : 'Không hạn'}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AvailableCoupons;
