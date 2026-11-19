const fs = require("fs");
["public", "src/pages", "src/components"].forEach(d => fs.mkdirSync(d, { recursive: true }));

fs.writeFileSync("package.json", JSON.stringify({
  name: "krono-do",
  private: true,
  version: "1.0.0",
  type: "module",
  scripts: { dev: "vite", build: "vite build" },
  dependencies: { react: "^18.2.0", "react-dom": "^18.2.0", "lucide-react": "^0.294.0" },
  devDependencies: {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    autoprefixer: "^10.4.18",
    postcss: "^8.4.35",
    tailwindcss: "^3.4.1",
    vite: "^5.1.6"
  }
}, null, 2));

fs.writeFileSync("postcss.config.js", `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`);
fs.writeFileSync("tailwind.config.js", `export default { content: ["./index.html", "./src/**/*.{js,jsx}"], theme: { extend: {} }, plugins: [] };`);
fs.writeFileSync("vite.config.js", `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });`);

fs.writeFileSync("index.html", `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Krono Do</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#070B19] text-[#F8FAFC] font-['Poppins']">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

fs.writeFileSync("src/index.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Gulfs Display";
  src: url("https://fonts.cdnfonts.com/s/79782/GulfsDisplay-Regular.woff") format("woff");
}

.font-title { font-family: "Gulfs Display", sans-serif; }

body {
  background: radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
              linear-gradient(135deg, #070B19 0%, #160B2E 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

.glass-card {
  background: rgba(19, 24, 48, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 92, 246, 0.3);
}`);

fs.writeFileSync("src/main.jsx", `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// TODO: revisar si tira warning de strictmode despues
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

fs.writeFileSync("src/App.jsx", `import React, { useState } from "react";
import Tutorial from "./pages/Tutorial";
import Login from "./pages/Login";
import HablarConKrono from "./pages/HablarConKrono";
import Ahora from "./pages/Ahora";
import Panorama from "./pages/Panorama";
import Notificaciones from "./pages/Notificaciones";
import Ajustes from "./pages/Ajustes";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";

export default function App() {
  // manejando estados basicos de la sesion
  const [step, setStep] = useState("tutorial");
  const [activeTab, setActiveTab] = useState("ahora");
  const [modal, setModal] = useState(null);

  if (step === "tutorial") return <Tutorial onFinish={() => setStep("login")} />;
  if (step === "login") return <Login onLoginSuccess={() => setStep("app")} />;

  return (
    <div className="min-h-screen pb-24 text-[#F8FAFC] relative">
      <TopBar onOpenNoti={() => setModal("noti")} onOpenAjustes={() => setModal("ajustes")} />
      <main className="max-w-md mx-auto pt-4 px-4">
        {activeTab === "hablar" && <HablarConKrono />}
        {activeTab === "ahora" && <Ahora />}
        {activeTab === "panorama" && <Panorama />}
      </main>
      {modal === "noti" && <Notificaciones onClose={() => setModal(null)} />}
      {modal === "ajustes" && <Ajustes onClose={() => setModal(null)} />}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}`);

fs.writeFileSync("src/pages/Tutorial.jsx", `import React, { useState } from "react";
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
            <span key={i} className={\`h-2 rounded-full transition-all \${i === idx ? "w-6 bg-[#8B5CF6]" : "w-2 bg-gray-600"}\`} />
          ))}
        </div>
      </div>
      <button onClick={() => idx < 2 ? setIdx(idx + 1) : onFinish()} className="w-full max-w-sm py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] font-semibold shadow-lg shadow-purple-500/30 mb-8">
        {idx < 2 ? "Siguiente" : "Empezar"}
      </button>
    </div>
  );
}`);

fs.writeFileSync("src/pages/Login.jsx", `import React from "react";
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
}`);

fs.writeFileSync("src/components/TopBar.jsx", `import React from "react";
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
}`);

fs.writeFileSync("src/components/BottomNav.jsx", `import React from "react";
import { MessageSquare, Zap, Calendar } from "lucide-react";
export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card py-2 px-6 flex justify-around items-center border-t border-purple-900/50 z-40">
      <button onClick={() => setActiveTab("hablar")} className={\`flex flex-col items-center gap-1 \${activeTab === "hablar" ? "text-[#06B6D4]" : "text-gray-400"}\`}>
        <MessageSquare size={20} /><span className="text-[10px]">Hablar</span>
      </button>
      <button onClick={() => setActiveTab("ahora")} className="relative -top-4 w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white shadow-lg shadow-purple-500/40 border-4 border-[#070B19]">
        <Zap size={24} />
      </button>
      <button onClick={() => setActiveTab("panorama")} className={\`flex flex-col items-center gap-1 \${activeTab === "panorama" ? "text-[#06B6D4]" : "text-gray-400"}\`}>
        <Calendar size={20} /><span className="text-[10px]">Panorama</span>
      </button>
    </nav>
  );
}`);

fs.writeFileSync("src/pages/HablarConKrono.jsx", `import React, { useState } from "react";
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
}`);

fs.writeFileSync("src/pages/Ahora.jsx", `import React, { useState } from "react";
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
          <button key={lvl} onClick={() => setEnergy(lvl)} className={\`flex-1 py-2 text-xs rounded-xl border transition \${energy === lvl ? "bg-purple-600/40 border-[#8B5CF6] text-white" : "glass-card text-gray-400"}\`}>
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
                <button onClick={() => toggleCheck(t.id)} className={\`text-lg \${t.done ? "text-green-400" : "text-gray-500"}\`}><CheckCircle size={18} /></button>
                <span className={\`text-sm \${t.done ? "line-through text-gray-500" : "text-white"}\`}>{t.title}</span>
              </div>
              <span className="text-[10px] text-purple-300">{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`);

fs.writeFileSync("src/pages/Panorama.jsx", `import React from "react";
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
}`);

fs.writeFileSync("src/pages/Notificaciones.jsx", `import React from "react";
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
}`);

fs.writeFileSync("src/pages/Ajustes.jsx", `import React from "react";
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
}`);
