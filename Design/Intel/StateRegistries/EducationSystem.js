import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { GraduationCap, Lock, Download, MapPin, School, Archive, FileCheck } from "lucide-react";
import { GameState } from "../../../Scripts/App/GameState.js";
import { dispatchDataTransfer } from "../../../Scripts/App/events.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
const EducationSystem = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [firstName, setFirstName] = useState(getAutofill(activeFile?.firstName));
  const [lastName, setLastName] = useState(getAutofill(activeFile?.lastName));
  const [schoolAddress, setSchoolAddress] = useState(getAutofill(activeFile?.schoolAddress));
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputPesel, setInputPesel] = useState("");
  const [inputSchoolName, setInputSchoolName] = useState("");
  const [inputSchoolAddress, setInputSchoolAddress] = useState("");
  const [authError, setAuthError] = useState("");
  const results = useMemo(() => {
    if (!firstName && !lastName && !schoolAddress) return [];
    return db.filter((p) => {
      const matchFirst = firstName ? p.firstName.toLowerCase().startsWith(firstName.toLowerCase()) : true;
      const matchLast = lastName ? p.lastName.toLowerCase().startsWith(lastName.toLowerCase()) : true;
      const matchAddress = schoolAddress ? p.schoolAddress.toLowerCase().includes(schoolAddress.toLowerCase()) : true;
      return matchFirst && matchLast && matchAddress;
    });
  }, [db, firstName, lastName, schoolAddress]);
  const handleUnlockClick = (person) => {
    setSelectedCitizen(person);
    setShowAuthModal(true);
    setIsUnlocked(false);
    setInputPesel(getAutofill(activeFile?.pesel));
    setInputSchoolName(getAutofill(activeFile?.schoolName));
    setInputSchoolAddress(getAutofill(activeFile?.schoolAddress));
    setAuthError("");
  };
  const attemptUnlock = () => {
    if (!selectedCitizen) return;
    const peselMatch = inputPesel.trim() === selectedCitizen.pesel;
    const schoolMatch = inputSchoolName.trim().toLowerCase() === selectedCitizen.schoolName.toLowerCase();
    if (peselMatch && schoolMatch) {
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
      setAuthError("B\u0141\u0104D WERYFIKACJI DANYCH.");
    }
  };
  const handleDownload = () => {
    if (!selectedCitizen || !isUnlocked) return;
    const isStudent = selectedCitizen.jobTitle.startsWith("Ucze\u0144");
    dispatchDataTransfer({
      pesel: selectedCitizen.pesel,
      education: selectedCitizen.education,
      schoolName: selectedCitizen.schoolName,
      schoolAddress: selectedCitizen.schoolAddress,
      // Direct field mapping now
      mainExamTitle: selectedCitizen.mainExamTitle,
      mainExamYear: selectedCitizen.mainExamYear,
      mainExamGrade: selectedCitizen.mainExamGrade,
      extraExamTitle: selectedCitizen.extraExamTitle,
      extraExamYear: selectedCitizen.extraExamYear,
      extraExamGrade: selectedCitizen.extraExamGrade,
      ...isStudent ? {
        employment: "Brak",
        workAddress: "Brak",
        livingAddress: selectedCitizen.address,
        livesWith: "Rodzice",
        bankName: selectedCitizen.bankName,
        insuranceNumber: `NFZ-${selectedCitizen.pesel.slice(0, 8)}`
      } : {}
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-purple-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-purple-500 flex items-center gap-2 border-b border-purple-900/30 pb-2", children: [
        /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }),
        "SYSTEM O\u015AWIATY (SIO/OKE)"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-purple-400/70 uppercase font-bold mb-1 block", children: "Imi\u0119" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-purple-100 focus:border-purple-500 outline-none font-mono text-sm",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-purple-400/70 uppercase font-bold mb-1 block", children: "Nazwisko" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-purple-100 focus:border-purple-500 outline-none font-mono text-sm",
              value: lastName,
              onChange: (e) => setLastName(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[9px] text-purple-400/70 uppercase font-bold mb-1 block", children: "Adres Szko\u0142y" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full bg-black border border-agency-border p-2 rounded text-purple-100 focus:border-purple-500 outline-none font-mono text-sm",
              value: schoolAddress,
              onChange: (e) => setSchoolAddress(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mt-4", children: results.length > 0 ? results.map((c) => /* @__PURE__ */ jsxs("div", { className: "bg-black border border-agency-border p-3 rounded flex flex-col gap-2 hover:border-purple-600/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-purple-100 text-sm", children: [
          c.firstName,
          " ",
          c.lastName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-purple-500/70 font-mono flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
          " ",
          c.schoolAddress
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleUnlockClick(c),
            className: "w-full py-1 bg-purple-900/20 hover:bg-purple-800/30 text-purple-400 border border-purple-800/40 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors mt-1",
            children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " Odblokuj"
            ]
          }
        )
      ] }, c.id)) : /* @__PURE__ */ jsx("div", { className: "text-center text-slate-700 mt-10 font-mono text-[10px]", children: "BRAK WYNIK\xD3W" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded relative overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(School, { className: "w-64 h-64 text-purple-600" }) }),
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "text-purple-500 font-mono text-xl font-bold mb-4 animate-pulse", children: "ODSZYFROWYWANIE DANYCH SIO..." }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-2 bg-agency-dark rounded border border-purple-900 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-purple-500 animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-purple-700 font-mono", children: "KLUCZ: MEN-2023 // SECURE" }),
        /* @__PURE__ */ jsx("style", { children: `
                        @keyframes progress {
                            0% { transform: scaleX(0); }
                            100% { transform: scaleX(1); }
                        }
                    ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-purple-800 w-96 p-6 rounded shadow-[0_0_30px_rgba(168,85,247,0.1)]", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-purple-500 mb-4 flex items-center gap-2 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
          " Weryfikacja Kuratorium"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-4 font-mono", children: "Dost\u0119p do danych ucznia jest chroniony." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "PESEL UCZNIA / ABSOLWENTA" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-purple-400 font-mono text-sm outline-none focus:border-purple-600",
                value: inputPesel,
                onChange: (e) => setInputPesel(e.target.value),
                placeholder: "XXXXXXXXXXX"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "NAZWA SZKO\u0141Y" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-purple-400 font-mono text-sm outline-none focus:border-purple-600",
                value: inputSchoolName,
                onChange: (e) => setInputSchoolName(e.target.value),
                placeholder: "np. Liceum Og\xF3lnokszta\u0142c\u0105ce nr 1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-slate-500 block mb-1", children: "ADRES PLAC\xD3WKI" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full bg-black border border-agency-border p-2 text-purple-400 font-mono text-sm outline-none focus:border-purple-600",
                value: inputSchoolAddress,
                onChange: (e) => setInputSchoolAddress(e.target.value),
                placeholder: "Ulica, Numer, Miasto"
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
                className: "flex-1 bg-purple-800 hover:bg-purple-700 text-black py-2 rounded text-xs font-bold",
                children: "ODBLOKUJ"
              }
            )
          ] })
        ] })
      ] }) }),
      isUnlocked && selectedCitizen ? /* @__PURE__ */ jsxs("div", { className: "z-10 h-full flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1", children: selectedCitizen.jobTitle.startsWith("Ucze\u0144") ? "UCZE\u0143 (AKTYWNY)" : "ABSOLWENT (ARCHIWUM)" }),
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-white", children: [
              selectedCitizen.firstName,
              " ",
              selectedCitizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono text-slate-500 text-xs mt-1", children: [
              /* @__PURE__ */ jsxs("div", { children: ["PESEL: ", selectedCitizen.pesel] }),
              /* @__PURE__ */ jsxs("div", { children: ["NR UBEZP: NFZ-", selectedCitizen.pesel.slice(0, 8)] })
            ] })
          ] }),
          settings.showDownloadBtn && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDownload,
              className: "flex items-center gap-2 text-purple-400 hover:text-purple-200 transition-colors border border-purple-900/50 px-3 py-1 rounded bg-black",
              children: /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 h-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-purple-950/10 border border-purple-900/30 p-6 rounded flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-purple-400 font-bold uppercase tracking-wider mb-2 border-b border-purple-900/30 pb-2 flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsx(Archive, { className: "w-3 h-3" }),
            " Archiwum Edukacji"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-purple-600 uppercase font-bold mb-1", children: "Wykszta\u0142cenie" }),
              /* @__PURE__ */ jsx("span", { className: "text-xl text-white font-mono", children: selectedCitizen.education })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[9px] text-purple-600 uppercase font-bold mb-1", children: "Plac\xF3wka" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-purple-200 font-mono", children: selectedCitizen.schoolName }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-purple-500/70 block mt-1", children: selectedCitizen.schoolAddress })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 border border-purple-900/20 rounded", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-purple-300 font-bold text-sm border-b border-purple-900/20 pb-2 mb-2", children: [
                /* @__PURE__ */ jsx(FileCheck, { className: "w-4 h-4" }),
                " EGZAMIN G\u0141\xD3WNY"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-purple-100 text-sm", children: [
                selectedCitizen.mainExamTitle,
                " (",
                selectedCitizen.mainExamYear,
                ") - ",
                selectedCitizen.mainExamGrade
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 border border-purple-900/20 rounded", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-purple-300 font-bold text-sm border-b border-purple-900/20 pb-2 mb-2", children: [
                /* @__PURE__ */ jsx(FileCheck, { className: "w-4 h-4" }),
                " EGZAMIN DODATKOWY"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-purple-100 text-sm", children: [
                selectedCitizen.extraExamTitle,
                " (",
                selectedCitizen.extraExamYear,
                ") - ",
                selectedCitizen.extraExamGrade
              ] })
            ] })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700", children: [
        /* @__PURE__ */ jsx(GraduationCap, { className: "w-24 h-24 mb-4 opacity-10" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest opacity-50", children: "WYMAGANA AUTORYZACJA KURATORIUM" })
      ] })
    ] })
  ] });
};
var stdin_default = EducationSystem;
export {
  stdin_default as default
};
