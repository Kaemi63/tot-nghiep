import React from 'react';

const AdminShell = ({ title, subtitle, actions, children, className = '' }) => (
  <div className={`min-h-full bg-slate-100 py-8 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600 max-w-2xl">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
              {actions}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  </div>
);

export default AdminShell;
