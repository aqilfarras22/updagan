// import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';

import participantInfo from '@/components/participants/participant-info';

const { it, describe, expect } = global;

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use({
  install(vue) {
    vue.filter('moment', (v, format) => format);
  },
});

const studyId = '111';
const participantId = '123';
const testParticipantDetails = {
  id: '123',
};
const getCustomLabelsStub = jest.fn().mockResolvedValue({});
const getStudyDetailsStub = jest.fn().mockResolvedValue({});
const vueAclCheckStub = jest.fn().mockReturnValue(Promise.resolve({}));
const vueAclChangeStub = jest.fn().mockReturnValue(Promise.resolve({}));

const createMountedWrapper = mountOptions => mount(participantInfo, {
  localVue,
  ...mountOptions,
  propsData: {
    participantDetails: testParticipantDetails,
  },
  mocks: {
    $api: {
      getLabelsFact: getCustomLabelsStub,
      getStudyDataFact: getStudyDetailsStub,
    },
    $route: {
      params: {
        studyId,
        participantId,
      },
    },
    $acl: {
      check: vueAclCheckStub,
      change: vueAclChangeStub,
    },
  },
});

describe('components/participants/participant-info.vue', () => {
  it('should create instance', () => {
    const { vm } = createMountedWrapper();
    expect(vm);
  });

  it('should able to receive props', () => {
    const wrapper = createMountedWrapper();
    expect(wrapper.props()).toEqual({
      participantDetails: testParticipantDetails,
    });
  });

  // it.skip('should not create if required props items were not passed', () => {
  //   const spy = jest.spyOn(console, 'error');
  //   mount(participantInfo);
  //   expect(spy).toBeCalledWith(expect.stringContaining('[Vue warn]: Invalid prop'));

  //   spy.mockReset();
  // });

  it('should display props which were passed', () => {
    const wrapper = createMountedWrapper();
    const generatedText = wrapper.text();
    expect(generatedText).toContain(testParticipantDetails.id);
  });

  it('should have method which request all required data: getCustomLabels', async () => {
    // method is called on mount
    expect(getCustomLabelsStub).toBeCalled();

    // getData should change state
    await getCustomLabelsStub();
  });

  it('should have method which request all required data: getStudyDetails', async () => {
    // method is called on mount
    expect(getStudyDetailsStub).toBeCalled();

    // getData should change state
    await getStudyDetailsStub();
  });

  it('has the expected html structure', () => {
    const { vm } = createMountedWrapper();
    expect(vm.$el).toMatchSnapshot();
  });
});
