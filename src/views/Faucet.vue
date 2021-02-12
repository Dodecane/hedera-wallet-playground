<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-info">
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
            <span>Hedera Hashgraph Test Network Account Faucet</span>
          </h1>
          <p class="lead text-white text-center">
            Get an account ID along with 100 testnet HBAR for testing purposes
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
            class="border-info h-100"
          >
            <loading
              :active.sync="isLoading"
              :is-full-page="false"
              loader="dots"
            ></loading>
            <template>
              <div class="btn-wrapper text-center col-lg-12">
                <div class="text-muted text-center mb-3">
                  You can get a public key from the account creation procedure
                  in Hedera Wallet
                </div>
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Enter a public key"
                  v-model="publicKey"
                >
                </base-input>
                <base-button
                  :disabled="publicKey === ''"
                  type="info"
                  class="mb-3"
                  @click="createAccount()"
                >
                  Generate Account ID
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
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { VBPopover } from "bootstrap-vue/esm/directives/popover/popover";
import { PublicKey } from "@hashgraph/sdk";

export default {
  directives: {
    BPopover: VBPopover,
  },
  components: {
    Loading,
  },
  data: () => ({
    isLoading: false,
    showSuccess: false,
    successMessage: "",
    showError: false,
    errorMessage: "",
    publicKey: "",
  }),
  methods: {
    validatePublicKey(publicKey) {
      try {
        let parsedPublicKey = PublicKey.fromString(publicKey);
        if (!parsedPublicKey) {
          return false;
        }
        return parsedPublicKey;
      } catch (error) {
        return false;
      }
    },
    createAccount() {
      let parsedPublicKey = this.validatePublicKey(this.publicKey);
      if (!parsedPublicKey) {
        this.errorMessage = "Invalid public key";
        this.showError = true;
        return;
      }
      this.isLoading = true;
      let _this = this;
      axios
        .post(
          `${process.env.VUE_APP_CLOUD_FUNCTIONS_BASE_URL}/generateAccountId`,
          {
            publicKey: this.publicKey,
          }
        )
        .then(function(res) {
          _this.isLoading = false;
          if (res.status === 200) {
            _this.successMessage = `Successfully created new account with account ID ${res.data.accountId}`;
            _this.showSuccess = true;
          } else {
            _this.errorMessage = res.data.status;
            _this.showError = true;
          }
        });
    },
  },
};
</script>
<style></style>
