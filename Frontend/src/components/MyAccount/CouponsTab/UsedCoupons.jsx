import React from 'react';

const UsedCoupons = ({ coupons, loading }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-800 mb-4">Mã đã dùng</h3>
      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Đang tải thông tin...
        </div>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-slate-500">Bạn chưa sử dụng mã giảm giá nào.</p>
      ) : (
        <div className="space-y-3">
          {coupons.map((usage) => (
            <div key={usage.id} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-slate-900">{usage.coupons?.code || usage.coupon_id}</p>
                  <p className="text-sm text-slate-500">{usage.coupons?.name || 'Mã giảm giá đã dùng'}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
                  Đã dùng
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-[13px] text-slate-600">
                {usage.coupons?.discount_type && (
                  <p>
                    Giảm: {usage.coupons.discount_type === 'percent'
                      ? `${usage.coupons.discount_value}%`
                      : `${usage.coupons.discount_value.toLocaleString('vi-VN')}₫`}
                  </p>
                )}
                <p>Đơn hàng: #{usage.order_id}</p>
                <p>Thời gian: {usage.created_at ? new Date(usage.created_at).toLocaleString('vi-VN') : '---'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UsedCoupons;
