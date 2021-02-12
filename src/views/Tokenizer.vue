<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
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
            <span>Asset Tokenizer</span>
          </h1>
          <p class="lead text-white text-center">
            Tokenize any asset by selecting one of the options below. Not sure
            which option to choose? Check out this flowchart for a
            recommendation
            <base-button
              type="secondary"
              @click="showFlowchart = !showFlowchart"
            >
              {{ !showFlowchart ? "Show flowchart" : "Hide flowchart" }}
            </base-button>
          </p>
        </div>
        <div class="images" v-viewer v-if="showFlowchart">
          <img src="img/tokenization-standard-flowchart.png" />
        </div>
      </div>
      <tabs fill class="flex-column flex-md-row">
        <loading
          :active.sync="isLoading"
          :is-full-page="false"
          loader="dots"
        ></loading>
        <card shadow>
          <div v-if="!walletConnected" class="text-dark text-center mb-3">
            Please connect your Hedera Hashgraph wallet to continue
          </div>
          <div v-else-if="incorrectNetwork" class="text-center">
            <div class="text-danger text-center mb-3">
              Wrong network! Please connect a Test Network account
            </div>
          </div>
          <div v-else>
            <tab-pane title="Create a custom token">
              <p class="lead text-center">
                Ideal for assets where divisibility is important.
              </p>
              <form>
                <vue-form-generator
                  :schema="schema"
                  :model="model"
                  :options="formOptions"
                  @validated="onValidated"
                >
                </vue-form-generator>
              </form>
              <base-button
                :disabled="!isValidated"
                type="default"
                @click="createToken()"
              >
                Create token
              </base-button>
            </tab-pane>
            <tab-pane title="Mint a non-fungible token">
              <p class="lead text-center">
                Ideal for assets that are unique and non-divisible.
              </p>
              <form>
                <vue-form-generator
                  :schema="schemaNFT"
                  :model="modelNFT"
                  :options="formOptions"
                  @validated="onValidated"
                >
                </vue-form-generator>
              </form>
              <base-button
                :disabled="!isValidated"
                type="default"
                @click="mintNFT()"
              >
                Mint NFT
              </base-button>
            </tab-pane>

            <tab-pane title="Mint a collection of non-fungible tokens">
              <p class="lead text-center">
                Ideal for assets that are comprised of unique parts.
              </p>
              <form>
                <vue-form-generator
                  :schema="schemaNFTCollection"
                  :model="modelNFTCollection"
                  :options="formOptions"
                  @validated="onValidated"
                >
                </vue-form-generator>
              </form>
              <base-button
                :disabled="!isValidated"
                type="default"
                @click="mintNFTCollection()"
              >
                Mint NFT Collection
              </base-button>
            </tab-pane>
          </div>
        </card>
      </tabs>
      <div class="row justify-content-center">
        <div class="col-lg-12 mt-3">
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
    </div>
  </section>
</template>
<script>
import wallet from "../mixins/wallet";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import {
  AccountId,
  TransactionId,
  TokenCreateTransaction,
  PublicKey,
} from "@hashgraph/sdk";
import { VBPopover } from "bootstrap-vue/esm/directives/popover/popover";
import Tabs from "@/components/Tabs/Tabs.vue";
import TabPane from "@/components/Tabs/TabPane.vue";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
Vue.use(Viewer);

