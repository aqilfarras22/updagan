import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex';
import VueMoment from 'vue-moment';
import BootstrapVue from 'bootstrap-vue';
import VueHighlightJS from 'vue-highlightjs';
import VeeValidate from 'vee-validate';

// Install Vue plugins.
Vue.use(Vuex);
Vue.use(VueMoment);
Vue.use(BootstrapVue);
Vue.use(VueHighlightJS);
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
});

require('bootstrap/dist/css/bootstrap.css');
require('highlight.js/styles/github.css');
require('bootstrap-vue/dist/bootstrap-vue.css');
require('font-awesome/css/font-awesome.css');

const req = require.context('../stories', true, /.story.js$/);
configure(() => {
  req.keys().forEach(filename => req(filename));
}, module);
