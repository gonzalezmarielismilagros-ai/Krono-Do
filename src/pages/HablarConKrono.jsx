import React, { useState } from "react";
import { Mic, Send } from "lucide-react";
export default function HablarConKrono() {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("Escribe o dicta lo que tengas pendiente...");
  
  // simulación local mientras conectamos el backend real
  const handleSend = () => {
    if(!text.trim()) return;
    setMsg("Procesando pendientes...");
    setTimeout(() => {
      setMsg("¡Listo! Tareas agregadas a tu lista.");
      setText("");
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-12">
      <div>
        <h1 className="font-title text-2xl text-[#F8FAFC]">Hablar con Krono</h1>
        <p className="text-xs text-[#94A3B8]">Vuelca tus pendientes aquí sin orden previo.</p>
      </div>
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ej: Mañana tengo reunion a las 3, comprar cafe..." className="w-full bg-[#070B19]/50 border border-purple-500/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]" />
        <div className="flex items-center justify-between">
          <button className="p-3 rounded-full bg-purple-600/30 text-purple-300 hover:bg-purple-600/50"><Mic size={20} /></button>
          <button onClick={handleSend} className="py-2 px-4 rounded-xl bg-[#8B5CF6] text-white text-sm font-medium flex items-center gap-2 hover:bg-purple-700"><Send size={16} /> Enviar</button>
        </div>
        <div className="text-center pt-2"><span className="text-xs text-[#06B6D4]">{msg}</span></div>
      </div>
    </div>
  );
}