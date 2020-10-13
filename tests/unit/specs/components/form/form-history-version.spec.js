import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import formHistoryVersionComponent from '@/components/form/form-history-version';

const { it, describe, expect } = global;

const testPropsData = {
  formVersion: {
    primaryReason: 'primaryReason',
    sections: [{ id: 1 }],
  },
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('components/form/form-history-version.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formHistoryVersionComponent, {
    localVue,
    propsData: { ...testPropsData },
    stubs: {
      FormFieldsList: {
        name: 'FormFieldsList',
        render: h => h('b', 'FormFieldsList'),
      },
    },
    ...options,
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formHistoryVersionComponent.components.FormFieldsList).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.formVersion).toEqual(testPropsData.formVersion);
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
