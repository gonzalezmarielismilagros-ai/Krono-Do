import React from "react";
export default function Notificaciones({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-3xl w-full max-w-sm space-y-4 border border-purple-500/40">
        <div className="flex justify-between items-center"><h2 className="font-title text-xl text-[#F8FAFC]">Avisos</h2><button onClick={onClose} className="text-gray-400 hover:text-white">✕</button></div>
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-2">
          <p className="text-gray-300">Se ajustó tu horario de lectura para las 6:00 PM.</p>
          <button onClick={onClose} className="w-full py-1.5 bg-[#8B5CF6] text-white rounded-lg font-medium">Entendido</button>
        </div>
      </div>
    </div>
  );
}