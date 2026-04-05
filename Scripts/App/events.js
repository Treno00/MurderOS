const EVENTS = {
  TRANSFER_DATA: "TRANSFER_INTEL_DATA",
  CLOSE_VICTIM_FILE: "CLOSE_VICTIM_FILE",
  ADD_NEW_VICTIM_FILE: "ADD_NEW_VICTIM_FILE"
};
const dispatchDataTransfer = (data) => {
  const event = new CustomEvent(EVENTS.TRANSFER_DATA, { detail: data });
  window.dispatchEvent(event);
};
const dispatchAddNewVictimFile = (data) => {
  const event = new CustomEvent(EVENTS.ADD_NEW_VICTIM_FILE, { detail: data });
  window.dispatchEvent(event);
};
const dispatchCloseFile = (pesel) => {
  const event = new CustomEvent(EVENTS.CLOSE_VICTIM_FILE, { detail: { pesel } });
  window.dispatchEvent(event);
};
export {
  EVENTS,
  dispatchAddNewVictimFile,
  dispatchCloseFile,
  dispatchDataTransfer
};
