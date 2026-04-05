import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { GameState } from "../../Scripts/App/GameState.js";
import { useGame } from "../../Scripts/App/GameContext.js";
import { Skull, Droplet, Activity, Eye, Heart, Leaf, FileWarning, AlertTriangle, Crosshair, ChevronRight, Wind, AlertOctagon, Phone, Volume2, ShieldAlert } from "lucide-react";

const ActionElimination = ({ onComplete }) => {
  const { setIsActionTimePaused, passTimeMinutes } = useGame();
  const [phase, setPhase] = useState("WEAPON_SELECTION"); // WEAPON_SELECTION, EXECUTION, SUCCESS
  const [selectedWeapon, setSelectedWeapon] = useState(null);

  // Zatrzymanie głównego czasu gry, żeby akcja działała turowo w zamrożonym świecie
  useEffect(() => {
    setIsActionTimePaused(true);
    return () => setIsActionTimePaused(false);
  }, [setIsActionTimePaused]);
  
  // Tactical Victim State
  const [stance, setStance] = useState("ZASKOCZONY"); // ZASKOCZONY, BRONI_SIE, PROBUJE_UCIEC, KRZYCZY, NIETOMNY, MARTWY
  const [noiseLevel, setNoiseLevel] = useState(0); // If reaches 100 -> Police arrives, forced flee
  const [turn, setTurn] = useState(1);

  // Vitals State
  const [maxBloodMl, setMaxBloodMl] = useState(5000);
  const [bloodVolume, setBloodVolume] = useState(5000);
  const [internalBloodLoss, setInternalBloodLoss] = useState(0); 
  const [externalBloodLoss, setExternalBloodLoss] = useState(0);
  const [saturation, setSaturation] = useState(99); 
  const [consciousness, setConsciousness] = useState(100); 
  const [heartRate, setHeartRate] = useState(75); 
  const [pain, setPain] = useState(0); 
  const [airway, setAirway] = useState(100); 
  
  // Organs & Structural Damage
  const [organs, setOrgans] = useState({ heart: 100, lungs: 100, liver: 100, kidneys: 100 });
  const [amputations, setAmputations] = useState([]);
  
  const [wounds, setWounds] = useState([]); 
  const [sustainedInjuries, setSustainedInjuries] = useState([]); 
  const [decapitated, setDecapitated] = useState(false);

  const injuryLogRef = useRef(null);

  useEffect(() => {
    if (injuryLogRef.current) {
      injuryLogRef.current.scrollTop = injuryLogRef.current.scrollHeight;
    }
  }, [sustainedInjuries]);

  const inventory = GameState.getInventory();
  const weapons = inventory.filter(i => ["Broń", "Palna", "WEAPON"].includes(i.category) || ["Biała", "Palna"].includes(i.subcategory));
  const victim = GameState.getActiveVictim();

  useEffect(() => {
    if (victim) {
      let weight = victim.weightKG || 75;
      const bloodPerKg = victim.gender === "Mężczyzna" ? 77 : 72;
      const totalBlood = weight * bloodPerKg;
      setMaxBloodMl(totalBlood);
      setBloodVolume(totalBlood);
      
      const plan = GameState.currentActionPlan;
      if (plan) {
         if (plan.locationMismatch) {
             setStance("BRAK_CELU");
         } else if (plan.targetState === "ŚPI") {
             if (plan.stealthBreach) {
                 setStance("ŚPI");
             } else {
                 setStance("ZASKOCZONY"); // Budzi się z powodu włamania/hałasu
             }
         } else {
             if (plan.risk > 60) setStance("BRONI_SIE");
             else setStance("ZASKOCZONY");
         }
      }
    }
  }, [victim]);

  const deathBloodMin = maxBloodMl * 0.4; 
  const isDead = stance === "MARTWY";

  // Koniec Mordercza
  const handleDeath = (cause) => {
    setStance("MARTWY");
    setHeartRate(0);
    setConsciousness(0);
    setNoiseLevel(0); // martwy nie robi halasu
    if (victim) {
      GameState.markCitizenAsDeceased(victim.id);
      GameState.recentDeceasedVitals = {
        isDead: true,
        isKidnapped: false,
        consciousness: 0,
        bloodVolume: bloodVolume / 1000, 
        bloodML: bloodVolume,
        externalBloodLoss,
        internalBloodLoss,
        causeOfDeath: cause,
        decapitated,
        organsDestruction: {
           heart: 100 - organs.heart,
           lungs: 100 - organs.lungs,
           liver: 100 - organs.liver,
           kidneys: 100 - organs.kidneys
        },
        amputations,
        sustainedInjuries
      };
    }
  };

  const handleKidnap = () => {
    if (victim) {
      GameState.markCitizenAsDeceased(victim.id); // Triggers visual removal from world, technically "missing"
      GameState.recentDeceasedVitals = {
        isDead: false,
        isKidnapped: true,
        consciousness: consciousness,
        bloodVolume: bloodVolume / 1000, 
        bloodML: bloodVolume,
        externalBloodLoss,
        internalBloodLoss,
        causeOfDeath: "Brak - Pacjent żyje, uprowadzony",
        decapitated: false,
        organsDestruction: {
           heart: 100 - organs.heart,
           lungs: 100 - organs.lungs,
           liver: 100 - organs.liver,
           kidneys: 100 - organs.kidneys
        },
        amputations,
        sustainedInjuries
      };
    }
  };

  const calculateTurnPhysiology = (minutesPassed) => {
     let currentLossExt = 0;
     let currentLossInt = 0;
     let satLoss = 0;
     let airwayLoss = 0;
     let painInc = 0;

     wounds.forEach(w => {
        if (w.bloodPerMin) {
           currentLossExt += w.bloodPerMin * (w.extRatio || 0) * minutesPassed;
           currentLossInt += w.bloodPerMin * (w.intRatio || 0) * minutesPassed;
        }
        if (w.type === "PNEUMOTHORAX") satLoss += 10 * minutesPassed;
        if (w.type === "CHOKING_ON_BLOOD") airwayLoss += 30 * minutesPassed;
        if (w.type === "STRANGULATION") airwayLoss += 100 * minutesPassed; // Huge drop
        if (w.type === "LUNG_DESTROYED") { satLoss += 30 * minutesPassed; airwayLoss += 20 * minutesPassed; }
        if (w.painPerSec) painInc += (w.painPerSec * 10) * minutesPassed;
     });

     let newAirway = Math.max(0, airway - airwayLoss);
     
     // Duszenie szybko eliminuje 
     if (victim?.diseases?.includes("Astma") && newAirway < 80) newAirway -= 20; // Astmatycy uduszą się szybciej
     
     let newPain = Math.min(100, Math.max(0, pain + painInc - (3 * minutesPassed)));
     
     // Odporność na ból przy chorobach psychicznych/lekach? Tutaj uogólnienie.

     let newSat = saturation - satLoss;
     if (newAirway === 0) newSat -= 40 * minutesPassed;
     else if (newAirway < 50) newSat -= 10 * minutesPassed;
     
     if (newAirway > 80 && satLoss === 0 && !isDead) newSat += 5 * minutesPassed;
     newSat = Math.min(100, Math.max(0, newSat));

     // Blood logic
     let isDepleted = bloodVolume < (maxBloodMl * 0.1);
     let modExt = isDepleted ? currentLossExt * 0.1 : currentLossExt;
     let modInt = isDepleted ? currentLossInt * 0.1 : currentLossInt;
     
     // Cukrzyca a krzepnięcie -> Większe wykrwawienie
     if (victim?.diseases?.includes("Cukrzyca")) {
        modExt *= 1.3;
        modInt *= 1.3;
     }

     let newBlood = bloodVolume - (modExt + modInt);
     if (newBlood < 0) newBlood = 0;
     setExternalBloodLoss(e => e + modExt);
     setInternalBloodLoss(i => i + modInt);

     let bloodLossPercent = ((maxBloodMl - newBlood) / maxBloodMl) * 100;
     let newConsc = 100 - (bloodLossPercent * 1.5) - ((100 - newSat) * 2);
     if (newPain > 60) newConsc -= (newPain - 50);
     
     const bluntPenalty = wounds.filter(w => w.type === "BLUNT").reduce((acc, w) => acc + w.conscDrop, 0);
     newConsc -= bluntPenalty;
     const brainDestroyed = wounds.some(w => w.type === "BRAIN_DESTROYED");
     if(brainDestroyed) newConsc = 0;

     newConsc = Math.min(100, Math.max(0, newConsc));

     // Update States
     setAirway(newAirway);
     setPain(newPain);
     setSaturation(newSat);
     setBloodVolume(newBlood);
     setConsciousness(newConsc);

     // Check bounds
     if (newBlood <= deathBloodMin && !isDead && !decapitated) {
        handleDeath("Tragiczny Szok Krwotoczny (Wykrwawienie)");
        return true;
     }
     if (newSat <= 20 && !isDead && !decapitated) {
        handleDeath("Ostra Hipoksja (Uduszenie)");
        return true;
     }
     
     return false; // Did not die just from physiology
  };

  const processVictimReaction = () => {
      if (isDead) return;
      if (consciousness <= 5) {
         setStance("NIETOMNY");
         logInjury("[AUTO] Ofiara traci przytomność.");
         return;
      }
      
      // Reactions logic
      if (pain > 60 && stance !== "KRZYCZY") {
         const chance = Math.random();
         if (chance > 0.4) {
            setStance("KRZYCZY");
            logInjury("[AUTO] Ofiara wyje z bólu na całe gardło!");
            setNoiseLevel(n => Math.min(100, n + 40));
            return;
         }
      }

      if (stance === "ZASKOCZONY") {
         setStance("BRONI_SIE");
         logInjury("[AUTO] Ofiara podejmuje walkę o życie!");
      } else if (stance === "BRONI_SIE") {
         if (Math.random() > 0.7) {
            setStance("PROBUJE_UCIEC");
            logInjury("[AUTO] Ofiara próbuje czołgać się do wyjścia, rozsmarowując krew!");
            // Ucieczka rozsmarowuje krew zewnetrzna mocniej
            setExternalBloodLoss(e => e * 1.2); 
         } else {
            // Walczy dalej
            logInjury("[AUTO] Ofiara szarpie się i stawia czynny opór.");
         }
      } else if (stance === "KRZYCZY") {
         setNoiseLevel(n => Math.min(100, n + 50));
         logInjury("[AUTO] Ofiara kontynuuje przeraźliwy krzyk! (RYZYKO ALARMU)");
      }
  };

  const logInjury = (text) => {
     const tStamp = `[TURA ${turn.toString().padStart(2, '0')}]`;
     setSustainedInjuries(prev => [...prev, `${tStamp} ${text}`]);
  };

  // ----------------------------------------------------
  // MECHANIKA TUROWA (PLAYER ATTEMPTS ACTION)
  // ----------------------------------------------------
  const executePlayerAction = (actionParams) => {
     let minsTaken = actionParams.minutes || 1;
     passTimeMinutes(minsTaken);
     
     // 1. Zapis obrażenia
     logInjury(actionParams.injuryLog);

     // Check Weapon constraints for extreme cases
     if (actionParams.type === "DECAPITATE") {
         if (!selectedWeapon.tags.includes("Rąbiące") && !selectedWeapon.tags.includes("Tnące")) {
             logInjury(">> OSTRZEŻENIE: Twoja broń zbyt słaba na odcięcie głowy, ostrze grzęźnie w kręgach!");
             actionParams.type = "BLEED"; // Downgrade
             actionParams.bloodPerMin = 400;
         } else {
            setDecapitated(true);
            setConsciousness(0);
            setAirway(0);
            setSaturation(0);
            handleDeath("Dekapitacja (Przerwanie Rdzenia Przedłużonego)");
         }
     } else if (actionParams.type === "AMPUTATION") {
         if (!selectedWeapon.tags.includes("Rąbiące") && !selectedWeapon.tags.includes("Tnące")) {
             logInjury(">> OSTRZEŻENIE: Nie da się amputować kończyny tym narzędziem. Kość stawia opór.");
             actionParams.type = "BLEED"; // Downgrade do zwykłego ciecia
             actionParams.bloodPerMin = 300;
         } else {
             setAmputations(a => [...a, actionParams.limbTarget]);
         }
     } else if (actionParams.type === "ORGAN_DAMAGE") {
         setOrgans(o => ({...o, [actionParams.organTarget]: Math.max(0, o[actionParams.organTarget] - actionParams.organDmg)}));
     } else if (actionParams.type === "BRAIN_DESTROYED" && !isDead) {
         setConsciousness(0);
         handleDeath("Rozległe zniszczenie pnia mózgu / Czaszki");
     }

     if (actionParams.mutes) {
         if (stance === "KRZYCZY") {
            setStance("BRONI_SIE"); 
            logInjury(">> Głos ofiary ucięty! Krztusi się krwią.");
         }
     }
     
     if (actionParams.instantPain) {
         setPain(p => Math.min(100, p + actionParams.instantPain));
     }

     if (actionParams.bloodPerMin || actionParams.type === "PNEUMOTHORAX" || actionParams.type === "CHOKING_ON_BLOOD" || actionParams.type === "STRANGULATION" || actionParams.type === "LUNG_DESTROYED") {
         setWounds(prev => [...prev, actionParams]);
     }

     // 2. Fizjologia wylicza efekt tego ataku i upływu czasu (może umrzeć w tej fazie)
     const diedFromBleed = calculateTurnPhysiology(minsTaken);

     // 3. Jeśli żyje -> Ofiara reaguje (Krzyk, ucieczka, obrona)
     if (!diedFromBleed && !decapitated && actionParams.type !== "BRAIN_DESTROYED") {
         processVictimReaction();
     }

     // 4. Update Turn Counter
     setTurn(t => t + 1);
     setSelectedAttackMode(null);
     setSelectedBodyPart(null);
  };

  // Menu Akcji 
  const [selectedAttackMode, setSelectedAttackMode] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);

  const ATTACK_TREE = {
    // KŁUCIE
    "Pchnięcie": {
       "Szyja": [
         { name: "Szybkie Dźgnięcie w Tętnicę", desc: "Ogromny trysk krwi, ucisza", bloodPerMin: 800, extRatio: 0.70, intRatio: 0.30, type: "BLEED", mutes: true, instantPain: 40, injuryLog: "Nóż przebija tętnicę szyjną wspólną. Masywny krwotok tętniący." }
       ],
       "Tułów (Wątroba)": [
         { name: "Pchnięcie pod żebra (Prawa strona)", desc: "Koszmarny ból, niszczy wątrobę trwale", bloodPerMin: 400, extRatio: 0.20, intRatio: 0.80, type: "ORGAN_DAMAGE", organTarget: "liver", organDmg: 90, instantPain: 90, injuryLog: "Ostrze zanurza się głęboko pod prawym łukiem żebrowym. Tkanka wątroby rozerwana we wstrząsie." }
       ],
       "Tułów (Nerki)": [
         { name: "Dźgnięcie w lędźwie (Nerki)", desc: "Szok bólowy, zniszczenie struktury nerkowej", bloodPerMin: 250, extRatio: 0.50, intRatio: 0.50, type: "ORGAN_DAMAGE", organTarget: "kidneys", organDmg: 80, instantPain: 95, injuryLog: "Szybkie, głębokie pchnięcie z tyłu w lędźwie. Ostrze niszczy nerkę, ogromny ból tułowia." }
       ],
       "Tułów (Serce)": [
         { name: "Celowane pchnięcie (Przebicie Serca)", desc: "Tamponada osierdzia. Gwarantowany szybki zgon.", bloodPerMin: 1200, extRatio: 0.30, intRatio: 0.70, type: "ORGAN_DAMAGE", organTarget: "heart", organDmg: 100, instantPain: 60, injuryLog: "Ostrze spenetrowało klatkę między 4 a 5 żebrem, prosto w lewą komorę serca." }
       ],
       "Tułów (Płuca)": [
         { name: "Przebicie Opłucnej", desc: "Wywołuje Odrę(-10% tlenu/ture). Mniej krwi na podłodze", bloodPerMin: 150, extRatio: 0.30, intRatio: 0.70, type: "PNEUMOTHORAX", organTarget: "lungs", organDmg: 50, instantPain: 60, injuryLog: "Ostrze wchodzi miedzy zebra, przebijając płuco i powłoki. Słychać świst powietrza z rany." }
       ],
       "Kończyny (Udo)": [
         { name: "Wiertło w Udo", desc: "Cel obalony. Wysoki wypływ krwi.", bloodPerMin: 600, extRatio: 0.7, intRatio: 0.3, type: "BLEED", instantPain: 80, injuryLog: "Penetracja w udo. Przebita tętnica udowa." }
       ]
    },
    // CIĘCIE
    "Cięcie": {
       "Szyja": [
         { name: "Cięcie przez Krtań", desc: "Cel topiony i zablokowany głosowo", bloodPerMin: 300, extRatio: 0.6, intRatio: 0.4, type: "CHOKING_ON_BLOOD", mutes: true, instantPain: 60, injuryLog: "Krtań rozcięta w półcieniach. Ofiara dusi się wewntrzną krwią." }
       ],
       "Twarz": [
         { name: "Płytkie Cięcie Twarzy", desc: "Krew zalewa oczy. Mniejszy drenaż", bloodPerMin: 100, extRatio: 1.0, intRatio: 0.0, type: "BLEED", instantPain: 70, injuryLog: "Długie, krwawe szramowanie skóry twarzy." },
         { name: "Wykłucie oczu", desc: "Permanentna ślepota i paraliżujący ból", bloodPerMin: 50, extRatio: 1.0, intRatio: 0.0, type: "BLEED", instantPain: 100, conscDrop: 40, injuryLog: "Ostrze całkowicie niszczy gałki oczne. Krew zalewa oczodoły, ofiara jest zupełnie ślepa." }
       ],
       "Brzuch": [
         { name: "Płatowanie (Ewisceracja)", desc: "Wypadnięcie jelit, skrajny ból. Niszczy nerki przy okazji.", bloodPerMin: 500, extRatio: 0.9, intRatio: 0.1, type: "ORGAN_DAMAGE", organTarget: "kidneys", organDmg: 40, instantPain: 100, conscDrop: 50, injuryLog: "Głębokie cięcie poziome w poprzek powłok brzusznych. Patologiczna ewisceracja jelit (wypadają na zewnątrz)." }
       ]
    },
    // RĄBANIE
    "Rąbanie": {
       "Głowa": [
         { name: "Wyrąbanie Czaszki", desc: "Uderzenie centralne obalające. Rozbicie mózgu.", bloodPerMin: 500, extRatio: 0.9, intRatio: 0.1, type: "BRAIN_DESTROYED", conscDrop: 100, injuryLog: "Narzędzie rąbiące z impetem gruchota kości pokrywy czaszki. Natychmiastowa śmierć tkankowa." }
       ],
       "Szyja": [
         { name: "Masywne Odcięcie Głowy", desc: "Natychmiastowe uciszenie i wykrwawienie rzutowe", bloodPerMin: 2000, extRatio: 1.0, intRatio: 0.0, type: "DECAPITATE", mutes: true, injuryLog: "PRÓBA DEKAPITACJI. Potężny zamach na stawy szyjne." }
       ],
       "Kończyny (Ręce)": [
         { name: "Amputacja Przedramienia", desc: "Potworny wstrząs bólowy. Tryskanie na zewnątrz.", bloodPerMin: 800, extRatio: 0.95, intRatio: 0.05, type: "AMPUTATION", limbTarget: "Ręka", instantPain: 100, conscDrop: 30, injuryLog: "Narzędzie tnie kość i mięsień. Częściowa lub pełna wstrząsowa amputacja kończyny (Ręki)!" }
       ],
       "Kończyny (Nogi)": [
         { name: "Amputacja Udowa", desc: "Natychmiastowe obalenie, potężna strata krwi.", bloodPerMin: 1500, extRatio: 0.95, intRatio: 0.05, type: "AMPUTATION", limbTarget: "Noga", instantPain: 100, conscDrop: 50, injuryLog: "Zamaszyste rąbnięcie w udo tnie kość udową na pół. Masywna amputacja urazowa na wysokości uda." }
       ]
    },
    // OBUCHOWE
    "Cios Obuchowy": {
       "Głowa": [
         { name: "Nokaut", desc: "Zasansa na natychmiastowe obalenie.", bloodPerMin: 20, extRatio: 0, intRatio: 1.0, type: "BLUNT", conscDrop: 90, instantPain: 20, injuryLog: "Ciężki cios prosto w środek ciężkości głowy. Ofiara mdleje lub chwieje się (Wstrząs)." }
       ],
       "Tułów (Żebra)": [
         { name: "Zmiażdżenie Klatki", desc: "Ryzyko odmy. Szok bólowy.", bloodPerMin: 100, extRatio: 0, intRatio: 1.0, type: "BLUNT", instantPain: 80, organTarget: "lungs", organDmg: 40, injuryLog: "Głuchy trzask padających żeber. Ofierze brakuje tlenu, płucom obrywa się fala uderzeniowa." }
       ],
       "Kolana": [
         { name: "Rozbicie Rzepki (Kneecap)", desc: "Immobilizacja i szał z bólu", bloodPerMin: 50, extRatio: 0.1, intRatio: 0.9, type: "BLUNT", instantPain: 100, conscDrop: 10, injuryLog: "Ciężkie, głuche uderzenie w strukturę stawu kolanowego. Rzepka rozbita w drobny mak." }
       ]
    },
    // STRZAŁ
    "Strzał Palny": {
       "Głowa": [
         { name: "Takedown Czaszkowy (Headshot)", desc: "Trzask. Mózg rozwiany na ścianie.", type: "BRAIN_DESTROYED", bloodPerMin: 400, mutes: true, injuryLog: "HUK ! Strzał w czaszkę z bliskiej odległości. Erupcja materii mózgowej." }
       ],
       "Tułów (Serce)": [
         { name: "Strzał w Serce", desc: "Rozległe niszczenie serca. Gwarantowany upadek.", type: "LUNG_DESTROYED", bloodPerMin: 1200, extRatio: 0.3, intRatio: 0.7, organTarget: "heart", organDmg: 100, injuryLog: "HUK ! Kula penetruje komorę serca, zatrzymując tętno i wlewając krew do klatki." }
       ],
       "Tułów (Płuca)": [
         { name: "Podziurawienie Płuc", desc: "Zamienia płuca w sito", type: "PNEUMOTHORAX", bloodPerMin: 800, extRatio: 0.4, intRatio: 0.6, organTarget: "lungs", organDmg: 80, injuryLog: "HUK ! Serie przebite przez tkankę płucną. Skrajna duszność, kule przeszywają miąższ." }
       ]
    },
    // DUSZENIE
    "Duszenie Zbliska": {
       "Szyja": [
         { name: "Zaciśnięcie Garoty/Struny", desc: "100% zablokowane powietrze. Bezgłośnie. (+10 Bólu)", type: "STRANGULATION", bloodPerMin: 0, mutes: true, instantPain: 10, injuryLog: "Garota oplata strugi krtani. Cel wyrywa się, ale nie może złapać oddechu." }
       ]
    },
    // AKCJE KONTROLNE (Puste lub reagujące)
    "Takedown / Akcje Taktyczne": {
       "Twarz": [
         { name: "Zakrycie Ust (Uciszenie)", desc: "Wymusza chwilowe zatrzymanie Hałasu", type: "MUTE_ONLY", mutes: true, instantPain: 0, injuryLog: "[AKCJA] Skok i brutalne zatkanie ust ofierze ręką."}
       ],
       "Szyja": [
         { name: "Obalenie Chwytem", desc: "Upadek na podłogę", type: "BLUNT", conscDrop: 30, instantPain: 10, injuryLog: "[AKCJA] Powalenie ofiary na płasko by wytrącić z równowagi."}
       ]
    },
    "Cicha Eliminacja (Cel Śpi)": {
       "Szyja": [
         { name: "Bezgłośne Podcięcie Krtani", desc: "Wymaga Noża/Ostrza. Śmierć we śnie.", type: "BLEED", bloodPerMin: 600, extRatio: 0.5, intRatio: 0.5, mutes: true, instantPain: 0, conscDrop: 100, reqTag: ["Cięte", "Tnące"], injuryLog: "[STEALTH] Ostrze bezdźwięcznie przecina krtań i tętnicę. Ofiara krztusi się krwią przez sen, zgon jest cichy." },
         { name: "Duszenie Garotą/Kablem", desc: "Wymaga narzędzia duszącego.", type: "STRANGULATION", bloodPerMin: 0, mutes: true, instantPain: 0, reqTag: ["Duszące"], injuryLog: "[STEALTH] Pętla zaciska się na szyi we śnie. Złamanie chrząstki i uduszenie bez wydania dźwięku." }
       ],
       "Twarz": [
         { name: "Uduszenie Poduszką (Ręce)", desc: "Zawsze dostępne, ciche uduszenie.", type: "STRANGULATION", bloodPerMin: 0, mutes: true, instantPain: 0, injuryLog: "[STEALTH] Mocny docisk poduszki do twarzy śpiącego. Ciało rzuca się w konwulsjach, brak krzyku." },
         { name: "Uśpienie Chloroformem", desc: "Wymaga Chloroformu w Ekwipunku. Bezgłośny nokaut.", type: "BLUNT", bloodPerMin: 0, mutes: true, instantPain: 0, conscDrop: 100, reqItem: "Chloroform", injuryLog: "[STEALTH] Szmata z chemikaliami dociska twarz. Ofiara wpada w głęboką nieprzytomność farmakologiczną. Szybko zabezpiecz cel." }
       ]
    }
  };

  const getAvailableAttackTypes = (weapon) => {
    if (!weapon) {
       if (stance === "ŚPI") return ["Cicha Eliminacja (Cel Śpi)", "Takedown / Akcje Taktyczne"];
       return ["Takedown / Akcje Taktyczne"];
    }
    const typeSet = new Set(["Takedown / Akcje Taktyczne"]);
    const tags = weapon.tags || [];

    if (stance === "ŚPI") typeSet.add("Cicha Eliminacja (Cel Śpi)");

    if (tags.includes("Cięte") || tags.includes("Tnące")) { typeSet.add("Cięcie"); typeSet.add("Pchnięcie"); }
    if (tags.includes("Kłute")) typeSet.add("Pchnięcie");
    if (tags.includes("Duszące")) typeSet.add("Duszenie Zbliska");
    if (tags.includes("Rąbiące")) typeSet.add("Rąbanie");
    if (tags.includes("Obuchowe")) typeSet.add("Cios Obuchowy");
    if (tags.includes("Strzeleckie")) typeSet.add("Strzał Palny");

    return Array.from(typeSet);
  };

  const isRequirementMet = (atk) => {
    if (atk.reqTag && selectedWeapon) {
       if (!selectedWeapon.tags) return false;
       if (!atk.reqTag.some(tag => selectedWeapon.tags.includes(tag))) return false;
    }
    if (atk.reqItem) {
       const hasItem = inventory.some(i => i.name.toLowerCase().includes(atk.reqItem.toLowerCase()));
       if (!hasItem) return false;
    }
    return true;
  };

  if (phase === "WEAPON_SELECTION") {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col p-6 animate-in fade-in bg-[#030303] text-zinc-300 custom-scrollbar overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 border-b border-zinc-800 pb-4", children: [
        /* @__PURE__ */ jsx(Skull, { className: "w-12 h-12 text-zinc-600 mx-auto mb-2 opacity-50" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]", children: "Wejście Kinetyczne" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-amber-500/80 uppercase mt-2 tracking-widest", children: "System Turowej Symulacji Obrażeń" })
      ]}),
      
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: 
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: 
            weapons.map(w => (
              /* @__PURE__ */ jsxs("div", { 
                key: w.instanceId,
                onClick: () => { setSelectedWeapon(w); setPhase("EXECUTION"); },
                className: "bg-[#0a0a0a] border border-zinc-800 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 hover:bg-red-900/10 transition-all font-mono",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-zinc-500 text-[9px] uppercase tracking-widest mb-2", children: "WYBIERZ NARZĘDZIE:" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-black text-slate-200", children: w.name }),
                  w.tags && /* @__PURE__ */ jsxs("div", { className: "flex gap-1 mt-4 flex-wrap justify-center", children: [
                     w.tags.map(t => /* @__PURE__ */ jsx("span", { className: "bg-black text-zinc-600 border border-zinc-700 px-2 py-0.5 text-[8px] rounded uppercase", children: t }))
                  ]})
                ]
              })
            ))
          })
      })
    ]});
  }

  // --- PHASE EXECUTION (TURN BASED UI) ---

  const percentOrgans = ((organs.heart + organs.lungs + organs.liver + organs.kidneys) / 400) * 100;
  const isKidnappedMode = GameState.recentDeceasedVitals?.isKidnapped;

  if (phase === "SUCCESS") {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-300 animate-in zoom-in p-8 text-center bg-[#010101]", children: [
      /* @__PURE__ */ jsx(Skull, { className: "w-24 h-24 text-red-900 mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black uppercase tracking-widest text-red-600", children: "Cel Ostatecznie Zamknięty" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-slate-500 mt-4 max-w-md mx-auto leading-relaxed", children: "Symulacja przerwana. Fizjologia zgasła całkowicie lub cel zabezpieczono. Czas gry został wnowiony. Procedujemy do Fazy Utylizacji lub ewakuacji by ukryć dowody i pozyskać korzyści." }),
      /* @__PURE__ */ jsx("button", {
        onClick: () => onComplete && onComplete(),
        className: "mt-12 bg-red-900 hover:bg-red-800 border border-red-500 text-white font-black uppercase py-4 px-12 rounded transition-all tracking-widest text-[10px]",
        children: "PRZEJDŹ DALEJ >>"
      })
    ]});
  }

  if (stance === "BRAK_CELU") {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-300 animate-in zoom-in p-8 text-center bg-[#010101]", children: [
      /* @__PURE__ */ jsx(Eye, { className: "w-24 h-24 text-zinc-600 mb-6 opacity-30" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black uppercase tracking-widest text-zinc-500", children: "Pusty Cel" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-zinc-600 mt-4 max-w-md mx-auto leading-relaxed", children: "Zabezpieczyłeś teren, ale nikogo nie ma. Cel zgodnie z harmonogramem znajduje się w innej lokalizacji. Symulacja inwazyjna przerwana. Po zebraniu zasobów wracasz." }),
      /* @__PURE__ */ jsx("button", {
        onClick: () => onComplete && onComplete(),
        className: "mt-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-black uppercase py-4 px-12 rounded transition-all tracking-widest text-[10px]",
        children: "PRZEJDŹ DALEJ >>"
      })
    ]});
  }

  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-[#050505] p-2 animate-in slide-in-from-right-8 fade-in text-zinc-200 custom-scrollbar overflow-y-auto", children: [
    
    // TOP STRIP (STANCE & NOISE)
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex-1 border p-3 flex justify-between items-center ${isDead ? 'bg-[#0a0000] border-red-900' : stance === "KRZYCZY" ? 'bg-amber-900/20 border-amber-500' : stance === "NIETOMNY" ? 'bg-zinc-900 border-zinc-500' : 'bg-black border-zinc-800'}`, children: [
           /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[9px] uppercase tracking-widest font-mono text-zinc-500", children: "Postawa / Reakcja Celu" }),
              /* @__PURE__ */ jsx("span", { className: `font-black text-lg tracking-widest uppercase ${isDead ? 'text-red-700' : stance === "KRZYCZY" ? 'text-amber-500 animate-pulse' : 'text-slate-200'}`, children: stance })
           ]}),
           !isDead && stance === "KRZYCZY" && /* @__PURE__ */ jsx(Volume2, { className: "w-6 h-6 text-amber-500 animate-pulse" })
        ]}),

        /* Noise Alarm Level */
        /* @__PURE__ */ jsxs("div", { className: `w-64 border p-3 flex flex-col justify-center ${noiseLevel >= 80 ? 'bg-red-900/20 border-red-500' : 'bg-black border-zinc-800'}`, children: [
           /* @__PURE__ */ jsx("span", { className: "block text-[9px] uppercase tracking-widest font-mono text-zinc-500 mb-2 flex justify-between", children: [/* @__PURE__ */ jsx("span", { children: "Zagrożenie Dźwiękiem" }), noiseLevel >= 100 ? "POLICJA!" : `${noiseLevel}%`] }),
           /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-zinc-900 overflow-hidden flex", children: 
               /* @__PURE__ */ jsx("div", { className: `h-full ${noiseLevel >= 80 ? 'bg-red-500' : 'bg-amber-500'}`, style: { width: `${noiseLevel}%` } })
           })
        ]})
    ]}),

    // MIDDLE: VITALS & MEDICAL SCAN
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-2 mb-3 shrink-0", children: [
       /* BLOOD */
       /* @__PURE__ */ jsxs("div", { className: "bg-[#030303] border border-zinc-800 p-4 text-center font-mono relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-red-900/30", style: { height: `${(bloodVolume/maxBloodMl)*100}%` } }),
          /* @__PURE__ */ jsx(Droplet, { className: "w-5 h-5 text-red-600 mx-auto mb-2 opacity-80" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black text-slate-200 relative", children: [Math.round(bloodVolume), /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500 ml-1", children: "ml" })] }),
          /* @__PURE__ */ jsxs("p", { className: "text-[8px] text-zinc-600 uppercase tracking-widest mt-1", children: ["Zewn. Rozlew: ", Math.round(externalBloodLoss), " ml"] })
       ]}),
       /* HEART / CONSCIOUSNESS */
       /* @__PURE__ */ jsxs("div", { className: "bg-[#030303] border border-zinc-800 p-4 font-mono relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
             /* @__PURE__ */ jsxs("div", { className: "text-center flex-1 border-r border-zinc-800", children: [
                /* @__PURE__ */ jsx(Activity, { className: `w-4 h-4 mx-auto mb-1 ${isDead ? 'text-zinc-700' : heartRate>100 ? 'text-amber-500' : 'text-emerald-500'}` }),
                /* @__PURE__ */ jsxs("p", { className: `text-lg font-black ${isDead ? 'text-red-700' : 'text-slate-200'}`, children: [Math.round(heartRate)] }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-zinc-600 uppercase tracking-widest", children: "BPM" })
             ]}),
             /* @__PURE__ */ jsxs("div", { className: "text-center flex-1", children: [
                /* @__PURE__ */ jsx(Eye, { className: `w-4 h-4 mx-auto mb-1 ${consciousness <= 5 ? 'text-red-600' : 'text-slate-400'}` }),
                /* @__PURE__ */ jsxs("p", { className: `text-lg font-black ${consciousness <= 5 ? 'text-red-600' : 'text-slate-200'}`, children: [Math.round(consciousness), "%"] }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-zinc-600 uppercase tracking-widest", children: "PRZYTOMNOŚĆ" })
             ]})
          ]}),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 text-[8px] text-amber-500/80 uppercase tracking-widest", children: ["Ból: ", Math.round(pain)] })
       ]}),
       /* LUNGS / AIRWAY */
       /* @__PURE__ */ jsxs("div", { className: "bg-[#030303] border border-zinc-800 p-4 font-mono relative flex flex-col justify-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full px-4 mb-2 text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sky-500 flex items-center gap-1", children: [/* @__PURE__ */ jsx(Wind, { className: "w-3 h-3" }), "SpO2"] }),
              /* @__PURE__ */ jsxs("span", { className: `font-bold ${saturation<60 ? 'text-amber-500' : 'text-slate-200'}`, children: [Math.round(saturation), "%"] })
          ]}),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full px-4 text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-amber-600 flex items-center gap-1", children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }), "Drożność"] }),
              /* @__PURE__ */ jsxs("span", { className: `font-bold ${airway===0 ? 'text-red-500' : 'text-slate-200'}`, children: [Math.round(airway), "%"] })
          ]}),
       ]}),
       /* ORGANS STATUS FOR HARVEST */
       /* @__PURE__ */ jsxs("div", { className: "bg-[#030303] border border-zinc-800 p-4 font-mono flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[8px] uppercase tracking-widest text-zinc-500 flex justify-between", children: [/* @__PURE__ */ jsx("span", { children: "Stan Narządów Celu" }), /* @__PURE__ */ jsxs("span", { className: "text-emerald-500/50", children: [Math.round(percentOrgans), "%"] })] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-y-2 mt-2 gap-x-2 text-[10px]", children: [
             /* @__PURE__ */ jsxs("span", { className: "flex justify-between", children: [ /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Serce" }), /* @__PURE__ */ jsx("span", { className: organs.heart<50 ? 'text-red-500' : 'text-emerald-400', children: Math.round(organs.heart) }) ]}),
             /* @__PURE__ */ jsxs("span", { className: "flex justify-between", children: [ /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Płuca" }), /* @__PURE__ */ jsx("span", { className: organs.lungs<50 ? 'text-red-500' : 'text-emerald-400', children: Math.round(organs.lungs) }) ]}),
             /* @__PURE__ */ jsxs("span", { className: "flex justify-between", children: [ /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Wątroba" }), /* @__PURE__ */ jsx("span", { className: organs.liver<50 ? 'text-red-500' : 'text-emerald-400', children: Math.round(organs.liver) }) ]}),
             /* @__PURE__ */ jsxs("span", { className: "flex justify-between", children: [ /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Nerki" }), /* @__PURE__ */ jsx("span", { className: organs.kidneys<50 ? 'text-red-500' : 'text-emerald-400', children: Math.round(organs.kidneys) }) ]})
          ]})
       ]})
    ]}),

    // BOTTOM AREA: INJURY LOG & TURN ACTION BAR
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2 overflow-hidden", children: [
       
       /* INJURY LOG / THE SURVIVAL STREAM */
       /* @__PURE__ */ jsxs("div", { className: "w-1/3 bg-black border border-zinc-800 flex flex-col rounded", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border-b border-zinc-800 p-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex gap-1 items-center", children: [/* @__PURE__ */ jsx(FileWarning, { className: "w-3 h-3" }), "Dziennik Traumy"]}),
              /* @__PURE__ */ jsxs("span", { children: ["Tura: ", turn] })
          ]}),
          /* @__PURE__ */ jsx("div", { ref: injuryLogRef, className: "flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2 font-mono text-[9px] leading-relaxed", children: 
              sustainedInjuries.length === 0 ? /* @__PURE__ */ jsx("span", { className: "text-zinc-700 italic", children: "[Oczekiwanie na inicjację destrukcji taktycznej]" }) :
              sustainedInjuries.map((log, i) => {
                 let tColor = log.includes("[AUTO]") ? "text-amber-500" : log.includes("OSTRZEŻENIE") ? "text-red-500" : "text-emerald-500";
                 return /* @__PURE__ */ jsxs("div", { key: i, className: "border-b border-zinc-900 pb-1 border-opacity-50", children: [
                    /* @__PURE__ */ jsx("span", { className: `font-bold ${tColor} mr-1`, children: log.split(']')[0] + ']' }),
                    /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: log.substring(log.indexOf(']') + 1) })
                 ]});
              })
          }),
          
          (isDead || stance === "NIETOMNY") && /* @__PURE__ */ jsxs("div", { className: `p-4 border-t ${isDead ? 'bg-red-950 border-red-900' : 'bg-amber-950 border-amber-900'}`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-bold text-xs tracking-widest uppercase mb-4 ${isDead ? 'text-red-500' : 'text-amber-500'}`, children: isDead ? "CEL WYELIMINOWANY" : "CEL NIEPRZYTOMNY (GOTOWY DO TRANSPORTU)" }),
              
              isDead ? 
              /* @__PURE__ */ jsx("button", { onClick: () => setPhase("SUCCESS"), className: "w-full bg-red-600 hover:bg-red-500 text-black py-2 text-[10px] font-black uppercase tracking-widest", children: "Zabezpiecz Skutki (Utylizacja)" })
              :
              /* @__PURE__ */ jsx("button", { onClick: () => { handleKidnap(); setPhase("SUCCESS"); }, className: "w-full bg-amber-600 hover:bg-amber-500 text-black py-2 text-[10px] font-black uppercase tracking-widest", children: "Porwij Żywego Celu >>" })
          ]})
       ]}),

       /* ACTION TREE (TURN EXECUTION) */
       /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-[#030303] border border-zinc-800 rounded p-4 flex flex-col relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex flex-col items-end opacity-50 pointer-events-none", children: [
             /* @__PURE__ */ jsx("span", { className: "text-[8px] font-mono text-zinc-500 uppercase", children: "Obecne Narzedzie:" }),
             /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-300 font-mono uppercase", children: selectedWeapon?.name }),
          ]}),

          !isDead && /* @__PURE__ */ jsxs("h3", { className: "text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-4 border-b border-zinc-800 pb-2", children: ["Faza Inicjatywy (Wybierz Atak na Turę ", turn, ")"] }),

          !isDead && (
             !selectedAttackMode ? (
                /* Step 1: Mode */
                /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mt-4 max-w-sm", children: 
                   getAvailableAttackTypes(selectedWeapon).map(t => (
                      /* @__PURE__ */ jsxs("button", { key: t, onClick: () => setSelectedAttackMode(t), className: "flex justify-between items-center bg-[#050505] hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-500 p-3 text-left transition-all", children: [
                         /* @__PURE__ */ jsx("span", { className: "text-slate-300 font-mono uppercase text-[10px]", children: t }),
                         /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-zinc-600" })
                      ]})
                   ))
                })
             ) : (
                !selectedBodyPart ? (
                   /* Step 2: Body Part */
                   /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mt-4 max-w-sm relative", children: [
                      /* @__PURE__ */ jsxs("button", { onClick: () => setSelectedAttackMode(null), className: "absolute -top-10 left-0 text-[9px] text-agency-main font-mono uppercase", children: ["< Cofnij (", selectedAttackMode, ")"] }),
                      Object.keys(ATTACK_TREE[selectedAttackMode] || {}).map(p => (
                         /* @__PURE__ */ jsxs("button", { key: p, onClick: () => setSelectedBodyPart(p), className: "flex justify-between items-center bg-[#050505] hover:bg-zinc-900 border border-zinc-800 p-3 text-left transition-all", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-slate-300 font-mono uppercase text-[10px]", children: p }),
                            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-zinc-600" })
                         ]})
                      ))
                   ]})
                ) : (
                   /* Step 3: Execute Final Attack */
                   /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap mt-4 relative pt-6", children: [
                      /* @__PURE__ */ jsxs("button", { onClick: () => setSelectedBodyPart(null), className: "absolute top-0 left-0 text-[9px] text-zinc-500 font-mono uppercase", children: ["< Cofnij (", selectedBodyPart, ")"] }),
                      (ATTACK_TREE[selectedAttackMode][selectedBodyPart] || []).map(atk => {
                         const available = isRequirementMet(atk);
                         return /* @__PURE__ */ jsxs("div", { 
                             key: atk.name, 
                             onClick: () => available && executePlayerAction({...atk}), 
                             className: `w-48 border p-3 transition-all flex flex-col justify-between ${available ? 'bg-[#0a0303] border-red-900/30 hover:border-red-500 hover:bg-red-900/10 cursor-pointer' : 'bg-black border-zinc-900 opacity-50 cursor-not-allowed'}`, 
                             children: [
                                 /* @__PURE__ */ jsxs("div", { children: [
                                     /* @__PURE__ */ jsx("h5", { className: "font-black text-[10px] text-slate-200 uppercase tracking-widest leading-tight mb-2", children: atk.name }),
                                     !available && /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold text-red-500 mb-1 uppercase tracking-widest", children: "BRAK ODPOWIEDNIEGO NARZĘDZIA" })
                                 ]}),
                                 /* @__PURE__ */ jsx("p", { className: "text-[8px] font-mono text-zinc-500 border-t border-zinc-800 pt-2 mt-auto", children: atk.desc })
                             ]
                         });
                      })
                   ]})
                )
             )
          )

       ]})

    ]})

  ]});
};

export default ActionElimination;
