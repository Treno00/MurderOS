import { useState } from "react";
import { GameState } from "../../App/GameState.js";
import { dispatchDataTransfer } from "../../App/events.js";
import { useGame } from "../../App/GameContext.js";
const useFieldInvestigation = () => {
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
  const [height, setHeight] = useState(getAutofill(activeFile?.height));
  const [weight, setWeight] = useState(getAutofill(activeFile?.weight));
  const [hairColor, setHairColor] = useState(getAutofill(activeFile?.hairColor));
  const [eyeColor, setEyeColor] = useState(getAutofill(activeFile?.eyeColor));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [mode, setMode] = useState("OBSERWACJA");
  const [isObserving, setIsObserving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [observationComplete, setObservationComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [targetCitizen, setTargetCitizen] = useState(null);
  const [isTarget, setIsTarget] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Poniedzia\u0142ek");
  const [investigationResult, setInvestigationResult] = useState(null);
  const cleanString = (str) => str.toLowerCase().replace(/^(ul\.|al\.|pl\.)\s*/, "").trim();
  const handleInitiate = () => {
    if (mode === "OBSERWACJA") {
      if (!startLocation || !city || !height || !weight || !hairColor || !eyeColor) {
        alert("WSZYSTKIE POLA (LOKALIZACJA, MIASTO, BIOMETRIA) S\u0104 WYMAGANE");
        return;
      }
    } else if (mode === "POJAZD") {
      if (!city || !vehicleModel || !vehicleColor || !licensePlate) {
        alert("MIASTO, MODEL, KOLOR I REJESTRACJA S\u0104 WYMAGANE DO \u015ALEDZENIA POJAZDU");
        return;
      }
    } else if (mode === "GPS") {
      if (!phoneNumber) {
        alert("NUMER TELEFONU JEST WYMAGANY DO NAMIERZANIA GPS");
        return;
      }
    } else if (mode === "WYWIAD") {
      if (!startLocation || !city) {
        alert("LOKALIZACJA I MIASTO S\u0104 WYMAGANE DO WYWIADU");
        return;
      }
    }
    setIsObserving(true);
    setObservationComplete(false);
    setProgress(0);
    setTargetCitizen(null);
    setIsTarget(false);
    setInvestigationResult(null);
    const modeLogs = {
      "OBSERWACJA": ["> Inicjalizacja drona...", "> Kalibracja optyki..."],
      "POJAZD": ["> Skanowanie tablic rejestracyjnych...", "> Analiza ruchu ulicznego..."],
      "GPS": ["> Triangulacja sygna\u0142u GSM...", "> Przeszukiwanie log\xF3w BTS..."],
      "WYWIAD": ["> Analiza powi\u0105za\u0144...", "> Weryfikacja s\u0105siedzka..."]
    };
    setLogs(modeLogs[mode]);
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
    const residents = db.filter((c) => {
      const matchLiving = checkLocation(c.livingAddress, c.currentCity || c.city);
      if (mode === "WYWIAD") {
        const matchRegistered = checkLocation(c.address, c.city);
        return matchRegistered || matchLiving;
      }
      return matchLiving;
    });
    let found;
    let foundIsTarget = false;
    if (mode === "OBSERWACJA") {
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
    } else if (mode === "POJAZD") {
      const inputCity2 = city.toLowerCase().trim();
      const inputModel = vehicleModel.toLowerCase().trim();
      const inputColor = vehicleColor.toLowerCase().trim();
      const inputPlate = licensePlate.replace(/\s/g, "").toLowerCase();
      found = db.find((c) => {
        if (!c.vehicle || !c.licensePlate) return false;
        const cCity = (c.currentCity || c.city).toLowerCase();
        const cVehicle = c.vehicle.toLowerCase();
        const cPlate = c.licensePlate.replace(/\s/g, "").toLowerCase();
        return cCity.includes(inputCity2) && cVehicle.includes(inputModel) && cVehicle.includes(inputColor) && cPlate.includes(inputPlate);
      });
      if (found) foundIsTarget = true;
    } else if (mode === "GPS") {
      const cleanPhone = phoneNumber.replace(/\s/g, "");
      found = db.find((c) => c.phoneNumber?.replace(/\s/g, "") === cleanPhone);
      if (found) foundIsTarget = true;
    } else if (mode === "WYWIAD") {
      if (residents.length > 0) found = residents[0];
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
          setIsTarget(mode === "OBSERWACJA" ? foundIsTarget : true);
          if (mode === "OBSERWACJA") {
            if (foundIsTarget) setLogs((prev) => [...prev.slice(-4), "> CEL ZIDENTYFIKOWANY."]);
            else setLogs((prev) => [...prev.slice(-4), "> ZIDENTYFIKOWANO MIESZKA\u0143CA."]);
          } else if (mode === "POJAZD") {
            if (found) {
              setInvestigationResult(`\u015Aledzony pojazd: ${found.vehicle} (${found.licensePlate})
Lokalizacja: ${found.currentCity}
W\u0142a\u015Bciciel: ${found.firstName} ${found.lastName}`);
              setLogs((prev) => [...prev.slice(-4), "> POJAZD NAMIERZONY."]);
            } else {
              setInvestigationResult("Brak zarejestrowanych pojazd\xF3w pasuj\u0105cych do kryteri\xF3w.");
              setLogs((prev) => [...prev.slice(-4), "> BRAK POJAZD\xD3W."]);
            }
          } else if (mode === "GPS") {
            if (found) {
              const locs = found.gpsLocations || [];
              const locStr = locs.map((l, i) => `${i + 1}. ${l}`).join("\n");
              setInvestigationResult(`Zlokalizowano urz\u0105dzenie.
Numer zarejestrowany na: ${found.firstName} ${found.lastName} (PESEL: ${found.pesel})
Ostatnie logowania do stacji BTS:
${locStr}`);
            } else {
              setInvestigationResult("Brak sygna\u0142u GPS dla podanego numeru. Urz\u0105dzenie wy\u0142\u0105czone lub zniszczone.");
            }
            setLogs((prev) => [...prev.slice(-4), "> POZYCJA USTALONA."]);
          } else if (mode === "WYWIAD") {
            const allConnections = residents.flatMap((r) => r.connections.map((c) => `${c.firstName} ${c.lastName} (${c.type}) - powi\u0105zany z ${r.firstName} ${r.lastName}`));
            const uniqueConns = [...new Set(allConnections)];
            let result = uniqueConns.length > 0 ? `Ustalono powi\u0105zania mieszka\u0144c\xF3w:
${uniqueConns.join("\n")}` : "Brak ustalonych powi\u0105za\u0144 w tym rejonie.";
            const missingOrWanted = residents.find((r) => r.kidnapperId || r.policeStatus === "ZAGINIONY" || r.policeStatus === "POSZUKIWANY");
            if (missingOrWanted) {
              const isAtHideout = checkLocation(missingOrWanted.currentAddress, missingOrWanted.currentCity || missingOrWanted.city);
              const isAtRegistered = checkLocation(missingOrWanted.address, missingOrWanted.city) || checkLocation(missingOrWanted.livingAddress, missingOrWanted.city);
              if (isAtHideout || isAtRegistered) { // We check both, Wywiad Środowiskowy needs to give info at *any* victim's location
                let tracks = "";
                let tracksModelStr = "";
                let bloodStr = "";
                let hairStr = "";
                if (missingOrWanted.kidnapperId) {
                  const rental = GameState.carRentals.find((r) => r.citizenId === missingOrWanted.kidnapperId);
                  if (rental) {
                    tracks = rental.carModel;
                    tracksModelStr = rental.carModel;
                  } else {
                    const kidnapper2 = GameState.getAllCitizens().find((c) => c.id === missingOrWanted.kidnapperId);
                    tracks = kidnapper2 && kidnapper2.vehicle ? kidnapper2.vehicle : "nieznany";
                    tracksModelStr = kidnapper2 && kidnapper2.vehicle ? kidnapper2.vehicle : "nieznanego z okolic";
                  }
                  const kidnapper = GameState.getAllCitizens().find((c) => c.id === missingOrWanted.kidnapperId);
                  if (kidnapper) {
                    const bloods = [missingOrWanted.bloodType, kidnapper.bloodType].sort(() => Math.random() - 0.5);
                    bloodStr = `Znaleziona krew: ${bloods[0]} oraz ${bloods[1]}.`;
                    const hairs = [];
                    if (missingOrWanted.hairColor !== "\u0141ysy") hairs.push(missingOrWanted.hairColor);
                    if (kidnapper.hairColor !== "\u0141ysy") hairs.push(kidnapper.hairColor);
                    if (hairs.length > 0) {
                      hairStr = `Znaleziono w\u0142osy w kolorach: ${hairs.join(" i ")}.`;
                    }
                  }
                } else {
                  tracks = missingOrWanted.vehicle ? missingOrWanted.vehicle : "nieznany";
                  tracksModelStr = missingOrWanted.vehicle ? missingOrWanted.vehicle : "nieznanego z okolic";
                  bloodStr = `Znaleziona krew: ${missingOrWanted.bloodType}.`;
                }
                
                if (isAtHideout) {
                  result += `\n\n[ANALIZA \u015ALAD\xD3W NA MIEJSCU]\nZnaleziono \u015Blady opon pasuj\u0105ce do ${tracksModelStr}.\n${bloodStr}\n${hairStr}`;
                } else if (isAtRegistered && missingOrWanted.kidnapperId) {
                  const kidnapper = GameState.getAllCitizens().find((c) => c.id === missingOrWanted.kidnapperId);
                  if (kidnapper) {
                     result += `\n\n[INFORMACJE Z WYWIADU]\nS\u0105siedzi widzieli podejrzan\u0105 osob\u0119 kr\u0119c\u0105c\u0105 si\u0119 w okolicy.\nRysopis: Wzrost ok. ${kidnapper.height}cm, w\u0142osy: ${kidnapper.hairColor}, oczy: ${kidnapper.eyeColor}.\nPojazd sprawcy u\u017Cyty w zaj\u015Bciu: ${tracks}.`;
                  }
                }
              }
            }
            setInvestigationResult(result);
            setLogs((prev) => [...prev.slice(-4), "> POWI\u0104ZANIA I \u015ALADY USTALONE."]);
          }
        } else {
          setLogs((prev) => [...prev.slice(-4), "> BRAK WYNIK\xD3W."]);
          setInvestigationResult("Nie znaleziono danych pasuj\u0105cych do kryteri\xF3w.");
        }
      }
    }, 100);
  };
  const handleSave = () => {
    if (!targetCitizen) return;
    dispatchDataTransfer({
      routine: targetCitizen.routine,
      vehicle: targetCitizen.vehicle || "Brak"
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
    phoneNumber,
    setPhoneNumber,
    licensePlate,
    setLicensePlate,
    vehicleModel,
    setVehicleModel,
    vehicleColor,
    setVehicleColor,
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
    showDownloadBtn: true,
    mode,
    setMode,
    investigationResult
  };
};
export {
  useFieldInvestigation
};
