<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="dark" expand>
      <router-link
        slot="brand"
        class="nav-item secondary text-white mr-3"
        to="/"
      >
        <img class="mr-1" src="img/hedera-wallet.png" alt="logo" />
        <span class="align-middle font-weight-bold"
          >Hedera Wallet Playground</span
        >
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <router-link class="nav-item secondary text-white mr-3" to="/tokenizer"
          >Tokenizer</router-link
        >
        <router-link class="nav-item secondary text-white mr-3" to="/bridge"
          >Bridge</router-link
        >
        <router-link class="nav-item secondary text-white" to="/faucet"
          >Faucet</router-link
        >
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item d-none d-lg-block ml-lg-4">
          <a
            v-if="!hederaWallet"
            href="https://github.com/Dodecane/hedera-wallet/releases/"
            target="_blank"
            rel="noopener"
            class="btn btn-neutral btn-icon"
          >
            <span class="btn-inner--icon">
              <i class="fa fa-download mr-2"></i>
            </span>
            <span class="nav-link-inner--text"
              >Install Hedera Wallet Extension</span
            >
          </a>
          <base-button
            v-else-if="!walletConnected"
            @click="connectWallet()"
            type="secondary"
            icon="fa fa-sign-in mr-2"
            >Connect Wallet</base-button
          >
          <base-button
            v-else-if="!incorrectNetwork"
            @click="disconnectWallet()"
            type="primary"
            icon="fa fa-sign-out mr-2"
            >Disconnect Wallet
            <badge class="ml-2" type="secondary">{{
              connectedAccount.name
            }}</badge></base-button
          >
          <base-button
            v-else
            @click="disconnectWallet()"
            type="danger"
            icon="fa fa-sign-out mr-2"
            >Disconnect Wallet
            <badge class="ml-2" type="secondary">{{
              connectedAccount.name
            }}</badge>
            <badge class="ml-2" type="secondary"
              >Wrong Network! Please connect a testnet wallet</badge
            ></base-button
          >
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

import wallet from "../mixins/wallet";

export default {
  mixins: [wallet],
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown,
  },
  async mounted() {
    let _this = this;
    setTimeout(function() {
      if (window.hederaWallet && window.hederaWallet.isHederaWallet === true) {
        _this.$store.commit("hederaWallet", window.hederaWallet);
        _this.connectWallet();
      }
    }, 1000);
  },
};
</script>
<style></style>
