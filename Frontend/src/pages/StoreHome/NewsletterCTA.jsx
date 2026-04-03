import React, { useState } from 'react';

/**
 * NewsletterCTA – email subscription section at the bottom of the page.
 */
const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to Supabase or email provider
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center shadow-2xl">
      <h2 className="text-3xl font-extrabold text-white">Đăng ký nhận ưu đãi</h2>
      <p className="text-slate-400 mt-2 text-sm">
        Nhận thông báo về các deal hot, bộ sưu tập mới và xu hướng mới nhất.
      </p>

      {submitted ? (
        <p className="mt-6 text-emerald-400 font-semibold text-sm">
          ✓ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn..."
            required
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-colors"
          >
            Đăng ký
          </button>
        </form>
      )}
    </section>
  );
};

export default NewsletterCTA;
