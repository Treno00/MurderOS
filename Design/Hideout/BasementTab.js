import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { Lock, User } from "lucide-react";

const BasementTab = () => {
  const [captives, setCaptives] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCaptives([...GameState.getHideoutStorage().basement]);
    }, 1000);
    
    setCaptives([...GameState.getHideoutStorage().basement]);
    return () => clearInterval(interval);
  }, [GameState]);

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col text-slate-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-agency-main" }),
        "PIWNICA"
      ]}),
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-slate-500", children: [
        "MIEJSCA: ",
        /* @__PURE__ */ jsxs("span", { className: "text-agency-main font-bold", children: [captives.length, " / ", GameState.basementCapacity] })
      ]})
    ]}),

    /* Basement Content Grid */
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2", children: 
      captives.length === 0 ? (
        /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4", children: [
          /* @__PURE__ */ jsx(User, { className: "w-16 h-16" }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold tracking-widest", children: "PUSTA PIWNICA" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] mt-2", children: "Brak więźniów / obiektów w piwnicy." })
          ]})
        ]})
      ) : (
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: 
          captives.map(c => (
            /* @__PURE__ */ jsxs("div", { key: c.id, className: "bg-agency-panel border border-agency-border rounded p-4 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-agency-main font-bold text-sm", children: c.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-mono uppercase", children: `PESEL: ${c.pesel} | WIEK: ${c.age}` })
                ]}),
                /* @__PURE__ */ jsx("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-slate-400 font-mono font-bold text-xs uppercase block", children: ["STAN:", c.health === 0 ? " Zgon" : " Żywy"] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-slate-500 font-mono text-[9px] uppercase block", children: ["PRZECHOWYWANY OD: ", c.dateStored] })
                ]})
              ]}),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 text-[10px] text-slate-400 font-mono grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("p", { children: ["Zdrowie: ", c.health, "%"] }),
                /* @__PURE__ */ jsxs("p", { children: ["Przytomność: ", c.consciousness, "%"] }),
                /* @__PURE__ */ jsxs("p", { children: ["Stres: ", c.stress, "%"] }),
                /* @__PURE__ */ jsxs("p", { children: ["Posłuszeństwo: ", c.submission, "%"] }),
                /* @__PURE__ */ jsxs("p", { children: ["Krew: ", c.bloodML, " ml"] }),
                /* @__PURE__ */ jsxs("p", { children: ["Grupa Krwi: ", c.bloodType] })
              ]})
            ]})
          ))
        })
      )
    })
  ]});
};

export default BasementTab;
