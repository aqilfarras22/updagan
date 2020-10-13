import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import { fieldTypes } from '@/constants/form';
import BootstrapVue from 'bootstrap-vue';

import formInfoComponent from '@/components/form/form-fields-list';
import formatDate from '@/constants/filter';

const { it, describe, expect } = global;

const simpleQuestion = {
  fieldId: '28n238n23823',
  question: 'question',
  response: ['answer'],
};

const dateQuestion = {
  fieldId: '28n212121',
  fragmentType: fieldTypes.DATEPICKER,
  question: 'question',
  response: [1519138199],
};

const sections = [
  {
    name: 'section',
    fields: [simpleQuestion, dateQuestion],
  },
];

const itemSelector = '.item';
const openQueryButtonSelector = '.open-query';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use({
  install(vue) {
    vue.filter('moment', (v, format) => format);
    vue.filter(formatDate);
  },
});

const createMountedWrapper = (options = {}) => mount(formInfoComponent, {
  localVue,
  propsData: { sections },
  ...options,
});

describe('components/form/form-fields-list.vue', () => {
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should show correct number of questions', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.findAll(itemSelector).length).toBe(2);
  });

  it('should fire "openQuery" on click corresponding button over item', async () => {
    const wrapper = createMountedWrapper();
    wrapper.find(openQueryButtonSelector).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('openQuery')[0][0]).toBe(simpleQuestion.fieldId);
  });

  it('should not fire "select" on clicking item without queries', async () => {
    const wrapper = createMountedWrapper();
    wrapper.find(itemSelector).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('selected')).toBe(undefined);
  });

  it('should fire "select" on clicking item with queries', async () => {
    const wrapper = createMountedWrapper({
      propsData: {
        sections,
        fieldsWithQueries: [simpleQuestion.fieldId],
      },
    });
    wrapper.find(itemSelector).trigger('click');

    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('selected')[0][0]).toBe(simpleQuestion.fieldId);
  });

  it('has the expected html structure', () => {
    const wrapper = shallowMount(formInfoComponent, { localVue, propsData: { sections } });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
