import { jsx, jsxs } from "react/jsx-runtime";
import { MapPin, Target, Eye, Download, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useObservation } from "../../../Scripts/Intel/FieldOps/useObservation.js";
const Observation = () => {
  const {
    startLocation,
    setStartLocation,
    city,
    setCity,
    height,
    setHeight,
    weight,
    setWeight,
    hairColor,
    setHairColor,
    eyeColor,
    setEyeColor,
    isObserving,
    progress,
    observationComplete,
    logs,
    targetCitizen,
    isTarget,
    selectedDay,
    setSelectedDay,
    handleInitiate,
    handleSave,
    showDownloadBtn
  } = useObservation();
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col overflow-hidden relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-agency-border pb-4 mb-4", children: [
      /* @__PURE__ */ jsx(Target, { className: "w-6 h-6 text-cyan-500" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "Obserwacja Celu" }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-cyan-500 font-mono", children: "FIELDOPS // DRONE SURVEILLANCE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-cyan-400 font-bold uppercase tracking-wider mb-4 border-b border-agency-border pb-2 text-xs flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
            " Parametry Operacji"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Lokalizacja (Ulica/Miejsce)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-cyan-900/30 p-2 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                    value: startLocation,
                    onChange: (e) => setStartLocation(e.target.value),
                    placeholder: "np. ul. D\u0142uga 12/4"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Miasto" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full bg-black border border-cyan-900/30 p-2 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                    value: city,
                    onChange: (e) => setCity(e.target.value),
                    placeholder: "np. Warszawa"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-agency-border pt-4", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[9px] text-cyan-500/70 uppercase font-bold mb-2 block", children: "Biometria Poszukiwanego" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[8px] text-slate-500 uppercase block", children: "Wzrost (cm)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-cyan-900/30 p-1 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                      value: height,
                      onChange: (e) => setHeight(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[8px] text-slate-500 uppercase block", children: "Waga (kg)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-cyan-900/30 p-1 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                      value: weight,
                      onChange: (e) => setWeight(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[8px] text-slate-500 uppercase block", children: "Kolor W\u0142os\xF3w" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-cyan-900/30 p-1 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                      value: hairColor,
                      onChange: (e) => setHairColor(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[8px] text-slate-500 uppercase block", children: "Kolor Oczu" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black border border-cyan-900/30 p-1 rounded text-cyan-100 focus:border-cyan-500 outline-none font-mono text-xs",
                      value: eyeColor,
                      onChange: (e) => setEyeColor(e.target.value)
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleInitiate,
                disabled: isObserving,
                className: `w-full py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${isObserving ? "bg-cyan-900/20 text-cyan-700 cursor-not-allowed" : "bg-cyan-900/40 hover:bg-cyan-800 text-cyan-300 border border-cyan-900/50"}`,
                children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
                  isObserving ? "Operacja w toku..." : "Rozpocznij Obserwacj\u0119"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black/80 border border-agency-border p-4 rounded flex flex-col relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-20", style: { backgroundImage: "radial-gradient(circle at 50% 50%, #06b6d4 1px, transparent 1px)", backgroundSize: "20px 20px" } }),
          /* @__PURE__ */ jsxs("h3", { className: "text-cyan-500 font-mono text-xs uppercase mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-cyan-500 animate-pulse" }),
            "Terminal Operacyjny"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 font-mono text-[10px] text-cyan-400/70 space-y-1", children: logs.map((log, i) => /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-left-2", children: log }, i)) }),
          isObserving && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1 bg-black rounded overflow-hidden border border-cyan-900/30", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-cyan-500 transition-all duration-100", style: { width: `${progress}%` } }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-right text-[9px] text-cyan-500 font-mono mt-1", children: [
              Math.round(progress),
              "%"
            ] })
          ] })
        ] })
      ] }),
      observationComplete && /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-500", children: targetCitizen ? /* @__PURE__ */ jsxs("div", { className: `border p-6 rounded relative overflow-hidden ${isTarget ? "bg-green-950/20 border-green-900/50" : "bg-orange-950/20 border-orange-900/50"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            isTarget ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-500" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 text-orange-500" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-black uppercase ${isTarget ? "text-green-400" : "text-orange-400"}`, children: isTarget ? "Cel Potwierdzony" : "Zidentyfikowano Mieszka\u0144ca" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-slate-400", children: [
                targetCitizen.firstName,
                " ",
                targetCitizen.lastName
              ] })
            ] })
          ] }),
          showDownloadBtn && /* @__PURE__ */ jsxs("button", { onClick: handleSave, className: "text-cyan-500 hover:text-cyan-300 transition-colors border border-cyan-900/50 px-3 py-1 rounded bg-black flex items-center gap-2 text-xs font-bold", children: [
            /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
            " ZAPISZ"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 font-mono text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase mb-1", children: "Potwierdzony Adres Przebywania" }),
            /* @__PURE__ */ jsx("span", { className: "text-white block", children: targetCitizen.livingAddress }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 block text-xs", children: targetCitizen.currentCity || targetCitizen.city })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase mb-1", children: "Zarejestrowane Miejsce Pracy" }),
            /* @__PURE__ */ jsx("span", { className: "text-white block", children: targetCitizen.currentWorkAddress || targetCitizen.workAddress || "Brak danych" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-agency-border pt-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-[10px] text-cyan-500 uppercase mb-2 font-bold", children: [
            /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }),
            " Analiza Dronowa: Zarejestrowane Sta\u0142e Punkty (Tryb Ograniczony)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-black/50 p-3 rounded border border-cyan-900/30 text-[10px] text-slate-300 space-y-2 font-mono", children: targetCitizen.favorites ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-agency-border pb-1", children: [/* @__PURE__ */ jsx("span", { className: "text-cyan-700", children: "Lokal gastronomiczny: "}), /* @__PURE__ */ jsx("span", { className: "text-cyan-300 font-bold", children: targetCitizen.favorites.restaurant || "Brak danych"})] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-agency-border pb-1", children: [/* @__PURE__ */ jsx("span", { className: "text-cyan-700", children: "Sklep (cz\u0119ste zakupy): "}), /* @__PURE__ */ jsx("span", { className: "text-cyan-300 font-bold", children: targetCitizen.favorites.shop || "Brak danych"})] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-agency-border pb-1", children: [/* @__PURE__ */ jsx("span", { className: "text-cyan-700", children: "Lokal rozrywkowy (Klub): "}), /* @__PURE__ */ jsx("span", { className: "text-cyan-300 font-bold", children: targetCitizen.favorites.club || "Brak danych"})] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-agency-border pb-1", children: [/* @__PURE__ */ jsx("span", { className: "text-cyan-700", children: "Lokal nocny (Bar): "}), /* @__PURE__ */ jsx("span", { className: "text-cyan-300 font-bold", children: targetCitizen.favorites.bar || "Brak danych"})] }),
            /* @__PURE__ */ jsx("div", { className: "text-[9px] text-slate-500 mt-2 block pt-2 border-t border-agency-border", children: "Uwaga: Raport wygenerowany na podstawie wst\u0119pnego \u015Bledzenia. Wskazuje jedynie cz\u0119sto odwiedzane lokalizacje. Szczeg\xF3\u0142owy harmonogram nale\u017Cy ustali\u0107 \u0142\u0105cz\u0105c dane bankowe i aktywno\u015B\u0107 w sieci." })
          ] }) : /* @__PURE__ */ jsx("div", { className: "text-orange-500", children: "Brak wystarczaj\u0105cych danych do profilowania nawyk\xF3w." }) })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-red-950/20 border border-red-900/50 p-6 rounded flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(XCircle, { className: "w-8 h-8 text-red-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-red-400 font-bold uppercase", children: "Brak Wynik\xF3w" }),
          /* @__PURE__ */ jsx("p", { className: "text-red-500/70 text-xs font-mono", children: "Nie zaobserwowano \u017Cadnej aktywno\u015Bci pod podanym adresem." })
        ] })
      ] }) })
    ] })
  ] });
};
var stdin_default = Observation;
export {
  stdin_default as default
};
