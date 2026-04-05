import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Map, Search, Loader2, MapPin } from "lucide-react";
import { getAddressForPlace } from "../../../Shared/utils.js";
import { GameState } from "../../../Scripts/App/GameState.js";

const CityMap = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setResult(null);

    setTimeout(() => {
      const db = GameState.getAllCitizens();
      const rawQ = query.trim().toLowerCase();
      let q = rawQ;
      
      let intel = [];
      let address = getAddressForPlace(query.trim());
      let statusCel = "W ZASI\u0118GU DRON\xD3W";
      
      db.forEach(citizen => {
          const cLivingCity = citizen.livingCity || citizen.city || "Nieznane";
          if (citizen.livingCity?.toLowerCase() === q || citizen.workCity?.toLowerCase() === q) {
              intel.push(`${citizen.firstName} ${citizen.lastName} (${cLivingCity}) - Zwi\u0105zany z t\u0105 lokalizacj\u0105`);
              statusCel = "W\u0118ZE\u0141 MIEJSKI (MIESZKA / PRACUJE)";
          }
          if (citizen.companyName?.toLowerCase() === q || citizen.workAddress?.toLowerCase() === q) {
              intel.push(`${citizen.firstName} ${citizen.lastName} (${cLivingCity}) - Pracuje tutaj`);
              address = citizen.workAddress;
              statusCel = "ZAK\u0141AD PRACY / KORPORACJA";
          }
          if (citizen.schoolName?.toLowerCase() === q || citizen.schoolAddress?.toLowerCase() === q) {
              intel.push(`${citizen.firstName} ${citizen.lastName} (${cLivingCity}) - Ucz\u0119szcza tutaj`);
              address = citizen.schoolAddress;
              statusCel = "OBIEKT EDUKACYJNY / SZKO\u0141A";
          }
          if (citizen.favorites?.club?.toLowerCase() === q || citizen.favorites?.bar?.toLowerCase() === q || citizen.favorites?.restaurant?.toLowerCase() === q) {
              intel.push(`${citizen.firstName} ${citizen.lastName} (${cLivingCity}) - Bywalec tego miejsca`);
              statusCel = "LOKAL GASTRONOMICZNY / ROZRYWKA";
          }
      });

      setResult({
        name: query.trim(),
        address: address,
        status: statusCel,
        intel: [...new Set(intel)].slice(0, 10).sort()
      });
      setIsSearching(false);
    }, 600);
  };

  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-slate-900 border border-green-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-green-900/30 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-green-500 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Map, { className: "w-5 h-5" }),
        "Mapy Miejskie"
      ] }) }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] text-green-400/70 uppercase font-bold mb-1 block", children: "Nazwa Obiektu / Zastrze\u017Conego Miejsca" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              className: "w-full bg-black border border-green-900/50 p-2 text-sm focus:border-green-500 outline-none rounded text-green-100 placeholder:text-green-900/50 transition-all font-mono",
              placeholder: "np. Energy 2000"
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSearching, className: "bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center transition-colors disabled:opacity-50", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-slate-900 border border-green-900/30 rounded relative overflow-hidden flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-5 pointer-events-none",
          style: { backgroundImage: "radial-gradient(#22c55e 1px, transparent 1px)", backgroundSize: "20px 20px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10 flex flex-col items-center justify-center", children: isSearching ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-green-500", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "w-12 h-12 animate-spin mb-4" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono uppercase tracking-widest text-xs", children: "Lokalizowanie obiektu..." })
      ] }) : result ? /* @__PURE__ */ jsxs("div", { className: "bg-black/60 border border-green-500/30 p-8 rounded-lg min-w-[400px] shadow-2xl animate-in zoom-in duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-green-900/50 pb-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-900/20 rounded-full text-green-400", children: /* @__PURE__ */ jsx(MapPin, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-green-100 font-bold text-xl uppercase tracking-wider", children: result.name }),
            /* @__PURE__ */ jsx("div", { className: "text-green-600 font-mono text-xs", children: "OBIEKT ZIDENTYFIKOWANY" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-mono", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-black/40 p-3 rounded border border-green-900/20 flex-col sm:flex-row gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs shrink-0", children: "DOK\u0141ADNY ADRES" }),
            /* @__PURE__ */ jsx("span", { className: "text-white font-bold tracking-wide text-right", children: result.address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-black/40 p-3 rounded border border-green-900/20", children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs", children: "STATUS CELU" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400 font-bold tracking-wide", children: result.status })
          ] }),
          result.intel && result.intel.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col bg-black/40 p-3 rounded border border-green-900/20 mt-4 gap-2", children: [
             /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-[10px] border-b border-green-900/30 pb-1 mb-1 font-bold", children: "DANE Z SYSTEMU OBYWATELSKIEGO" }),
             result.intel.map((line, i) => (
                /* @__PURE__ */ jsx("span", { className: "text-green-300 text-xs", children: `- ${line}` }, i)
             ))
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-green-900/30", children: [
        /* @__PURE__ */ jsx(Map, { className: "w-16 h-16 mb-4 opacity-50" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono uppercase tracking-widest font-bold text-xs", children: "OCZEKIWANIE NA ZAPYTANIE" })
      ] }) })
    ] })
  ] });
};
export default CityMap;
