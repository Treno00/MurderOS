import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MapPin, Search, Globe } from "lucide-react";
import { GameState } from "../../../Scripts/App/GameState.js";
const GeographicAnalysis = () => {
  const [inputCoords, setInputCoords] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [citizens] = useState(GameState.getAllCitizens());
  const handleAnalyze = () => {
    if (!inputCoords.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      const cleanInput = inputCoords.replace(/\s/g, "");
      let foundLocation = "Teren nieznany / Brak danych satelitarnych";
      let foundType = "UNKNOWN";
      for (const c of citizens) {
        const matchIndex = c.gpsLocations.findIndex((loc) => {
          const cleanLoc = loc.replace(/\s/g, "");
          return cleanLoc === cleanInput;
        });
        if (matchIndex !== -1) {
          if (c.policeStatus === "ZAGINIONY" && matchIndex === c.gpsLocations.length - 1) {
            foundLocation = `${c.currentAddress} (${c.currentCity || c.livingCity})`;
            foundType = "CRIME_SCENE";
            break;
          }
          if (c.policeStatus === "ZAGINIONY" && matchIndex === c.gpsLocations.length - 2) {
            foundLocation = `${c.livingAddress} (${c.livingCity})`;
            foundType = "KIDNAP_SPOT";
            break;
          }
          if (c.kidnapperId) {
          }
          if (matchIndex === 0) {
            foundLocation = `Adres Zamieszkania: ${c.livingAddress} (${c.livingCity})`;
            foundType = "RESIDENTIAL";
          } else if (c.workAddress && c.workAddress !== "Brak (Bezrobotny)" && matchIndex === 1) {
            foundLocation = `Miejsce Pracy: ${c.workAddress} (${c.workCity})`;
            foundType = "WORKPLACE";
          } else {
            foundLocation = `Teren Miejski (${c.livingCity})`;
            foundType = "URBAN";
          }
        }
      }
      setResult(foundLocation);
    }, 1500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-agency-border pb-4 mb-4", children: [
      /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6 text-emerald-500" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "Analiza Geograficzna" }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-emerald-500 font-mono", children: "GEOINT // SATELLITE RECON" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-6 rounded", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] text-emerald-500/70 uppercase font-bold mb-2 block", children: "Wsp\xF3\u0142rz\u0119dne Geograficzne (LAT, LON)" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "flex-1 bg-black border border-emerald-900/30 p-3 rounded text-emerald-100 focus:border-emerald-500 outline-none font-mono text-sm tracking-widest",
              value: inputCoords,
              onChange: (e) => setInputCoords(e.target.value),
              placeholder: "52.229700, 21.012200"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleAnalyze,
              disabled: isAnalyzing || !inputCoords,
              className: `px-6 rounded font-bold uppercase text-xs transition-colors flex items-center gap-2 ${isAnalyzing ? "bg-emerald-900/20 text-emerald-700" : "bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 border border-emerald-900/50"}`,
              children: [
                isAnalyzing ? /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                isAnalyzing ? "Analiza..." : "Skanuj"
              ]
            }
          )
        ] })
      ] }),
      result && /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black/80 border border-emerald-900/30 p-6 rounded flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-10", style: { backgroundImage: "radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)", backgroundSize: "30px 30px" } }),
        /* @__PURE__ */ jsxs("div", { className: "text-center z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/20 border border-emerald-500/30 mb-4", children: /* @__PURE__ */ jsx(MapPin, { className: "w-8 h-8 text-emerald-500" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-emerald-400 font-bold uppercase tracking-widest mb-2", children: "Wynik Analizy" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-white font-mono mb-2", children: result }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-emerald-600 font-mono uppercase", children: "Prawdopodobie\u0144stwo identyfikacji: 99.8%" })
        ] })
      ] }),
      !result && !isAnalyzing && /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30", children: [
        /* @__PURE__ */ jsx(Globe, { className: "w-24 h-24 mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest", children: "OCZEKIWANIE NA DANE WEJ\u015ACIOWE" })
      ] })
    ] })
  ] });
};
var stdin_default = GeographicAnalysis;
export {
  stdin_default as default
};
