import React from "react";
import { Bell, Settings } from "lucide-react";
export default function TopBar({ onOpenNoti, onOpenAjustes }) {
  return (
    <header className="sticky top-0 z-40 glass-card px-4 py-3 flex items-center justify-between border-b border-purple-900/40">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-7 object-contain" />
        <span className="font-title text-lg tracking-wide">Krono Do</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onOpenNoti} className="p-2 rounded-xl bg-purple-950/40 text-purple-300 hover:bg-purple-900/50"><Bell size={18} /></button>
        <button onClick={onOpenAjustes} className="p-2 rounded-xl bg-purple-950/40 text-purple-300 hover:bg-purple-900/50"><Settings size={18} /></button>
      </div>
    </header>
  );
}