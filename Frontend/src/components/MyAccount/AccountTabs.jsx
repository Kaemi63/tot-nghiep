import React from 'react';

const AccountTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-slate-100 border-b border-slate-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === tab.id 
              ? 'text-indigo-700 bg-white border-b-2 border-indigo-500' 
              : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AccountTabs;