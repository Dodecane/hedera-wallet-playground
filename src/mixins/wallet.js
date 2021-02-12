import { mapState } from "vuex";
export default {
  computed: mapState({
    hederaWallet: (state) => state.hederaWallet,
    walletConnected: (state) => state.walletConnected,
    connectedAccount: (state) => state.connectedAccount,
    incorrectNetwork: (state) => state.incorrectNetwork,
  }),
  methods: {
    async connectWallet() {
      try {
        let account = await this.hederaWallet.getAccount();
        this.$store.commit("connectedAccount", account);
        if (account.network !== "network.testnet") {
          this.$store.commit("incorrectNetwork", true);
        }
        this.$store.commit("walletConnected", true);
      } catch (error) {
        this.$store.commit("walletConnected", false);
      }
    },
    async disconnectWallet() {
      try {
        console.log(await this.hederaWallet.forgetIdentity());
        this.$store.commit("walletConnected", false);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
