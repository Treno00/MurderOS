import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { FileText, Lock, Shield, Download, Home, Car, MapPin, Landmark } from "lucide-react";
import { GameState } from "../../../Scripts/App/GameState.js";
import { dispatchDataTransfer } from "../../../Scripts/App/events.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
const TaxRegistry = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [workAddress, setWorkAddress] = useState(getAutofill(activeFile?.workAddress));
  const [jobTitle, setJobTitle] = useState(getAutofill(activeFile?.employment));
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputPesel, setInputPesel] = useState("");
  const [inputBirthDate, setInputBirthDate] = useState("");
  const [inputEmployment, setInputEmployment] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [authError, setAuthError] = useState("");
  const taxPayerDb = useMemo(() => Object.values(db), [db]);
  const results = useMemo(() => {
    if (!firstName && !lastName && !workAddress && !jobTitle) return [];
    return taxPayerDb.filter((p) => {
      const matchFirst = firstName ? p.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? p.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchWork = workAddress ? p.workAddress.toLowerCase().includes(workAddress.toLowerCase()) : true;
      const matchJob = jobTitle ? p.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) : true;
      return matchFirst && matchLast && matchWork && matchJob;
    });
  }, [taxPayerDb, firstName, lastName, workAddress, jobTitle]);
  const handleUnlockClick = (citizen) => {
    setSelectedCitizen(citizen);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputPesel(getAutofill(activeFile?.pesel));
    setInputBirthDate(getAutofill(activeFile?.birthDate));
    setInputEmployment(getAutofill(activeFile?.employment));
    setInputCity(getAutofill(activeFile?.city));
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCitizen) return;
    if (inputPesel.trim() === selectedCitizen.pesel && inputBirthDate.trim() === selectedCitizen.birthDate && inputEmployment.trim().toLowerCase() === selectedCitizen.jobTitle.toLowerCase() && inputCity.trim().toLowerCase() === selectedCitizen.city.toLowerCase()) {
      setShowAuthModal(false);
      if (!settings.noDecoding) {
        setIsDecoding(true);
        const delay = Math.floor(Math.random() * (3700 - 2e3 + 1) + 2e3);
        setTimeout(() => {
          setIsDecoding(false);
          setIsUnlocked(true);
        }, delay);
      } else {
        setIsUnlocked(true);
      }
    } else {
      setAuthError("B\u0141\u0104D WERYFIKACJI. Sprawd\u017A wszystkie pola.");
    }
  };
  const handleDownload = () => {
    if (!selectedCitizen || !isUnlocked) return;
    dispatchDataTransfer({
      pesel: selectedCitizen.pesel,
      birthDate: selectedCitizen.birthDate,
      employment: selectedCitizen.jobTitle,
      insuranceNumber: `NFZ-${selectedCitizen.pesel.slice(0, 8)}`,
      bankName: selectedCitizen.bankName || "Brak",
      companyName: selectedCitizen.companyName || "Brak Danych",
      income: selectedCitizen.income ? selectedCitizen.income.toFixed(2).replace(".", ",") : "Brak",
      licensePlate: selectedCitizen.licensePlate || "Brak"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-yellow-800/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-yellow-500 flex items-center gap-2 border-b border-yellow-800/30 pb-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }),
        "e-URZ\u0104D SKARBOWY"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-yellow-600/70 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-sm",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-yellow-600/70 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-sm",
              value: lastName,
              onChange: (e) => setLastName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-yellow-600/70 uppercase font-bold mb-1 block", children: "Zaw\xF3d" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-sm",
              value: jobTitle,
              onChange: (e) => setJobTitle(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-yellow-600/70 uppercase font-bold mb-1 block", children: "Adres Pracy" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-yellow-100 focus:border-yellow-500 outline-none font-mono text-sm",
              value: workAddress,
              onChange: (e) => setWorkAddress(e.target.value),
              placeholder: "Ulica..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mt-4", children: results.length > 0 ? results.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-black border border-agency-border p-3 rounded flex flex-col gap-2 hover:border-yellow-600/30 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-yellow-100 text-sm", children: [
          c.firstName,
          " ",
          c.lastName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-yellow-500/70 font-mono flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
          c.jobTitle.startsWith("Ucze\u0144") || c.workAddress === "Brak (Bezrobotny)" ? c.livingCity : c.workAddress
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUnlockClick(c),
            className: "w-full py-1 bg-yellow-900/10 hover:bg-yellow-800/30 text-yellow-500 border border-yellow-800/30 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " Odblokuj"
            ]
          }
        )
      ] }, c.id)) : /* @__PURE__ */ jsx("div", { className: "text-center text-slate-700 mt-10 font-mono text-[10px]", children: "BRAK WYNIK\xD3W" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(FileText, { className: "w-64 h-64 text-yellow-600" }) }),
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "text-yellow-500 font-mono text-xl font-bold mb-4 animate-pulse", children: "ODSZYFROWYWANIE DANYCH PODATKOWYCH..." }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-agency-dark rounded border border-yellow-900 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-yellow-500 animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-yellow-700 font-mono", children: "KLUCZ: RSA-4096 // US SKARBOWY" }),
        /* @__PURE__ */ jsx("style", { children: `
                        @keyframes progress {
                            0% { transform: scaleX(0); }
                            100% { transform: scaleX(1); }
                        }
                    ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-yellow-700 w-96 p-6 rounded shadow-[0_0_30px_rgba(202,138,4,0.1)]", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
          " Kontrola Skarbowa"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-4 font-mono", children: "Dost\u0119p do akt podatkowych wymaga weryfikacji." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "PESEL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-yellow-400 font-mono text-sm outline-none focus:border-yellow-600",
                value: inputPesel,
                onChange: (e) => setInputPesel(e.target.value),
                placeholder: "XXXXXXXXXXX"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "Data Urodzenia" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-yellow-400 font-mono text-sm outline-none focus:border-yellow-600",
                value: inputBirthDate,
                onChange: (e) => setInputBirthDate(e.target.value),
                placeholder: "DD.MM.RRRR"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "Zatrudnienie (Stanowisko)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-yellow-400 font-mono text-sm outline-none focus:border-yellow-600",
                value: inputEmployment,
                onChange: (e) => setInputEmployment(e.target.value),
                placeholder: "Stanowisko..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "Miasto" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-yellow-400 font-mono text-sm outline-none focus:border-yellow-600",
                value: inputCity,
                onChange: (e) => setInputCity(e.target.value),
                placeholder: "Miasto..."
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
                className: "flex-1 bg-yellow-800 hover:bg-yellow-700 text-black py-2 rounded text-xs font-bold",
                children: "WERYFIKUJ"
              }
            )
          ] })
        ] })
      ] }) }),
      isUnlocked && selectedCitizen ? /* @__PURE__ */ jsxs("div", { className: "z-10 h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-yellow-600 font-bold uppercase tracking-widest mb-1", children: "PODATNIK" }),
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
          settings.showDownloadBtn && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDownload,
              className: "flex items-center gap-2 text-yellow-500 hover:text-yellow-300 transition-colors border border-yellow-900/50 px-3 py-1 rounded bg-black",
              children: /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-yellow-500 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
              " Zeznanie (PIT-37)"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 font-mono text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Nazwa Firmy" }),
                /* @__PURE__ */ jsx("span", { className: "text-white block font-bold", children: selectedCitizen.companyName || "Brak Danych" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Stanowisko" }),
                /* @__PURE__ */ jsx("span", { className: "text-yellow-100 block", children: selectedCitizen.jobTitle })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Siedziba / Miejsce Wykonywania Pracy" }),
                /* @__PURE__ */ jsxs("span", { className: "text-yellow-100 block font-bold", children: [ selectedCitizen.workAddress, selectedCitizen.workCity ? ` (${selectedCitizen.workCity})` : "" ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Przych\xF3d (Brutto / Msc)" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg text-white block", children: selectedCitizen.income > 0 ? selectedCitizen.income.toLocaleString("pl-PL", { style: "currency", currency: "PLN" }) : "0,00 z\u0142" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Bank" }),
                /* @__PURE__ */ jsxs("span", { className: "text-yellow-100 block", children: [
                  selectedCitizen.bankName,
                  !selectedCitizen.vehicle && ` (${selectedCitizen.bankClientId})`
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-black/50 border border-agency-border p-4 rounded", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-yellow-500 font-bold uppercase tracking-wider mb-2 border-b border-agency-border pb-2 flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }),
              " Status"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 font-mono text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "block text-[9px] text-slate-600 uppercase flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Car, { className: "w-3 h-3" }),
                  " Tablica Rejestracyjna"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-white block", children: selectedCitizen.licensePlate || "Brak" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "block text-[9px] text-slate-600 uppercase flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Landmark, { className: "w-3 h-3" }),
                  " Nr. Ubezpieczenia:"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-yellow-400 block font-bold", children: [
                  "NFZ-",
                  selectedCitizen.pesel.slice(0, 8)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-slate-600 uppercase", children: "Data Urodzenia" }),
                /* @__PURE__ */ jsx("span", { className: "text-white block font-mono", children: selectedCitizen.birthDate })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest opacity-50", children: "OCZEKIWANIE NA AUTORYZACJ\u0118" })
      ] })
    ] })
  ] });
};
var stdin_default = TaxRegistry;
export {
  stdin_default as default
};
