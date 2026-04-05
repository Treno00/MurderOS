import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { UserX } from "lucide-react";
import { usePoliceMissing } from "../../../Scripts/Intel/LawEnforcement/usePoliceMissing.js";
const PoliceMissing = () => {
  const {
    missingPersons,
    handleSendData,
    isAllSegmentsComplete
  } = usePoliceMissing();
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    if (missingPersons.length > 0 && (!selectedPerson || !missingPersons.find(p => p.id === selectedPerson.id))) {
      setSelectedPerson(missingPersons[0]);
    } else if (missingPersons.length === 0) {
      setSelectedPerson(null);
    }
  }, [missingPersons, selectedPerson]);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full gap-4 text-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 p-4 bg-agency-dark border border-blue-900/30 rounded shadow-lg", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-mono text-blue-500 flex items-center gap-2 border-b border-blue-900/30 pb-2", children: [
        /* @__PURE__ */ jsx(UserX, { className: "w-5 h-5" }),
        "BAZA ZAGINIONYCH"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar", children: [
        missingPersons.map((p) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedPerson(p),
            className: `p-3 rounded border cursor-pointer transition-colors ${selectedPerson?.id === p.id ? "bg-blue-900/20 border-blue-500" : "bg-black border-agency-border hover:border-blue-900/50"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-blue-100 text-sm", children: [
                  p.firstName,
                  " ",
                  p.lastName
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-blue-900/50 text-blue-200 px-1 rounded", children: "AKTYWNY" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-blue-500/70 font-mono mt-1", children: [
                "WIEK: ",
                p.age,
                " LAT"
              ] })
            ]
          },
          p.id
        )),
        missingPersons.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-slate-500 py-8 font-mono text-sm", children: "BRAK AKTYWNYCH ZG\u0141OSZE\u0143" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-agency-dark border border-agency-border rounded p-6 flex flex-col relative overflow-hidden", children: selectedPerson ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-6 border-b border-agency-border pb-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-black text-white uppercase", children: [
          selectedPerson.firstName,
          " ",
          selectedPerson.lastName
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-blue-500", children: [
          "ZG\u0141OSZENIE # ",
          selectedPerson.id.slice(0, 8).toUpperCase()
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-blue-900/20", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-blue-600 uppercase font-bold mb-1", children: "Ostatnia Lokalizacja" }),
          /* @__PURE__ */ jsxs("span", { className: "text-white font-mono text-sm", children: [
            selectedPerson.livingAddress,
            " (",
            selectedPerson.livingCity,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-4 rounded border border-blue-900/20", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-blue-600 uppercase font-bold mb-1", children: "Status" }),
          /* @__PURE__ */ jsx("span", { className: "text-blue-400 font-mono text-sm uppercase animate-pulse", children: "ZAGINIONY" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col gap-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-blue-950/10 border border-blue-900/30 p-4 rounded flex items-center justify-between mt-auto", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-blue-600 uppercase font-bold", children: "Wymagane Dzia\u0142ania" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: "Uzupe\u0142nij akta sprawy, aby przes\u0142a\u0107 raport." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSendData(selectedPerson),
            disabled: !isAllSegmentsComplete,
            className: `px-6 py-2 rounded font-bold uppercase text-xs transition-colors ${isAllSegmentsComplete ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`,
            children: "Prze\u015Blij Dane"
          }
        )
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-700 opacity-30", children: [
      /* @__PURE__ */ jsx(UserX, { className: "w-24 h-24 mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs uppercase tracking-widest", children: "WYBIERZ OSOB\u0118 Z LISTY" })
    ] }) })
  ] });
};
var stdin_default = PoliceMissing;
export {
  stdin_default as default
};
