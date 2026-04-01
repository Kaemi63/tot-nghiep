import React from 'react';

const ProfileEditForm = ({ editData, setEditData, onSubmit, isSaving }) => {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-500">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Tên đầy đủ</label>
        <input 
          value={editData?.fullname || ''} 
          onChange={(e) => setEditData({...editData, fullname: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
        <input 
          value={editData?.phone || ''} 
          onChange={(e) => setEditData({...editData, phone: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Ngày sinh</label>
        <input 
          type="date" 
          value={editData?.date_of_birth || ''} 
          onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Giới tính</label>
        <select 
          value={editData?.gender || 'Khác'} 
          onChange={(e) => setEditData({...editData, gender: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>
      </div>
      <div className="sm:col-span-2 pt-4">
        <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all">
          {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;