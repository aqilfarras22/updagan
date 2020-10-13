import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesComponent from '@/components/form/form-queries';
import { formFieldQueryStatus } from '@/constants/form';

const { it, describe, expect } = global;

const testPropsData = {
  value: 'model',
  queries: [
    {
      queryId: '1',
      fieldId: '11111',
      openedOn: 1,
      status: formFieldQueryStatus.OPEN,
    },
    {
      queryId: '2',
      fieldId: '11111',
      openedOn: 0,
      status: formFieldQueryStatus.OPEN,
    },
    {
      queryId: '3',
      fieldId: '33333',
      openedOn: 2,
      status: formFieldQueryStatus.CLOSE,
    },
  ],
  filter: '',
  formId: '1',
  fakeProp: '',
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('components/form/form-queries.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formQueriesComponent, {
    localVue,
    propsData: { ...testPropsData },
    ...options,
    stubs: {
      FormQueriesList: {
        name: 'FormQueriesList',
        render: h => h('b', 'FormQueriesList'),
      },
      FormQueriesQueryDetails: {
        name: 'FormQueriesQueryDetails',
        render: h => h('b', 'FormQueriesQueryDetails'),
      },
      FormQueriesCommentForm: {
        name: 'FormQueriesCommentForm',
        render: h => h('b', 'FormQueriesCommentForm'),
      },
      FormQueriesHeader: {
        name: 'FormQueriesHeader',
        render: h => h('b', 'FormQueriesHeader'),
      },
    },
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formQueriesComponent.components.FormQueriesList).toBeTruthy();
    expect(formQueriesComponent.components.FormQueriesQueryDetails).toBeTruthy();
    expect(formQueriesComponent.components.FormQueriesCommentForm).toBeTruthy();
    expect(formQueriesComponent.components.FormQueriesHeader).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.value).toBe(testPropsData.value);
    expect(wrapper.vm.queries).toEqual(testPropsData.queries);
    expect(wrapper.vm.filter).toBe(testPropsData.filter);
    expect(wrapper.vm.formId).toBe(testPropsData.formId);
  });

  it('should have all required initial data', () => {
    const wrapper = createMountedWrapper();
    // initial data
    expect(wrapper.vm.tabIndex).toBe(0);
    expect(wrapper.vm.openQueryId).toEqual(null);
    expect(wrapper.vm.closedQueryId).toEqual(null);
  });

  it('should return computed property: shortFilterId', () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({ filter: 'qwertyasdfg' });
    // first 5 charts in uppercase
    expect(wrapper.vm.shortFilterId).toBe('QWERT');
    wrapper.setData({ filter: 'zxcvbasdfg' });
    expect(wrapper.vm.shortFilterId).toBe('ZXCVB');
  });

  it('should return computed property: filteredQueries', () => {
    const wrapper = createMountedWrapper();
    // from new to old
    expect(wrapper.vm.filteredQueries).toEqual([
      testPropsData.queries[2],
      testPropsData.queries[0],
      testPropsData.queries[1],
    ]);
    wrapper.setData({ filter: '33333' });
    expect(wrapper.vm.filteredQueries).toEqual([testPropsData.queries[2]]);
    wrapper.setData({ filter: '11111' });
    expect(wrapper.vm.filteredQueries).toEqual([
      testPropsData.queries[0],
      testPropsData.queries[1],
    ]);
  });

  it('should return computed property: openQueries', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.openQueries).toEqual([testPropsData.queries[0], testPropsData.queries[1]]);
  });

  it('should return computed property: closedQueries', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.closedQueries).toEqual([testPropsData.queries[2]]);
  });

  it('should return computed property: openQuery', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.openQuery).toBeUndefined();
    wrapper.setData({ openQueryId: '1' });
    expect(wrapper.vm.openQuery).toEqual(testPropsData.queries[0]);
    wrapper.setData({ openQueryId: '3' });
    expect(wrapper.vm.openQuery).toEqual(testPropsData.queries[2]);
  });

  it('should return computed property: closedQuery', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.closedQuery).toBeUndefined();
    wrapper.setData({ closedQueryId: '1' });
    expect(wrapper.vm.closedQuery).toEqual(testPropsData.queries[0]);
    wrapper.setData({ closedQueryId: '3' });
    expect(wrapper.vm.closedQuery).toEqual(testPropsData.queries[2]);
  });

  it('should watch v-model', async () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      openQueryId: '1',
      closedQueryId: '2',
      tabIndex: 1,
    });
    await wrapper.vm.$nextTick();
    wrapper.setData({
      value: '1',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.openQueryId).toEqual(null);
    expect(wrapper.vm.closedQueryId).toEqual(null);
    expect(wrapper.vm.tabIndex).toBe(0);
  });

  it('should have method which set open query id to view: viewOpenQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.viewOpenQuery('openQueryId');
    expect(wrapper.vm.openQueryId).toBe('openQueryId');
  });

  it('should have method which reset open query id to hide view: hideOpenQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      openQueryId: 'openQueryId',
    });
    wrapper.vm.hideOpenQuery();
    expect(wrapper.vm.openQueryId).toEqual(null);
  });

  it('should have method which set closed query id to view: viewClosedQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.viewClosedQuery('openQueryId');
    expect(wrapper.vm.closedQueryId).toBe('openQueryId');
  });

  it('should have method which reset closed query id to hide view: hideClosedQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      closedQueryId: 'openQueryId',
    });
    wrapper.vm.hideClosedQuery();
    expect(wrapper.vm.closedQueryId).toEqual(null);
  });

  it('should have method which emit events ("createQuery", "input") on query create: createQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.createQuery({ comment: 'comment' });
    // assert event has been emitted
    expect(wrapper.emitted().createQuery).toBeTruthy();
    expect(wrapper.emitted().input).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().createQuery.length).toBe(1);
    expect(wrapper.emitted().input.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().createQuery[0][0]).toEqual({
      fieldId: testPropsData.value,
      formId: testPropsData.formId,
      comment: 'comment',
    });
    expect(wrapper.emitted().input[0][0]).toEqual(null);
  });

  it('should have method which emit "createComment" event on query comment create: onQueryCommentCreate', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.onQueryCommentCreate('comment');
    // assert event has been emitted
    expect(wrapper.emitted().createComment).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().createComment.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().createComment[0][0]).toEqual('comment');
  });

  it('should have method which emit "input" event on query cancel: cancelQuery', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.cancelQuery();
    // assert event has been emitted
    expect(wrapper.emitted().input).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().input.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().input[0][0]).toEqual(null);
  });

  it('should have method which emit "resetFilter" event on filter reset: resetFilter', () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.resetFilter();
    // assert event has been emitted
    expect(wrapper.emitted().resetFilter).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().resetFilter.length).toBe(1);
  });

  it('should have method which emit "onQueryClosed" event on query close: onQueryClosed', () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      openQueryId: 'openQueryId',
    });
    wrapper.vm.onQueryClosed('queryPayload');
    // assert change state
    expect(wrapper.vm.openQueryId).toEqual(null);
    // assert event has been emitted
    expect(wrapper.emitted().onQueryClosed).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().onQueryClosed.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().onQueryClosed[0][0]).toBe('queryPayload');
  });

  it('should have method which emit "onQueryReopened" event on query reopen: onQueryReopened', () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      closedQueryId: 'closedQueryId',
    });
    wrapper.vm.onQueryReopened('queryPayload');
    // assert change state
    expect(wrapper.vm.closedQueryId).toEqual(null);
    // assert event has been emitted
    expect(wrapper.emitted().onQueryReopened).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().onQueryReopened.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().onQueryReopened[0][0]).toBe('queryPayload');
  });

  it('has the expected html structure', async () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.$el).toMatchSnapshot();
    wrapper.setData({
      openQueryId: '1',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
    wrapper.vm.hideOpenQuery();
    wrapper.setData({
      closedQueryId: '1',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it('should switch between tabs', async () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      tabIndex: 1,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
