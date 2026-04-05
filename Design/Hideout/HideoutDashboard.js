import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Home, Package, Lock, ThermometerSnowflake, CarFront } from "lucide-react";
import WarehouseTab from "./WarehouseTab.js";
import BasementTab from "./BasementTab.js";
import FridgeTab from "./FridgeTab.js";
import GarageTab from "./GarageTab.js";

const HideoutDashboard = () => {
  const [activeTab, setActiveTab] = useState("MAGAZYN");

  const tabs = [
    { id: "MAGAZYN", label: "Magazyn", icon: Package },
    { id: "PIWNICA", label: "Piwnica", icon: Lock },
    { id: "LODOWKA", label: "Lodówka", icon: ThermometerSnowflake },
    { id: "GARAZ", label: "Garaż", icon: CarFront }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "MAGAZYN": return /* @__PURE__ */ jsx(WarehouseTab, {});
      case "PIWNICA": return /* @__PURE__ */ jsx(BasementTab, {});
      case "LODOWKA": return /* @__PURE__ */ jsx(FridgeTab, {});
      case "GARAZ": return /* @__PURE__ */ jsx(GarageTab, {});
      default: return null;
    }
  };

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-agency-black", children: [
    /* Header */
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-agency-border bg-agency-dark shrink-0", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-agency-main font-bold tracking-widest uppercase text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }),
        "KRYJÓWKA: BAZA OPERACYJNA"
      ]})
    ]}),

    /* Top Navigation Tabs */
    /* @__PURE__ */ jsx("div", { className: "flex border-b border-agency-border bg-agency-dark/50 shrink-0", children: 
      tabs.map((tab, index) => /* @__PURE__ */ jsxs("div", {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer hover:bg-agency-main/5
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

export default HideoutDashboard;
