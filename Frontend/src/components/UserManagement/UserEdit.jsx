import React from 'react';
import { X, Camera } from 'lucide-react';

const UserEditModal = ({ isOpen, onClose, user, setUser, onSave }) => {
  if (!isOpen || !user) return null;
  
  // Logic quan trọng: Chỉ khóa (ReadOnly) nếu là role 'user' VÀ đã có ID (người dùng cũ)
  // Nếu user.id === '' (đang thêm mới), isReadOnly sẽ là false -> Admin nhập được.
  const isReadOnly = user.role === 'user' && user.id !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const getInputClass = (locked) => `
    w-full px-4 py-2.5 border rounded-xl outline-none transition-all font-medium
    ${locked 
      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' 
      : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}
  `;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-black text-slate-800">
            {user.id === '' ? "Thêm người dùng mới" : (isReadOnly ? "Chi tiết tài khoản" : "Chỉnh sửa người dùng")}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img 
                src={user.avatar_url || 'https://via.placeholder.com/150'} 
                className={`w-24 h-24 rounded-full object-cover border-4 ${isReadOnly ? 'border-slate-100' : 'border-indigo-50 shadow-md'}`}
                alt="Avatar"
              />
            </div>
            {!isReadOnly && (
              <input 
                type="text"
                placeholder="Dán URL ảnh đại diện..."
                className="mt-3 w-full text-[11px] text-center bg-transparent text-indigo-600 outline-none"
                value={user.avatar_url || ''}
                onChange={(e) => setUser({...user, avatar_url: e.target.value})}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Họ và tên</label>
              <input type="text" disabled={isReadOnly} className={getInputClass(isReadOnly)} value={user.fullname || ''} onChange={(e) => setUser({...user, fullname: e.target.value})} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username</label>
              <input type="text" disabled={isReadOnly} className={getInputClass(isReadOnly)} value={user.username || ''} onChange={(e) => setUser({...user, username: e.target.value})} required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Vai trò</label>
              <select disabled={isReadOnly} className={getInputClass(isReadOnly)} value={user.role || 'user'} onChange={(e) => setUser({...user, role: e.target.value})}>
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Địa chỉ Email</label>
            <input type="email" disabled={isReadOnly} className={getInputClass(isReadOnly)} value={user.email || ''} onChange={(e) => setUser({...user, email: e.target.value})} required />
          </div>

          {/* Ô MẬT KHẨU: CHỈ XUẤT HIỆN KHI THÊM MỚI (ID TRỐNG) */}
          {user.id === '' && (
            <div>
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-1.5">Mật khẩu khởi tạo</label>
              <input 
                type="password" 
                className={getInputClass(false)} 
                placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                value={user.password || ''} 
                onChange={(e) => setUser({...user, password: e.target.value})} 
                required 
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Hủy bỏ</button>
            {!isReadOnly && (
              <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
                {user.id === '' ? "Tạo người dùng" : "Lưu thay đổi"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;