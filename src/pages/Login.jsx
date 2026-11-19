import React from "react";
export default function Login({ onLoginSuccess }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card p-8 rounded-3xl w-full max-w-sm border border-purple-500/30 shadow-2xl">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Krono Do Logo" className="h-14 object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
        </div>
        <h1 className="font-title text-3xl mb-2 text-[#F8FAFC]">Krono Do</h1>
        <p className="text-xs text-[#94A3B8] mb-8">Acceso a tu espacio de trabajo</p>
        <div className="space-y-3">
          <button onClick={onLoginSuccess} className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition">
            <span>🌐</span> Continuar con Google
          </button>
          <button onClick={onLoginSuccess} className="w-full py-3 px-4 rounded-xl bg-[#1E293B] text-white font-medium flex items-center justify-center gap-3 border border-gray-700 hover:bg-[#273548] transition">
            <span></span> Continuar con Apple
          </button>
        </div>
      </div>
    </div>
  );
}