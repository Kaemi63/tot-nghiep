import React from 'react';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist, onAddReview }) => {
  const [review, setReview] = React.useState({ rating: 5, comment: '', images: '' });
  if (!product) return null;

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6">
        <button onClick={onBack} className="mb-4 rounded-lg border border-slate-300 px-4 py-2 text-sm">← Quay lại</button>
        <div className="grid gap-6 lg:grid-cols-2">
          <img src={product.image} alt={product.name} className="h-96 w-full object-cover rounded-2xl border" />
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-lg text-indigo-600 font-bold">{product.price}</p>
            <p className="text-sm text-slate-500 mt-1">Thương hiệu: {product.brand}</p>
            <p className="text-sm text-slate-500 mt-1">Tồn kho: {product.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
            <p className="mt-3 text-slate-600">{product.description || 'Đây là sản phẩm thời trang cao cấp phù hợp phong cách hiện đại.'}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-slate-700">Cấu hình kỹ thuật</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-600">
                <li>Màu sắc: {product.colors?.join(', ') || 'Đen'}</li>
                <li>Chất liệu: Cotton, Denim</li>
                <li>Số lượng trong kho: {product.reviewCount || 99}</li>
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => onAddToCart && onAddToCart(product)} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Thêm vào giỏ hàng</button>
              <button onClick={() => onAddToWishlist && onAddToWishlist(product)} className="rounded-xl border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">Yêu thích</button>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              {(product.sizes || ['S', 'M', 'L']).map((size) => (
                <span key={size} className="rounded-full border border-slate-300 px-3 py-1 text-sm">{size}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Đánh giá / Bình luận</h2>
          <div className="mt-4 space-y-4">
            <article className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-semibold">Nguyễn Văn A - ⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-slate-600">Sản phẩm rất đẹp, chất lượng vượt trội, giao hàng nhanh.</p>
            </article>
            <article className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="font-semibold">Trần Thị B - ⭐⭐⭐⭐</p>
              <p className="text-sm text-slate-600">Màu phù hợp, vải mát, chỉ hơi chật ở tay.</p>
            </article>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold mb-3">Gửi đánh giá của bạn</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddReview && onAddReview(product.id, review);
              setReview({ rating: 5, comment: '', images: '' });
              alert('Cảm ơn bạn đã góp ý!');
            }} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Đánh giá sao</label>
                <select value={review.rating} onChange={(e) => setReview((p) => ({ ...p, rating: Number(e.target.value) }))} className="ml-2 rounded-lg border px-2 py-1">
                  {[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} sao</option>)}
                </select>
              </div>
              <textarea value={review.comment} onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))} placeholder="Viết nhận xét" className="w-full rounded-lg border px-3 py-2" required />
              <input type="text" placeholder="URL hình ảnh (tùy chọn)" value={review.images} onChange={(e) => setReview((p) => ({ ...p, images: e.target.value }))} className="w-full rounded-lg border px-3 py-2" />
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Gửi đánh giá</button>
            </form>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map((idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-3 bg-white">
                <p className="text-sm font-semibold">Sản phẩm liên quan {idx}</p>
                <p className="text-xs text-slate-500">Guarded by default image</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
