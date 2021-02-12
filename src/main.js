import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Argon from "./plugins/argon-kit";
import web3Providers from "vue-plugin-web3-providers";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

require("dotenv").config();

Vue.config.productionTip = false;
Vue.use(Argon);
Vue.use(web3Providers);
Vue.use(VueFormGenerator);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
