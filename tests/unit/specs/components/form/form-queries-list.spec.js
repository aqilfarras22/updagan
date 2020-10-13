import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesListComponent from '@/components/form/form-queries/form-queries-list';

const { it, describe, expect } = global;

const testPropsData = {
  queries: [{ id: 1 }, { id: 2 }],
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('components/form/form-queries/form-queries-list.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formQueriesListComponent, {
    localVue,
    propsData: { ...testPropsData },
    stubs: {
      FormQueriesListItem: {
        name: 'FormQueriesListItem',
        render: h => h('b', 'FormQueriesListItem'),
      },
      'b-list-group-item': {
        name: 'b-list-group-item',
        render: h => h('b', 'b-list-group-item'),
      },
    },
    ...options,
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formQueriesListComponent.components.FormQueriesListItem).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.queries).toEqual(testPropsData.queries);
    expect(wrapper.vm.queries).not.toBeUndefined();
  });

  it('should have method which emit event "view" on query view: viewQuery(queryId)', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.viewQuery('queryId');
    // assert event has been emitted
    expect(wrapper.emitted().view).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().view.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().view[0][0]).toBe('queryId');
  });

  it('has the expected html structure', async () => {
    const wrapper = createMountedWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
