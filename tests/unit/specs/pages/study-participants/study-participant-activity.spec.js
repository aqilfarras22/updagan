import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import studyParticipantsActivityPage from '@/pages/study-participants/study-participant-activity';

const { it, describe, expect } = global;

describe('pages/study-participants/study-participant-activity.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  const activityId = 111;

  const createMountedWrapper = testMocks => {
    const getActivityResponse = {
      participant: { name: 'name' },
      payload: '{"payload": "payload"}',
      activity: {
        id: 1,
        name: 'Uniq 1',
      },
    };

    const getActivityStub = jest.fn().mockReturnValue(Promise.resolve(getActivityResponse));
    const getParticipantDataFactStub = jest.fn()
      .mockReturnValue(Promise.resolve(getActivityResponse));

    return {
      wrapper: shallowMount(studyParticipantsActivityPage, {
        localVue,
        mocks: {
          $api: {
            getActivity: getActivityStub,
            getParticipantDataFact: getParticipantDataFactStub,
          },
          $route: {
            params: {
              activityId,
            },
          },
          ...testMocks,
        },
        stubs: {
          JsonTree: { name: 'JsonTree', render: h => h('b', 'JsonTreeCmp') },
          ParticipantInfo: { name: 'ParticipantInfo', render: h => h('b', 'ParticipantInfoCmp') },
          ActivityInfo: { name: 'ActivityInfo', render: h => h('b', 'ActivityInfoCmp') },
        },
      }),
      getActivityStub,
      getParticipantDataFactStub,
      getActivityResponse,
    };
  };

  it('should create instance', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(studyParticipantsActivityPage.components.ActivityInfo).toBeTruthy();
    expect(studyParticipantsActivityPage.components.ParticipantInfo).toBeTruthy();
    expect(studyParticipantsActivityPage.components.JsonTree).toBeTruthy();
  });

  it('should have all required initial data', () => {
    const { wrapper } = createMountedWrapper();
    // initial data
    expect(wrapper.vm.participantInfo).toEqual({});
    expect(wrapper.vm.activity).toEqual(null);
    expect(wrapper.vm.payload).toEqual(null);
  });

  it('should return computed property: activityId', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.activityId).toBe(activityId);
  });

  it('should has the expected html structure', async () => {
    const { wrapper, getActivityStub, getParticipantDataFactStub } = createMountedWrapper();
    await getParticipantDataFactStub();
    await getActivityStub();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
