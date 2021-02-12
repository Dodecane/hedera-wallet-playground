import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Bridge from "./views/Bridge.vue";
import Home from "./views/Home.vue";
import Faucet from "./views/Faucet.vue";
import Tokenizer from "./views/Tokenizer.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        header: AppHeader,
        default: Home,
        footer: AppFooter,
      },
    },
    {
      path: "/tokenizer",
      name: "tokenizer",
      components: {
        header: AppHeader,
        default: Tokenizer,
        footer: AppFooter,
      },
    },
    {
      path: "/bridge",
      name: "bridge",
      components: {
        header: AppHeader,
        default: Bridge,
        footer: AppFooter,
      },
    },
    {
      path: "/faucet",
      name: "faucet",
      components: {
        header: AppHeader,
        default: Faucet,
        footer: AppFooter,
      },
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});
