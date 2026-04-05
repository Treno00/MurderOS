import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { ThermometerSnowflake, Droplet } from "lucide-react";

const FridgeTab = () => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setItems([...GameState.getHideoutStorage().fridge]);
    }, 1000);
    
    setItems([...GameState.getHideoutStorage().fridge]);
    return () => clearInterval(interval);
  }, [GameState]);

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col text-slate-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ThermometerSnowflake, { className: "w-5 h-5 text-agency-main" }),
        "CHŁODNIA"
      ]}),
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-slate-500", children: [
        "MIEJSCE: ",
        /* @__PURE__ */ jsxs("span", { className: "text-agency-main font-bold", children: [GameState.getCurrentFridgeUsage(), " / ", GameState.fridgeCapacity] })
      ]})
    ]}),

    /* Fridge Grid */
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2", children: 
      items.length === 0 ? (
        /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
          /* @__PURE__ */ jsx(ThermometerSnowflake, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest", children: "PUSTA CHŁODNIA" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Brak materiałów biologicznych." })
          ]})
        ]})
      ) : (
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: 
          items.map(item => (
            /* @__PURE__ */ jsxs("div", { key: item.id, className: "bg-agency-panel border border-agency-border rounded p-4 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                   item.type === "BLOOD" ? /* @__PURE__ */ jsx(Droplet, { className: "w-6 h-6 text-red-500" }) : /* @__PURE__ */ jsx(ThermometerSnowflake, { className: "w-6 h-6 text-blue-300" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-white font-bold text-sm", children: item.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono uppercase", children: item.type === "ORGAN" ? `Organ: ${item.organType}` : `Krew: ${item.bloodType}` })
                  ]})
                ]}),
                /* @__PURE__ */ jsxs("div", { className: "text-right flex flex-col", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-agency-main font-mono font-bold text-xs", children: ["Stan: ", item.condition.toFixed(1), "%"] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-slate-500 font-mono text-[9px] uppercase mt-1", children: ["Zajmuje: ", item.slots, " slot(y)"] })
                ]})
              ]})
            ]})
          ))
        })
      )
    })
  ]});
};

export default FridgeTab;
