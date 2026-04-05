import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { CreditCard, ShoppingCart, Search, Skull, Wrench, Shirt, Laptop, Beaker, HeartPulse, Car } from "lucide-react";
import { DARK_WEB_ITEMS } from "./items.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
import { GameState } from "../../../Scripts/App/GameState.js";

const DarkShop = () => {
  const { playerBalance, updateBalance } = useGame();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Wszystko", icon: Search },
    { id: "weapons", label: "Broń", icon: Skull },
    { id: "tools", label: "Narzędzia", icon: Wrench },
    { id: "clothing", label: "Ubiór", icon: Shirt },
    { id: "equipment", label: "Sprzęt", icon: Laptop },
    { id: "chemicals", label: "Chemia", icon: Beaker },
    { id: "medical", label: "Medyczne", icon: HeartPulse },
    { id: "vehicles", label: "Pojazdy", icon: Car },
  ];

  const categoryMapping = {
    "all": "Wszystko",
    "weapons": "Broń",
    "tools": "Narzędzia",
    "clothing": "Ubiór",
    "equipment": "Sprzęt",
    "chemicals": "Chemia",
    "medical": "Medyczne",
    "vehicles": "Pojazdy",
  };

  const filteredItems = useMemo(() => {
    let items = DARK_WEB_ITEMS;
    if (activeCategory !== "all") {
       items = items.filter(item => item.category === categoryMapping[activeCategory]);
    }
    if (searchQuery.trim() !== "") {
       const q = searchQuery.toLowerCase();
       items = items.filter(item => item.name.toLowerCase().includes(q));
    }
    return items;
  }, [activeCategory, searchQuery]);

  const handlePurchase = (item) => {
    if (playerBalance < item.price) {
      alert("BRAK ŚRODKÓW: Nie masz wystarczająco pieniędzy, aby zakupić ten przedmiot.");
      return;
    }

    let success = false;
    if (item.category === "Pojazdy") {
      success = GameState.addVehicleToGarage({
        marketId: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
      });
      if (!success) {
        alert("BŁĄD: Brak miejsca w Garażu!");
        return;
      }
    } else {
      success = GameState.addItemToInventory({
        instanceId: crypto.randomUUID(),
        marketId: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        quantity: 1,
        unit: item.unit || "szt.",
        isStackable: true,
        description: item.description,
        attackModes: item.attackModes,
        tags: item.tags || [item.category, item.subcategory].filter(Boolean)
      });
      if (!success) {
        alert("BŁĄD: Brak miejsca w Magazynie!");
        return;
      }
    }

    updateBalance(-item.price);
  };

  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.03]", style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" } }),
    
    /* Header */
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-agency-border pb-4 mb-6 z-10 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "w-6 h-6 text-emerald-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "Czarny Rynek" }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-emerald-500/70 font-mono", children: "ANONYMOUS P2P MARKETPLACE" })
        ]})
      ]}),
      /* Search Input */
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
         /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" }),
         /* @__PURE__ */ jsx("input", {
            type: "text",
            placeholder: "Szukaj po nazwie...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "bg-black/40 border border-emerald-500/30 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors w-64 font-mono uppercase placeholder:text-zinc-600"
         })
      ]})
    ]}),

    /* Content Area */
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6 h-full z-10 relative overflow-hidden", children: [
      
      /* Left Sidebar - Categories */
      /* @__PURE__ */ jsxs("div", { className: "w-48 flex flex-col gap-2 shrink-0 overflow-y-auto pr-2 custom-scrollbar", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest pl-2 border-l-2 border-slate-700", children: "Kategorie" }),
        ...categories.map(cat => (
          /* @__PURE__ */ jsxs("button", {
            key: cat.id,
            onClick: () => setActiveCategory(cat.id),
            className: `flex items-center gap-3 w-full p-3 rounded text-xs font-bold transition-colors ${activeCategory === cat.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-black/40 text-slate-400 border border-transparent hover:bg-black/60 hover:text-slate-300'}`,
            children: [
              /* @__PURE__ */ jsx(cat.icon, { className: "w-4 h-4" }),
              cat.label
            ]
          })
        ))
      ]}),

      /* Right Side - Items Grid */
      /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black/40 border border-zinc-900/50 rounded p-4 overflow-y-auto custom-scrollbar", children: [
        filteredItems.length === 0 ? (
          /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
            /* @__PURE__ */ jsx(ShoppingCart, { className: "w-16 h-16" }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest", children: "BRAK OFERT" }),
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Obecnie brak przedmiotów w tej kategorii." })
            ]})
          ]})
        ) : (
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: 
            filteredItems.map(item => (
              /* @__PURE__ */ jsxs("div", { key: item.id, className: "bg-agency-darker border border-agency-border rounded p-4 flex flex-col hover:border-emerald-500/30 transition-colors group", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-emerald-400 font-bold text-sm group-hover:text-emerald-300 transition-colors", children: item.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono uppercase", children: item.subcategory || item.category })
                  ]}),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-white font-mono font-bold text-sm", children: ["$", item.price.toLocaleString()] }),
                    (item.capacity || item.unit) && /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-slate-500 font-mono", children: [item.capacity, " ", item.unit] })
                  ]})
                ]}),
                item.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-2 mb-4 flex-1", children: item.description }),
                /* @__PURE__ */ jsxs("button", { 
                  onClick: () => handlePurchase(item),
                  className: "mt-auto w-full py-2 bg-black/40 hover:bg-emerald-500/20 text-emerald-500/70 hover:text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2", 
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "w-3 h-3" }),
                    " Kup"
                  ]
                })
              ]})
            ))
          })
        )
      ]})
      
    ]})
  ]});
};

export default DarkShop;
