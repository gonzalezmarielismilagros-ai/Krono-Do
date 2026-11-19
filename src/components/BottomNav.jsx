import React from "react";
import { MessageSquare, Zap, Calendar } from "lucide-react";
export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card py-2 px-6 flex justify-around items-center border-t border-purple-900/50 z-40">
      <button onClick={() => setActiveTab("hablar")} className={`flex flex-col items-center gap-1 ${activeTab === "hablar" ? "text-[#06B6D4]" : "text-gray-400"}`}>
        <MessageSquare size={20} /><span className="text-[10px]">Hablar</span>
      </button>
      <button onClick={() => setActiveTab("ahora")} className="relative -top-4 w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white shadow-lg shadow-purple-500/40 border-4 border-[#070B19]">
        <Zap size={24} />
      </button>
      <button onClick={() => setActiveTab("panorama")} className={`flex flex-col items-center gap-1 ${activeTab === "panorama" ? "text-[#06B6D4]" : "text-gray-400"}`}>
        <Calendar size={20} /><span className="text-[10px]">Panorama</span>
      </button>
    </nav>
  );
}