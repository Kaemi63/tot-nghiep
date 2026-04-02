import React from 'react';
import { X, Camera } from 'lucide-react';

const UserEditModal = ({ isOpen, onClose, user, setUser, onSave }) => {
  if (!isOpen) return null;
  
  // Logic: Nếu role là 'user' thì chỉ được xem, không được sửa
  const isReadOnly = user.role === 'user';

  // Hàm tạo ClassName cho input để tránh lặp lại code
  const getInputClass = (locked) => `
    w-full px-4 py-2.5 border rounded-xl outline-none transition-all font-medium
    ${locked 
      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' 
      : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}
  `;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-black text-slate-800">
            {isReadOnly ? "Chi tiết tài khoản" : "Chỉnh sửa người dùng"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium flex justify-between">
            ID: {user.id}
            {isReadOnly && <span className="text-slate-600 font-bold italic uppercase text-[10px]">Thông tin người dùng</span>}
          </p>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* PHẦN AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img 
                src={user.avatar_url || 'https://via.placeholder.com/150'} 
                className={`w-24 h-24 rounded-full object-cover border-4 ${isReadOnly ? 'border-slate-100' : 'border-indigo-50 shadow-md'}`}
                alt="Avatar"
              />
              {!isReadOnly && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={20} />
                </div>
              )}
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
              <input 
                type="text"
                disabled={isReadOnly}
                className={getInputClass(isReadOnly)}
                value={user.fullname || ''} 
                onChange={(e) => setUser({...user, fullname: e.target.value})}
                placeholder="Nhập họ tên..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                type="text"
                disabled={isReadOnly}
                className={getInputClass(isReadOnly)}
                value={user.username || ''} 
                onChange={(e) => setUser({...user, username: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Vai trò</label>
              <select 
                disabled={isReadOnly}
                className={`${getInputClass(isReadOnly)} font-bold text-indigo-600 cursor-pointer`}
                value={user.role || 'user'} 
                onChange={(e) => setUser({...user, role: e.target.value})}
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
            <input 
              type="email"
              disabled={isReadOnly}
              className={getInputClass(isReadOnly)}
              value={user.email || ''} 
              onChange={(e) => setUser({...user, email: e.target.value})}
              placeholder="nhap@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ngày sinh</label>
            <input 
              type="date"
              disabled={isReadOnly}
              className={getInputClass(isReadOnly)}
              value={user.date_of_birth || ''} 
              onChange={(e) => setUser({...user, date_of_birth: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              {isReadOnly ? "Đóng" : "Hủy bỏ"}
            </button>
            
            {!isReadOnly && (
              <button 
                type="submit" 
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                Lưu thay đổi
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;