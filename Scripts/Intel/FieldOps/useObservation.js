import { useState } from "react";
import { GameState } from "../../App/GameState.js";
import { dispatchDataTransfer } from "../../App/events.js";
import { useGame } from "../../App/GameContext.js";
const useObservation = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const resolveLocationData = () => {
    const rawAddress = activeFile?.livingAddress || activeFile?.registeredAddress || activeFile?.workAddress;
    const defaultCity = activeFile?.city;
    if (!rawAddress) {
      return { addr: "", city: defaultCity || "" };
    }
    const match = rawAddress.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (match) {
      return {
        addr: match[1].trim(),
        city: match[2].trim()
      };
    }
    return { addr: rawAddress, city: defaultCity || "" };
  };
  const locData = resolveLocationData();
  const [startLocation, setStartLocation] = useState(getAutofill(locData.addr));
  const [city, setCity] = useState(getAutofill(locData.city));
  const [height, setHeight] = useState(getAutofill(activeFile?.height?.toString()));
  const [weight, setWeight] = useState(getAutofill(activeFile?.weight?.toString()));
  const [hairColor, setHairColor] = useState(getAutofill(activeFile?.hairColor));
  const [eyeColor, setEyeColor] = useState(getAutofill(activeFile?.eyeColor));
  const [isObserving, setIsObserving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [observationComplete, setObservationComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [targetCitizen, setTargetCitizen] = useState(null);
  const [isTarget, setIsTarget] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Poniedzia\u0142ek");
  const cleanString = (str) => str.toLowerCase().replace(/^(ul\.|al\.|pl\.)\s*/, "").trim();
  const handleInitiate = () => {
    if (!startLocation || !city || !height || !weight || !hairColor || !eyeColor) {
      alert("WSZYSTKIE POLA (LOKALIZACJA, MIASTO, BIOMETRIA) S\u0104 WYMAGANE");
      return;
    }
    setIsObserving(true);
    setObservationComplete(false);
    setProgress(0);
    setTargetCitizen(null);
    setIsTarget(false);
    setLogs(["> Inicjalizacja drona...", "> Kalibracja optyki..."]);
    const inputLoc = cleanString(startLocation);
    const inputCity = city.toLowerCase().trim();
    const h = parseInt(height);
    const w = parseInt(weight);
    const checkLocation = (dbAddr, dbDefaultCity) => {
      if (!dbAddr || dbAddr === "Brak" || dbAddr === "Brak (Bezrobotny)") return false;
      let actualAddr = dbAddr;
      let actualCity = dbDefaultCity;
      const match = dbAddr.match(/^(.*?)\s*\(([^)]+)\)$/);
      if (match) {
        actualAddr = match[1];
        actualCity = match[2];
      }
      const cleanDbAddr = cleanString(actualAddr);
      return cleanDbAddr.includes(inputLoc) && actualCity.toLowerCase().includes(inputCity);
    };
    const residents = db.filter((c) => checkLocation(c.currentAddress, c.currentCity || c.city) || checkLocation(c.livingAddress, c.city) || checkLocation(c.address, c.city));
    let found;
    let foundIsTarget = false;
    found = residents.find((c) => {
      const cHeight = Number(c.height);
      const cWeight = Number(c.weight);
      if (isNaN(h) || isNaN(w)) return false;
      const hMatch = Math.abs(cHeight - h) <= 5;
      const wMatch = Math.abs(cWeight - w) <= 5;
      const hairMatch = c.hairColor.toLowerCase() === hairColor.toLowerCase().trim();
      const eyeMatch = c.eyeColor.toLowerCase() === eyeColor.toLowerCase().trim();
      return hMatch && wMatch && hairMatch && eyeMatch;
    });
    if (found) {
      foundIsTarget = true;
    } else if (residents.length > 0) {
      found = residents[0];
      foundIsTarget = false;
    }
    let p = 0;
    const interval = setInterval(() => {
      p += 100 / 40;
      setProgress(Math.min(p, 100));
      if (Math.random() > 0.85) {
        const randomLog = `> ${["Przetwarzanie danych...", "Weryfikacja...", "Pobieranie pakiet\xF3w...", "Analiza wzorca..."][Math.floor(Math.random() * 4)]}`;
        setLogs((prev) => [...prev.slice(-4), randomLog]);
      }
      if (p >= 100) {
        clearInterval(interval);
        setIsObserving(false);
        setObservationComplete(true);
        if (found) {
          setTargetCitizen(found);
          setIsTarget(foundIsTarget);
          if (foundIsTarget) setLogs((prev) => [...prev.slice(-4), "> CEL ZIDENTYFIKOWANY."]);
          else setLogs((prev) => [...prev.slice(-4), "> ZIDENTYFIKOWANO MIESZKA\u0143CA."]);
        } else {
          setLogs((prev) => [...prev.slice(-4), "> BRAK WYNIK\xD3W."]);
        }
      }
    }, 100);
  };
  const handleSave = () => {
    if (!targetCitizen) return;
    dispatchDataTransfer({
      livingAddress: targetCitizen.livingAddress,
      currentAddress: targetCitizen.currentAddress,
      currentCity: targetCitizen.currentCity || targetCitizen.city,
      workAddress: targetCitizen.currentWorkAddress || targetCitizen.workAddress,
      routine: targetCitizen.routine
    });
  };
  return {
    startLocation,
    setStartLocation,
    city,
    setCity,
    height,
    setHeight,
    weight,
    setWeight,
    hairColor,
    setHairColor,
    eyeColor,
    setEyeColor,
    isObserving,
    progress,
    observationComplete,
    logs,
    targetCitizen,
    isTarget,
    selectedDay,
    setSelectedDay,
    handleInitiate,
    handleSave,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useObservation
};
