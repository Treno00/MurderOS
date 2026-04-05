import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { Crosshair, MapPin, Calendar, Clock, Sword, Shield, AlertTriangle, CloudRain, Moon, Info } from "lucide-react";

const ActionPlanning = ({ onComplete }) => {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("Poniedziałek");
  const [selectedTime, setSelectedTime] = useState("02:00");
  
  // Arsenal
  const [primaryWeapon, setPrimaryWeapon] = useState("Brak");
  const [secondaryWeapon, setSecondaryWeapon] = useState("Brak");

  // Clothing
  const [gear, setGear] = useState({ head: "", torso: "", legs: "", hands: "", feet: "" });

  // Get active victims and populate
  const victims = GameState.getVictimFiles().filter(v => v.pesel);
  const activeVictim = victims.find(v => v.id === selectedTarget) || null;
  const inventory = GameState.getInventory();

  const getAvailableLocations = () => {
    if (!activeVictim) return [];
    const locs = [];
    if (activeVictim.registeredAddress) locs.push(`Zameldowania: ${activeVictim.registeredAddress}`);
    if (activeVictim.livingAddress) locs.push(`Zamieszkania: ${activeVictim.livingAddress}`);
    if (activeVictim.currentAddress) locs.push(`Aktualny: ${activeVictim.currentAddress}`);
    if (activeVictim.workAddress) locs.push(`Praca: ${activeVictim.workAddress}`);
    return locs;
  };

  const predictionContext = useMemo(() => {
     let riskScore = 0;
     let desc = "";
     const hr = parseInt(selectedTime.split(':')[0]);
     
     let targetHome = true;
     let targetAtWork = false;

     // Dni robocze: 9-17 praca
     if (hr >= 9 && hr <= 17 && selectedDay !== "Sobota" && selectedDay !== "Niedziela") {
        targetAtWork = true;
        targetHome = false;
     }

     // Apply occupation-specific modifiers (if any)
     if (activeVictim && activeVictim.employment && activeVictim.employment.includes("Nocn")) {
         // Nocna zmiana: 22:00 - 06:00
         if ((hr >= 22 || hr <= 6) && selectedDay !== "Niedziela") {
             targetAtWork = true;
             targetHome = false;
         } else {
             targetAtWork = false;
             targetHome = true;
         }
     }

     // Własny biznes - elastyczne godziny ale głównie dzień
     if (activeVictim && activeVictim.employment && activeVictim.employment.includes("Własna działalność")) {
         if (hr >= 10 && hr <= 16 && selectedDay !== "Sobota" && selectedDay !== "Niedziela") {
             targetAtWork = true;
             targetHome = false;
         }
     }

     // Determine exact Target state:
     let targetState = "W_DOMU";
     if (targetAtWork) {
         targetState = "W_PRACY";
     } else {
         if (hr >= 23 || hr <= 6) {
             targetState = "ŚPI";
         } else {
             targetState = "W_DOMU";
         }
     }

     // Determine Location Mode
     let isLocWork = selectedLocation.includes("Praca");
     let isLocHome = !isLocWork && selectedLocation.trim().length > 0;
     
     let locationMismatch = false;
     if (isLocWork && !targetAtWork) locationMismatch = true;
     if (isLocHome && !targetHome) locationMismatch = true;

     // Neighbors & Cohabitation context
     let neighborsAlertness = (hr >= 23 || hr <= 5) ? 20 : (hr >= 16 && hr <= 22) ? 90 : 60; // w nocy niska, wieczorem bardzo wysoka (wszyscy w domach), w dzien srednia (wiele osob w pracy)
     let cohabitantsPresent = false;
     if (activeVictim?.relationshipStatus?.includes("W związku") || activeVictim?.relationshipStatus?.includes("Żonaty") || activeVictim?.relationshipStatus?.includes("Zamężna")) {
         if ((targetState === "ŚPI" || targetState === "W_DOMU") && isLocHome) {
             cohabitantsPresent = true; // partner zazwyczaj jest z nimi w domu/śpi w tych samych porach
         }
     }

     // Calculate general risk score
     if (locationMismatch) {
         riskScore = 10;
         desc = "Pusty obiekt. Jeśli wtargniesz i w środku nikogo nie będzie, to idealny moment na przeszukanie lub pułapkę. Cel jest gdzie indziej.";
     } else {
         if (isLocWork) {
             riskScore = 80;
             desc = "Atak w godzinach pracy. Gwarantowani współpracownicy i duży ruch. Ekstremalne ryzyko.";
         } else if (isLocHome) {
             if (targetState === "ŚPI") {
                 riskScore = cohabitantsPresent ? 40 : 15;
                 desc = `Środek nocy. ${cohabitantsPresent ? "Obiekt śpi, ale uwaga – domownik (partner) również znajduje się w lokalu. Musisz uważać na hałas." : "Obiekt śpi sam. Doskonała okazja na bezszelestną penetrację i eliminację we śnie."}`;
             } else if (hr >= 7 && hr <= 15) {
                 riskScore = 50;
                 desc = "Obiekt w pełnej gotowości. Niektórzy sąsiedzi w pracy, ale czujność wciąż wysoka. Spodziewaj się oporu.";
             } else {
                 riskScore = cohabitantsPresent ? 85 : 70;
                 desc = `Wieczór. Tętniące życiem bloki to fatalne miejsce na szturm. ${cohabitantsPresent ? "Obiekt i partner nie śpią!" : "Obiekt gotowy do brony. Wysoka uwaga sąsiadów."}`;
             }
         }
     }

     return { 
         score: Math.min(100, riskScore), 
         desc, 
         targetState, 
         locationMismatch, 
         neighborsAlertness, 
         cohabitantsPresent 
     };
  }, [selectedTime, selectedLocation, selectedDay, activeVictim]);

  const getRiskColor = (score) => {
     if (score < 30) return "text-emerald-500";
     if (score < 70) return "text-amber-500";
     return "text-agency-danger";
  };

  const getGearOptions = (subCat) => {
    const items = inventory.filter(i => i.category === "Ubiór" && i.subcategory === subCat);
    const unique = [];
    const seen = new Set();
    for (const i of items) {
      if (!seen.has(i.marketId)) {
        seen.add(i.marketId);
        unique.push(i);
      }
    }
    return unique;
  };

  const updateGear = (part, value) => {
    setGear(prev => ({...prev, [part]: value}));
  };

  const handleConfirm = () => {
    if (!selectedTarget) return alert("Musisz wybrać cel!");
    if (!selectedLocation) return alert("Musisz wybrać miejsce akcji!");
    
    const loadout = {
      head: inventory.find(i => i.marketId === gear.head) || null,
      torso: inventory.find(i => i.marketId === gear.torso) || null,
      legs: inventory.find(i => i.marketId === gear.legs) || null,
      hands: inventory.find(i => i.marketId === gear.hands) || null,
      feet: inventory.find(i => i.marketId === gear.feet) || null,
    };
    GameState.setLoadout(loadout);
    GameState.currentActionPlan = {
      targetId: selectedTarget,
      location: selectedLocation,
      day: selectedDay,
      time: selectedTime,
      risk: predictionContext.score,
      targetState: predictionContext.targetState,
      locationMismatch: predictionContext.locationMismatch,
      cohabitantsPresent: predictionContext.cohabitantsPresent,
      stealthBreach: null // Będzie wypełnione we Włamaniu
    };
    onComplete && onComplete();
  };

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex gap-4 text-slate-200 animate-in fade-in custom-scrollbar overflow-y-auto p-4", children: [
    
    /* LEFT COLUMN: Setup */
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4 relative z-10", children: [
      
      /* @__PURE__ */ jsxs("div", { className: "bg-black/90 border border-zinc-700 rounded shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center py-6 border-t-4 border-t-agency-main", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-black text-white text-xl tracking-widest uppercase mb-1", children: "Briefing Taktyczny" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-slate-500", children: "PLANOWANIE ELIMINACJI CELU" })
      ]}),
      
      /* Cel */
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-700 rounded p-4 relative overflow-hidden flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-[9px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2", children: [/* @__PURE__ */ jsx(Crosshair, { className: "w-3 h-3" }), "Cel Operacji"] }),
        /* @__PURE__ */ jsxs("select", { 
          className: "w-full bg-black border border-zinc-700 p-3 rounded text-sm font-mono text-slate-300 focus:border-agency-main outline-none",
          value: selectedTarget,
          onChange: (e) => setSelectedTarget(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "-- Baza Ofiar --" }),
            victims.map(v => /* @__PURE__ */ jsx("option", { value: v.id, key: v.id, children: `${v.firstName} ${v.lastName} (${v.pesel})` }))
          ]
        })
      ]}),

      /* Miejsce */
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-700 rounded p-4 relative overflow-hidden flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-[9px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2", children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }), "Lokalizacja Uderzenia"] }),
        /* @__PURE__ */ jsxs("select", { 
          className: "w-full bg-black border border-zinc-700 p-3 rounded text-sm font-mono text-slate-300 focus:border-agency-main outline-none",
          value: selectedLocation,
          onChange: (e) => setSelectedLocation(e.target.value),
          disabled: !activeVictim,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: activeVictim ? "-- Punkty Dostępu --" : "Skonfiguruj Cel..." }),
            getAvailableLocations().map(loc => /* @__PURE__ */ jsx("option", { value: loc, key: loc, children: loc }))
          ]
        })
      ]}),

      /* Czas Akcji */
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-700 rounded p-4 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-[9px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2", children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), "Wektor Czasu"] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("select", { 
            className: "flex-1 bg-black border border-zinc-700 p-3 rounded text-sm font-mono text-slate-300 focus:border-agency-main outline-none",
            value: selectedDay,
            onChange: (e) => setSelectedDay(e.target.value),
            children: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map(d => /* @__PURE__ */ jsx("option", { value: d, key: d, children: d }))
          }),
          /* @__PURE__ */ jsx("input", { 
            type: "time",
            className: "w-1/3 bg-black border border-zinc-700 p-3 rounded text-sm font-mono text-slate-300 focus:border-agency-main outline-none text-center",
            value: selectedTime,
            onChange: (e) => setSelectedTime(e.target.value)
          })
        ]})
      ]})

    ]}),

    /* MIDDLE: Risk & Info */
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-4 relative z-10", children: [
       /* RISK ASSESSMENT BOARD */
       /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-black/80 border border-zinc-800 rounded p-6 shadow-xl flex flex-col relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agency-main/0 via-agency-main to-agency-main/0 opacity-50"}),
          /* @__PURE__ */ jsxs("h3", { className: "text-zinc-500 font-bold uppercase tracking-widest mb-6 flex items-center justify-between text-xs", children: [
             /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }), "Analiza Sytuacyjna"] }),
             "AI PREDICTIVE MODEL v2.0"
          ]}),
          
          /* Risk Meter */
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-end gap-6 mb-8", children: [
             /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                 /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest", children: "Wskaźnik Wykrywalności" }),
                 /* @__PURE__ */ jsxs("span", { className: `text-6xl font-black ${getRiskColor(predictionContext.score)}`, children: [ predictionContext.score, /* @__PURE__ */ jsx("span", { className: "text-lg", children: "%" }) ]})
             ]}),
          ]}),

          /* Briefing Context */
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-950 p-4 border border-zinc-800/50 rounded flex flex-col gap-3 font-mono text-xs text-slate-400 mb-6 flex-1", children: [
             /* @__PURE__ */ jsxs("p", { className: "flex gap-2", children: [ /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-purple-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: predictionContext.desc }) ] }),
             // Dynamic info based on target relation
             predictionContext.cohabitantsPresent ?
                /* @__PURE__ */ jsxs("p", { className: "flex gap-2", children: [ /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-agency-main shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Profil wskazuje na aktywną obecność partnera w domu. W przypadku cichego wejścia do śpiących osób, unikaj krzyku za wszelką cenę." }) ] })
             : 
                /* @__PURE__ */ jsxs("p", { className: "flex gap-2", children: [ /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: predictionContext.locationMismatch ? "UWAGA: Symulacje czasowe wskazują, że cel fizycznie NIE JEST na miejscu. To idealna okazja do zasadzki lub pułapki." : "Profil samotnika lub partner nieobecny. Cel z dużym prawdopodobieństwem w izolacji środowiskowej." }) ] })
          ]}),

          /* Start Button */
          /* @__PURE__ */ jsx("button", {
            onClick: handleConfirm,
            className: "mt-auto bg-agency-main hover:bg-agency-main/80 text-black font-black uppercase tracking-widest py-5 rounded shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all transform hover:scale-[1.01] text-lg",
            children: "ZATWIERDŹ WEKTOR I WYRUSZ"
          })
       ]})
    ]}),

    /* RIGHT COLUMN: Loadout / Clothing */
    /* @__PURE__ */ jsxs("div", { className: "w-72 flex flex-col gap-4 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-700 rounded p-4 flex-1 flex flex-col shadow-xl", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-zinc-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }), "Loadout (Ubiór)"
        ]}),

        /* Ubiór Slots */
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          [
            { id: "head", label: "Twarz", subCat: "Głowa" },
            { id: "torso", label: "Tułów", subCat: "Tułów" },
            { id: "legs", label: "Nogi", subCat: "Nogi" },
            { id: "hands", label: "Dłonie", subCat: "Dłonie" },
            { id: "feet", label: "Stopy", subCat: "Stopy" }
          ].map((slot, i) => (
            /* @__PURE__ */ jsxs("div", { key: slot.id, className: "flex flex-col gap-1 relative", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[9px] text-zinc-500 uppercase font-bold pl-1 border-l border-zinc-600", children: ["0", i+1, " // ", slot.label] }),
              /* @__PURE__ */ jsxs("select", {
                className: "bg-black border border-zinc-800 p-2 text-xs font-mono text-zinc-300 focus:border-agency-main outline-none w-full appearance-none",
                value: gear[slot.id],
                onChange: (e) => updateGear(slot.id, e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "[ ... ]" }),
                  getGearOptions(slot.subCat).map(item => /* @__PURE__ */ jsx("option", { key: item.marketId, value: item.marketId, children: item.name }))
                ]
              })
            ]})
          ))
        ]})
      ]})
    ]})
  ]});
};

export default ActionPlanning;
