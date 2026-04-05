import { useState } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
const useVehicleTracking = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [city, setCity] = useState(getAutofill(activeFile?.city));
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [isObserving, setIsObserving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [observationComplete, setObservationComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [investigationResult, setInvestigationResult] = useState(null);
  const handleInitiate = () => {
    if (!city || !vehicleModel || !vehicleColor || !licensePlate) {
      alert("MIASTO, MODEL, KOLOR I REJESTRACJA S\u0104 WYMAGANE DO \u015ALEDZENIA POJAZDU");
      return;
    }
    setIsObserving(true);
    setObservationComplete(false);
    setProgress(0);
    setInvestigationResult(null);
    setLogs(["> Skanowanie tablic rejestracyjnych...", "> Analiza ruchu ulicznego..."]);
    const inputCity = city.toLowerCase().trim();
    const inputModel = vehicleModel.toLowerCase().trim();
    const inputColor = vehicleColor.toLowerCase().trim();
    const inputPlate = licensePlate.replace(/\s/g, "").toLowerCase();
    const found = db.find((c) => {
      if (!c.vehicle || !c.licensePlate) return false;
      const cCity = (c.currentCity || c.city).toLowerCase();
      const cVehicle = c.vehicle.toLowerCase();
      const cPlate = c.licensePlate.replace(/\s/g, "").toLowerCase();
      return cCity.includes(inputCity) && cVehicle.includes(inputModel) && cVehicle.includes(inputColor) && cPlate.includes(inputPlate);
    });
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
          setInvestigationResult(`\u015Aledzony pojazd: ${found.vehicle} (${found.licensePlate})
Lokalizacja: ${found.currentCity}
W\u0142a\u015Bciciel: ${found.firstName} ${found.lastName}`);
          setLogs((prev) => [...prev.slice(-4), "> POJAZD NAMIERZONY."]);
        } else {
          setInvestigationResult("Brak zarejestrowanych pojazd\xF3w pasuj\u0105cych do kryteri\xF3w.");
          setLogs((prev) => [...prev.slice(-4), "> BRAK POJAZD\xD3W."]);
        }
      }
    }, 100);
  };
  return {
    city,
    setCity,
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
    investigationResult,
    handleInitiate
  };
};
export {
  useVehicleTracking
};
