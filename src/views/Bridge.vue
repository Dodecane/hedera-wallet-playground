<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-primary">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <h1 class="display-2 text-white text-center">
            <span>Ethereum to Hedera Hashgraph Bridge</span>
          </h1>
          <p class="lead text-white text-center">
            Custodial protocol powered by Cloud Functions for Firebase,
            currently supports Ethereum
          </p>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <base-alert type="success" fade v-if="showSuccess">
            <span class="alert-inner--icon"><i class="fa fa-check"></i></span>
            <span class="alert-inner--text">{{ this.successMessage }}</span>
            <base-button
              type="button"
              class="close mt-2"
              @click="
                showSuccess = false;
                successMessage = '';
              "
              icon="fa fa-close"
            >
            </base-button>
          </base-alert>
          <base-alert type="danger" fade v-if="showError">
            <span class="alert-inner--icon"><i class="fa fa-warning"></i></span>
            <span class="alert-inner--text">{{ this.errorMessage }}</span>
            <base-button
              type="button"
              class="close mt-2"
              @click="
                showError = false;
                errorMessage = '';
              "
              icon="fa fa-close"
            >
            </base-button>
          </base-alert>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-warning h-100"
          >
            <loading
              :active.sync="sendingEth"
              :is-full-page="false"
              loader="dots"
            ></loading>
            <template>
              <div class="row justify-content-center">
                <div class="col-lg-6 mb-5">
                  <img
                    v-lazy="'img/ethereum.png'"
                    alt="Ethereum logo"
                    class="img-fluid rounded-circle shadow-lg"
                    style="width: 500px;"
                  />
                </div>
              </div>
              <div
                v-if="!ethereumInfo.userAddress"
                class="text-dark text-center mb-3"
              >
                Connect your Ethereum wallet
              </div>
              <a
                v-if="!provider"
                href="https://metamask.io/"
                target="_blank"
                rel="noopener"
                class="btn btn-warning btn-icon col-lg-12"
              >
                <span class="btn-inner--icon">
                  <i class="fa fa-download mr-2"></i>
                </span>
                <span class="nav-link-inner--text">Install Metamask</span>
              </a>
              <div
                v-else-if="ethereumInfo.chainId !== '0x3'"
                class="text-center"
              >
                <div class="text-danger text-center mb-3">
                  Wrong network! Please switch to the Ropsten Test Network
                </div>
              </div>
              <div
                v-else-if="!ethereumInfo.userAddress"
                class="btn-wrapper text-center"
              >
                <base-button
                  type="warning"
                  @click="connectMetamask()"
                  v-b-popover.hover.bottom="
                    `If this button doesn't work please disconnect Metamask in
                  the extension`
                  "
                >
                  Connect Metamask
                </base-button>
              </div>
              <div v-else class="btn-wrapper text-center col-lg-12">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Enter amount of ETH to wrap"
                  v-model.number="ethToWrap"
                  type="number"
                >
                </base-input>
                <base-button
                  :disabled="ethToWrap <= 0"
                  type="warning"
                  @click="sendEth()"
                  class="mb-3"
                >
                  Wrap ETH
                </base-button>
                <div class="text-dark text-center mb-3">
                  Please associate the token
                  <strong>{{ getHethTokenId() }} (hETH)</strong> in Hedera
                  Wallet (click the "+" icon under the tokens tab) before
                  proceeding
                </div>
                <div class="text-dark text-center mb-3">
                  You may obtain Ropsten Testnet Ethereum at
                  <a href="https://faucet.metamask.io/" target="_blank"
                    >faucet.metamask.io</a
                  >
                </div>
              </div>
            </template>
          </card>
        </div>
        <div class="col-lg-6">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-dark text-center h-100"
          >
            <loading
              :active.sync="sendingHeth"
              :is-full-page="false"
              loader="dots"
            ></loading>
            <template>
              <div class="row justify-content-center">
                <div class="col-lg-6 mb-5">
                  <img
                    v-lazy="'img/hedera.png'"
                    alt="Hedera Hashgraph logo"
                    class="img-fluid rounded-circle shadow-lg"
                    style="width: 500px;"
                  />
                </div>
              </div>
              <div v-if="!walletConnected" class="text-dark text-center mb-3">
                Please connect your Hedera Hashgraph wallet
              </div>
              <div v-else-if="incorrectNetwork" class="text-center">
                <div class="text-danger text-center mb-3">
                  Wrong network! Please connect a Test Network account
                </div>
              </div>
              <div v-else class="btn-wrapper text-center col-lg-12">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Enter amount of hETH to unwrap"
                  v-model.number="hethToUnwrap"
                  type="number"
                >
                </base-input>
                <base-button
                  class="btn-tooltip"
                  :disabled="hethToUnwrap <= 0"
                  type="dark"
                  @click="sendHeth()"
                  v-b-popover.hover.bottom="
                    `If this button doesn't work please restart Hedera Wallet by disabling and reenabling it in the Manage extensions page`
                  "
                >
                  Unwrap hETH
                </base-button>
              </div>
            </template>
          </card>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { toHex, toWei } from "web3-utils";
