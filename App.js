import { jsx } from "react/jsx-runtime";
import MainLayout from "./Design/App/MainLayout.js";
import { GameProvider } from "./Scripts/App/GameContext.js";
const App = () => {
  return /* @__PURE__ */ jsx(GameProvider, { children: /* @__PURE__ */ jsx(MainLayout, {}) });
};
var stdin_default = App;
export {
  stdin_default as default
};
