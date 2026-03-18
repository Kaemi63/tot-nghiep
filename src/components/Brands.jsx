import React from 'react';

const Brands = () => {
  const brands = ['Shopify', 'Amazon', 'Tiki', 'Lazada', 'Haravan', 'Squarespace', 'PrestaShop'];

  return (
    <section className="py-16 border-t border-black/5 bg-white w-full">
      <div className="max-w-[1200px] mx-auto flex justify-center items-center flex-wrap gap-8 md:gap-12 px-8 opacity-60 grayscale transition-all duration-300 hover:opacity-80">
        {brands.map((brand) => (
          <div key={brand} className="font-bold text-xl text-slate-700 tracking-[-0.5px]">
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
