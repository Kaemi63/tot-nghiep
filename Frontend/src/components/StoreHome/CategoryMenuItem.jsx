import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * CategoryMenuItem – a nav button that shows a mega-menu dropdown on hover.
 * The menu automatically flips direction (up/down) based on available viewport space.
 *
 * Props:
 *   cat         – { id, label, icon, color, items: [{ group, links[] }] }
 *   onFilterCategory(id) – called when a sub-link is clicked
 *   onOpenListing(id)    – called to navigate to listing page
 */
const CategoryMenuItem = ({ cat, onFilterCategory, onOpenListing }) => {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const btnRef = useRef(null);
  const timerRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timerRef.current);
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropUp(window.innerHeight - rect.bottom < 340);
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const handleMenuEnter = useCallback(() => clearTimeout(timerRef.current), []);
  const handleMenuLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Premium Trigger button */}
      <button
        ref={btnRef}
        onClick={() => onOpenListing(cat.id)}
        className={`
          relative group flex items-center justify-between w-full p-4 md:p-5 rounded-3xl
          bg-white border-2 overflow-hidden shadow-sm hover:shadow-xl
          transition-all duration-400 ease-out
          ${open ? 'border-indigo-300 shadow-lg scale-[1.02]' : 'border-slate-100 hover:border-indigo-200 hover:-translate-y-1'}
        `}
      >
        {/* Background glow effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

        <div className="flex items-center relative z-10">
          <span className="font-black text-lg text-slate-800 uppercase tracking-widest group-hover:text-indigo-700 transition-colors">
            {cat.label}
          </span>
        </div>
        
        <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors`}>
          <svg
            className={`w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-300
              ${open ? (dropUp ? 'rotate-0' : 'rotate-180') : (dropUp ? 'rotate-180' : 'rotate-0')}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Mega dropdown panel */}
      <div
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
        className={`
          absolute left-0 z-50 w-[520px] rounded-2xl border border-slate-200 bg-white shadow-2xl
          transition-all duration-200 origin-top
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}
        `}
      >
        {/* Coloured accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${cat.color} rounded-t-2xl`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-black text-slate-800 text-base uppercase tracking-widest">{cat.label}</h3>
            <button
              onClick={() => { onOpenListing(cat.id); setOpen(false); }}
              className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${cat.color} text-white hover:opacity-80 transition-opacity`}
            >
              Xem tất cả →
            </button>
          </div>

          {/* Sub-category links */}
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            {cat.items.map((group) => (
              <div key={group.group}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {group.group}
                </p>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => {
                          onFilterCategory(cat.id + '_' + link.toLowerCase().replace(/\s/g, '-'));
                          setOpen(false);
                        }}
                        className="text-sm text-slate-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-150 block"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => { onOpenListing(cat.id); setOpen(false); }}
              className={`w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${cat.color} hover:opacity-90 transition-opacity`}
            >
              Xem tất cả {cat.label} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenuItem;
