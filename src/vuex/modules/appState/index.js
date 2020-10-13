import state from "./state";
import mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";

const appState = {
  state,
  mutations,
  actions,
  getters
};

export default appState;
