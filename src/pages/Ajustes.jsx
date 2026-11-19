import React from "react";
export default function Ajustes({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-3xl w-full max-w-sm space-y-4 border border-purple-500/40">
        <div className="flex justify-between items-center"><h2 className="font-title text-xl text-[#F8FAFC]">Ajustes</h2><button onClick={onClose} className="text-gray-400 hover:text-white">✕</button></div>
        <div className="space-y-3 text-xs">
          <div><label className="text-gray-400 block mb-1">Correo</label><input type="text" defaultValue="milagros@kronodo.app" className="w-full bg-black/40 border border-gray-700 p-2 rounded-xl text-white" /></div>
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-[#8B5CF6] text-white rounded-xl font-medium text-sm mt-4">Guardar</button>
      </div>
    </div>
  );
}