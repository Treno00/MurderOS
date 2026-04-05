import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { GameState } from "../../../Scripts/App/GameState.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
import { useVictimFilePanel } from "../../../Scripts/App/useVictimFilePanel.js";
import { Upload, Database, CreditCard, CheckCircle, XCircle, DollarSign, Activity, FileText, Globe } from "lucide-react";

const DarkMarket = () => {
  const { updateBalance } = useGame();
  
  const { getValidationColor, activeVictim } = useVictimFilePanel();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);

  const groups = [
    { name: "Dane Osobowe", id: "personal", value: 500, fields: ["pesel", "firstName", "lastName", "birthDate", "maritalStatus", "phoneNumber"] },
    { name: "Edukacja", id: "education", value: 300, fields: ["education", "schoolName", "schoolAddress", "mainExamTitle", "mainExamYear", "mainExamGrade", "extraExamTitle", "extraExamYear", "extraExamGrade"] },
    { name: "Lokalizacja", id: "location", value: 600, fields: ["city", "registeredAddress", "currentCity", "currentAddress", "livesWith", "livingCity", "livingAddress"] },
    { name: "Praca", id: "work", value: 800, fields: ["employment", "companyName", "workCity", "workAddress", "income", "netIncome"] },
    { name: "Finanse", id: "finance", value: 1500, fields: ["accountNumber", "bankName", "vehicle", "licensePlate", "cardNumber", "cardExpiry", "cardCVV", "accountBalance"] },
    { name: "Biometria", id: "biometrics", value: 400, fields: ["height", "weight", "hairColor", "eyeColor"] },
    { name: "Kartoteka Kryminalna", id: "criminal", value: 700, fields: ["sentences", "fines"] },
    { name: "Raport Medyczny", id: "medical", value: 1000, fields: ["insuranceNumber", "bloodType", "bmi", "diseases", "addictions", "psychologicalProfile"] },
    { name: "Rodzina i Powi\u0105zania", id: "connections", value: 1200, fields: ["familyMembers"] }
  ];

  const checkGroupComplete = (fields) => {
    if (!activeVictim || !activeVictim.pesel) return false;
    return fields.every((field) => {
      const colorClass = getValidationColor(field, true);
      return colorClass && (colorClass.includes("border-green-500") || colorClass.includes("border-yellow-500"));
    });
  };

  const calculateTotalValue = () => {
    return groups.reduce((total, group) => {
        if (checkGroupComplete(group.fields)) {
            return total + group.value;
        }
        return total;
    }, 0);
  };

  const handleUpload = () => {
    if (!activeVictim || !activeVictim.pesel) {
        alert("BRAK AKTYWNEJ KARTY. OTWÓRZ LUB WYBIERZ TECZKĘ OPERACYJNĄ.");
        return;
    }

    const val = calculateTotalValue();
    if (val === 0) {
        alert("BRAK KOMPLETNYCH DANYCH DO SPRZEDAŻY.");
        return;
    }

    setIsUploading(true);
    setUploadComplete(false);
    setUploadProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 100 / 30;
      setUploadProgress(Math.min(p, 100));

      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        setEarnedAmount(val);
        updateBalance(val);
        
        // Dispatch close file event
        const event = new CustomEvent("CLOSE_VICTIM_FILE", { detail: { pesel: activeVictim.pesel } });
        window.dispatchEvent(event);
      }
    }, 100);
  };

  return /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.03]", style: { backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" } }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-agency-border pb-4 mb-6 z-10 relative", children: 
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6 text-zinc-500" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white uppercase tracking-tighter", children: "Dark Market Data Broker" }),
          /* @__PURE__ */ jsx("div", { className: "text-[9px] text-zinc-500 font-mono", children: "ENCRYPTED P2P // ONION ROUTING ACTIVE" })
        ]})
      ]})
    }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 h-full z-10 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-2/3 bg-black/40 border border-zinc-900/50 p-4 rounded overflow-y-auto custom-scrollbar flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-zinc-400 font-bold uppercase tracking-wider mb-2 border-b border-zinc-900/50 pb-2 text-xs flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Database, { className: "w-4 h-4" }),
          " Dostępne Pakiety Danych"
        ]}),
        !activeVictim ? (
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-zinc-600 opacity-50 space-y-3", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-xs text-center", children: ["OCZEKIWANIE NA KARTOTEKĘ...", /* @__PURE__ */ jsx("br", {}), "Wczytaj Akta aby przeanalizować wartość danych."] })
          ]})
        ) : (
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: 
            groups.map(group => {
              const isComplete = checkGroupComplete(group.fields);
              return /* @__PURE__ */ jsxs("div", { key: group.id, className: `p-3 border rounded flex items-center justify-between transition-colors ${isComplete ? 'border-zinc-500 bg-zinc-900/20' : 'border-zinc-900/50 bg-black'}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  isComplete ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-zinc-400" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 text-zinc-800" }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase ${isComplete ? 'text-zinc-300' : 'text-zinc-700'}`, children: group.name })
                ]}),
                /* @__PURE__ */ jsxs("div", { className: `text-xs font-mono font-bold ${isComplete ? 'text-zinc-400' : 'text-zinc-800'}`, children: [group.value, " PLN"] })
              ]});
            })
          })
        )
      ]}),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/3 bg-black/60 border border-zinc-900/50 p-4 rounded flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-zinc-400 font-bold uppercase tracking-wider mb-4 border-b border-zinc-900/50 pb-2 text-xs flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }),
            " Portfel Transakcyjny"
          ]}),
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-950/50 border border-zinc-900/50 p-4 rounded mb-6 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-zinc-500 uppercase mb-1", children: "Potencjalny Zysk" }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-black text-zinc-300 tracking-tighter block", children: [calculateTotalValue().toLocaleString('pl-PL'), " PLN"] })
          ]}),
          isUploading && /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[9px] text-zinc-500 font-mono tracking-widest uppercase", children: [
              /* @__PURE__ */ jsx("span", { children: "Szyfrowanie i Transfer..." }),
              /* @__PURE__ */ jsxs("span", { children: [Math.round(uploadProgress), "%"] })
            ]}),
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-zinc-950 rounded overflow-hidden", children: 
              /* @__PURE__ */ jsx("div", { className: "h-full bg-zinc-500 transition-all duration-100", style: { width: `${uploadProgress}%` } })
            })
          ]}),
          uploadComplete && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-zinc-900/20 border border-zinc-500/30 rounded flex items-center gap-3 animate-in fade-in zoom-in", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "w-8 h-8 text-zinc-400" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-zinc-500 uppercase font-bold", children: "Transfer Zakończony" }),
              /* @__PURE__ */ jsxs("div", { className: "text-zinc-300 font-mono font-bold text-sm", children: ["+", earnedAmount.toLocaleString('pl-PL'), " PLN"] })
            ]})
          ]})
        ]}),
        /* @__PURE__ */ jsxs("button", { 
          onClick: handleUpload,
          disabled: isUploading || !activeVictim || calculateTotalValue() === 0,
          className: `w-full py-4 rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isUploading || !activeVictim || calculateTotalValue() === 0 ? 'bg-zinc-950 border border-zinc-900 text-zinc-800 cursor-not-allowed' : 'bg-zinc-900/50 hover:bg-zinc-800 border-zinc-500 text-zinc-300 border hover:border-zinc-400 shadow-[0_0_15px_rgba(113,113,122,0.1)] hover:scale-[1.02]'}`,
          children: [
            /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
            isUploading ? 'Przetwarzanie...' : 'Sprzedaj Pakiet'
          ]
        })
      ]})
    ]})
  ]});
};

export default DarkMarket;
