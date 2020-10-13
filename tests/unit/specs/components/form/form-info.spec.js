import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';

import formInfoComponent from '@/components/form/form-info';

const { it, describe, expect } = global;

const testPropsData = {
  formId: '66066679-1eef-480b-86b7-c7745fa4fb87',
  formName: 'e-visit_1',
  approvalStatus: 'NOT_APPROVED',
  verificationStatus: 'VERIFIED',
  verifiedOn: 1516034703,
  approvedOn: 1516034703,
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
});
const vueAclCheckStub = jest
  .fn()
  .mockReturnValue(Promise.resolve({}));

const vueAclChangeStub = jest
  .fn()
  .mockReturnValue(Promise.resolve({}));

describe('components/form/form-info.vue', () => {
  const createMountedWrapper = (options = {}) => mount(formInfoComponent, {
    localVue,
    propsData: { ...testPropsData },
    ...options,
    mocks: {
      $acl: {
        check: vueAclCheckStub,
        change: vueAclChangeStub,
      },
    },
  });
  it('should create instance', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.props()).toEqual(testPropsData);
  });

  it('should not create if required props items were not passed', () => {
    // const consoleErrorStub = sinon.stub(console, 'error');
    const wrapper = createMountedWrapper({ propsData: {} });
    expect(wrapper.isEmpty()).toBeTruthy();
  });

  it('should display props which were passed', () => {
    const wrapper = createMountedWrapper();
    const formName = wrapper.find({ ref: 'formName' });
    const verificationStatus = wrapper.find({ ref: 'verificationStatus' });
    const approvalStatus = wrapper.find({ ref: 'approvalStatus' });
    expect(formName);
    expect(verificationStatus);
    expect(approvalStatus);
  });

  it('should not display props which were not passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        formId: 'formId_prop',
      },
    });
    const { verificationStatus, approvalStatus, formName } = wrapper.vm.$refs;
    expect(verificationStatus).toBe(undefined);
    expect(approvalStatus).toBe(undefined);
    expect(formName).toBe(undefined);
  });

  it('has the expected html structure', () => {
    const { vm } = shallowMount(formInfoComponent, { localVue,
      propsData: { ...testPropsData },
      mocks: {
        $acl: {
          check: vueAclCheckStub,
          change: vueAclChangeStub,
        },
      },
      sync: false });
    expect(vm.$el).toMatchSnapshot();
  });
});
