import { jsx, jsxs } from "react/jsx-runtime";
import { DollarSign, Lock, ArrowUpRight, ArrowDownLeft, Key, Download, CreditCard, Activity, Wifi, ShieldCheck, Server } from "lucide-react";
import { useBankingSystem } from "../../../Scripts/Intel/Finances/useBankingSystem.js";
import { useGame } from "../../../Scripts/App/GameContext.js";
const BankingSystem = () => {
  const { networkTrace } = useGame();
  const {
    searchClientId,
    setSearchClientId,
    results,
    selectedCitizen,
    isUnlocked,
    isDecoding,
    showAuthModal,
    setShowAuthModal,
    inputBankClientId,
    setInputBankClientId,
    inputBankName,
    setInputBankName,
    authError,
    handleUnlockClick,
    attemptUnlock,
    handleDownload,
    showDownloadBtn
  } = useBankingSystem();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200 font-mono", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-emerald-900/30 rounded shadow-lg relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-5 pointer-events-none",
          style: { backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)", backgroundSize: "20px 20px" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-emerald-900/50 pb-2 relative z-10", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-emerald-500 flex items-center gap-2 tracking-wider", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5" }),
          "SYSTEM BANKOWY"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] font-mono bg-black/50 px-2 py-1 rounded border border-emerald-900/30", title: "\u015Alad Sieciowy", children: [
          /* @__PURE__ */ jsx(Wifi, { className: `w-3 h-3 ${networkTrace > 50 ? "text-red-500 animate-pulse" : "text-emerald-500"}` }),
          /* @__PURE__ */ jsxs("span", { className: networkTrace > 70 ? "text-red-500 font-bold" : "text-emerald-500", children: [
            Math.round(networkTrace),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 relative z-10", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "text-[9px] text-emerald-600/70 uppercase font-bold mb-1 block flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "ID Klienta" }),
          /* @__PURE__ */ jsx("span", { className: "text-[8px] opacity-50", children: "REQ_FIELD_01" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchClientId,
            onChange: (e) => setSearchClientId(e.target.value),
            className: "w-full bg-black border border-emerald-900/50 p-2 text-sm focus:border-emerald-500 outline-none rounded text-emerald-100 placeholder:text-emerald-900/50 transition-all",
            placeholder: "Wprowad\u017A ID..."
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar relative z-10 mt-2", children: results.length > 0 ? results.map((citizen) => /* @__PURE__ */ jsxs("div", { className: "group bg-black/40 border border-emerald-900/30 p-3 rounded hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all cursor-pointer relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-emerald-100 tracking-wide text-sm group-hover:text-white transition-colors", children: [
              citizen.firstName,
              " ",
              citizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-emerald-600/70 mb-2 font-mono flex gap-2 items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-900 group-hover:bg-emerald-500 transition-colors" }),
              /* @__PURE__ */ jsx("span", { children: citizen.city })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono text-emerald-800 group-hover:text-emerald-600", children: [
            "ID: ",
            citizen.id.slice(-4)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black/60 border border-emerald-900/30 p-2 rounded flex justify-between items-center group-hover:border-emerald-500/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-mono text-[10px] text-emerald-500/80 tracking-tighter", children: [
            citizen.bankAccount.slice(0, 4),
            " **** **** ",
            citizen.bankAccount.slice(-4)
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleUnlockClick(citizen),
              className: "text-[10px] bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1 font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
              children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
                " Dost\u0119p"
              ]
            }
          )
        ] })
      ] }, citizen.id)) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-emerald-900/40", children: [
        /* @__PURE__ */ jsx(Server, { className: "w-12 h-12 mb-2 opacity-20" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center font-mono text-[10px] tracking-widest", children: [
          "OCZEKIWANIE NA DANE",
          /* @__PURE__ */ jsx("br", {}),
          "SYSTEM GOTOWY"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-agency-dark border border-emerald-900/30 rounded relative overflow-hidden flex flex-col shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 opacity-10 pointer-events-none",
          style: { backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22 opacity=%220.4%22/%3E%3C/svg%3E')] opacity-5" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent opacity-20 animate-scan" }),
      isDecoding && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-500" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-500" }),
          /* @__PURE__ */ jsx("div", { className: "text-emerald-500 font-mono text-xl font-bold mb-6 animate-pulse text-center tracking-[0.2em]", children: "PRZE\u0141AMYWANIE ZABEZPIECZE\u0143" }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-emerald-900/30 rounded-full overflow-hidden mb-2", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[progress_3s_ease-in-out_forwards] w-full origin-left transform scale-x-0" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-emerald-700", children: [
            /* @__PURE__ */ jsx("span", { children: "BYPASSING_FIREWALL..." }),
            /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "PROCESSING" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-4 gap-2 opacity-30", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-1 bg-emerald-500 rounded animate-pulse", style: { animationDelay: `${i * 100}ms` } }, i)) })
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                    @keyframes progress {
                        0% { transform: scaleX(0); }
                        100% { transform: scaleX(1); }
                    }
                ` })
      ] }),
      showAuthModal && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-agency-dark border border-emerald-600 w-96 p-6 rounded shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" }),
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-emerald-500 mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-emerald-900/50 pb-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-4 h-4" }),
          " Autoryzacja Dost\u0119pu"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mb-6 font-mono leading-relaxed", children: "Wymagane pe\u0142ne potwierdzenie to\u017Csamo\u015Bci w celu uzyskania dost\u0119pu do danych wra\u017Cliwych." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "group", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-emerald-700 group-focus-within:text-emerald-500 transition-colors block mb-1", children: "ID Klienta Banku" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inputBankClientId,
                onChange: (e) => setInputBankClientId(e.target.value),
                className: "w-full bg-black border border-emerald-900/50 p-2 text-emerald-400 font-mono text-sm outline-none focus:border-emerald-500 transition-colors rounded-sm",
                placeholder: "XXXXXXXX"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "group", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] uppercase font-bold text-emerald-700 group-focus-within:text-emerald-500 transition-colors block mb-1", children: "Nazwa Banku" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: inputBankName,
                onChange: (e) => setInputBankName(e.target.value),
                className: "w-full bg-black border border-emerald-900/50 p-2 text-emerald-400 font-mono text-sm outline-none focus:border-emerald-500 transition-colors rounded-sm",
                placeholder: "Np. PKO BP"
              }
            )
          ] }),
          authError && /* @__PURE__ */ jsxs("div", { className: "text-red-500 text-[10px] font-bold bg-red-950/20 p-2 border border-red-900/50 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }),
            " ",
            authError
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowAuthModal(false),
                className: "flex-1 bg-transparent border border-emerald-900/50 hover:bg-emerald-900/20 text-emerald-600 py-2 rounded text-xs font-bold transition-all",
                children: "ANULUJ"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: attemptUnlock,
                className: "flex-1 bg-emerald-700 hover:bg-emerald-600 text-black py-2 rounded text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all",
                children: "INICJUJ PRZE\u0141AMANIE"
              }
            )
          ] })
        ] })
      ] }) }),
      isUnlocked && selectedCitizen ? /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-emerald-900/30 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-500 font-bold tracking-widest uppercase", children: "PO\u0141\u0104CZENIE ZABEZPIECZONE" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-white tracking-widest uppercase", children: [
              selectedCitizen.firstName,
              " ",
              selectedCitizen.lastName
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-emerald-600 tracking-wider text-xs mt-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "IBAN:" }),
              " ",
              selectedCitizen.bankAccount
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-4 text-[10px] font-mono text-emerald-100 bg-emerald-950/20 p-3 rounded border border-emerald-900/30 inline-flex items-center shadow-inner", children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 text-emerald-500" }),
              /* @__PURE__ */ jsx("span", { className: "tracking-widest", children: selectedCitizen.creditCard }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-800", children: "|" }),
              /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
                "EXP: ",
                selectedCitizen.cardExpiry
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-800", children: "|" }),
              /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
                "CVV: ",
                selectedCitizen.cardCvv
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-emerald-700 uppercase tracking-widest mb-1 font-bold", children: "Saldo Dost\u0119pne" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-mono text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]", children: selectedCitizen.accountBalance.toLocaleString("pl-PL", { style: "currency", currency: "PLN" }) }),
            showDownloadBtn && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleDownload,
                className: "mt-4 text-[10px] flex items-center gap-2 text-emerald-400 hover:text-emerald-200 ml-auto transition-colors bg-black border border-emerald-900/50 px-3 py-1.5 rounded hover:bg-emerald-900/20",
                children: [
                  /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
                  " EKSPORTUJ DANE"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar pr-2", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-[10px] uppercase tracking-widest text-emerald-600 mb-4 font-bold flex items-center gap-2 sticky top-0 bg-agency-dark/95 backdrop-blur py-2 z-20 border-b border-emerald-900/30", children: [
            /* @__PURE__ */ jsx(Activity, { className: "w-3 h-3" }),
            "Historia Transakcji"
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-[10px] text-emerald-800 border-b border-emerald-900/30 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx("th", { className: "py-3 pl-2 font-bold", children: "Data Operacji" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 font-bold", children: "Odbiorca / Nadawca" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 font-bold", children: "Typ" }),
              /* @__PURE__ */ jsx("th", { className: "py-3 pr-2 text-right font-bold", children: "Kwota" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "font-mono text-xs", children: selectedCitizen.transactions.map((tx, idx) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-emerald-900/10 hover:bg-emerald-500/5 transition-colors group", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 pl-2 text-emerald-600/70 group-hover:text-emerald-400 transition-colors", children: tx.date }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 flex items-center gap-2", children: [
                tx.encrypted && /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3 text-emerald-700" }),
                /* @__PURE__ */ jsx("span", { className: tx.encrypted ? "text-emerald-800 blur-[2px] hover:blur-none transition-all cursor-help" : "text-emerald-100", children: tx.recipient })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3", children: tx.type === "incoming" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-emerald-400 text-[9px] bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded w-fit shadow-[0_0_10px_rgba(16,185,129,0.1)]", children: [
                /* @__PURE__ */ jsx(ArrowDownLeft, { className: "w-2 h-2" }),
                " WP\u0141YW"
              ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-red-400 text-[9px] bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded w-fit", children: [
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-2 h-2" }),
                " WYDATEK"
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: `py-3 pr-2 text-right font-bold ${tx.type === "incoming" ? "text-emerald-400" : "text-slate-400"}`, children: [
                tx.type === "incoming" ? "+" : "-",
                tx.amount.toLocaleString("pl-PL", { minimumFractionDigits: 2 })
              ] })
            ] }, tx.id)) })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-emerald-900/30 relative z-10", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-32 h-32 opacity-10 mb-6 animate-pulse" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-[0.3em] text-emerald-800 font-bold", children: "Wybierz cel do inwigilacji" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-[9px] font-mono text-emerald-900/50", children: "SECURE_CONNECTION_ESTABLISHED" })
      ] })
    ] })
  ] });
};
var stdin_default = BankingSystem;
export {
  stdin_default as default
};
