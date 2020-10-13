import Vue from 'vue';
import 'vue-tel-input/dist/vue-tel-input.css';

import App from './components/app/app';
import setup from './setup';
import acl from './acl';

const { router, store, i18n } = setup();

require('./assets/main.scss');

// TODO: remove global jquery
window.$ = require('jquery');

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  acl,
  components: { App },
  template: '<App />',
}).$mount('#app');
