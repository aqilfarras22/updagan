import Vue from 'vue';

// modules
import swal from 'sweetalert2';
import toastr from 'toastr';

// plugins
import VueRouter from 'vue-router';
import VueQuillEditor from 'vue-quill-editor';
import VueMoment from 'vue-moment';
import momentTimezone from 'moment-timezone';
import VueResource from 'vue-resource';
import Vue2Filters from 'vue2-filters';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import VueProgressBar from 'vue-progressbar';
import VueInstant from 'vue-instant/dist/vue-instant.common';
import VueTelInput from 'vue-tel-input';
import Switches from 'vue-switches';
import { Drag, Drop } from 'vue-drag-drop';
import vuePerfectScrollbar from 'vue-perfect-scrollbar'

// app
import store from '@/vuex/store';
import routes from '@/routes';
import { beforeEach } from '@/routes/hooks';
import idleLogout from '@/utils/idle';
import api from '@/api';

// recursive components
import JsonTree from '@/components/common/json-tree';
import '@/constants/filter';
import colxx from '@/components/common/colxx';

//locale
import en from './locales/en.json'
import es from './locales/es.json'
import { defaultLocale, localeOptions } from './constants/config'
import VueI18n from 'vue-i18n'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
 
Vue.component('apexchart', VueApexCharts)
Vue.component('JsonTree', JsonTree);
Vue.component('Switches', Switches);
Vue.component('drag', Drag);
Vue.component('drop', Drop);
Vue.component('b-colxx', colxx);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);

// CSS
require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');
require('quill/dist/quill.bubble.css');

require('toastr');
require('toastr/build/toastr.min.css');

require('sweetalert2/dist/sweetalert2.min.css');

require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap-vue/dist/bootstrap-vue.css');

require('font-awesome/css/font-awesome.css');

// Options
toastr.options = {
  closeButton: true,
  newestOnTop: false,
  progressBar: false,
  positionClass: 'toast-bottom-center',
  preventDuplicates: true,
  showDuration: 500,
  hideDuration: 500,
  timeOut: 2000,
  extendedTimeOut: 2000,
};

const VueProgressBarOptions = {
  color: '#2ecc71',
  failedColor: '#f16559',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.5s',
    termination: 300,
  },
  autoRevert: true,
  location: 'top',
  inverse: false,
};

Vue.use(VueProgressBar, VueProgressBarOptions);
Vue.use(VueRouter);
Vue.use(VueQuillEditor);
Vue.use(VueMoment, {
  momentTimezone,
});
Vue.use(VueResource);
Vue.use(Vue2Filters);
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
});
Vue.use(VueInstant);
Vue.use(BootstrapVue);
Vue.use(VueI18n);
const messages = { en: en, es: es };
const locale = defaultLocale;
// const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages
});

Vue.use(VueTelInput);

const router = new VueRouter({
  routes,
});
router.beforeEach(beforeEach({ store, api, toastr }));

Vue.use({
  install(VueInstance) {
    api.setupInterceptors({
      http: VueInstance.http,
      toastr,
      store,
      VueInstance,
    });
    VueInstance.prototype.$swal = swal; // eslint-disable-line
    VueInstance.prototype.$toastr = toastr; // eslint-disable-line
    VueInstance.prototype.$api = api; // eslint-disable-line
  },
});

// setup
export default () => {
  idleLogout({
    swal,
    store,
  });

  store.dispatch('setupLocalStorageUserData');
  store.dispatch('setupLocalStorageEDCData');

  // offline events
  if (!window.navigator.onLine) {
    toastr.warning('Sorry! No internet connection.');
  }
  window.addEventListener('online', () => {
    toastr.success('Welcome back, unfortunately we lost you, Continue with your Research!!');
  });
  window.addEventListener('offline', () => {
    toastr.warning('Sorry! No internet connection.');
  });

  return {
    i18n,
    router,
    store,
  };
};

export { router, toastr, swal, store, i18n };
