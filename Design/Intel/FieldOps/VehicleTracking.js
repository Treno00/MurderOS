import { jsx, jsxs } from "react/jsx-runtime";
import { Car, MapPin, Search } from "lucide-react";
import { useVehicleTracking } from "../../../Scripts/Intel/FieldOps/useVehicleTracking.js";
const VehicleTracking = () => {
  const {
    city,
    setCity,
    licensePlate,
    setLicensePlate,
    vehicleModel,
    setVehicleModel,
    vehicleColor,
    setVehicleColor,
    isObserving,
    progress,
    observationComplete,
    logs,
    investigationResult,
    handleInitiate
  } = useVehicleTracking();
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-agency-border pb-4 mb-4", children: [
      /* @__PURE__ */ jsx(Car, { className: "w-6 h-6 text-yellow-500" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "\u015Aledzenie Pojazdu" }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-yellow-500 font-mono", children: "FIELDOPS // ANPR NETWORK" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-yellow-400 font-bold uppercase tracking-wider mb-4 border-b border-agency-border pb-2 text-xs flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
            " Parametry Operacji"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Miasto" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-yellow-900/30 p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-xs",
                    value: city,
                    onChange: (e) => setCity(e.target.value),
                    placeholder: "np. Warszawa"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Tablica Rejestracyjna" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-yellow-900/30 p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-xs",
                    value: licensePlate,
                    onChange: (e) => setLicensePlate(e.target.value),
                    placeholder: "np. WA 12345"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Model Pojazdu" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-yellow-900/30 p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-xs",
                    value: vehicleModel,
                    onChange: (e) => setVehicleModel(e.target.value),
                    placeholder: "np. Toyota Corolla"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Kolor Pojazdu" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-yellow-900/30 p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-xs",
                    value: vehicleColor,
                    onChange: (e) => setVehicleColor(e.target.value),
                    placeholder: "np. Czarny"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleInitiate,
                disabled: isObserving,
                className: `w-full py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${isObserving ? "bg-yellow-900/20 text-yellow-700 cursor-not-allowed" : "bg-yellow-900/40 hover:bg-yellow-800 text-yellow-300 border border-yellow-900/50"}`,
                children: [
                  /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                  isObserving ? "Wyszukiwanie w toku..." : "Rozpocznij \u015Aledzenie"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black/80 border border-agency-border p-4 rounded flex flex-col relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-20", style: { backgroundImage: "radial-gradient(circle at 50% 50%, #eab308 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
          /* @__PURE__ */ jsxs("h3", { className: "text-yellow-500 font-mono text-xs uppercase mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-yellow-500 animate-pulse" }),
            "Terminal Operacyjny"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 font-mono text-[10px] text-yellow-400/70 space-y-1", children: logs.map((log, i) => /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-left-2", children: log }, i)) }),
          isObserving && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 bg-black rounded overflow-hidden border border-yellow-900/30", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-yellow-500 transition-all duration-100", style: { width: `${progress}%` } }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-right text-[9px] text-yellow-500 font-mono mt-1", children: [
              Math.round(progress),
              "%"
            ] })
          ] })
        ] })
      ] }),
      observationComplete && investigationResult && /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-500", children: /* @__PURE__ */ jsxs("div", { className: "bg-yellow-950/20 border border-yellow-900/50 p-6 rounded relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-yellow-400 font-bold uppercase tracking-widest mb-4 border-b border-yellow-900/30 pb-2 text-xs", children: "Raport z Systemu ANPR" }),
        /* @__PURE__ */ jsx("pre", { className: "font-mono text-xs text-yellow-100 whitespace-pre-wrap leading-relaxed", children: investigationResult })
      ] }) })
    ] })
  ] });
};
var stdin_default = VehicleTracking;
export {
  stdin_default as default
};