import wallet from "../mixins/wallet";
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import {
  TokenId,
  AccountId,
  TransferTransaction,
  TransactionId,
} from "@hashgraph/sdk";
import { VBPopover } from "bootstrap-vue/esm/directives/popover/popover";

export default {
  directives: {
    BPopover: VBPopover,
  },
  mixins: [wallet],
  components: {
    Loading,
  },
  computed: {
    provider: function() {
      return this.$ethereum;
    },
  },
  data: () => ({
    sendingEth: false,
    sendingHeth: false,
    showSuccess: false,
    successMessage: "",
    showError: false,
    errorMessage: "",
    ethToWrap: "",
    hethToUnwrap: "",
  }),
  methods: {
    async connectMetamask() {
      this.provider.connect();
    },
    getHethTokenId() {
      return process.env.VUE_APP_HETH_TOKEN_ID;
    },
    async sendEth() {
      if (!this.connectedAccount.account) {
        this.errorMessage = "Please connect a Hedera Hashgraph wallet";
        this.showError = true;
        return;
      }
      try {
        this.sendingEth = true;
        this.txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: process.env.VUE_APP_BRIDGE_ETH_ADDRESS,
              from: ethereum.selectedAddress,
              value: toHex(toWei(this.ethToWrap.toString(), "ether")),
            },
          ],
        });
        if (!this.txHash.code) {
          let _this = this;
          axios
            .post(
              `${process.env.VUE_APP_CLOUD_FUNCTIONS_BASE_URL}/bridgeEthereumToHedera`,
              {
                txHash: this.txHash,
                recipientAccountId: this.connectedAccount.account,
              }
            )
            .then(function(res) {
              _this.sendingEth = false;
              if (res.status === 200) {
                _this.successMessage =
                  "Wrapping successful! Check your Hedera Wallet balance.";
                _this.showSuccess = true;
              } else {
                _this.errorMessage = res.data.status;
                _this.showError = true;
              }
            });
        }
      } catch (error) {
        this.sendingEth = false;
        this.errorMessage = "Transaction rejected";
        this.showError = true;
      }
    },
    async sendHeth() {
      if (!this.$ethereum.selectedAddress) {
        this.errorMessage = "Please connect an Ethereum wallet";
        this.showError = true;
        return;
      }
      let hethTokenId = TokenId.fromString(process.env.VUE_APP_HETH_TOKEN_ID);
      let bridgeAccountId = AccountId.fromString(
        process.env.VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID
      );
      let senderAccountId = AccountId.fromString(this.connectedAccount.account);
      let amountToSend = this.hethToUnwrap * 1000000000000000000;
      try {
        this.sendingHeth = true;
        const transaction = new TransferTransaction()
          .addTokenTransfer(hethTokenId, senderAccountId, amountToSend * -1)
          .addTokenTransfer(hethTokenId, bridgeAccountId, amountToSend)
          .setTransactionId(TransactionId.generate(senderAccountId))
          .setNodeAccountIds([AccountId.fromString("0.0.3")])
          .freeze();
        let txReceipt = await this.hederaWallet.signTransaction(transaction);
        if (txReceipt) {
          let _this = this;
          axios
            .post(
              `${process.env.VUE_APP_CLOUD_FUNCTIONS_BASE_URL}/bridgeHederaToEthereum`,
              {
                recipientAddress: this.$ethereum.selectedAddress,
                hethSent: amountToSend,
              }
            )
            .then(function(res) {
              _this.sendingHeth = false;
              if (res.status === 200) {
                _this.successMessage =
                  "Unwrapping successful! Check your Metamask Wallet balance.";
                _this.showSuccess = true;
              } else {
                _this.errorMessage = res.data.status;
                _this.showError = true;
              }
            });
        } else {
          this.errorMessage = "Transaction failed";
          this.showError = true;
        }
      } catch (error) {
        this.sendingHeth = false;
        this.errorMessage = "Transaction rejected";
        this.showError = true;
      }
    },
  },
};
</script>
<style></style>
