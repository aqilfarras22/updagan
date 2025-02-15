import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
// import vueRouter from 'vue-router';

import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';
// import navBar from '@/components/common/nav-bar';
import studyParticipantsPage from '@/pages/study-participants';

const { it, describe, expect, beforeEach } = global;

describe('pages/study-participants.vue', () => {
  const localVue = createLocalVue();
  const routerView = {
    name: 'router-view',
    props: {
      routes: {
        type: Array,
      },
    },
    render: h => h('h1', 'render'),
  };
  localVue.use(Vuex);

  const testStudyId = 111;
  const getStudyDataFactResponse = { body: {} };
  const getToggleFeaturesResponse = { body: {} };
  let actions;
  let store;
  let getters;

  const createMountedWrapper = (wrapperOptions = {}, testMocks = {}) => {
    const getStudyDataFactStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(getStudyDataFactResponse));
    const getToggleFeaturesFactStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(getToggleFeaturesResponse));

    return {
      wrapper: shallowMount(studyParticipantsPage, {
        localVue,
        mocks: {
          $api: {
            getStudyDataFact: getStudyDataFactStub,
            getToggleFeaturesFact: getToggleFeaturesFactStub,
          },
          $route: {
            name: 'study-participant',
            params: {
              studyId: testStudyId,
            },
          },
          $router: {
            push: jest.fn(),
          },
          ...testMocks,
        },
        stubs: {
          'router-view': routerView,
        },
        ...wrapperOptions,
      }),
      getStudyDataFactStub,
      getToggleFeaturesFactStub,
    };
  };

  beforeEach(() => {
    getters = {
      user: () => ({
        userRole: '',
      }),
    };
    actions = {
      userLogout: jest.fn(),
    };
    store = new Vuex.Store({
      state: {},
      getters,
      actions,
    });
  });

  it('should create instance', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have all required initial data', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(wrapper.vm.studyData).toBeTruthy();
  });

  it('should have required child components', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(wrapper.find(mainHeader).exists()).toBeTruthy();
    expect(wrapper.find(sideMenu).exists()).toBeTruthy();
    // expect(wrapper.find(navBar).exists()).toBeTruthy();
    expect(wrapper.find(routerView).exists()).toBeTruthy();
  });

  it('should return computed property: studyId', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(wrapper.vm.studyId).toBe(testStudyId);
  });

  it('should return computed property: isDetailPage (not detail page)', () => {
    const { wrapper } = createMountedWrapper(
      { store },
      {
        $route: {
          name: 'study-participant',
          params: {
            studyId: testStudyId,
          },
        },
      },
    );
    expect(wrapper.vm.isDetailPage).toBe(false);
  });

  it('should return computed property: isDetailPage (detail page)', () => {
    const { wrapper } = createMountedWrapper(
      { store },
      {
        $route: {
          name: 'study-participants-list',
          params: {
            studyId: testStudyId,
          },
        },
      },
    );
    expect(wrapper.vm.isDetailPage).toBeTruthy();
  });

  it('should return computed property: navBarRoutes', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(Array.isArray(wrapper.vm.navBarRoutes)).toBeTruthy();
  });

  it('should call api method with studyId in order to get studyData', () => {
    const { getStudyDataFactStub, getToggleFeaturesFactStub } = createMountedWrapper({ store });
    expect(getStudyDataFactStub).toBeCalled();
    expect(getToggleFeaturesFactStub).toBeCalled();
    expect(getStudyDataFactStub).toBeCalledWith(testStudyId);
  });

  it('should call api method with studyId and set studyData', () => {
    const { wrapper, getStudyDataFactStub } = createMountedWrapper({ store });
    return getStudyDataFactStub().then(result => {
      expect(result.body).toBe(getStudyDataFactResponse.body);
      expect(wrapper.vm.studyData).toBe(getStudyDataFactResponse.body);
    });
  });

  it('should has the expected html structure', () => {
    const { wrapper } = createMountedWrapper({ store });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
