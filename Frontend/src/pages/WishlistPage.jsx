import React from 'react';

const WishlistPage = ({ items, onAddToCart, onRemove }) => {
  if (!items.length) {
    return <div className="h-full overflow-y-auto bg-white p-6"><div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">Danh sách yêu thích trống.</div></div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm yêu thích</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4 flex items-center gap-4 bg-white">
            <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-slate-500">{item.brand}</p>
              <p className="text-indigo-600 font-bold">{item.price.toLocaleString('vi-VN')}₫</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onAddToCart(item)} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Thêm giỏ hàng</button>
              <button onClick={() => onRemove(item.id)} className="rounded-lg border border-red-500 px-3 py-2 text-red-500">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
