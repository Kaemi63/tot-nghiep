import React from 'react';
import { Search, Filter, UserPlus, RefreshCw } from 'lucide-react';

const UserFilters = ({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, onSearch, onAddClick, onRefresh, loading }) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <div className="flex flex-1 w-full gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all shadow-sm"
          placeholder="Tìm kiếm theo tên, email hoặc username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 border border-slate-200 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-sm"
        title="Làm mới danh sách"
      >
        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
      </button>
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <Filter size={18} className="text-slate-400" />
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          className="bg-transparent outline-none text-sm font-bold text-slate-600 cursor-pointer min-w-[100px]"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      
      <button 
        onClick={onAddClick} 
        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all whitespace-nowrap active:scale-95"
      >
        <UserPlus size={18} /> 
        <span>Thêm mới</span>
      </button>
    </div>
  </div>
);

export default UserFilters;