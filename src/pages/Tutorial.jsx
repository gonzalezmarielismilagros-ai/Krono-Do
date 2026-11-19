import React, { useState } from "react";
export default function Tutorial({ onFinish }) {
  // pasitos del onboarding, no olvidar cambiar textos si piden feedback
  const [idx, setIdx] = useState(0);
  const data = [
    { title: "Control total de tu tiempo", desc: "Suelta tus ideas y organiza todo en segundos sin estresarte." },
    { title: "Enfoque absoluto", desc: "Visualiza únicamente lo que te toca hacer en este preciso instante." },
    { title: "Flexibilidad real", desc: "El sistema se adapta a tus cambios de planes de forma natural." }
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 text-center">
      <div className="mt-12">
        <h1 className="font-title text-4xl text-[#06B6D4] mb-2 tracking-wider">KRONO DO</h1>
        <p className="text-sm text-[#94A3B8]">Gestión vital inteligente</p>
      </div>
      <div className="glass-card p-6 rounded-2xl w-full max-w-sm my-auto">
        <h2 className="font-title text-2xl mb-4 text-[#F8FAFC]">{data[idx].title}</h2>
        <p className="text-sm text-[#94A3B8]">{data[idx].desc}</p>
        <div className="flex justify-center gap-2 mt-6">
          {data.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[#8B5CF6]" : "w-2 bg-gray-600"}`} />
          ))}
        </div>
      </div>
      <button onClick={() => idx < 2 ? setIdx(idx + 1) : onFinish()} className="w-full max-w-sm py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] font-semibold shadow-lg shadow-purple-500/30 mb-8">
        {idx < 2 ? "Siguiente" : "Empezar"}
      </button>
    </div>
  );
}