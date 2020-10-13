import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesQueryDetailsComponent from '@/components/form/form-queries/form-queries-query-details';

const { it, describe, expect } = global;

const testPropsData = {
  query: {
    queryId: 'qwerty',
  },
  closed: false,
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);
const vueAclCheckStub = jest.fn().mockResolvedValue({});
const vueAclChangeStub = jest.fn().mockResolvedValue({});

describe('components/form/form-queries/form-queries-query-details.vue', () => {
  const createMountedWrapper = (options = {}) => {
    const confirmationShowStub = jest.fn();

    return {
      wrapper: shallowMount(formQueriesQueryDetailsComponent, {
        localVue,
        propsData: { ...testPropsData },
        mocks: {
          $acl: {
            check: vueAclCheckStub,
            change: vueAclChangeStub,
          },
        },
        stubs: {
          FormQueriesQueryComment: {
            name: 'FormQueriesQueryComment',
            render: h => h('b', 'FormQueriesQueryComment'),
          },
          FormQueriesHeader: {
            name: 'FormQueriesHeader',
            render: h => h('b', 'FormQueriesHeader'),
          },
          FormQueriesCommentForm: {
            name: 'FormQueriesCommentForm',
            render: h => h('b', 'FormQueriesCommentForm'),
          },
          ConfirmationModal: {
            name: 'ConfirmationModal',
            methods: {
              show: confirmationShowStub,
            },
            render: h => h('b', 'ConfirmationModal'),
          },
          ButtonCmp: {
            name: 'ButtonCmp',
            render: h => h('b', 'ButtonCmp'),
          },
        },
        ...options,
      }),
      confirmationShowStub,
    };
  };
  it('should create instance', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formQueriesQueryDetailsComponent.components.FormQueriesQueryComment).toBeTruthy();
    expect(formQueriesQueryDetailsComponent.components.FormQueriesHeader).toBeTruthy();
    expect(formQueriesQueryDetailsComponent.components.FormQueriesCommentForm).toBeTruthy();
    expect(formQueriesQueryDetailsComponent.components.ConfirmationModal).toBeTruthy();
    expect(formQueriesQueryDetailsComponent.components.ButtonCmp).toBeTruthy();
  });

  it('should able to receive props', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.closed).toBe(testPropsData.closed);
    expect(wrapper.vm.query).toEqual(testPropsData.query);
  });

  it('should have all required initial data', () => {
    const { wrapper } = createMountedWrapper();
    // initial data
    expect(wrapper.vm.replyQuery).toEqual(null);
  });

  it('should return computed property (5 charts of queryId in uppercase ): shortQueryId', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.shortQueryId).toBe(testPropsData.query.queryId.slice(0, 5).toUpperCase());
  });

  it('should have method which emit "back" event: back', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.vm.back();
    // assert event has been emitted
    expect(wrapper.emitted().back).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().back.length).toBe(1);
  });

  it('should have method which set "replyQuery" property: reply', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.vm.reply();
    expect(wrapper.vm.replyQuery).toBe(testPropsData.query.queryId);
  });

  it('should have method which run show method on $refs.reopenConfirmation: reopen', () => {
    const { wrapper, confirmationShowStub } = createMountedWrapper();
    wrapper.vm.reopen();
    expect(confirmationShowStub).toHaveBeenCalled();
    expect(confirmationShowStub).toHaveBeenCalledTimes(1);
    wrapper.vm.reopen();
    expect(confirmationShowStub).toHaveBeenCalledTimes(2);
  });

  it('should have method which run show method on $refs.closeConfirmation: close', () => {
    const { wrapper, confirmationShowStub } = createMountedWrapper();
    wrapper.vm.close();
    expect(confirmationShowStub).toHaveBeenCalled();
    expect(confirmationShowStub).toHaveBeenCalledTimes(1);
    wrapper.vm.close();
    expect(confirmationShowStub).toHaveBeenCalledTimes(2);
  });

  it('should have method which reset replyQuery state (cancel comment): cancelComment', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({ replyQuery: '1' });
    wrapper.vm.cancelComment();
    expect(wrapper.vm.replyQuery).toEqual(null);
  });

  it('should have method which emit onQueryCommentCreate on comment creation: createComment', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({ replyQuery: '1' });
    wrapper.vm.createComment({ comment: 'comment' });

    // assert event has been emitted
    expect(wrapper.emitted().onQueryCommentCreate).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().onQueryCommentCreate.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().onQueryCommentCreate[0][0]).toEqual({
      queryId: testPropsData.query.queryId,
      comment: 'comment',
    });

    expect(wrapper.vm.replyQuery).toEqual(null);
  });

  it('should have method which emit "onQueryClosed" event on query close confirmation: closeConfirmed', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.vm.closeConfirmed();
    // assert event has been emitted
    expect(wrapper.emitted().onQueryClosed).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().onQueryClosed.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().onQueryClosed[0][0]).toEqual(testPropsData.query);
  });

  it('should have method which emit "reopenConfirmed" event on query reopen confirmation: reopenConfirmed', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.vm.reopenConfirmed();
    // assert event has been emitted
    expect(wrapper.emitted().onQueryReopened).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().onQueryReopened.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().onQueryReopened[0][0]).toEqual(testPropsData.query);
  });

  it('has the expected html structure', async () => {
    const { wrapper } = createMountedWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
    // reply

    wrapper.vm.reply();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.replyQuery).toBe(testPropsData.query.queryId);
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
