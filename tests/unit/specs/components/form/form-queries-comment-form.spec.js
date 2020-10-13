import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import { mount, createLocalVue } from '@vue/test-utils';

import formQueriesCommentFormComponent from '@/components/form/form-queries/form-queries-comment-form';

const { it, describe, expect } = global;

const testPropsData = {
  saveBtnText: 'saveBtnText',
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
});

describe('components/form/form-queries/form-queries-comment-form.vue', () => {
  const createMountedWrapper = (options = {}) => mount(formQueriesCommentFormComponent, {
    localVue,
    propsData: { ...testPropsData },
    stubs: {
      ButtonCmp: {
        name: 'ButtonCmp',
        render: h => h('b', 'ButtonCmp'),
      },
    },
    sync: false,
    ...options,
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(formQueriesCommentFormComponent.components.ButtonCmp).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.fakeProp).toBeUndefined();
    expect(wrapper.vm.saveBtnText).toEqual(testPropsData.saveBtnText);
    expect(wrapper.vm.saveBtnText).not.toBeUndefined();
  });

  it('should have all required initial data', () => {
    const wrapper = createMountedWrapper();
    // initial data
    expect(wrapper.vm.comment).toBe('');
    expect(wrapper.vm.limit).toBe(500);
    expect(wrapper.vm.submited).toBe(false);
  });

  it('should watch comment prop and slice it with limit', async () => {
    const wrapper = createMountedWrapper();
    wrapper.setData({
      comment: '12345678',
      limit: 5,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.comment).toBe('12345');
    wrapper.setData({
      comment: '12345678',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.comment).toBe('12345');
    wrapper.setData({
      comment: '1234',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.comment).toBe('1234');
  });

  it('should have method which emit "cancel" event on comment cancel: cancel', async () => {
    const wrapper = createMountedWrapper();
    const cancelLink = wrapper.find('.cancelBtn');
    expect(cancelLink.is('b')).toBe(true);

    wrapper.vm.cancel();

    // assert event has been emitted
    expect(wrapper.emitted().cancel).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().cancel.length).toBe(1);
  });

  it('should have method which emit "submit" event on comment submit (if valid): submit', async () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.vm.submited).toBe(false);

    try {
      await wrapper.vm.submit();
    } catch (e) {
      expect(e.message).toMatch('Invalid comment data');
    }
    expect(wrapper.vm.submited).toBe(true);

    // invalid from data
    expect(wrapper.emitted().submit).toBeFalsy();

    const commentField = wrapper.find('#comment');
    expect(commentField.is('textarea')).toBe(true);
    commentField.element.value = 'My comment';
    commentField.trigger('input');
    await wrapper.vm.$nextTick();
    await wrapper.vm.submit();

    // assert event has been emitted
    expect(wrapper.emitted().submit).toBeTruthy();
    // assert event count
    expect(wrapper.emitted().submit.length).toBe(1);
    // assert event payload
    expect(wrapper.emitted().submit[0][0]).toEqual({ comment: 'My comment' });
  });

  it('has the expected html structure', async () => {
    const wrapper = createMountedWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();

    try {
      await wrapper.vm.submit();
    } catch (e) {
      expect(e.message).toMatch('Invalid comment data');
    }
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();

    const commentField = wrapper.find('#comment');
    expect(commentField.is('textarea')).toBe(true);
    commentField.element.value = 'My comment';
    commentField.trigger('input');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
