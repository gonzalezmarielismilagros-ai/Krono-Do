import React from "react";
export default function Panorama() {
  return (
    <div className="space-y-4 pb-12">
      <div><h1 className="font-title text-2xl text-[#F8FAFC]">Panorama</h1><p className="text-xs text-[#94A3B8]">Vista general de tus proyectos y pendientes.</p></div>
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <h3 className="font-title text-sm text-[#06B6D4]">PROYECTOS ACTIVOS</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1"><span>App Krono Do v1</span><span>85%</span></div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] w-[85%]"></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}