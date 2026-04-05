import { jsx, jsxs } from "react/jsx-runtime";
import { Activity, Lock, HeartPulse, User, MapPin, Download } from "lucide-react";
import { useMedicalRecord } from "../../../Scripts/Intel/StateRegistries/useMedicalRecord.js";
const MedicalRecord = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    city,
    setCity,
    bloodType,
    setBloodType,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputPesel,
    setInputPesel,
    inputInsurance,
    setInputInsurance,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    calculateBMI,
    showDownloadBtn
  } = useMedicalRecord();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-rose-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-rose-500 flex items-center gap-2 border-b border-rose-900/30 pb-2", children: [
        /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }),
        "SYSTEM NFZ"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-rose-400/70 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-rose-100 focus:border-rose-500 outline-none font-mono text-sm",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-rose-400/70 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-rose-100 focus:border-rose-500 outline-none font-mono text-sm",
              value: lastName,
              onChange: (e) => setLastName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-rose-400/70 uppercase font-bold mb-1 block", children: "Miasto" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-rose-100 focus:border-rose-500 outline-none font-mono text-sm",
              placeholder: "np. Warszawa",
              value: city,
              onChange: (e) => setCity(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-rose-400/70 uppercase font-bold mb-1 block", children: "Grupa Krwi" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-rose-100 focus:border-rose-500 outline-none font-mono text-sm",
              placeholder: "np. AB+",
              value: bloodType,
              onChange: (e) => setBloodType(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mt-4", children: results.length > 0 ? results.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-black border border-agency-border p-3 rounded flex flex-col gap-2 hover:border-rose-800/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-rose-100 text-sm", children: [
          c.firstName,
          " ",
          c.lastName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-rose-500/70 font-mono flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
          " ",
          c.livingAddress
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUnlockClick(c),
            className: "w-full py-1 bg-rose-900/20 hover:bg-rose-800/30 text-rose-400 border border-rose-800/40 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors mt-1",
            children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " Odblokuj"
            ]
          }
        )
      ] }, c.id)) : /* @__PURE__ */ jsx("div", { className: "text-center text-slate-700 mt-10 font-mono text-[10px]", children: "BRAK DANYCH" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-64 h-64 text-rose-500" }) }),
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "text-rose-500 font-mono text-xl font-bold mb-4 animate-pulse", children: "ODSZYFROWYWANIE KARTY MEDYCZNEJ..." }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-agency-dark rounded border border-rose-900 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-rose-500 animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-rose-700 font-mono", children: "KLUCZ: HIPAA-COMPLIANT // PRIVATE" }),
        /* @__PURE__ */ jsx("style", { children: `
                        @keyframes progress {
                            0% { transform: scaleX(0); }
                            100% { transform: scaleX(1); }
                        }
                    ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-rose-800 w-96 p-6 rounded shadow-[0_0_30px_rgba(244,63,94,0.1)]", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-rose-500 mb-4 flex items-center gap-2 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
          " Weryfikacja Medyczna"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-4 font-mono", children: "Dost\u0119p wymaga numeru ubezpieczenia." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "PESEL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-rose-400 font-mono text-sm outline-none focus:border-rose-600",
                value: inputPesel,
                onChange: (e) => setInputPesel(e.target.value),
                placeholder: "XXXXXXXXXXX"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "Nr Ubezpieczenia" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-rose-400 font-mono text-sm outline-none focus:border-rose-600",
                value: inputInsurance,
                onChange: (e) => setInputInsurance(e.target.value),
                placeholder: "NFZ-XXXXXXXX"
              }
            )
          ] }),
          authError && /* @__PURE__ */ jsx("div", { className: "text-agency-danger text-[10px] text-center", children: authError }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowAuthModal(false),
                className: "flex-1 bg-agency-border hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold",
                children: "ANULUJ"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: attemptUnlock,
                className: "flex-1 bg-rose-800 hover:bg-rose-700 text-black py-2 rounded text-xs font-bold",
                children: "ODBLOKUJ"
              }
            )
          ] })
        ] })
      ] }) }),
      isUnlocked && selectedCitizen ? /* @__PURE__ */ jsxs("div", { className: "z-10 h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-rose-600 font-bold uppercase tracking-widest mb-1", children: "PACJENT" }),
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-white", children: [
              selectedCitizen.firstName,
              " ",
              selectedCitizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono text-slate-500 text-xs", children: [
              "PESEL: ",
              selectedCitizen.pesel
            ] })
          ] }),
          showDownloadBtn && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDownload,
              className: "flex items-center gap-2 text-rose-400 hover:text-rose-200 transition-colors border border-rose-900/50 px-3 py-1 rounded bg-black",
              children: /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-rose-500 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
              " Biometria"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Wzrost" }),
                /* @__PURE__ */ jsxs("span", { className: "text-lg text-white font-mono", children: [
                  selectedCitizen.height,
                  " cm"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Waga" }),
                /* @__PURE__ */ jsxs("span", { className: "text-lg text-white font-mono", children: [
                  selectedCitizen.weight,
                  " kg"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Grupa Krwi" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg text-rose-500 font-black font-mono", children: selectedCitizen.bloodType })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "BMI" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg text-rose-100 font-mono", children: calculateBMI(selectedCitizen.height, selectedCitizen.weight) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-rose-500 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx(Activity, { className: "w-3 h-3" }),
              " Historia Chor\xF3b"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase mb-1", children: "Choroby Przewlek\u0142e" }),
                selectedCitizen.diseases.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: selectedCitizen.diseases.map((d, i) => /* @__PURE__ */ jsxs("li", { className: "text-rose-400 font-mono text-xs", children: [
                  "\u2022 ",
                  d
                ] }, i)) }) : /* @__PURE__ */ jsx("span", { className: "text-slate-600 text-xs italic", children: "Brak." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase mb-1", children: "Uzale\u017Cnienia" }),
                selectedCitizen.addictions.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: selectedCitizen.addictions.map((a, i) => /* @__PURE__ */ jsxs("li", { className: "text-slate-200 font-mono text-xs", children: [
                  "\u2022 ",
                  a
                ] }, i)) }) : /* @__PURE__ */ jsx("span", { className: "text-slate-600 text-xs italic", children: "Brak stwierdzonych." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase mb-1", children: "Profil Psychologiczny" }),
                /* @__PURE__ */ jsxs("span", { className: "text-white font-mono text-xs italic", children: [
                  '"',
                  selectedCitizen.psychologicalProfile,
                  '"'
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700", children: [
        /* @__PURE__ */ jsx(HeartPulse, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest opacity-50", children: "WYMAGANA AUTORYZACJA" })
      ] })
    ] })
  ] });
};
var stdin_default = MedicalRecord;
export {
  stdin_default as default
};
