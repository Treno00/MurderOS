import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { CarFront, Key } from "lucide-react";

const GarageTab = () => {
  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles([...(GameState.hideoutStorage.garage || [])]);
    }, 1000);
    
    setVehicles([...(GameState.hideoutStorage.garage || [])]);
    return () => clearInterval(interval);
  }, [GameState]);

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col text-slate-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CarFront, { className: "w-5 h-5 text-agency-main" }),
        "GARAŻ"
      ]}),
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-slate-500", children: [
        "MIEJSCA: ",
        /* @__PURE__ */ jsxs("span", { className: "text-agency-main font-bold", children: [vehicles.length, " / ", GameState.garageCapacity || 2] })
      ]})
    ]}),

    /* Garage Grid */
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2", children: 
      vehicles.length === 0 ? (
        /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
          /* @__PURE__ */ jsx(CarFront, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest", children: "PUSTY GARAŻ" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Brak zaparkowanych pojazdów." })
          ]})
        ]})
      ) : (
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: 
          vehicles.map(vehicle => (
            /* @__PURE__ */ jsxs("div", { key: vehicle.instanceId, className: "bg-agency-panel border border-agency-border rounded p-4 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(CarFront, { className: "w-6 h-6 text-agency-main" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-white font-bold text-sm", children: vehicle.name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500 font-mono uppercase mt-1", children: [
                      /* @__PURE__ */ jsx(Key, { className: "w-3 h-3 inline mr-1" }),
                      vehicle.subcategory || "Pojazd"
                    ]})
                  ]})
                ]}),
              ]}),
              vehicle.description && /* @__PURE__ */ jsx("p", { className: "mt-4 text-[10px] text-slate-400 font-mono", children: vehicle.description })
            ]})
          ))
        })
      )
    })
  ]});
};

export default GarageTab;
