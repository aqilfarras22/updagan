import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';

import navBarComponent from '@/components/common/nav-bar';
import testComponent from '../../../test';

const { it, describe, expect } = global;

const componentsRoutes = [
  {
    label: 'home',
    to: {
      name: 'home',
    },
  },
  {
    label: 'route 1',
    to: {
      name: 'route-1',
      params: { id: 1 },
    },
  },
  {
    label: 'route 2',
    to: {
      name: 'route-2',
      params: { id: 2 },
    },
  },
];

const type = 'byinvitation';

describe('components/common/nav-bar/nav-bar.vue', () => {
  const createMountedWrapper = (wrapperOptions = {}) => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(VueRouter);

    const availableRoutes = [
      { path: '/', name: 'home', component: testComponent },
      { path: '/route-1/:id', name: 'route-1', component: testComponent },
      { path: '/route-2/:id', name: 'route-2', component: testComponent },
    ];
    const router = new VueRouter({
      routes: availableRoutes,
    });

    return mount(navBarComponent, {
      localVue,
      router,
      propsData: { routes: [], studyType: '' },
      ...wrapperOptions,
    });
  };

  it('should create instance', () => {
    const wrapper = createMountedWrapper({
      propsData: { routes: componentsRoutes, studyType: type },
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  // it('should display navigation structure', () => {
  //   const wrapper = createMountedWrapper({ propsData: { routes: componentsRoutes } });
  //   const bNav = wrapper.findAll('.nav');
  //   const bNavItems = wrapper.findAll('.nav-item');
  //   expect(bNav.length).toBe(1);
  //   expect(bNavItems.length).toBe(componentsRoutes.length);
  //   expect(wrapper.text()).toContain('route 1');
  //   expect(wrapper.text()).toContain('route 2');
  // });

  // it('should display active nav item', () => {
  //   const wrapper = createMountedWrapper({
  //     propsData: { routes: componentsRoutes },
  //   });
  //   const activeEl = wrapper.find('a.active');
  //   expect(activeEl.text()).toContain('home');
  // });

  it('should not create if required props items were not passed', () => {
    const wrapper = mount(navBarComponent, {
      propsData: {
        routes: null,
      },
    });
    expect(wrapper.isEmpty()).toBeTruthy();
  });
});
