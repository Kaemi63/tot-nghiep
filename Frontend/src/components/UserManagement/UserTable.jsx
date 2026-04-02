import React from 'react';
import { Edit2, Trash2, Calendar, Phone, Mail } from 'lucide-react';

const UserTable = ({ users, loading, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <th className="px-6 py-4">Thành viên</th>
          <th className="px-6 py-4">Liên lạc</th>
          <th className="px-6 py-4">Ngày tham gia</th>
          <th className="px-6 py-4 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading ? (
          <tr><td colSpan="4" className="py-20 text-center text-slate-400 italic font-medium">Đang tải danh sách người dùng...</td></tr>
        ) : users.length === 0 ? (
          <tr><td colSpan="4" className="py-20 text-center text-slate-400 italic font-medium">Không tìm thấy dữ liệu phù hợp.</td></tr>
        ) : (
          users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/80 transition-all group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt="" />
                  ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {user.fullname?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.fullname || 'Chưa đặt tên'}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 flex items-center gap-2"><Mail size={14} className="text-slate-300"/>{user.email}</p>
                  <p className={`text-[11px] flex items-center gap-2 ${user.phone ? 'text-slate-500' : 'text-slate-300 italic'}`}>
                    <Phone size={12} /> {user.phone || 'Chưa cập nhật SĐT'}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-300" />
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Chỉnh sửa / Xem chi tiết"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Xóa người dùng"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default UserTable;