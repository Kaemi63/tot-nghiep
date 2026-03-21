import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';

const FormRegister = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    onRegister({ email, username, password });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-neutral-700" htmlFor="email">Email</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Username Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-neutral-700" htmlFor="username">Username</label>
        <div className="relative">
          <input
            id="username"
            type="text"
            required
            placeholder="Tên đăng nhập của bạn"
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-neutral-700" htmlFor="password">Mật khẩu</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
          <button
            type="button"
            className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-neutral-700" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
          <button
            type="button"
            className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-200"
      >
        Đăng ký
      </button>
    </form>
  );
};

export default FormRegister;
