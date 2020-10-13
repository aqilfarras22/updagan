import { shallowMount, createLocalVue } from '@vue/test-utils';

import formQueriesQueryCommentComponent from '@/components/form/form-queries/form-queries-query-comment';
import formatGMTDate from '@/constants/filter';
import momentTimezone from 'moment-timezone';

// Vue.use(moment, {
//   momentTimezone,
// });

const { it, describe, expect } = global;

const testPropsData = {
  comment: {
    author: 'authorName',
    comment: 'comment',
    createdOn: 1,
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

describe('components/form/form-queries/form-queries-query-comment.vue', () => {
  const createMountedWrapper = (options = {}) => shallowMount(formQueriesQueryCommentComponent, {
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
    expect(wrapper.vm.comment).toEqual(testPropsData.comment);
  });

  it('has the expected html structure', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
