import { useState, useMemo } from "react";
import { GameState } from "../../App/GameState.js";
import { useGame } from "../../App/GameContext.js";
import { dispatchDataTransfer } from "../../App/events.js";
const useWorkLink = () => {
  const { settings } = useGame();
  const activeFile = GameState.getActiveVictim();
  const [db] = useState(GameState.getAllCitizens());
  const getAutofill = (val) => settings.autoFill && val && val !== "Brak" && val !== "---" ? val : "";
  const [handle, setHandle] = useState(getAutofill(activeFile?.workLinkHandle));
  const results = useMemo(() => {
    if (!handle) return [];
    return db.filter((p) => {
      const matchHandle = handle ? p.socialMedia.workLinkHandle.toLowerCase().includes(handle.toLowerCase()) : true;
      return matchHandle;
    });
  }, [db, handle]);
  const handleDownload = (citizen) => {
    dispatchDataTransfer({
      employment: citizen.jobTitle,
      education: citizen.education,
      schoolName: citizen.schoolName,
      schoolAddress: citizen.schoolAddress
    });
  };
  return {
    handle,
    setHandle,
    results,
    handleDownload,
    showDownloadBtn: settings.showDownloadBtn
  };
};
export {
  useWorkLink
};
