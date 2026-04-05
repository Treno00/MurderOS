import { useState, useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Zap, Crosshair, Key, Skull, Trash2, Brush } from "lucide-react";
import ActionPlanning from "./ActionPlanning.js";
import ActionBreach from "./ActionBreach.js";
import ActionElimination from "./ActionElimination.js";
import ActionDisposal from "./ActionDisposal.js";
import ActionCleanup from "./ActionCleanup.js";

const ActionDashboard = () => {
  const [activeTab, setActiveTab] = useState("PLANOWANIE");

  const tabs = [
    { id: "PLANOWANIE", label: "Planowanie", icon: Crosshair },
    { id: "WLAMANIE", label: "Włamanie", icon: Key },
    { id: "ELIMINACJA", label: "Eliminacja", icon: Skull },
    { id: "UTYLIZACJA", label: "Utylizacja", icon: Trash2 },
    { id: "SPRZATANIE", label: "Sprzątanie", icon: Brush }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "PLANOWANIE": return /* @__PURE__ */ jsx(ActionPlanning, { onComplete: () => setActiveTab("WLAMANIE") });
      case "WLAMANIE": return /* @__PURE__ */ jsx(ActionBreach, { onComplete: () => setActiveTab("ELIMINACJA") });
      case "ELIMINACJA": return /* @__PURE__ */ jsx(ActionElimination, { onComplete: () => setActiveTab("UTYLIZACJA") });
      case "UTYLIZACJA": return /* @__PURE__ */ jsx(ActionDisposal, { onComplete: () => setActiveTab("SPRZATANIE") });
      case "SPRZATANIE": return /* @__PURE__ */ jsx(ActionCleanup, { onComplete: () => setActiveTab("PLANOWANIE") });
      default: return null;
    }
  };

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-agency-black", children: [
    /* Header */
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-agency-border bg-agency-dark shrink-0", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-agency-main font-bold tracking-widest uppercase text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" }),
        "CENTRUM OPERACJI ZBROJNYCH"
      ]})
    ]}),

    /* Top Navigation Tabs */
    /* @__PURE__ */ jsx("div", { className: "flex border-b border-agency-border bg-agency-dark/50 shrink-0", children: 
      tabs.map((tab, index) => /* @__PURE__ */ jsxs("div", {
        key: tab.id,
        className: `flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all
          ${activeTab === tab.id 
            ? 'bg-agency-main/10 border-b-2 border-agency-main text-agency-main' 
            : 'text-slate-500 opacity-50 border-b-2 border-transparent relative'}
        `,
        children: [
          /* @__PURE__ */ jsx(tab.icon, { className: "w-4 h-4" }),
          tab.label,
          index < tabs.length - 1 && activeTab !== tab.id && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-1/4 bottom-1/4 w-px bg-agency-border/50" })
        ]
      }))
    }),

    /* Content Area */
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden p-6 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 opacity-[0.02] pointer-events-none", children: 
        /* @__PURE__ */ jsx("div", { className: "h-full w-full", style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)", backgroundSize: "100% 4px" }})
      }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 h-full", children: renderContent() })
    ]})
  ]});
};

export default ActionDashboard;
