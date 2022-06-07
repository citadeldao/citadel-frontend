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
import hljsVuePlugin from '@highlightjs/vue-plugin';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import Vue from 'vue';

const app = createApp(App);




if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: 'https://44fcbe6018f6401183379ecc807128bc@o510489.ingest.sentry.io/6142796',
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    environment: process.env.VUE_APP_HOST === 'app.citadel.one' ? 'production' : 'development',
    tracesSampleRate: 1.0,
  });
}

if(window.navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      for(const registration of registrations) {
        registration.unregister();
      }
    });
}

app.directive('pretty-number', prettyNumber)
  .use(hljsVuePlugin)
  .use(i18n)
  .use(VueClickAway)
  .use(store)
  .use(ElementPlus)
  .use(router)
  .use(Vue3Resize)
  .component('AppLayout', AppLayout)
  .provide('citadel', citadel)
  .mount('#app');


