import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { Package, Search, Skull, Box, Wrench, Shirt, Laptop, Beaker, HeartPulse, Car } from "lucide-react";

const WarehouseTab = () => {
  const [inventory, setInventory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { id: "all", label: "Wszystko", icon: Search },
    { id: "weapons", label: "Broń", icon: Skull },
    { id: "tools", label: "Narzędzia", icon: Wrench },
    { id: "clothing", label: "Ubiór", icon: Shirt },
    { id: "equipment", label: "Sprzęt", icon: Laptop },
    { id: "chemicals", label: "Chemia", icon: Beaker },
    { id: "medical", label: "Medyczne", icon: HeartPulse }
  ];

  const categoryMapping = {
    "all": "Wszystko",
    "weapons": "Broń",
    "tools": "Narzędzia",
    "clothing": "Ubiór",
    "equipment": "Sprzęt",
    "chemicals": "Chemia",
    "medical": "Medyczne"
  };

  useEffect(() => {
    // Refresh inventory every second
    const interval = setInterval(() => {
      setInventory([...GameState.getInventory()]);
    }, 1000);
    
    // Initial load
    setInventory([...GameState.getInventory()]);
    
    return () => clearInterval(interval);
  }, []);

  const filteredInventory = useMemo(() => {
    if (activeCategory === "all") return inventory;
    return inventory.filter(item => item.category === categoryMapping[activeCategory]);
  }, [inventory, activeCategory]);

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col text-slate-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-agency-main" }),
        "INWENTARZ GŁÓWNY"
      ]}),
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-slate-500", children: [
        "POJEMNOŚĆ: ",
        /* @__PURE__ */ jsx("span", { className: "text-agency-main font-bold", children: "BEZ LIMITU (DEBUG)" })
      ]})
    ]}),

    /* Tabs */
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2", children: 
      categories.map(cat => (
        /* @__PURE__ */ jsxs("button", {
          key: cat.id,
          onClick: () => setActiveCategory(cat.id),
          className: `flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'bg-agency-main/20 text-agency-main border border-agency-main/50' : 'bg-black/40 text-slate-400 border border-transparent hover:bg-black/60 hover:text-slate-300'}`,
          children: [
            /* @__PURE__ */ jsx(cat.icon, { className: "w-4 h-4" }),
            cat.label
          ]
        })
      ))
    }),

    /* Inventory Grid */
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2", children: 
      filteredInventory.length === 0 ? (
        /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
          /* @__PURE__ */ jsx(Box, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest uppercase", children: "Pusty Magazyn w tej Kategorii" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Brak przedmiotów na stanie." })
          ]})
        ]})
      ) : (
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: 
          filteredInventory.map((item, idx) => (
            /* @__PURE__ */ jsxs("div", { key: item.instanceId || idx, className: "bg-agency-panel border border-agency-border rounded p-4 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-agency-main font-bold text-sm", children: item.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono uppercase", children: item.subcategory || item.category })
                ]}),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-white font-mono font-bold text-sm", children: [item.quantity, " ", item.unit || "szt."] }),
                ]})
              ]}),
              (item.attackModes || item.tags || item.description) && (
                /* @__PURE__ */ jsxs("div", { className: "mt-4 text-[10px] text-slate-400 font-mono space-y-1", children: [
                  item.description && /* @__PURE__ */ jsx("p", { className: "mb-2 text-slate-300", children: item.description }),
                  item.attackModes && /* @__PURE__ */ jsxs("p", { children: ["Atak: ", item.attackModes.join(", ")] }),
                  item.tags && /* @__PURE__ */ jsxs("p", { children: ["Tagi: ", item.tags.join(", ")] }),
                  item.condition && /* @__PURE__ */ jsxs("p", { children: ["Stan: ", item.condition, "%"] })
                ]})
              )
            ]})
          ))
        })
      )
    })
  ]});
};

export default WarehouseTab;
