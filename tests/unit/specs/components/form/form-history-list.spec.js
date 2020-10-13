import { shallowMount, createLocalVue } from '@vue/test-utils';

import formHistoryListComponent from '@/components/form/form-history-list';

const { it, describe, expect } = global;

const testPropsData = {
  formVersion: {
    history: [{ id: 1 }],
  },
};

const localVue = createLocalVue();

describe('components/form/form-history-list.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formHistoryListComponent, {
    localVue,
    propsData: { ...testPropsData },
    stubs: {
      TableComponent: {
        name: 'TableComponent',
        render: h => h('b', 'TableComponent'),
      },
    },
    ...options,
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formHistoryListComponent.components.TableComponent).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.history).toEqual(testPropsData.history);
  });

  it('should have all required initial data', () => {
    const wrapper = createMountedWrapper();
    // initial data
    expect(wrapper.vm.approvalStatusText).toMatchSnapshot();
    expect(wrapper.vm.verificationStatusText).toMatchSnapshot();
    expect(wrapper.vm.historyStatusText).toMatchSnapshot();
    expect(wrapper.vm.historyStatus).toMatchSnapshot();
    expect(wrapper.vm.formHistoryFields).toMatchSnapshot();
  });

  it('should have method which emit "view" event: view(item)', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.view('item');
    // assert event has been emitted
    expect(wrapper.emitted().view).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().view.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().view[0][0]).toBe('item');
  });

  it('has the expected html structure', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
