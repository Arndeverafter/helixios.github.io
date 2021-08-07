import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/css/style.scss";

import VueAxios from "vue-axios";
import axios from "axios";
Vue.use(VueAxios, axios);

import VueHtml2Canvas from "vue-html2canvas";
Vue.use(VueHtml2Canvas);

Vue.config.productionTip = false;

new Vue({
  router,

  render: h => h(App)
}).$mount("#app");
