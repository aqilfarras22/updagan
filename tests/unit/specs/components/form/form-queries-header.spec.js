import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesHeaderComponent from '@/components/form/form-queries-header';

const { it, describe, expect } = global;

const testPropsData = {
  title: 'title',
  backTitle: 'backTitle',
  fakeProp: '',
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('components/form/form-queries-header.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formQueriesHeaderComponent, {
    localVue,
    propsData: { ...testPropsData },
    ...options,
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.title).toBe(testPropsData.title);
    expect(wrapper.vm.backTitle).toBe(testPropsData.backTitle);
  });

  it('should have method which emit "back" event by click on link: back', () => {
    const wrapper = createMountedWrapper();
    // test link
    const link = wrapper.find('.backButton');
    expect(link.is('a')).toBe(true);

    link.trigger('click');
    // assert event has been emitted
    expect(wrapper.emitted().back).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().back.length).toBe(1);
  });

  it('has the expected html structure', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