export default {
  directives: {
    BPopover: VBPopover,
  },
  mixins: [wallet],
  components: {
    Loading,
    Tabs,
    TabPane,
  },
  computed: {
    provider: function() {
      return this.$ethereum;
    },
  },
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      successMessage: "",
      showError: false,
      errorMessage: "",
      isValidated: false,
      showFlowchart: false,
      model: {
        name: "Token",
        symbol: "TKN",
        decimal: 0,
        initialSupply: 0,
        adminKeyEnabled: false,
        kycKeyEnabled: false,
        freezeKeyEnabled: false,
        wipeKeyEnabled: false,
        supplyKeyEnabled: false,
        freezeDefault: false,
      },
      schema: {
        groups: [
          {
            legend: "Token Details",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "Token name",
                model: "name",
                required: true,
                max: 100,
                placeholder: "Enter a name for your token",
                hint: "Choose a name that best describes your asset",
                validator: "string",
              },
              {
                type: "input",
                inputType: "text",
                label: "Token symbol",
                model: "symbol",
                required: true,
                max: 100,
                placeholder: "Enter a symbol for your token",
                hint:
                  "Could be an abbreviation of the name or a clear and concise identifier",
                validator: "string",
              },
              {
                type: "input",
                inputType: "number",
                label: "Token decimals",
                model: "decimal",
                min: 0,
                max: 100,
                placeholder: "Enter the number of decimals for your token",
                hint: "Decimal places provide granularity",
                validator: "integer",
              },
              {
                type: "input",
                inputType: "number",
                label: "Token initial supply",
                model: "initialSupply",
                min: 0,
                max: 9223372036854775807,
                placeholder: "Enter the initial supply for your token",
                hint:
                  "If a token has initial supply set to 10000 and decimals set to 2, 100 tokens will be put into circulation",
                validator: "integer",
              },
              {
                type: "checkbox",
                label: "Enable admin key",
                model: "adminKeyEnabled",
                hint:
                  "If enabled, this token can be deleted or updated (the freeze key, wipe key, KYC key and treasury account can be modified)",
              },
              {
                type: "checkbox",
                label: "Enable KYC key",
                model: "kycKeyEnabled",
                hint:
                  "If enabled, KYC status can be granted to an account to allow transactions with this token",
              },
              {
                type: "checkbox",
                label: "Enable freeze key",
                model: "freezeKeyEnabled",
                hint:
                  "If enabled, an account can be frozen to prevent transactions with this token",
              },
              {
                type: "checkbox",
                label: "Enable wipe key",
                model: "wipeKeyEnabled",
                hint:
                  "If enabled, the token balance of an account can be wiped",
              },
              {
                type: "checkbox",
                label: "Enable supply key",
                model: "supplyKeyEnabled",
                hint: "If enabled, mint or burn operations are possible",
              },
              {
                type: "checkbox",
                label: "Freeze token by default",
                model: "freezeDefault",
                hint:
                  "If enabled, an account must be unfrozen before it can receive this token",
              },
            ],
          },
        ],
      },
      modelNFT: {
        name: "Non-Fungible Token",
        symbol: "NFT",
        decimal: 0,
        initialSupply: 1,
        adminKeyEnabled: false,
        kycKeyEnabled: false,
        freezeKeyEnabled: false,
        wipeKeyEnabled: false,
        supplyKeyEnabled: false,
        freezeDefault: false,
      },
      schemaNFT: {
        groups: [
          {
            legend: "NFT Details",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "NFT name",
                model: "name",
                required: true,
                max: 100,
                placeholder: "Enter a name for your NFT",
                hint: "Choose a name that best describes your asset",
                validator: "string",
              },
              {
                type: "input",
                inputType: "text",
                label: "NFT symbol",
                model: "symbol",
                required: true,
                max: 100,
                placeholder: "Enter a symbol for your NFT",
                hint:
                  "Could be an abbreviation of the name or a clear and concise identifier",
                validator: "string",
              },
              {
                type: "checkbox",
                label: "Enable admin key",
                model: "adminKeyEnabled",
                hint:
                  "If enabled, this NFT can be deleted or updated (the freeze key, wipe key, KYC key and treasury account can be modified)",
              },
              {
                type: "checkbox",
                label: "Enable KYC key",
                model: "kycKeyEnabled",
                hint:
                  "If enabled, KYC status can be granted to an account to allow transactions with this NFT",
              },
              {
                type: "checkbox",
                label: "Enable freeze key",
                model: "freezeKeyEnabled",
                hint:
                  "If enabled, an account can be frozen to prevent transactions with this NFT",
              },
              {
                type: "checkbox",
                label: "Enable wipe key",
                model: "wipeKeyEnabled",
                hint: "If enabled, the NFT balance of an account can be wiped",
              },
              {
                type: "checkbox",
                label: "Freeze NFT by default",
                model: "freezeDefault",
                hint:
                  "If enabled, an account must be unfrozen before it can receive this NFT",
              },
            ],
          },
        ],
      },
      modelNFTCollection: {
        size: 2,
        name: "Non-Fungible Token",
        symbol: "NFT",
        decimal: 0,
        initialSupply: 1,
        adminKeyEnabled: false,
        kycKeyEnabled: false,
        freezeKeyEnabled: false,
        wipeKeyEnabled: false,
        supplyKeyEnabled: false,
        freezeDefault: false,
      },
      schemaNFTCollection: {
        groups: [
          {
            legend: "NFT Collection Details",
            fields: [
              {
                type: "input",
                inputType: "number",
                label: "NFT collection size",
                model: "size",
                min: 0,
                max: 16,
                placeholder:
                  "Enter the size of the NFT collection to be minted",
                hint:
                  "Each NFT minting transaction has to be individually approved",
                validator: "integer",
              },
              {
                type: "input",
                inputType: "text",
                label: "NFT collection name",
                model: "name",
                required: true,
                max: 100,
                placeholder: "Enter a name for your NFT collection",
                hint:
                  "Choose a name that best describes your asset (the NFTs will be named in the following format: 'NAME-SEQUENCE_NUMBER')",
                validator: "string",
              },
              {
                type: "input",
                inputType: "text",
                label: "NFT collection symbol",
                model: "symbol",
                required: true,
                max: 100,
                placeholder: "Enter a symbol for your NFT collection",
                hint:
                  "Could be an abbreviation of the name or a clear and concise identifier (the NFTs will have symbols in the following format: 'SYMBOL-SEQUENCE_NUMBER')",
                validator: "string",
              },
              {
                type: "checkbox",
                label: "Enable admin key",
                model: "adminKeyEnabled",
                hint:
                  "If enabled, these NFTs can be deleted or updated (the freeze key, wipe key, KYC key and treasury account can be modified)",
              },
              {
                type: "checkbox",
                label: "Enable KYC key",
                model: "kycKeyEnabled",
                hint:
                  "If enabled, KYC status can be granted to an account to allow transactions with these NFTs",
              },
              {
                type: "checkbox",
                label: "Enable freeze key",
                model: "freezeKeyEnabled",
                hint:
                  "If enabled, an account can be frozen to prevent transactions with these NFTs",
              },
              {
                type: "checkbox",
                label: "Enable wipe key",
                model: "wipeKeyEnabled",
                hint: "If enabled, the NFT balance of an account can be wiped",
              },
              {
                type: "checkbox",
                label: "Freeze NFT by default",
                model: "freezeDefault",
                hint:
                  "If enabled, an account must be unfrozen before it can receive these NFTs",
              },
            ],
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true,
      },
    };
  },
  methods: {
    onValidated(isValid, errors) {
      this.isValidated = isValid;
    },
    async createToken() {
      let accountId = AccountId.fromString(this.connectedAccount.account);
      let publicKey = PublicKey.fromString(this.connectedAccount.publicKey);
      try {
        this.isLoading = true;
        const transaction = new TokenCreateTransaction()
          .setTokenName(this.model.name)
          .setTokenSymbol(this.model.symbol)
          .setTreasuryAccountId(accountId)
          .setTransactionId(TransactionId.generate(accountId))
          .setNodeAccountIds([AccountId.fromString("0.0.3")])
          .setAutoRenewAccountId(accountId);
        if (this.model.decimal) {
          transaction.setDecimals(this.model.decimal);
        }
        if (this.model.initialSupply) {
          transaction.setInitialSupply(this.model.initialSupply);
        }
        if (this.model.adminKeyEnabled) {
          transaction.setAdminKey(publicKey);
        }
        if (this.model.kycKeyEnabled) {
          transaction.setKycKey(publicKey);
        }
        if (this.model.freezeKeyEnabled) {
          transaction.setFreezeKey(publicKey);
        }
        if (this.model.wipeKeyEnabled) {
          transaction.setWipeKey(publicKey);
        }
        if (this.model.supplyKeyEnabled) {
          transaction.setSupplyKey(publicKey);
        }
        if (this.model.freezeDefault) {
          transaction.setFreezeDefault(true);
        }
        transaction.freeze();
        let txReceipt = await this.hederaWallet.signTransaction(transaction);
        this.isLoading = false;
        let tokenId = txReceipt.txReceipt.tokenId;
        if (txReceipt) {
          this.successMessage = `Successfully created new token with token ID ${tokenId.shard.low}.${tokenId.realm.low}.${tokenId.num.low}`;
          this.showSuccess = true;
        } else {
          this.errorMessage = "Transaction failed";
          this.showError = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = "Transaction rejected";
        this.showError = true;
      }
    },
    async mintNFT() {
      let accountId = AccountId.fromString(this.connectedAccount.account);
      let publicKey = PublicKey.fromString(this.connectedAccount.publicKey);
      try {
        this.isLoading = true;
        const transaction = new TokenCreateTransaction()
          .setTokenName(this.modelNFT.name)
          .setTokenSymbol(this.modelNFT.symbol)
          .setTreasuryAccountId(accountId)
          .setInitialSupply(1)
          .setTransactionId(TransactionId.generate(accountId))
          .setNodeAccountIds([AccountId.fromString("0.0.3")])
          .setAutoRenewAccountId(accountId);
        if (this.modelNFT.adminKeyEnabled) {
          transaction.setAdminKey(publicKey);
        }
        if (this.modelNFT.kycKeyEnabled) {
          transaction.setKycKey(publicKey);
        }
        if (this.modelNFT.freezeKeyEnabled) {
          transaction.setFreezeKey(publicKey);
        }
        if (this.modelNFT.wipeKeyEnabled) {
          transaction.setWipeKey(publicKey);
        }
        if (this.modelNFT.supplyKeyEnabled) {
          transaction.setSupplyKey(publicKey);
        }
        if (this.modelNFT.freezeDefault) {
          transaction.setFreezeDefault(true);
        }
        transaction.freeze();
        let txReceipt = await this.hederaWallet.signTransaction(transaction);
        this.isLoading = false;
        let tokenId = txReceipt.txReceipt.tokenId;
        if (txReceipt) {
          this.successMessage = `Successfully minted new NFT with token ID ${tokenId.shard.low}.${tokenId.realm.low}.${tokenId.num.low}`;
          this.showSuccess = true;
        } else {
          this.errorMessage = "Transaction failed";
          this.showError = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = "Transaction rejected";
        this.showError = true;
      }
    },
    async mintNFTCollection() {
      let accountId = AccountId.fromString(this.connectedAccount.account);
      let publicKey = PublicKey.fromString(this.connectedAccount.publicKey);
      try {
        this.isLoading = true;
        let transactionList = [];
        for (let i = 1; i <= this.modelNFTCollection.size; i++) {
          let transaction = new TokenCreateTransaction()
            .setTokenName(this.modelNFTCollection.name)
            .setTokenSymbol(this.modelNFTCollection.symbol)
            .setTreasuryAccountId(accountId)
            .setInitialSupply(1)
            .setTransactionId(TransactionId.generate(accountId))
            .setNodeAccountIds([AccountId.fromString("0.0.3")])
            .setAutoRenewAccountId(accountId);
          if (this.modelNFTCollection.adminKeyEnabled) {
            transaction.setAdminKey(publicKey);
          }
          if (this.modelNFTCollection.kycKeyEnabled) {
            transaction.setKycKey(publicKey);
          }
          if (this.modelNFTCollection.freezeKeyEnabled) {
            transaction.setFreezeKey(publicKey);
          }
          if (this.modelNFTCollection.wipeKeyEnabled) {
            transaction.setWipeKey(publicKey);
          }
          if (this.modelNFTCollection.supplyKeyEnabled) {
            transaction.setSupplyKey(publicKey);
          }
          if (this.modelNFTCollection.freezeDefault) {
            transaction.setFreezeDefault(true);
          }
          transaction.freeze();
          transactionList.push(transaction);
        }
        for (const transaction of transactionList) {
          let txReceipt = await this.hederaWallet.signTransaction(transaction);
          let tokenId = txReceipt.txReceipt.tokenId;
          if (txReceipt) {
            this.successMessage = `Successfully minted new NFT with token ID ${tokenId.shard.low}.${tokenId.realm.low}.${tokenId.num.low}`;
            this.showSuccess = true;
          } else {
            this.errorMessage = "Transaction failed";
            this.showError = true;
          }
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = "Transaction rejected";
        this.showError = true;
      }
    },
  },
};
</script>
<style></style>
