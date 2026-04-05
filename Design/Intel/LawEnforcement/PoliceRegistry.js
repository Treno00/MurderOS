import { jsx, jsxs } from "react/jsx-runtime";
import { Siren, Lock, MapPin, Download } from "lucide-react";
import { usePoliceRegistry } from "../../../Scripts/Intel/LawEnforcement/usePoliceRegistry.js";
const PoliceRegistry = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    crimeCategory,
    setCrimeCategory,
    results,
    selectedCriminal,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputPesel,
    setInputPesel,
    inputAge,
    setInputAge,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn
  } = usePoliceRegistry();
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-4 overflow-hidden text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 bg-agency-dark border border-agency-border rounded flex flex-col p-4 shadow-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-agency-border pb-4 mb-4", children: [
        /* @__PURE__ */ jsx(Siren, { className: "w-6 h-6 text-blue-600 animate-pulse" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: [
            "KGP ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "CENTRAL" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-blue-500 font-mono", children: "PO\u0141\u0104CZENIE SZYFROWANE" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-slate-200 focus:border-blue-600 outline-none font-mono text-sm",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-slate-200 focus:border-blue-600 outline-none font-mono text-sm",
              value: lastName,
              onChange: (e) => setLastName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Miasto" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-slate-200 focus:border-blue-600 outline-none font-mono text-sm",
              value: city,
              onChange: (e) => setCity(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-slate-500 uppercase font-bold mb-1 block", children: "Kategoria" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-slate-200 focus:border-blue-600 outline-none font-mono text-sm",
              value: crimeCategory,
              onChange: (e) => setCrimeCategory(e.target.value),
              placeholder: "np. Kradzie\u017C"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto mt-4 space-y-2 pr-1 custom-scrollbar", children: results.length > 0 ? results.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-black border border-agency-border p-3 rounded flex flex-col gap-1 hover:border-blue-600/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-200 text-sm", children: [
          c.firstName,
          " ",
          c.lastName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-blue-400 flex items-center gap-1 mb-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
          " (",
          c.city,
          ")"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUnlockClick(c),
            className: "w-full py-1 bg-blue-900/20 hover:bg-blue-800 text-blue-300 border border-blue-900/50 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " ODBLOKUJ"
            ]
          }
        )
      ] }, c.id)) : /* @__PURE__ */ jsx("div", { className: "text-center text-slate-600 mt-10 font-mono text-[10px]", children: "BRAK WYNIK\xD3W W BAZIE KARNEJ" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(Siren, { className: "w-64 h-64 text-blue-600" }) }),
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "text-blue-500 font-mono text-xl font-bold mb-4 animate-pulse", children: "DEKRYPTACJA KARTOTEKI..." }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-slate-800 rounded border border-blue-900 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-500 animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
        /* @__PURE__ */ jsx("style", { children: `
                            @keyframes progress {
                                0% { transform: scaleX(0); }
                                100% { transform: scaleX(1); }
                            }
                        ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-blue-800 w-96 p-6 rounded shadow-lg", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-blue-500 mb-4 flex items-center gap-2 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
          " Autoryzacja Dost\u0119pu"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-4 font-mono", children: "Dost\u0119p do pe\u0142nej kartoteki karnej wymaga weryfikacji to\u017Csamo\u015Bci." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block uppercase", children: "PESEL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inputPesel,
                onChange: (e) => setInputPesel(e.target.value),
                className: "w-full bg-black border border-slate-700 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
                placeholder: "11 cyfr"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-500 font-bold mb-1 block uppercase", children: "Wiek" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: inputAge,
                onChange: (e) => setInputAge(e.target.value),
                className: "w-full bg-black border border-slate-700 p-2 text-sm focus:border-blue-500 outline-none rounded text-slate-200 transition-colors font-mono",
                placeholder: "np. 34"
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
              children: "AUTORYZUJ"
            }
          )
        ] })
      ] }) }),
      isUnlocked && selectedCriminal ? /* @__PURE__ */ jsxs("div", { className: "z-10 h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1", children: "KARTOTEKA OBYWATELA" }),
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-white", children: [
              selectedCriminal.firstName,
              " ",
              selectedCriminal.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono text-slate-500 text-xs", children: [
              "PESEL: ",
              selectedCriminal.pesel
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
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-blue-400 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 text-xs", children: "Dane Podstawowe" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 font-mono text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "Adres Zameldowania" }),
                /* @__PURE__ */ jsx("span", { className: "text-white block", children: selectedCriminal.address })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "Wzrost / Waga" }),
                /* @__PURE__ */ jsxs("span", { className: "text-white block", children: [
                  selectedCriminal.height,
                  " cm / ",
                  selectedCriminal.weight,
                  " kg"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "W\u0142osy" }),
                /* @__PURE__ */ jsx("span", { className: "text-white block", children: selectedCriminal.hairColor })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-500 uppercase", children: "Oczy" }),
                /* @__PURE__ */ jsx("span", { className: "text-white block", children: selectedCriminal.eyeColor })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-blue-400 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 text-xs", children: "Historia Kryminalna" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-[9px] uppercase block mb-2 font-bold", children: "Wyroki S\u0105dowe" }),
                selectedCriminal.sentences.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: selectedCriminal.sentences.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "text-red-400 font-mono text-xs", children: [
                  "\u2022 ",
                  s
                ] }, i)) }) : /* @__PURE__ */ jsx("span", { className: "text-slate-600 text-xs italic", children: "Czysta kartoteka skaza\u0144." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-[9px] uppercase block mb-2 font-bold", children: "Wykroczenia i Grzywny" }),
                selectedCriminal.fines.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: selectedCriminal.fines.map((f, i) => /* @__PURE__ */ jsxs("li", { className: "text-orange-400 font-mono text-xs", children: [
                  "\u2022 ",
                  f
                ] }, i)) }) : /* @__PURE__ */ jsx("span", { className: "text-slate-600 text-xs italic", children: "Brak odnotowanych wykrocze\u0144." })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest opacity-50", children: "WYMAGANA AUTORYZACJA" })
      ] })
    ] })
  ] });
};
var stdin_default = PoliceRegistry;
export {
  stdin_default as default
};
