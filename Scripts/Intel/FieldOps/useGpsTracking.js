import { useState } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
const useGpsTracking = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [phoneNumber, setPhoneNumber] = useState(getAutofill(activeFile?.phoneNumber));
  const [isObserving, setIsObserving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [observationComplete, setObservationComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [investigationResult, setInvestigationResult] = useState(null);
  const handleInitiate = () => {
    if (!phoneNumber) {
      alert("NUMER TELEFONU JEST WYMAGANY DO NAMIERZANIA GPS");
      return;
    }
    setIsObserving(true);
    setObservationComplete(false);
    setProgress(0);
    setInvestigationResult(null);
    setLogs(["> Triangulacja sygna\u0142u GSM...", "> Przeszukiwanie log\xF3w BTS..."]);
    const cleanPhone = phoneNumber.replace(/\s/g, "");
    const found = db.find((c) => c.phoneNumber?.replace(/\s/g, "") === cleanPhone);
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
          const locs = found.gpsLocations || [];
          const locStr = locs.map((l, i) => {
            const [lat, lon] = l.split(",").map((s) => s.trim());
            return `LOG #${(i + 1).toString().padStart(3, "0")}: ${lat}, ${lon}`;
          }).join("\n");
          setInvestigationResult(`Zlokalizowano urz\u0105dzenie.
Ostatnie logowania do stacji BTS:
${locStr}`);
          setLogs((prev) => [...prev.slice(-4), "> POZYCJA USTALONA."]);
        } else {
          setInvestigationResult("Brak sygna\u0142u GPS dla podanego numeru. Urz\u0105dzenie wy\u0142\u0105czone lub zniszczone.");
          setLogs((prev) => [...prev.slice(-4), "> BRAK WYNIK\xD3W."]);
        }
      }
    }, 100);
  };
  return {
    phoneNumber,
    setPhoneNumber,
    isObserving,
    progress,
    observationComplete,
    logs,
    investigationResult,
    handleInitiate
  };
};
export {
  useGpsTracking
};
