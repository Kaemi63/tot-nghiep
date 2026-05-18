import React from 'react';
import CategoryMenuItem from './CategoryMenuItem';

export const NAV_CATEGORIES = [
  {
    id: 'men',
    label: 'Nam',
    icon: '👔',
    color: 'from-blue-500 to-indigo-600',
    slug: 'nam',
    items: [
      {
        group: 'Áo',
        links: [
          { label: 'Áo thun', slug: 'ao-thun-nam' },
          { label: 'Áo sơ mi', slug: 'ao-so-mi-nam' },
          { label: 'Áo polo', slug: 'ao-polo-nam' },
          { label: 'Áo khoác', slug: 'ao-khoac-nam' },
          { label: 'Áo hoodie', slug: 'ao-hoodie-nam' }
        ]
      },
      {
        group: 'Quần',
        links: [
          { label: 'Quần jeans', slug: 'quan-jeans-nam' },
          { label: 'Quần âu', slug: 'quan-au-nam' },
          { label: 'Quần short', slug: 'quan-short-nam' },
          { label: 'Quần kaki', slug: 'quan-kaki-nam' }
        ]
      }
    ],
  },
  {
    id: 'women',
    label: 'Nữ',
    icon: '👗',
    color: 'from-pink-500 to-rose-500',
    slug: 'nu',
    items: [
      {
        group: 'Áo',
        links: [
          { label: 'Áo thun', slug: 'ao-thun-nu' },
          { label: 'Áo sơ mi', slug: 'ao-so-mi-nu' },
          { label: 'Áo croptop', slug: 'ao-croptop' },
          { label: 'Áo blouse', slug: 'ao-blouse' },
          { label: 'Cardigan', slug: 'cardigan' }
        ]
      },
      {
        group: 'Quần & Váy',
        links: [
          { label: 'Quần jeans', slug: 'quan-jeans-nu' },
          { label: 'Chân váy ngắn', slug: 'chan-vay-ngan' },
          { label: 'Chân váy dài', slug: 'chan-vay-dai' }
        ]
      },
      {
        group: 'Đầm',
        links: [
          { label: 'Đầm dự tiệc', slug: 'dam-du-tiec' },
          { label: 'Đầm công sở', slug: 'dam-cong-so' },
          { label: 'Maxi', slug: 'dam-maxi' }
        ]
      }
    ],
  },
  {
    id: 'shoes',
    label: 'Giày',
    icon: '👟',
    color: 'from-amber-500 to-orange-500',
    slug: 'giay',
    items: [
      {
        group: 'Giày Nam',
        links: [
          { label: 'Sneaker', slug: 'giay-nam' },
          { label: 'Giày tây', slug: 'giay-tay' },
          { label: 'Giày lười', slug: 'giay-luoi' }
        ]
      },
      {
        group: 'Giày Nữ',
        links: [
          { label: 'Cao gót', slug: 'giay-cao-got' },
          { label: 'Sandal', slug: 'sandal' },
          { label: 'Sneaker nữ', slug: 'sneaker-nu' }
        ]
      }
    ],
  },
  {
    id: 'accessories',
    label: 'Phụ kiện',
    icon: '👜',
    color: 'from-violet-500 to-purple-600',
    slug: 'phu-kien',
    items: [
      {
        group: 'Túi xách',
        links: [
          { label: 'Túi tote', slug: 'tui-tote' },
          { label: 'Túi đeo chéo', slug: 'tui-deo-cheo' },
          { label: 'Ba lô', slug: 'ba-lo' }
        ]
      },
      {
        group: 'Trang sức',
        links: [
          { label: 'Vòng cổ', slug: 'vong-co' },
          { label: 'Nhẫn', slug: 'nhan' },
          { label: 'Vòng tay', slug: 'vong-tay' }
        ]
      }
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
