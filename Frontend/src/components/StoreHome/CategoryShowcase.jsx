import React from 'react';
import CategoryMenuItem from './CategoryMenuItem';

export const NAV_CATEGORIES = [
  {
    id: 'men',
    label: 'Nam',
    icon: '👔',
    color: 'from-blue-500 to-indigo-600',
    slug: 'mens-fashion',
    items: [
      {
        group: 'Áo',
        links: [
          { label: 'Áo thun', slug: 'mens-tshirt' },
          { label: 'Áo sơ mi', slug: 'mens-shirt' },
          { label: 'Áo polo', slug: 'mens-polo' },
          { label: 'Áo khoác', slug: 'coats-jackets' },
          { label: 'Áo hoodie', slug: 'mens-hoodies' }
        ]
      },
      {
        group: 'Quần',
        links: [
          { label: 'Quần jeans', slug: 'mens-jeans' },
          { label: 'Quần âu', slug: 'mens-dress-pants' },
          { label: 'Quần short', slug: 'mens-shorts' },
          { label: 'Quần kaki', slug: 'mens-chinos' }
        ]
      },
      {
        group: 'Giày',
        links: [
          { label: 'Sneaker', slug: 'sneakers' },
          { label: 'Giày tây', slug: 'oxfords-derbies' },
          { label: 'Giày lười', slug: 'loafers' },
          { label: 'Giày thể thao', slug: 'mens-sports-shoes' }
        ]
      }
    ],
  },
  {
    id: 'women',
    label: 'Nữ',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
    slug: 'womens-fashion',
    items: [
      {
        group: 'Áo',
        links: [
          { label: 'Áo thun', slug: 'womens-tshirt' },
          { label: 'Áo sơ mi', slug: 'womens-shirt' },
          { label: 'Áo croptop', slug: 'womens-croptop' },
          { label: 'Áo blouse', slug: 'womens-blouse' },
          { label: 'Đồ dệt kim', slug: 'knitwear' }
        ]
      },
      {
        group: 'Quần & Váy',
        links: [
          { label: 'Quần jeans', slug: 'womens-jeans' },
          { label: 'Chân váy ngắn', slug: 'womens-mini-skirt' },
          { label: 'Chân váy dài', slug: 'womens-maxi-skirt' },
          { label: 'Quần legging', slug: 'womens-leggings' }
        ]
      },
      {
        group: 'Đầm',
        links: [
          { label: 'Đầm dự tiệc', slug: 'womens-party-dress' },
          { label: 'Đầm công sở', slug: 'womens-office-dress' },
          { label: 'Maxi', slug: 'womens-maxi-dress' }
        ]
      },
      {
        group: 'Giày',
        links: [
          { label: 'Sneaker', slug: 'womens-sneakers' },
          { label: 'Cao gót', slug: 'womens-heels' },
          { label: 'Sandal', slug: 'womens-sandals' },
          { label: 'Giày thể thao', slug: 'womens-sports-shoes' }
        ]
      }
    ],
  },
  {
    id: 'leather',
    label: 'Đồ da',
    icon: '👜',
    color: 'from-amber-500 to-orange-500',
    slug: 'leather-goods',
    items: [
      {
        group: 'Túi xách',
        links: [
          { label: 'Túi tote', slug: 'leather-tote' },
          { label: 'Túi đeo chéo', slug: 'leather-shoulder-bag' },
          { label: 'Ba lô', slug: 'leather-backpack' },
          { label: 'Ví da', slug: 'leather-wallet' }
        ]
      },
      {
        group: 'Phụ kiện da',
        links: [
          { label: 'Thắt lưng', slug: 'leather-belt' },
          { label: 'Giày da', slug: 'leather-shoes' },
          { label: 'Áo khoác da', slug: 'leather-jacket' },
          { label: 'Phụ kiện nhỏ', slug: 'leather-accessories' }
        ]
      }
    ],
  },
  {
    id: 'jewelry',
    label: 'Trang sức',
    icon: '💍',
    color: 'from-violet-500 to-purple-600',
    slug: 'jewelry',
    items: [
      {
        group: 'Trang sức',
        links: [
          { label: 'Vòng tay', slug: 'bracelets' },
          { label: 'Dây chuyền', slug: 'necklaces' },
          { label: 'Bông tai', slug: 'earrings' },
          { label: 'Nhẫn', slug: 'rings' }
        ]
      },
      {
        group: 'Bộ sưu tập',
        links: [
          { label: 'Mặt dây chuyền', slug: 'pendants' },
          { label: 'Bộ trang sức', slug: 'jewelry-sets' },
          { label: 'Phụ kiện trang sức', slug: 'jewelry-accessories' },
          { label: 'Trang sức cưới', slug: 'bridal-jewelry' },
          { label: 'Nước hoa', slug: 'fragrance' }
        ]
      }
    ],
  }
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
