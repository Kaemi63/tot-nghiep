import React from 'react';
import AvailableCoupons from './AvailableCoupons';
import UsedCoupons from './UsedCoupons';

const CouponsTab = ({ availableCoupons, usedCoupons, loadingCoupons }) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <AvailableCoupons coupons={availableCoupons} loading={loadingCoupons} />
        <UsedCoupons coupons={usedCoupons} loading={loadingCoupons} />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Lưu ý: mỗi mã chỉ được áp dụng một lần cho một tài khoản. Nếu bạn đã dùng mã cho đơn hàng trước đó, hệ thống sẽ không chấp nhận áp dụng lại.
      </div>
    </div>
  );
};

export default CouponsTab;
