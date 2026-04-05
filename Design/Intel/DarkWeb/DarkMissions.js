import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Crosshair, ShieldAlert, Eye, Target, Skull } from "lucide-react";

const DarkMissions = () => {
  const [activeTab, setActiveTab] = useState("zabojstwo");

  const tabs = [
    { id: "zabojstwo", label: "Zabójstwo", icon: Skull, desc: "Zlecenie likwidacji celu" },
    { id: "inwigilacja", label: "Inwigilacja", icon: Eye, desc: "Śledzenie i zdobywanie informacji" },
    { id: "zastraszanie", label: "Zastraszanie", icon: ShieldAlert, desc: "Wysyłanie jasnego komunikatu" }
  ];

  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.03]", style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" } }),
    
    /* Header */
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-agency-border pb-4 mb-6 z-10 relative", children: 
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Crosshair, { className: "w-6 h-6 text-red-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "Giełda Zleceń" }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-red-500/70 font-mono", children: "CONTRACT KILLERS & MERCENARIES" })
        ]})
      ]})
    }),

    /* Content Area */
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full z-10 relative", children: [
      
      /* Top Navigation */
      /* @__PURE__ */ jsx("div", { className: "flex gap-4 mb-6", children: 
        tabs.map(tab => (
          /* @__PURE__ */ jsxs("button", {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            className: `flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded border transition-all ${
              activeTab === tab.id 
                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                : 'bg-black/40 border-zinc-800 text-slate-500 hover:border-zinc-600 hover:text-slate-300'
            }`,
            children: [
              /* @__PURE__ */ jsx(tab.icon, { className: "w-6 h-6" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold tracking-widest uppercase text-xs", children: tab.label }),
              /* @__PURE__ */ jsx("span", { className: `text-[9px] font-mono ${activeTab === tab.id ? 'text-red-400/70' : 'text-slate-600'}`, children: tab.desc })
            ]
          })
        ))
      }),

      /* Work Area */
      /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black/50 border border-zinc-900/50 rounded p-6 flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
          /* @__PURE__ */ jsx(Target, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest uppercase", children: "Brak dostępnych wykonawców" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Sieć operacyjna w trakcie kalibracji. Spróbuj powrócić później." })
          ]})
        ]})
      ]})
      
    ]})
  ]});
};

export default DarkMissions;
