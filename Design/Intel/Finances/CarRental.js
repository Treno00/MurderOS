import { jsx, jsxs } from "react/jsx-runtime";
import { useCarRental } from "../../../Scripts/Intel/Finances/useCarRental.js";
import { Car, Search, MapPin, User, Key, Loader2 } from "lucide-react";
const CarRental = () => {
  const {
    carModel,
    setCarModel,
    city,
    setCity,
    results,
    isSearching,
    handleSearch
  } = useCarRental();
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col gap-4 text-orange-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-orange-900/30 rounded p-4 shadow-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 border-b border-orange-900/30 pb-4", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-6 h-6 text-orange-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: [
            "REJESTR ",
            /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "WYPO\u017BYCZALNI" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-orange-500/70 font-mono", children: "CAR RENTAL DATABASE v4.1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Model Pojazdu" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Car, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-900" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-orange-900/30 p-2 pl-10 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-xs",
                placeholder: "np. Toyota Corolla",
                value: carModel,
                onChange: (e) => setCarModel(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-orange-500/50 uppercase font-bold mb-1 block", children: "Miasto" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-900" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-orange-900/30 p-2 pl-10 rounded text-orange-100 focus:border-orange-500 outline-none font-mono text-xs",
                placeholder: "np. Warszawa",
                value: city,
                onChange: (e) => setCity(e.target.value)
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSearch,
          disabled: isSearching,
          className: "w-full mt-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-900/50 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-all uppercase text-xs tracking-widest",
          children: [
            isSearching ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
            isSearching ? "PRZESZUKIWANIE..." : "SZUKAJ W BAZIE"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-orange-900/30 rounded overflow-hidden flex flex-col shadow-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-orange-900/10 p-2 border-b border-orange-900/30 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-orange-500 uppercase tracking-widest", children: "Wyniki Wyszukiwania" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-orange-900", children: [
          results.length,
          " REKORD\xD3W"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2", children: results.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: results.map((record) => /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-orange-900/20 rounded p-3 hover:border-orange-500/50 transition-colors group", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-orange-500" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-sm text-white group-hover:text-orange-400 transition-colors", children: [
            record.citizenName,
            " - ",
            record.paymentMethod === "Got\xF3wka" ? `Got\xF3wka (${record.phoneNumber || "Brak numeru"})` : `${record.bankClientId} (${record.bankName || "Bank"})`
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-orange-900/10 pb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-orange-900 uppercase", children: "Pojazd:" }),
            /* @__PURE__ */ jsx("span", { className: "text-orange-200", children: record.carModel })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-b border-orange-900/10 pb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-orange-900 uppercase", children: "Tablice:" }),
            /* @__PURE__ */ jsx("span", { className: "text-orange-200", children: record.licensePlate })
          ] })
        ] })
      ] }, record.id)) }) : /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center text-orange-900/30 italic text-sm", children: isSearching ? "Trwa przeszukiwanie bazy danych..." : "Brak wynik\xF3w dla podanych kryteri\xF3w." }) })
    ] })
  ] });
};
var stdin_default = CarRental;
export {
  stdin_default as default
};
