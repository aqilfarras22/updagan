import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import studyParticipantsDashboardPage from '@/pages/study-participants/study-participants-data-dashboard';

const { it, describe, expect } = global;

describe('pages/study-participants-data-dashboard.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  const metainfoProp = {};
  const perPageProp = 5;
  const totalQueriesProp = 0;
  const totalFormsProp = 0;

  const createMountedWrapper = testMocks => {
    const getQueryToolStatisticResponse = {
      metainfo: {
        totalQueries: 10,
        totalForms: 11,
      },
      queries: [{ id: 1 }, { id: 2 }],
    };

    const getQueryToolStatisticStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(getQueryToolStatisticResponse));
    const vueAclCheckStub = jest
      .fn()
      .mockReturnValue(Promise.resolve({}));

    const vueAclChangeStub = jest
      .fn()
      .mockReturnValue(Promise.resolve({}));

    return {
      wrapper: shallowMount(studyParticipantsDashboardPage, {
        localVue,
        mocks: {
          $api: {
            getQueryToolStatistic: getQueryToolStatisticStub,
          },
          $acl: {
            check: vueAclCheckStub,
            change: vueAclChangeStub,
          },
          ...testMocks,
        },
        stubs: {
          DonutChartWidget: {
            name: 'DonutChartWidget',
            render: h => h('b', 'DonutChartWidgetCmp'),
          },
          TableComponent: { name: 'TableComponent', render: h => h('b', 'TableComponentCmp') },
        },
      }),
      getQueryToolStatisticStub,
      getQueryToolStatisticResponse,
    };
  };

  it('should create instance', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(studyParticipantsDashboardPage.components.DonutChartWidget).toBeTruthy();
    expect(studyParticipantsDashboardPage.components.TableComponent).toBeTruthy();
  });

  it('should be able to get required props', () => {
    const { wrapper } = createMountedWrapper();
    const props = {
      studyId: '1',
      studyData: { data: 'data' },
      participantInfo: { data: 'data' },
    };
    wrapper.setProps(props);
    expect(wrapper.vm.studyId).toBe(props.studyId);
    expect(wrapper.vm.studyData).toBe(props.studyData);
    expect(wrapper.vm.participantInfo).toBe(props.participantInfo);
  });

  it('should have all required initial data', () => {
    const { wrapper } = createMountedWrapper();
    // imported data
    expect(wrapper.vm.approvalStatusText).toBeTruthy();
    expect(wrapper.vm.verificationStatusText).toBeTruthy();
    // initial data
    expect(wrapper.vm.filterOptions).toMatchSnapshot(); // snapshot for array
    expect(wrapper.vm.metainfo).toMatchObject(metainfoProp);
    expect(wrapper.vm.perPage).toBe(perPageProp);
    expect(wrapper.vm.totalQueries).toBe(totalQueriesProp);
    expect(wrapper.vm.totalForms).toBe(totalFormsProp);
  });

  it('should return computed property: queriesData', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      metainfo: {
        openQueries: 1,
        closedQueries: 2,
      },
    });
    expect(wrapper.vm.queriesData).toMatchSnapshot();
  });

  it('should return computed property: verificationData', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      metainfo: {
        unverifiedForms: 1,
        verifiedForms: 2,
      },
    });
    expect(wrapper.vm.verificationData).toMatchSnapshot();
  });

  it('should return computed property: approvalData', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      metainfo: {
        unApprovedForms: 1,
        approvedForms: 2,
      },
    });
    expect(wrapper.vm.approvalData).toMatchSnapshot();
  });
  it('should return computed property for PI role: tableFields', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.tableFields).toMatchSnapshot();
  });

  it('should return computed property for not PI role: tableFields', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.tableFields).toMatchSnapshot();
  });

  it('should create getCacheStatistic function', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.getCacheStatistic).toBeTruthy();
  });
  it('should have method printTotalFormatter which returns string', () => {
    const { wrapper } = createMountedWrapper();
    const totalText = wrapper.vm.printTotalFormatter();
    expect(totalText).toBe('Total queries: 0');
  });

  it('should have method getStatistic which sets and returns data', async () => {
    const {
      wrapper,
      getQueryToolStatisticStub,
      getQueryToolStatisticResponse,
    } = createMountedWrapper();
    const studyId = 123;
    wrapper.setProps({
      studyId,
    });
    const result = await wrapper.vm.getStatistic({ filter: 1 });
    expect(result).toEqual(getQueryToolStatisticResponse);
    expect(getQueryToolStatisticStub).toBeCalled();
    expect(getQueryToolStatisticStub).toBeCalledWith({
      sId: studyId,
      params: { filter: 1 },
    });
    expect(wrapper.vm.totalQueries).toBe(getQueryToolStatisticResponse.metainfo.totalQueries);
    expect(wrapper.vm.totalForms).toBe(getQueryToolStatisticResponse.metainfo.totalForms);
  });
  it('should have method getQueries which provides data', async () => {
    const {
      wrapper,
      getQueryToolStatisticStub,
      getQueryToolStatisticResponse,
    } = createMountedWrapper();
    const studyId = 123;
    const params = {
      filter: 2,
      currentPage: 1,
      sortBy: 'id',
      sortDesc: false,
      perPage: 5,
    };
    wrapper.setProps({
      studyId,
    });
    const actualQueries = await wrapper.vm.getQueries(params);
    expect(getQueryToolStatisticStub).toBeCalled();
    expect(getQueryToolStatisticStub).toBeCalledWith({
      params: {
        filter: 2,
        limit: 5,
        offset: 0,
        sortBy: 'id',
        sortDesc: false,
      },
      sId: studyId,
    });
    expect(actualQueries).toEqual(getQueryToolStatisticResponse.queries);
  });

  it('should has the expected html structure', async () => {
    const { wrapper } = createMountedWrapper();
    const studyId = 123;
    wrapper.setProps({
      studyId,
    });
    await wrapper.vm.getQueries({
      filter: 2,
      currentPage: 1,
      sortBy: 'id',
      sortDesc: false,
      perPage: 5,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
