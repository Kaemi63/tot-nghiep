import React from 'react';

const PasswordChangeForm = ({ passwordData, setPasswordData, onSubmit, isSaving }) => {
  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5 animate-in fade-in duration-500">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu hiện tại</label>
        <input 
          type="password" 
          value={passwordData.current} 
          onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Nhập mật khẩu đang dùng"
          required 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu mới</label>
        <input 
          type="password" 
          value={passwordData.newPass} 
          onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Tối thiểu 6 ký tự"
          required 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Xác nhận mật khẩu mới</label>
        <input 
          type="password" 
          value={passwordData.confirm} 
          onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} 
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="Nhập lại mật khẩu mới"
          required 
        />
      </div>
      <div className="pt-4">
        <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all">
          {isSaving ? 'Đang xác thực...' : 'Cập nhật mật khẩu'}
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;