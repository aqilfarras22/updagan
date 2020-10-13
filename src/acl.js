import toastr from 'toastr';

import Vue from 'vue';
import { AclInstaller, AclCreate } from 'vue-acl';
import VueRouter from 'vue-router';

import store from '@/vuex/store';
import routes from '@/routes';
import { beforeEach } from '@/routes/hooks';
import api from '@/api';

Vue.use(VueRouter);
Vue.use(AclInstaller);

const router = new VueRouter({
  routes,
});
router.beforeEach(beforeEach({ store, api, toastr }));

export default new AclCreate({
  initial: '*',
  notfound: '/login',
  save: true,
  router,
  acceptLocalRules: true,
});
