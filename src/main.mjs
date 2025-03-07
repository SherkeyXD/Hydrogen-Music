import { createApp } from "vue";

import App from "./App.vue";
import router from "./router/router.mjs";
import pinia from "./store/pinia.mjs";
import { init } from "./utils/initApp.mjs";
import lazy from "./utils/lazy.mjs";

import "./style.css";
import "normalize.css";
import "./assets/css/common.css";
import "./assets/css/fonts.css";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.directive("lazy", lazy);
app.mount("#app");
init();
