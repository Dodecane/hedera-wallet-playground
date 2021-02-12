import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state: {
    hederaWallet: false,
    walletConnected: false,
    connectedAccount: false,
    incorrectNetwork: false,
  },

  mutations: {
    hederaWallet(state, change) {
      state.hederaWallet = change;
    },
    walletConnected(state, change) {
      state.walletConnected = change;
    },
    connectedAccount(state, change) {
      state.connectedAccount = change;
    },
    incorrectNetwork(state, change) {
      state.incorrectNetwork = change;
    },
  },

  plugins: [vuexLocal.plugin],
});
