import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const LoginFormFields = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ identifier, password });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-neutral-700" htmlFor="identifier">Email hoặc Username</label>
        <div className="relative">
          <input
            id="identifier"
            type="text"
            required
            placeholder="Username hoặc email của bạn"
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-neutral-700" htmlFor="password">Mật khẩu</label>
          <a href="#" className="text-xs font-semibold text-neutral-500 hover:text-black">Quên mật khẩu?</a>
        </div>
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

      <button
        type="submit"
        className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-200"
      >
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginFormFields;