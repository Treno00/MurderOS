import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { useVictimFilePanel } from "../../App/useVictimFilePanel.js";
const usePoliceWanted = () => {
  const { updateBalance } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db, setDb] = useState(GameState.getCitizens());
  const { checkSectionComplete } = useVictimFilePanel();
  const wantedPersons = useMemo(() => {
    return db.filter((c) => c.policeStatus === "POSZUKIWANY");
  }, [db]);
  const isAllSegmentsComplete = () => {
    if (!activeFile) return false;
    const allFields = [
      "pesel",
      "firstName",
      "lastName",
      "birthDate",
      "maritalStatus",
      "education",
      "schoolName",
      "schoolAddress",
      "mainExamTitle",
      "mainExamYear",
      "mainExamGrade",
      "extraExamTitle",
      "extraExamYear",
      "extraExamGrade",
      "city",
      "registeredAddress",
      "livesWith",
      "livingAddress",
      "employment",
      "workAddress",
      "accountNumber",
      "bankName",
      "vehicle",
      "cardNumber",
      "cardExpiry",
      "cardCVV",
      "accountBalance",
      "income",
      "height",
      "weight",
      "hairColor",
      "eyeColor",
      "sentences",
      "fines",
      "insuranceNumber",
      "bloodType",
      "bmi",
      "diseases",
      "addictions",
      "psychologicalProfile"
    ];
    return checkSectionComplete(allFields, true);
  };
  const handleSendData = (citizen) => {
    if (activeFile?.pesel === citizen.pesel && isAllSegmentsComplete()) {
      const rewardMsg = citizen.reward ? ` Otrzymano nagrod\u0119: ${citizen.reward.toLocaleString()} PLN.` : "";
      alert(`Dane przes\u0142ane pomy\u015Blnie. Zlecenie zako\u0144czone sukcesem!${rewardMsg}`);
      if (citizen.reward) {
        updateBalance(citizen.reward);
      }
      GameState.resolvePoliceStatus(citizen.id);
      setDb((prev) => prev.map((c) => c.id === citizen.id ? { ...c, policeStatus: "CZYSTY" } : c));
      
      const event = new CustomEvent("CLOSE_VICTIM_FILE", { detail: { pesel: citizen.pesel } });
      window.dispatchEvent(event);
    } else {
      alert("Teczka nie jest kompletna lub nie dotyczy tej osoby.");
    }
  };
  return {
    wantedPersons,
    handleSendData,
    isAllSegmentsComplete: isAllSegmentsComplete()
  };
};
export {
  usePoliceWanted
};
