import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { Brush, Droplet, Dna, Fingerprint, Wind, FlaskConical, SearchCode, CheckCircle2, AlertTriangle, Footprints } from "lucide-react";

const TraceBar = ({ label, value, max, unit, icon: Icon, color, isSecret, secretText }) => {
   const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
   
   return /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-zinc-800 p-3 rounded mb-2 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute bottom-0 left-0 h-1 ${color} transition-all duration-500`, style: { width: `${isSecret ? 0 : percent}%` } }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between relative z-10", children: [
         /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${color.replace('bg-', 'text-')}` }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-300 uppercase tracking-wider", children: label })
         ]}),
         /* @__PURE__ */ jsx("div", { className: "font-mono text-xs font-bold text-white", children: 
            isSecret ? secretText : `${Math.round(value)}${unit}`
         })
      ]})
   ]});
};

const ActionCleanup = ({ onComplete }) => {
  const [phase, setPhase] = useState("CLEANING"); // CLEANING, DONE
  const loadout = GameState.getLoadout() || {};
  
  // Traces State
  const vitals = GameState.recentDeceasedVitals || {};
  const mods = vitals.sceneModifiers || { addedBlood: 0, addedWaste: 0, addedFumes: 0, addedDna: 0, timeSpent: 0 };

  const [bloodVolume, setBloodVolume] = useState((vitals.externalBloodLoss ? Math.round(vitals.externalBloodLoss) : 1500) + mods.addedBlood); 
  const [chemicalWaste, setChemicalWaste] = useState(mods.addedWaste); 
  const [latentBlood, setLatentBlood] = useState(100); 
  const [latentRevealed, setLatentRevealed] = useState(false);
  
  // Mechaniczne stany zepsucia i błędów
  const [isWet, setIsWet] = useState((vitals.externalBloodLoss + mods.addedBlood) > 0 || mods.addedWaste > 0);
  const [bleachUsed, setBleachUsed] = useState(false);
  const [acidUsed, setAcidUsed] = useState(false);
  const [vacuumBroken, setVacuumBroken] = useState(false);

  // Start values depend on equipped gear from ActionPlanning
  const [dnaTraces, setDnaTraces] = useState(() => {
     let val = 100 + mods.addedDna;
     if (loadout.head?.marketId === 'c2') val -= 40; // Czepek chroni włosy
     if (loadout.head?.marketId === 'c1') val -= 20; // Kominiarka
     if (loadout.head?.marketId === 'c3') val -= 10; // Maska p.gazowa redukuje DNA ze śliny
     if (loadout.torso?.marketId === 'c5') val -= 50; // Tyvek chroni przed martwym naskórkiem
     if (loadout.hands) val -= 10;
     return Math.max(0, Math.min(100, val));
  }); 
  const [fingerprints, setFingerprints] = useState(() => {
     return loadout.hands ? 0 : 100; // Rękawiczki zapobiegają pozostawieniu odcisków palców
  }); 
  const [scent, setScent] = useState(() => {
     let val = 100;
     if (loadout.torso?.marketId === 'c5') val -= 40; 
     if (loadout.feet?.marketId === 'c16') val -= 20; 
     if (loadout.head?.marketId === 'c3') val -= 30; 
     return Math.max(0, val);
  }); 
  const [footprints, setFootprints] = useState(() => {
     return loadout.feet?.marketId === 'c16' ? 0 : 100; 
  }); 

  const [fumes, setFumes] = useState(mods.addedFumes); 
  const [timeSpent, setTimeSpent] = useState(mods.timeSpent); 

  const [logMessages, setLogMessages] = useState([]);

  const addLog = (msg, isError = false) => {
      setLogMessages(prev => [ { msg, isError }, ...prev ].slice(0, 5));
  };

  const inventory = GameState.getInventory();
  const getQty = (marketId) => {
     const item = inventory.find(i => i.marketId === marketId);
     return item ? item.quantity : 0;
  };
  const hasItem = (marketId) => getQty(marketId) > 0;
  const hasUV = hasItem("e8");

  const totalTraces = bloodVolume + chemicalWaste + latentBlood + dnaTraces + fingerprints + scent + fumes + footprints;

  // Wspólna funkcja reagująca na bałagan butami przy każdej pracy
  const messUpFootprints = () => {
      if (loadout.feet?.marketId !== 'c16' && footprints < 50) {
          setFootprints(v => Math.min(100, v + 25));
      }
  };

  const actions = [
    {
      category: "Ślady Płynne (Krew i Odpady)",
      id: "CLEAN_BLOOD",
      name: "Zmywanie Krwi (H₂O₂)",
      desc: "Używa Perhydrolu do spienienia widocznej krwi. Zwiększa ilość chemicznych odpadów, moczy powierzchnię.",
      reqItems: [{ id: "ch1", name: "H₂O₂ (500ml)", qty: 1 }],
      canDo: bloodVolume > 0 && getQty("ch1") >= 1,
      execute: () => {
        GameState.consumeItemFromInventory("ch1", 1);
        const cleaned = Math.min(bloodVolume, 1500);
        setBloodVolume(v => Math.max(0, v - cleaned));
        setChemicalWaste(v => v + cleaned);
        setFumes(v => Math.min(100, v + 15));
        setIsWet(true);
        setTimeSpent(t => t + 10);
        messUpFootprints();
        addLog(`Użyto roztworu H2O2. Zmyto ${cleaned}ml krwi, zostawiając mokre odpady chemiczne.`);
      }
    },
    {
      category: "Ślady Płynne (Krew i Odpady)",
      id: "SORBENT",
      name: "Zasypanie Sorbentem (SiO₂)",
      desc: "Związuje mokre odpady chemiczne (z kwasów lub H2O2) w suchy granulat możliwy do odkurzenia.",
      reqItems: [{ id: "ch8", name: "Sorbent 2000g", qty: 1 }],
      canDo: chemicalWaste > 0 && getQty("ch8") >= 1,
      execute: () => {
        GameState.consumeItemFromInventory("ch8", 1);
        const cleaned = Math.min(chemicalWaste, 3000);
        setChemicalWaste(v => Math.max(0, v - cleaned));
        setIsWet(false); 
        setTimeSpent(t => t + 15);
        messUpFootprints();
        addLog("Sorbent związał rozlane odpady. Powierzchnia jest teraz sucha, ale pokryta ziarnem (wymaga odkurzenia).");
      }
    },
    {
      category: "Ślady Utajone i Mikroślady",
      id: "LUMINOL",
      name: "Detekcja Kryminalna (Luminol)",
      desc: "Ujawnia niewidoczne gołym okiem zmyte ślady krwi, pokazując realny wskaźnik utajonych śladów.",
      reqItems: [{ id: "ch5", name: "Luminol", qty: 1 }, { id: "e8", name: "Lampa UV", qty: 1, reusable: true }],
      canDo: !latentRevealed && getQty("ch5") >= 1 && hasUV,
      execute: () => {
        GameState.consumeItemFromInventory("ch5", 1);
        setLatentRevealed(true);
        setTimeSpent(t => t + 10);
        addLog("Spryskano teren luminolem. Ujawniono utajone ślady biologiczne (świecą w UV).");
      }
    },
    {
      category: "Ślady Utajone i Mikroślady",
      id: "BLEACH",
      name: "Dezynfekcja (Podchloryn Sodu)",
      desc: "Niszczy DNA i ukrytą krew (utajone). Uwaga: kontakt Podchlorynu z Kwasem wytwarza trujący gaz chlorowy!",
      reqItems: [{ id: "ch2", name: "NaClO (1000ml)", qty: 1 }],
      canDo: getQty("ch2") >= 1,
      execute: () => {
        GameState.consumeItemFromInventory("ch2", 1);
        setIsWet(true);
        messUpFootprints();
        setTimeSpent(t => t + 15);
        setBleachUsed(true);

        if (acidUsed) {
            setFumes(100);
            addLog("KATASTROFA CHEMICZNA! Podchloryn wszedł w reakcję z kwasem. Eksplozja toksycznego chloru!", true);
        } else if (bloodVolume > 0) {
            setLatentBlood(100);
            addLog("BŁĄD ZASAD: Użyto wybielacza na niezmytej krwi. Białka uległy koagulacji, wżerając ślady utajone w posadzkę!", true);
        } else {
            setLatentBlood(v => Math.max(0, v - 80));
            setFumes(v => Math.min(100, v + 40));
            addLog("Skutecznie wyjałowiono obszar wywabiając struktury utajone. Ostry zapach chloru rozniósł się po obiekcie.");
        }
      }
    },
    {
      category: "Ślady Utajone i Mikroślady",
      id: "ACID_WASH",
      name: "Skrajne Wytrawianie (Kwas Siarkowy)",
      desc: "Wypala absolutnie wszystko włącznie z drewnem i płytkami. Ekstremalnie niebezpieczne. Mieszanie z Chlorem = GAZ.",
      reqItems: [{ id: "ch6", name: "H₂SO₄", qty: 1 }],
      canDo: getQty("ch6") >= 1,
      execute: () => {
        GameState.consumeItemFromInventory("ch6", 1);
        setIsWet(true);
        messUpFootprints();
        setTimeSpent(t => t + 20);
        setAcidUsed(true);

        if (bleachUsed) {
            setFumes(100);
            addLog("KATASTROFA CHEMICZNA! Kwas wlany do podchlorynu. Eksplozja toksycznego gazu!", true);
        } else {
            setDnaTraces(0);
            setLatentBlood(0);
            setFingerprints(0);
            setChemicalWaste(v => v + 500); 
            setFumes(v => Math.min(100, v + 80)); 
            addLog("Zalano obszar żrącym roztworem. Wszystko zostało wypalone, pozostawiając groźne opary i ubytki w powierzchni.");
        }
      }
    },
    {
      category: "Ślady Utajone i Mikroślady",
      id: "VACUUM",
      name: "Odkurzanie Przemysłowe",
      desc: "Usuwa suche drobiny naskórka i włosów. Bezużyteczne i szkodliwe na mokrej posadzce.",
      reqItems: [{ id: "e9", name: "Odkurzacz Przem.", qty: 1, reusable: true }],
      canDo: hasItem("e9") && !vacuumBroken,
      execute: () => {
        setTimeSpent(t => t + 15);
        messUpFootprints();
        if (isWet) {
            setVacuumBroken(true);
            setDnaTraces(v => Math.max(0, v - 5));
            addLog("BŁĄD: Użyto odkurzacza na mokrą posadzkę lub kałużę chemii! Płyn zniszczył filtr HEPA i silnik urządzenia.", true);
        } else {
            setDnaTraces(v => Math.max(0, v - 60));
            addLog("Suche odkurzanie pomyślnie zebrało włosy, naskórek i inne cząstkowe mikroślady (DNA).");
        }
      }
    },
    {
      category: "Ślady Utajone i Mikroślady",
      id: "MOP",
      name: "Mopowanie Koncowe (Zmywanie butów)",
      desc: "Zmywa fizyczne odbicia podeszew z pomocą Acetonu. Usuwa Footprinty na stałe (o ile w pomieszczeniu już nic nie robisz).",
      reqItems: [{ id: "e5", name: "Mop", qty: 1, reusable: true }, { id: "ch7", name: "Aceton", qty: 1 }],
      canDo: hasItem("e5") && getQty("ch7") >= 1,
      execute: () => {
        GameState.consumeItemFromInventory("ch7", 1);
        setIsWet(false); 
        setFootprints(0);
        setDnaTraces(v => Math.max(0, v - 10)); // lekkie wspomaganie resztek
        setFumes(v => Math.min(100, v + 25));
        setTimeSpent(t => t + 15);
        addLog("Starannie zmopowano całą podłogę. Zniknęły ślady butów.");
      }
    },
    {
      category: "Atmosfera i Oczyszczanie",
      id: "VENT",
      name: "Rozszczelnienie / Wietrzenie",
      desc: "Powolne usuwanie gazów bez dotykania sprzętów. Obniża opary i zapach.",
      reqItems: [{ id: "e7", name: "Wentylator Przemysłowy", qty: 1, reusable: true, optional: true }],
      canDo: (scent > 0 || fumes > 0),
      execute: () => {
        const hasFan = hasItem("e7");
        const efficiency = hasFan ? 50 : 20;
        setScent(v => Math.max(0, v - efficiency));
        setFumes(v => Math.max(0, v - efficiency));
        setTimeSpent(t => t + (hasFan ? 15 : 45)); // Zajmuje duzo czasu jesli brak fana
        addLog(`Poddano mieszkanie wietrzeniu ${hasFan ? '(mechanicznemu)' : '(grawitacyjnemu)'}. Obniżono natężenie oparów.`);
      }
    },
    {
      category: "Atmosfera i Oczyszczanie",
      id: "OZONE",
      name: "Ozonowanie Pomieszczenia",
      desc: "Maszynowa dezynfekcja powietrza O₃. Unieszkodliwia gazy i niszczy DNA w kurzu z szafek.",
      reqItems: [{ id: "e6", name: "Agregat Ozonowy", qty: 1, reusable: true }],
      canDo: hasItem("e6"),
      execute: () => {
        setScent(0);
        setFumes(0);
        setDnaTraces(v => Math.max(0, v - 40));
        setTimeSpent(t => t + 60); // Bardzo dlugie oczekiwanie
        addLog("Zakończono Godzinne Ozonowanie. Zapach i większość lotnych oparów zniknęła definitywnie.");
      }
    }
  ];

  if (phase === "DONE") {
     const isPerfect = totalTraces === 0;
     
     return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in", children: [
        /* @__PURE__ */ jsx(Brush, { className: `w-24 h-24 ${isPerfect ? 'text-emerald-500' : 'text-amber-500'} mb-6` }),
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-black uppercase tracking-widest ${isPerfect ? 'text-emerald-500' : 'text-amber-500'} mb-2`, children: 
           isPerfect ? "Czysta Robota" : "Ośrodek Zabezpieczony (Z Wadami)"
        }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 font-mono max-w-lg mb-8", children: 
           isPerfect 
              ? "Nie zostawiono najmniejszego biologicznego, ani chemicznego śladu. Technicy policyjni będą bezradni, a psy tropiące zgubią trop." 
              : "Mimo starań, na miejscu zbrodni pozostały ślady. Jeśli Policja odpowiednio połączy fakty, mogą one stanowić dowód w śledztwie."
        }),
        
        /* @__PURE__ */ jsxs("div", { className: "bg-black border border-zinc-800 p-6 rounded mb-8 w-full max-w-md", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs uppercase text-slate-500 font-bold mb-4", children: "Podsumowanie Zacierania:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-left font-mono text-[10px]", children: [
             /* @__PURE__ */ jsxs("div", { children: ["Czas czyszczenia: ", /* @__PURE__ */ jsxs("span", { className: "text-white", children: [timeSpent, " min"] })] }),
             /* @__PURE__ */ jsxs("div", { children: ["Pozostała Krew / Chemikalia: ", /* @__PURE__ */ jsxs("span", { className: (bloodVolume + chemicalWaste) > 0 ? "text-red-500" : "text-emerald-500", children: [(bloodVolume + chemicalWaste), " ml"] })] }),
             /* @__PURE__ */ jsxs("div", { children: ["Mikroślady Utajone: ", /* @__PURE__ */ jsxs("span", { className: (latentBlood+dnaTraces+fingerprints+footprints) > 0 ? "text-amber-500" : "text-emerald-500", children: [(latentBlood+dnaTraces+fingerprints+footprints), "%"] })] }),
             /* @__PURE__ */ jsxs("div", { children: ["Skażenie Atmosfery: ", /* @__PURE__ */ jsxs("span", { className: (scent+fumes) > 0 ? "text-amber-500" : "text-emerald-500", children: [(scent+fumes), "%"] })] })
          ]})
        ]}),

        /* @__PURE__ */ jsx("button", {
           onClick: () => onComplete && onComplete(),
           className: `bg-agency-dark border border-agency-border text-white font-black uppercase tracking-widest py-3 px-12 transition-colors hover:bg-agency-main hover:text-black`,
           children: "Zakończ Operację i Wróć do Bazy"
        })
     ]});
  }

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-6 animate-in fade-in", children: [
     /* Header */
     /* @__PURE__ */ jsxs("div", { className: "text-center mb-6 shrink-0", children: [
        /* @__PURE__ */ jsx(Brush, { className: "w-12 h-12 text-agency-main mx-auto mb-2" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase tracking-widest text-white", children: "Czyszczenie Miejsca Zbrodni" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-zinc-400 mt-2 max-w-xl mx-auto", children: "Najważniejszy element układanki. Usunięcie śladów to jedyny sposób na opóźnienie pościgu i uniknięcie bezdyskusyjnego powiązania profilu DNA/odcisków w bazach policyjnych." })
     ]}),

     /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-6 overflow-hidden", children: [
        
        /* LEFT: Traces Monitor */
           /* @__PURE__ */ jsxs("div", { className: "w-72 bg-agency-dark border border-agency-border rounded p-4 flex flex-col shrink-0 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ jsxs("h4", { className: "font-bold text-agency-main uppercase tracking-widest text-xs mb-4 pb-2 border-b border-agency-border flex justify-between", children: [
                 /* @__PURE__ */ jsx("span", { children: "Poziom Skażenia" }),
                 /* @__PURE__ */ jsxs("span", { className: `font-mono ${timeSpent > 120 ? 'text-red-500 animate-pulse' : timeSpent > 60 ? 'text-amber-500' : 'text-emerald-500'}`, children: [timeSpent, " min"] })
              ]}),
              
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                     /* @__PURE__ */ jsxs("h5", { className: "text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between items-center", children: [
                        "Makroślady Płynne",
                        isWet && /* @__PURE__ */ jsx("span", { className: "text-[8px] bg-cyan-900/50 text-cyan-500 px-1 rounded animate-pulse border border-cyan-500/50", children: "MOKRA POSADZKA" })
                     ]}),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Widoczna Krew", value: bloodVolume, max: 5000, unit: " ml", icon: Droplet, color: "bg-red-600" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Odpady Płynne", value: chemicalWaste, max: 5000, unit: " ml", icon: FlaskConical, color: "bg-emerald-500" })
               ]}),

               /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h5", { className: "text-[10px] text-slate-500 uppercase font-bold mb-2 flex justify-between items-center", children: [
                     "Mikroślady Utajone",
                 latentRevealed ? /* @__PURE__ */ jsx("span", { className: "text-emerald-500 bg-emerald-500/10 px-1 rounded", children: "LUMINOL AKTYWNY" }) : /* @__PURE__ */ jsx("span", { className: "text-red-500 bg-red-500/10 px-1 rounded text-[8px]", children: "ŚLADY UKRYTE" })
                  ]}),
              /* @__PURE__ */ jsx(TraceBar, { label: "Krew Utajona", value: latentBlood, max: 100, unit: "%", icon: SearchCode, color: "bg-cyan-500", isSecret: !latentRevealed && latentBlood > 0, secretText: "WYMAGA LUMINOLU" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Naskórek / DNA", value: dnaTraces, max: 100, unit: "%", icon: Dna, color: "bg-purple-500" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Odciski Palców", value: fingerprints, max: 100, unit: "%", icon: Fingerprint, color: "bg-zinc-400" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Odciski Butów", value: footprints, max: 100, unit: "%", icon: Footprints, color: "bg-orange-700" })
               ]}),

               /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-[10px] text-slate-500 uppercase font-bold mb-2", children: "Środowisko Lotne" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Zapach Gracza", value: scent, max: 100, unit: "%", icon: Wind, color: "bg-amber-500" }),
                  /* @__PURE__ */ jsx(TraceBar, { label: "Opary Chemiczne", value: fumes, max: 100, unit: "%", icon: Wind, color: "bg-lime-400" })
               ]})
           ]}),
           
           /* Dziennik Działań (Logs) */
              /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-black border border-zinc-900 p-2 text-[9px] font-mono text-zinc-500 rounded overflow-hidden", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-zinc-400 mb-1 tracking-widest border-b border-zinc-900 pb-1", children: "OSTATNIE DZIAŁANIA:" }),
                  logMessages.map((log, i) => (
                      /* @__PURE__ */ jsxs("div", { key: i, className: `mb-1 ${log.isError ? 'text-red-500' : 'text-slate-400'}`, children: ["> ", log.msg] })
                  )),
                  logMessages.length === 0 && /* @__PURE__ */ jsx("span", { className: "italic opacity-50", children: "Czekam na akcję..." })
              ]}),
              
              /* @__PURE__ */ jsx("button", {
                  onClick: () => setPhase("DONE"),
                  className: "mt-4 w-full py-3 bg-agency-main text-black font-black uppercase text-xs tracking-widest rounded hover:bg-white transition-colors",
                  children: "Zakończ Czyszczenie"
              })
           ]}),

        /* RIGHT: Actions */
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-2 pb-12 custom-scrollbar", children: 
           /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: 
               actions.map(action => /* @__PURE__ */ jsxs("div", { key: action.id, className: `border rounded p-4 flex flex-col ${action.canDo ? 'bg-zinc-900 border-zinc-700 hover:border-agency-main' : 'bg-black/50 border-zinc-900 opacity-60'}`, children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-white uppercase mb-1", children: action.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-mono mb-3", children: action.desc }),
                  
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-end", children: [
                     /* @__PURE__ */ jsxs("div", { className: "mb-3 space-y-1", children: [
                        action.reqItems.length > 0 && action.reqItems.map((req, i) => {
                           const has = getQty(req.id) >= req.qty;
                           return /* @__PURE__ */ jsxs("div", { key: i, className: `flex justify-between items-center text-[10px] font-mono bg-black px-2 py-1 rounded ${req.optional ? 'opacity-70' : ''}`, children: [
                              /* @__PURE__ */ jsxs("span", { className: has ? 'text-slate-300' : (req.optional ? 'text-slate-500' : 'text-red-500 line-through'), children: [req.name, req.reusable ? " (Sprzęt)" : "", req.optional ? " [Opcjonalne]" : ""] }),
                              has ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-500" }) : (req.optional ? /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-500", children: "BRAK (WOLNIEJ)" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3 text-red-500" }))
                           ]});
                        }),
                        action.reqItems.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-500 font-mono italic bg-black px-2 py-1 rounded", children: "Brak wymogów materiałowych" }),
                        action.warning && !action.canDo && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-amber-500 font-mono mt-1", children: action.warning })
                     ]}),
                     
                     /* @__PURE__ */ jsx("button", {
                        onClick: action.execute,
                        disabled: !action.canDo,
                        className: `w-full py-2 uppercase font-bold text-[10px] tracking-widest rounded transition-colors ${action.canDo ? 'bg-agency-dark hover:bg-agency-main text-white hover:text-black border border-agency-border' : 'bg-black text-slate-600 border border-zinc-900 cursor-not-allowed'}`,
                        children: action.canDo ? "Wykonaj" : "Brak Możliwości"
                     })
                  ]})
               ]}))
           })
        })
     ]})
  ]});
};

export default ActionCleanup;
