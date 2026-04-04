import React from 'react';
import CategoryMenuItem from './CategoryMenuItem';

export const NAV_CATEGORIES = [
  {
    id: 'men',
    label: 'Nam',
    icon: '👔',
    color: 'from-blue-500 to-indigo-600',
    items: [
      { group: 'Áo', links: ['Áo thun', 'Áo sơ mi', 'Áo polo', 'Áo khoác', 'Áo hoodie', 'Áo len'] },
      { group: 'Quần', links: ['Quần jeans', 'Quần âu', 'Quần short', 'Quần jogger', 'Quần kaki'] },
      { group: 'Phong cách', links: ['Streetwear', 'Smart Casual', 'Công sở', 'Thể thao', 'Outdoor'] },
    ],
  },
  {
    id: 'women',
    label: 'Nữ',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
    items: [
      { group: 'Áo', links: ['Áo thun', 'Áo sơ mi', 'Áo croptop', 'Áo blouse', 'Áo khoác', 'Cardigan'] },
      { group: 'Quần & Váy', links: ['Quần jeans', 'Quần palazzo', 'Chân váy ngắn', 'Chân váy dài', 'Overalls'] },
      { group: 'Đồ bộ & Dress', links: ['Đầm dự tiệc', 'Đầm công sở', 'Set bộ', 'Jumpsuit', 'Maxi'] },
    ],
  },
  {
    id: 'shoes',
    label: 'Giày',
    icon: '👟',
    color: 'from-amber-500 to-orange-500',
    items: [
      { group: 'Giày Nam', links: ['Sneaker', 'Giày tây', 'Giày lười', 'Giày thể thao', 'Boot'] },
      { group: 'Giày Nữ', links: ['Cao gót', 'Sandal', 'Sneaker nữ', 'Giày bệt', 'Mules'] },
      { group: 'Thể thao', links: ['Chạy bộ', 'Training', 'Bóng rổ', 'Bóng đá'] },
    ],
  },
  {
    id: 'accessories',
    label: 'Phụ kiện',
    icon: '👜',
    color: 'from-violet-500 to-purple-600',
    items: [
      { group: 'Túi xách', links: ['Túi tote', 'Túi đeo chéo', 'Ba lô', 'Clutch', 'Túi xách tay'] },
      { group: 'Trang sức', links: ['Vòng cổ', 'Nhẫn', 'Vòng tay', 'Bông tai', 'Ghim cài'] },
      { group: 'Khác', links: ['Mũ & Nón', 'Thắt lưng', 'Ví', 'Kính mắt', 'Khăn quàng'] },
    ],
  },
];

const CategoryShowcase = ({ onOpenListing, onFilterCategory }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Danh mục sản phẩm</h2>
          <p className="text-sm text-slate-500 mt-0.5">Di chuột vào để mở rộng chi tiết danh mục</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {NAV_CATEGORIES.map((cat) => (
          <CategoryMenuItem
            key={cat.id}
            cat={cat}
            onFilterCategory={onFilterCategory}
            onOpenListing={onOpenListing}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
