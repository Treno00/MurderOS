import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { Trash2, Flame, Droplet, Skull, Pickaxe, CarFront, AlertTriangle, CheckCircle2 } from "lucide-react";

const ActionDisposal = ({ onComplete }) => {
  const [phase, setPhase] = useState("SELECT_METHOD"); // SELECT_METHOD, SUCCESS
  const [selectedMethod, setSelectedMethod] = useState(null);

  const inventory = GameState.getInventory();
  const garage = GameState.getHideoutStorage().garage || [];
  const vitals = GameState.recentDeceasedVitals; // Saved from Execution

  // Pomocnicze funkcje do sprawdzania ekwipunku
  const getQty = (marketId) => {
     const item = inventory.find(i => i.marketId === marketId);
     return item ? item.quantity : 0;
  };
  const hasItem = (marketId) => getQty(marketId) > 0;
  const hasVehicle = garage.length > 0;

  // Definicje metod z wymaganiami
  const DISPOSAL_METHODS = [
    {
      id: "ACID",
      name: "Rozpuszczenie w Beczce na Miejscu",
      icon: Droplet,
      desc: "Zero wynoszenia. Zniszczenie ciała roztworem na miejscu. Likwiduje problem ukrywania, generuje masywne odpady i opary.",
      requirements: [
        { name: "Beczka HDPE (200L)", met: hasItem("e10") },
        { name: "Kwas Siarkowy (min. 4x 500ml)", met: getQty("ch6") >= 4 }
      ],
      consume: [{ id: "e10", qty: 1 }, { id: "ch6", qty: 4 }],
      modifiers: { blood: 0, waste: 5000, fumes: 100, time: 120 }
    },
    {
      id: "FRAGMENTATION_BURY",
      name: "Porąbanie i Zakopanie z Dala",
      icon: Pickaxe,
      desc: "Rozczłonkowanie opóźni identyfikację latami. Generuje gigantyczną plamę nowej krwi na dywanie.",
      requirements: [
        { name: "Ostrze (Siekiera/Maczeta/Piła)", met: hasItem("w5") || hasItem("w7") || hasItem("w7b") || hasItem("e1") },
        { name: "Worki na Zwłoki (min. 2)", met: getQty("e3") >= 2 },
        { name: "Saperka / Łopata", met: hasItem("e11") },
        { name: "Pojazd", met: hasVehicle }
      ],
      consume: [{ id: "e3", qty: 2 }],
      modifiers: { blood: 2500, waste: 0, fumes: 20, time: 60 }
    },
    {
      id: "FRAGMENTATION_BURN",
      name: "Porąbanie i Spalenie",
      icon: Flame,
      desc: "Absolutne niszczenie tożsamości poprzez spopielenie w piecu na uboczu. Niesamowity rzeźnicki bałagan do wyczyszczenia w tym pokoju.",
      requirements: [
        { name: "Ostrze (Siekiera/Maczeta/Piła)", met: hasItem("w5") || hasItem("w7") || hasItem("w7b") || hasItem("e1") },
        { name: "Worki na Zwłoki (min. 2)", met: getQty("e3") >= 2 },
        { name: "Benzyna", met: hasItem("ch9") },
        { name: "Zapalniczka", met: hasItem("ch10") },
        { name: "Pojazd", met: hasVehicle }
      ],
      consume: [{ id: "e3", qty: 2 }, { id: "ch9", qty: 1 }],
      modifiers: { blood: 2500, waste: 0, fumes: 20, time: 60 }
    },
    {
      id: "BAG_BURY",
      name: "Zapakowanie w Całości i Zakopanie",
      icon: Pickaxe,
      desc: "Zapakowanie i transport w stanie obecnym. Nie generuje nowej krwi, jednak dużo ciężej znieść do bagażnika ciężkie ciało.",
      requirements: [
        { name: "Worek na Zwłoki (1)", met: hasItem("e3") },
        { name: "Saperka / Łopata", met: hasItem("e11") },
        { name: "Pojazd", met: hasVehicle }
      ],
      consume: [{ id: "e3", qty: 1 }],
      modifiers: { blood: 0, waste: 0, fumes: 0, time: 20 }
    },
    {
      id: "TRANSPORT",
      name: "Zapakowanie do Kryjówki",
      icon: CarFront,
      desc: "Przerzut do piwnicy rzeźni na prywatny użytek bez grzebania. Trudny transport.",
      requirements: [
        { name: "Worek na Zwłoki", met: hasItem("e3") },
        { name: "Pojazd", met: hasVehicle }
      ],
      consume: [{ id: "e3", qty: 1 }],
      modifiers: { blood: 0, waste: 0, fumes: 0, time: 20 }
    },
    {
      id: "LEAVE",
      name: "Pozostawienie na Pastwę Losu",
      icon: Trash2,
      desc: "Bez tykania ciała. Zerowy czas włożony na pakowanie. Upraszcza robotę do zera, ale to koszmar dla wskaźników dekonspiracji.",
      requirements: [],
      consume: [],
      modifiers: { blood: 0, waste: 0, fumes: 50, time: 0, dnaPlus: 50 }
    }
  ];

  const handleDisposal = (methodBox) => {
    // Sprawdź czy spełnia wszystkie (choć button będzie zablokowany, to dla bezpieczeństwa)
    const canDo = methodBox.requirements.every(req => req.met);
    if (!canDo) return;

    // Przetwarzanie i konsumowanie itemów ekwipunku
    if (methodBox.consume && methodBox.consume.length > 0) {
       methodBox.consume.forEach(consumable => {
          GameState.consumeItemFromInventory(consumable.id, consumable.qty);
       });
    }

    // Dodanie modyfikacji ostatecznych do vitals przed zakończeniem
    let finalVitals = { ...vitals };
    
    // Generowanie czasu mordu/ukrycia
    const dateObj = new Date();
    dateObj.setHours(dateObj.getHours() + Math.floor(Math.random() * 3)); // Random offset
    const dateStr = dateObj.toISOString().replace('T', ' ').substring(0, 16);

    // Modyfikacje przekazywane do CleanupPhase
    if (!finalVitals.sceneModifiers) {
        finalVitals.sceneModifiers = {
           addedBlood: 0,
           addedWaste: 0,
           addedFumes: 0,
           addedDna: 0,
           timeSpent: 0
        };
    }
    
    if (methodBox.modifiers) {
        finalVitals.sceneModifiers.addedBlood += methodBox.modifiers.blood || 0;
        finalVitals.sceneModifiers.addedWaste += methodBox.modifiers.waste || 0;
        finalVitals.sceneModifiers.addedFumes += methodBox.modifiers.fumes || 0;
        finalVitals.sceneModifiers.timeSpent += methodBox.modifiers.time || 0;
        finalVitals.sceneModifiers.addedDna += methodBox.modifiers.dnaPlus || 0;
    }

    // Call GameState (update with modifiers)
    GameState.recentDeceasedVitals = finalVitals;
    GameState.finalizeBodyDisposal(methodBox.id, dateStr, finalVitals);
    
    setSelectedMethod(methodBox);
    setPhase("SUCCESS");
  };

  const isKidnapped = vitals?.isKidnapped;
  const filteredMethods = DISPOSAL_METHODS.filter(m => isKidnapped ? m.id === "TRANSPORT" : true);

  if (phase === "SUCCESS") {
     return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in", children: [
         /* @__PURE__ */ jsx(selectedMethod.icon, { className: `w-24 h-24 ${isKidnapped ? 'text-emerald-500' : 'text-agency-main'} mb-6 opacity-80` }),
         /* @__PURE__ */ jsx("h2", { className: `text-3xl font-black uppercase tracking-widest ${isKidnapped ? 'text-emerald-500' : 'text-agency-main'} mb-2`, children: isKidnapped ? "Cel Zabezpieczony" : "Ciało Zutylizowane" }),
         /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-400 font-mono max-w-lg mb-8", children: [
             "Zastosowana metoda: ", /* @__PURE__ */ jsx("span", { className: "text-white font-bold tracking-widest uppercase", children: selectedMethod.name }), ". ", isKidnapped ? "Pomyślnie przetransportowano ofiarę do kryjówki." : "Ślady zostały odpowiednio zabezpieczone lub zniszczone. Sprawa trafi niebawem do nagłówków gazet i archiwów policyjnych."
         ]}),
         /* @__PURE__ */ jsx("button", { 
             onClick: () => onComplete && onComplete(),
             className: `bg-agency-main text-white font-black uppercase tracking-widest py-3 px-12 transition-colors ${isKidnapped ? 'hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]'}`,
             children: "Zakończ Akcję"
         })
     ]});
  }

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-6 overflow-hidden animate-in fade-in", children: [
    
    /* Header */
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx(isKidnapped ? CarFront : Trash2, { className: "w-12 h-12 text-zinc-500 mx-auto mb-2" }),
      /* @__PURE__ */ jsx("h3", { className: `text-2xl font-black uppercase tracking-widest ${isKidnapped ? 'text-emerald-500' : 'text-white'}`, children: isKidnapped ? "Ewakuacja Celu" : "Utylizacja Zwłok" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-zinc-400 mt-2 max-w-xl mx-auto", children: isKidnapped ? "Dostarcz cel prosto do piwnicy rzeźni przed jego przebudzeniem." : "Wybierz metodę pozbycia się ciała. Przemyśl swój wybór – pozostawienie dowodów przyciągnie Policję i wyjawi brutalne szczegóły obdukcji z Twojej masakry, natomiast bezśladowe usunięcie opóźni polowanie." })
    ]}),

    /* Methods Grid */
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-2 custom-scrollbar", children: 
       /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12", children: 
          filteredMethods.map(method => {
             const canAfford = method.requirements.every(req => req.met);
             const Icon = method.icon;
             
             return /* @__PURE__ */ jsxs("div", { 
               key: method.id,
               className: `border rounded flex flex-col transition-all ${canAfford ? 'bg-zinc-900/80 border-zinc-700 hover:border-agency-main hover:bg-zinc-900 group' : 'bg-black/40 border-slate-900 opacity-60 grayscale'} p-5`,
               children: [
                 
                 /* Górna sekcja z opisem */
                 /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
                    /* @__PURE__ */ jsx("div", { className: `p-3 rounded ${canAfford ? 'bg-agency-dark' : 'bg-black'}`, children: 
                       /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${canAfford ? 'text-agency-main' : 'text-slate-700'}` })
                    }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                       /* @__PURE__ */ jsx("h4", { className: `font-bold tracking-widest uppercase text-sm mb-1 ${canAfford ? 'text-white group-hover:text-agency-main transition-colors' : 'text-slate-500'}`, children: method.name }),
                       /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono leading-tight text-slate-400", children: method.desc })
                    ]})
                 ]}),

                 /* Wymagania magazynowe */
                 /* @__PURE__ */ jsxs("div", { className: "flex-1 border-t border-zinc-800/50 pt-3 flex flex-col gap-1.5 mb-4", children: [
                    /* @__PURE__ */ jsx("h5", { className: "text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-1", children: "WYMAGANIA EKWIPUNKU I LOGISTYKI:" }),
                    method.requirements.length === 0 ? 
                       /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500 font-mono italic", children: "Brak wymagań specyficznych." }) :
                       method.requirements.map((req, i) => (
                          /* @__PURE__ */ jsxs("div", { key: i, className: "flex items-center justify-between text-[10px] font-mono bg-black/40 px-3 py-1.5 border border-zinc-800 rounded", children: [
                             /* @__PURE__ */ jsx("span", { className: req.met ? 'text-slate-300' : 'text-red-500 font-bold line-through', children: req.name }),
                             req.met ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-500" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3 text-red-500" })
                          ]})
                       ))
                 ]}),

                 /* Przycisk Akcji */
                 /* @__PURE__ */ jsx("button", {
                    onClick: () => handleDisposal(method),
                    disabled: !canAfford,
                    className: `w-full py-3 uppercase tracking-widest font-bold text-xs flex justify-center items-center rounded transition-all ${canAfford ? 'bg-zinc-800 hover:bg-agency-main text-white hover:text-black shadow-md' : 'bg-black text-slate-700 cursor-not-allowed'}`,
                    children: canAfford ? "Wykonaj" : "Brak Ekwipunku"
                 })

               ]
             });
          })
       })
    })

  ]});
};

export default ActionDisposal;
