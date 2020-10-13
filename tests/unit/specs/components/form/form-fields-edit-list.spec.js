import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { fieldTypes } from '@/constants/form';

import formInfoComponent from '@/components/form/form-fields-edit-list';

const { it, describe, expect } = global;

const inputQuestion = {
  fieldId: '121input',
  fragmentType: fieldTypes.INPUT,
  question: 'question',
  response: ['answer'],
};
const polarQuestion = {
  fieldId: '123polar',
  fragmentType: fieldTypes.POLAR_QUESTION,
  question: 'question',
  answers: [{ name: 'Yes' }, { name: 'No' }],
  response: ['Yes'],
};
const dropdownQuestion = {
  fieldId: '421dropdown',
  fragmentType: fieldTypes.DROPDOWN,
  multipleChoice: false,
  question: 'question',
  response: ['first'],
  answers: ['first', 'second', 'third'],
};
const dateQuestion = {
  fieldId: '411date',
  fragmentType: fieldTypes.DATEPICKER,
  question: 'question',
  response: ['1519138199'],
};
const section = {
  name: 'section',
  fields: [inputQuestion, polarQuestion, dropdownQuestion, dateQuestion],
};
const changeReason = 'reason for change';

const itemSelector = '.item';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const createMountedWrapper = (options = {}) => shallowMount(formInfoComponent, {
  localVue,
  propsData: { sections: [section] },
  ...options,
  stub: {
    FormChangeReasonModal: {
      name: 'FormChangeReasonModal',
      render: h => h('b', 'FormChangeReasonModalCmp'),
    },
  },
});

describe('components/form/form-fields-list.vue', () => {
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should show correct number of questions', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.findAll(itemSelector).length).toBe(4);
  });

  it('should emit "save" event on submit with unchanged fields', async () => {
    const wrapper = createMountedWrapper();
    wrapper.vm.submit(changeReason);

    await wrapper.vm.$nextTick();
    const actualSaveData = wrapper.emitted('save')[0][0];

    expect(actualSaveData.primaryReason).toBe(changeReason);
    expect(actualSaveData.sections).toEqual([
      {
        name: section.name,
        fields: [inputQuestion, polarQuestion, dropdownQuestion, dateQuestion].map(field => ({
          ...field,
          changed: false,
          oldResponse: field.response,
        })),
      },
    ]);
  });

  it('should emit "save" event on submit with changed fields', async () => {
    const wrapper = createMountedWrapper();

    wrapper.vm.sectionsModel[0].fields[0].response = 'new_input';
    wrapper.vm.submit(changeReason);

    await wrapper.vm.$nextTick();
    const actualSaveData = wrapper.emitted('save')[0][0];

    expect(actualSaveData.primaryReason).toBe(changeReason);
    expect(actualSaveData.sections).toEqual([
      {
        name: section.name,
        fields: [
          {
            ...inputQuestion,
            response: ['new_input'],
            changed: true,
            oldResponse: inputQuestion.response,
          },
          ...[polarQuestion, dropdownQuestion, dateQuestion].map(field => ({
            ...field,
            changed: false,
            oldResponse: field.response,
          })),
        ],
      },
    ]);
  });

  it('has the expected html structure', () => {
    const wrapper = shallowMount(formInfoComponent, {
      localVue,
      propsData: { sections: [section] },
    });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
