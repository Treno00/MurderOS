import { jsx } from "react/jsx-runtime";
import PoliceRegistry from "./PoliceRegistry.js";
import PoliceMissing from "./PoliceMissing.js";
import PoliceWanted from "./PoliceWanted.js";
const PoliceDatabase = ({ mode }) => {
  if (mode === "BAZA") return /* @__PURE__ */ jsx(PoliceRegistry, {});
  if (mode === "ZAGINIENI") return /* @__PURE__ */ jsx(PoliceMissing, {});
  if (mode === "POSZUKIWANI") return /* @__PURE__ */ jsx(PoliceWanted, {});
  return null;
};
var stdin_default = PoliceDatabase;
export {
  stdin_default as default
};
