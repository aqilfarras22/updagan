import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesListItemComponent from '@/components/form/form-queries/form-queries-list-item';
import formatGMTDate from '@/constants/filter';
import momentTimezone from 'moment-timezone';

const { it, describe, expect } = global;

const testPropsData = {
  query: {
    queryId: 'qwerty',
    comments: [
      {
        createdOn: 0,
        author: 'authorName1',
        comment: 'comment1',
      },
      {
        createdOn: 1,
        author: 'authorName2',
        comment: 'comment2',
      },
    ],
  },
};

const localVue = createLocalVue();
localVue.use('moment', {
  momentTimezone,
});
localVue.use({
  install(vue) {
    vue.filter('moment', (v, format) => format);
    vue.filter(formatGMTDate);
  },
});

describe('components/form/form-queries/form-queries-list-item.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formQueriesListItemComponent, {
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
    expect(wrapper.vm.query).toEqual(testPropsData.query);
    expect(wrapper.vm.query).not.toBeUndefined();
  });

  it('should return computed property (5 charts of queryId in uppercase ): shortQueryId', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.shortQueryId).toBe(testPropsData.query.queryId.slice(0, 5).toUpperCase());
  });

  it('should return computed property (latest comment): lastComment', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.lastComment).toEqual(testPropsData.query.comments[0]);
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
