import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/styles/index.scss';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { i18n } from '@/plugins/i18n';
import AppLayout from '@/layouts/AppLayout';
import VueClickAway from 'vue3-click-away';
import prettyNumber from '@/directives/prettyNumber';
import 'vue3-resize/dist/vue3-resize.css';
import Vue3Resize from 'vue3-resize';
import citadel from '@citadeldao/lib-citadel';
// import hljsVuePlugin from '@highlightjs/vue-plugin';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
// import JsonViewer from 'vue-json-viewer';
import JsonViewer from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import Vue from 'vue';

const app = createApp(App);

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    tunnel: new URL(process.env.VUE_APP_SENTRY_DSN).origin + '/tunnel',
    release: process.env.VUE_APP_RELEASE,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    ignoreErrors: [
      'ChunkLoadError',
      'Loading chunk',
      'Request rejected',
      'Cannot find module',
      'Operation not allowed',
      'code, message, stack',
      'Non-Error promise',
      'ebfidpplhabeedpnhjnobghokpiioolj',
      'pmmbeeacafhbpgmlkacpadheejlhhkbf',
    ],
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.3,
  });
}

app
  .directive('pretty-number', prettyNumber)
  // .use(hljsVuePlugin)
  .use(i18n)
  .use(VueClickAway)
  .use(store)
  .use(ElementPlus)
  .use(router)
  .use(Vue3Resize)
  .use(JsonViewer)
  .component('AppLayout', AppLayout)
  .provide('citadel', citadel)
  .mount('#app');
