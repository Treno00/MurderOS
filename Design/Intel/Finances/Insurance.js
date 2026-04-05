import { jsx, jsxs } from "react/jsx-runtime";
import { ShieldCheck, Lock, Download, Car, Building } from "lucide-react";
import { useInsurance } from "../../../Scripts/Intel/Finances/useInsurance.js";
const Insurance = () => {
  const {
    licensePlate,
    setLicensePlate,
    carModel,
    setCarModel,
    carColor,
    setCarColor,
    city,
    setCity,
    inputVehicle,
    setInputVehicle,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn
  } = useInsurance();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-slate-900 border border-slate-700 rounded shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center border-b border-slate-700 pb-2", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-blue-400 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" }),
        "Ubezpieczalnia"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block", children: "Tablica Rejestracyjna" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: licensePlate,
              onChange: (e) => setLicensePlate(e.target.value),
              className: "w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors uppercase font-mono",
              placeholder: "XX 12345"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block", children: "Model Pojazdu" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: carModel,
              onChange: (e) => setCarModel(e.target.value),
              className: "w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
              placeholder: "np. Toyota Corolla"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block", children: "Kolor Pojazdu" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: carColor,
              onChange: (e) => setCarColor(e.target.value),
              className: "w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
              placeholder: "np. Srebrny"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block", children: "Miasto" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: city,
              onChange: (e) => setCity(e.target.value),
              className: "w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
              placeholder: "np. Warszawa"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mt-4", children: results.length > 0 ? results.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-800 border border-slate-700 p-3 rounded flex flex-col gap-2 hover:border-blue-500/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-200 text-sm", children: [
          c.firstName,
          " ",
          c.lastName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 font-mono flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Car, { className: "w-3 h-3" }),
          " ",
          c.licensePlate
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUnlockClick(c),
            className: "w-full py-1 bg-blue-900/20 hover:bg-blue-800/30 text-blue-400 border border-blue-800/40 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors mt-1",
            children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " Odblokuj"
            ]
          }
        )
      ] }, c.id)) : /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500 mt-10 font-mono text-[10px]", children: "BRAK WYNIK\xD3W" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-slate-900 border border-slate-700 rounded relative overflow-hidden flex flex-col", children: [
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "text-blue-500 font-mono text-xl font-bold mb-4 animate-pulse", children: "WERYFIKACJA POLISY..." }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-slate-800 rounded border border-blue-900 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-500 animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
        /* @__PURE__ */ jsx("style", { children: `
                    @keyframes progress {
                        0% { transform: scaleX(0); }
                        100% { transform: scaleX(1); }
                    }
                ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 border border-blue-800 w-96 p-6 rounded shadow-lg", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-blue-500 mb-4 flex items-center gap-2 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
          " Dost\u0119p do Polisy"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-4 font-mono", children: "Potwierd\u017A dost\u0119p do danych ubezpieczeniowych." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block uppercase", children: "Pojazd (Marka i Model)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inputVehicle,
                onChange: (e) => setInputVehicle(e.target.value),
                className: "w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
                placeholder: "Np. Toyota Corolla"
              }
            )
          ] }),
          authError && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-[10px] text-center font-bold", children: authError })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowAuthModal(false),
              className: "flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold",
              children: "ANULUJ"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: attemptUnlock,
              className: "flex-1 bg-blue-800 hover:bg-blue-700 text-white py-2 rounded text-xs font-bold",
              children: "ODBLOKUJ"
            }
          )
        ] })
      ] }) }),
      isUnlocked && selectedCitizen ? /* @__PURE__ */ jsxs("div", { className: "z-10 h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-slate-700 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1", children: "UBEZPIECZONY" }),
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-white", children: [
              selectedCitizen.firstName,
              " ",
              selectedCitizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono text-slate-500 text-xs", children: [
              "Polisa: ",
              selectedCitizen.insuranceCompany
            ] })
          ] }),
          showDownloadBtn && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDownload,
              className: "flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors border border-blue-900/50 px-3 py-1 rounded bg-black",
              children: /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-800/50 border border-slate-700 p-4 rounded", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-blue-400 font-bold uppercase tracking-wider mb-2 border-b border-slate-700 pb-2 flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsx(Building, { className: "w-4 h-4" }),
            " Dane Finansowe"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 font-mono text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "Firma Ubezpieczeniowa" }),
              /* @__PURE__ */ jsx("span", { className: "text-white block font-bold", children: selectedCitizen.insuranceCompany })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "ID Klienta Banku" }),
              /* @__PURE__ */ jsx("span", { className: "text-yellow-400 block font-bold tracking-widest", children: selectedCitizen.bankClientId })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "Konto (Cz\u0119\u015Bciowe)" }),
              /* @__PURE__ */ jsxs("span", { className: "text-slate-300 block tracking-widest", children: [
                selectedCitizen.bankAccount.slice(0, 4),
                "...",
                selectedCitizen.bankAccount.slice(-3)
              ] })
            ] })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest opacity-50", children: "WYMAGANA AUTORYZACJA" })
      ] })
    ] })
  ] });
};
var stdin_default = Insurance;
export {
  stdin_default as default
};
