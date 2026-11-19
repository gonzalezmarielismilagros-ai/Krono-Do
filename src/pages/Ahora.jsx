import React, { useState } from "react";
import { Play, CheckCircle, Clock } from "lucide-react";
export default function Ahora() {
  const [energy, setEnergy] = useState("alta");
  const [todoList, setTodoList] = useState([
    { id: 1, title: "Revisar prototipo de hardware", time: "10:00 AM", done: false },
    { id: 2, title: "Avanzar reporte de química", time: "11:30 AM", done: false },
    { id: 3, title: "Entrenamiento físico en casa", time: "05:00 PM", done: false }
  ]);

  const toggleCheck = (id) => setTodoList(todoList.map(item => item.id === id ? {...item, done: !item.done} : item));

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between glass-card p-4 rounded-2xl">
        <div><h1 className="font-title text-xl text-[#F8FAFC]">Modo Ejecución</h1><p className="text-xs text-[#94A3B8]">Tu enfoque para el día de hoy</p></div>
        <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
      </div>
      <div className="flex gap-2">
        {['alta', 'cansado', 'poco tiempo'].map((lvl) => (
          <button key={lvl} onClick={() => setEnergy(lvl)} className={`flex-1 py-2 text-xs rounded-xl border transition ${energy === lvl ? "bg-purple-600/40 border-[#8B5CF6] text-white" : "glass-card text-gray-400"}`}>
            {lvl}
          </button>
        ))}
      </div>
      <div className="glass-card p-4 rounded-2xl border-l-4 border-l-[#06B6D4] space-y-3">
        <div className="flex justify-between items-center text-xs text-[#06B6D4]"><span>SIGUIENTE ACCIÓN</span><span className="flex items-center gap-1"><Clock size={12}/> 45 min</span></div>
        <h2 className="font-semibold text-base">Revisar prototipo de hardware</h2>
        <div className="flex gap-2 pt-1"><button className="flex-1 py-2 rounded-xl bg-[#06B6D4] text-gray-950 font-medium text-xs flex items-center justify-center gap-1"><Play size={14}/> Iniciar</button></div>
      </div>
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <h3 className="font-title text-sm text-[#94A3B8]">TAREAS CLAVE (1-3-5)</h3>
        <div className="space-y-2">
          {todoList.map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-black/20">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleCheck(t.id)} className={`text-lg ${t.done ? "text-green-400" : "text-gray-500"}`}><CheckCircle size={18} /></button>
                <span className={`text-sm ${t.done ? "line-through text-gray-500" : "text-white"}`}>{t.title}</span>
              </div>
              <span className="text-[10px] text-purple-300">{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}