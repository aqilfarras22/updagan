import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import studyParticipantsDetailsPage from '@/pages/study-participants/study-participant-details';
// import { verificationStatus, approvalStatus } from '@/constants/form';

const { it, describe, expect } = global;

describe('pages/study-participants/study-participant-details.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  const studyIdProp = '100';
  const participantId = 111;
  const tableFormPerPageData = 5;
  const tableFormCurrentPageData = 1;

  const createMountedWrapper = testMocks => {
    const getQueryToolStudyParticipantResponse = {
      activities: [
        {
          id: 1,
          name: 'Uniq 1',
        },
        {
          id: 2,
          name: 'Uniq 2',
        },
        {
          id: 3,
          name: 'Uniq 2',
        },
      ],
    };

    const getParticipantDetailsResponse = {
      id: '123',
    };

    const getParticipantForms = [];

    const checkStatus = {};

    const features = {};

    const aclCheck = {};

    const aclChange = {};

    const getQueryToolStudyParticipantStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(getQueryToolStudyParticipantResponse));

    const getParticipantDataFactStub = jest
      .fn().mockReturnValue(Promise.resolve(getParticipantDetailsResponse));

    const checkEDCMilestonesFactStub = jest
      .fn().mockReturnValue(Promise.resolve(checkStatus));

    const getToggledFeaturesFactStub = jest
      .fn().mockReturnValue(Promise.resolve(features));

    const vueAclCheckStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(aclCheck));

    const vueAclChangeStub = jest
      .fn()
      .mockReturnValue(Promise.resolve(aclChange));

    return {
      wrapper: shallowMount(studyParticipantsDetailsPage, {
        localVue,
        propsData: {
          studyId: studyIdProp,
        },
        mocks: {
          $api: {
            getQueryToolStudyParticipant: getQueryToolStudyParticipantStub,
            getParticipantDataFact: getParticipantDataFactStub,
            checkEDCMilestonesFact: checkEDCMilestonesFactStub,
            getToggleFeaturesFact: getToggledFeaturesFactStub,
          },
          $route: {
            params: {
              participantId,
            },
          },
          $acl: {
            check: vueAclCheckStub,
            change: vueAclChangeStub,
          },
          ...testMocks,
        },
        stubs: {
          ParticipantInfo: { name: 'ParticipantInfo', render: h => h('b', 'ParticipantInfoCmp') },
          TableComponent: { name: 'TableComponent', render: h => h('b', 'TableComponentCmp') },
        },
      }),
      getQueryToolStudyParticipantStub,
      getQueryToolStudyParticipantResponse,
      getParticipantForms,
      getParticipantDataFactStub,
      checkEDCMilestonesFactStub,
      getToggledFeaturesFactStub,
    };
  };

  it('should create instance', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(studyParticipantsDetailsPage.components.ParticipantInfo).toBeTruthy();
    expect(studyParticipantsDetailsPage.components.TableComponent).toBeTruthy();
  });

  it('should be able to get required props', () => {
    const { wrapper } = createMountedWrapper();
    const props = {
      studyId: '1',
      studyData: { data: 'data' },
    };
    wrapper.setProps(props);
    expect(wrapper.vm.studyId).toEqual(props.studyId);
    expect(wrapper.vm.studyData).toEqual(props.studyData);
  });

  it('should have all required initial data', () => {
    const { wrapper } = createMountedWrapper();
    // imported data
    expect(wrapper.vm.approvalStatusText).toBeTruthy();
    expect(wrapper.vm.verificationStatusText).toBeTruthy();
    // initial data
    expect(wrapper.vm.participantInfo).toEqual({});
    expect(wrapper.vm.forms).toEqual([]);
    expect(wrapper.vm.filteredForms).toEqual(null);
    expect(wrapper.vm.tableFormPerPage).toBe(tableFormPerPageData);
    expect(wrapper.vm.tableFormCurrentPage).toBe(tableFormCurrentPageData);

    expect(wrapper.vm.tableFormFields).toMatchSnapshot();
    expect(wrapper.vm.tableFormFilterOptions).toMatchSnapshot();
    expect(wrapper.vm.reportedData).toEqual([]);
    expect(wrapper.vm.filteredReportedData).toEqual(null);
    expect(wrapper.vm.tableReportedDataFields).toMatchSnapshot();
    expect(wrapper.vm.tableReportedDataFilterOptions).toMatchSnapshot();
  });

  it('should call API getQueryToolStudyParticipant on mount and set related data', async () => {
    const {
      wrapper,
      getQueryToolStudyParticipantStub,
      getQueryToolStudyParticipantResponse,
      getParticipantForms,
      getParticipantDataFactStub,
      checkEDCMilestonesFactStub,
      getToggledFeaturesFactStub,
    } = createMountedWrapper();
    expect(getQueryToolStudyParticipantStub).toBeCalled();
    expect(getParticipantDataFactStub).toBeCalled();
    expect(getToggledFeaturesFactStub).toBeCalled();
    expect(getQueryToolStudyParticipantStub).toBeCalledWith({
      pId: participantId,
      sId: studyIdProp,
    });
    expect(checkEDCMilestonesFactStub).toBeCalled();
    await getQueryToolStudyParticipantStub();
    await getParticipantDataFactStub();
    await checkEDCMilestonesFactStub();
    await getToggledFeaturesFactStub();
    expect(wrapper.vm.forms).toEqual(getParticipantForms);
    expect(wrapper.vm.reportedData).toEqual(getQueryToolStudyParticipantResponse.activities);
  });

  it('should call API getQueryToolStudyParticipant on mount and get uniq names for table filter', async () => {
    const {
      wrapper,
      getParticipantDataFactStub,
      getToggledFeaturesFactStub,
      // getQueryToolStudyParticipantResponse,
    } = createMountedWrapper();
    expect(getParticipantDataFactStub).toBeCalled();
    expect(getToggledFeaturesFactStub).toBeCalled();
    await getParticipantDataFactStub();
    await getToggledFeaturesFactStub();
    expect(wrapper.vm.tableReportedDataFilterOptions).toEqual([
      {
        text: 'Filter',
        value: '',
      },
      {
        text: 'Uniq 1',
        value: 'Uniq 1',
      },
      {
        text: 'Uniq 2',
        value: 'Uniq 2',
      },
    ]);
  });

  it('should return computed property: totalForms', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      forms: [{}, {}, {}], // totalForms is 3
    });
    expect(wrapper.vm.totalForms).toBe(3);
    wrapper.setData({
      filteredForms: [{}, {}], // totalForms is 2
    });
    expect(wrapper.vm.totalForms).toBe(2);
    wrapper.setData({
      filteredForms: null, // totalForms is 2
    });
    expect(wrapper.vm.totalForms).toBe(3);
  });

  it('should return computed property: totalReportedData', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      reportedData: [{}, {}, {}], // totalReportedData is 3
    });
    expect(wrapper.vm.totalReportedData).toBe(3);
    wrapper.setData({
      filteredReportedData: [{}, {}], // totalReportedData is 2
    });
    expect(wrapper.vm.totalReportedData).toBe(2);
    wrapper.setData({
      filteredReportedData: null, // totalReportedData is 2
    });
    expect(wrapper.vm.totalReportedData).toBe(3);
  });

  it('should return computed property: displayShowMore', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      forms: [{}, {}, {}], // totalForms is 3
      tableFormCurrentPage: 1,
      tableFormPerPage: 5, // 5 forms per page
    });
    expect(wrapper.vm.displayShowMore).toBeFalsy();
    wrapper.setData({
      forms: [{}, {}, {}], // totalForms is 3
      tableFormCurrentPage: 1, // max 2 pages
      tableFormPerPage: 2, // 2 forms per page
    });
    expect(wrapper.vm.displayShowMore).toBeTruthy();
    wrapper.setData({
      forms: [{}, {}, {}], // totalForms is 3
      tableFormCurrentPage: 2, // max 2 pages
      tableFormPerPage: 2, // 2 forms per page
    });
    expect(wrapper.vm.displayShowMore).toBeFalsy();
  });

  it('should have method formsPrintTotalFormatter which return required string', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      forms: [{}, {}, {}], // totalForms is 3
    });
    expect(wrapper.vm.formsPrintTotalFormatter()).toMatchSnapshot();
  });

  it('should have method reportedDataPrintTotalFormatter which return required string', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      reportedData: [{}, {}, {}], // reportedData is 3
    });
    expect(wrapper.vm.reportedDataPrintTotalFormatter()).toMatchSnapshot();
  });

  it('should have method showMore which increment current page', () => {
    const { wrapper } = createMountedWrapper();
    const prevPage = wrapper.vm.tableFormCurrentPage;
    wrapper.vm.showMore();
    expect(wrapper.vm.tableFormCurrentPage).toBe(prevPage + 1);
  });

  it('should have method reportedDataCollection which filter and return data', async () => {
    const {
      wrapper,
      getQueryToolStudyParticipantStub,
      getQueryToolStudyParticipantResponse,
      checkEDCMilestonesFactStub,
    } = createMountedWrapper();
    await getQueryToolStudyParticipantStub();
    await checkEDCMilestonesFactStub();
    const result = wrapper.vm.reportedDataCollection({});
    expect(result).toEqual(getQueryToolStudyParticipantResponse.activities);
    // const filteredResult = wrapper.vm.reportedDataCollection({ filter: 'Uniq 2' });
    // expect(filteredResult.length).toBe(2);
    // expect(filteredResult[0].name).toBe('Uniq 2');
    // expect(filteredResult[1].name).toBe('Uniq 2');
  });

  // it('should have method formsDataCollection which filter and return data', async () => {
  //   const {
  //     wrapper,
  //     getParticipantFormsFactStub,
  //     getParticipantForms,
  //   } = createMountedWrapper();
  //   await getParticipantFormsFactStub();

  //   let result = wrapper.vm.formsDataCollection({});
  //   expect(result).toEqual(getParticipantForms);

  //   // forms with open queries
  //   result = wrapper.vm.formsDataCollection({ filter: 'open' });
  //   expect(result.length).toBe(2);

  //   // forms with closed queries
  //   result = wrapper.vm.formsDataCollection({ filter: 'closed' });
  //   expect(result.length).toBe(1);

  //   // forms with verified forms
  //   result = wrapper.vm.formsDataCollection({ filter: 'verified' });
  //   expect(result.length).toBe(2);

  //   // forms with unverified forms
  //   result = wrapper.vm.formsDataCollection({ filter: 'unverified' });
  //   expect(result.length).toBe(1);

  //   // forms with approved forms
  //   result = wrapper.vm.formsDataCollection({ filter: 'approved' });
  //   expect(result.length).toBe(2);

  //   // forms with unapproved forms
  //   result = wrapper.vm.formsDataCollection({ filter: 'unapproved' });
  //   expect(result.length).toBe(1);
  // });

  it('should has the expected html structure', async () => {
    const {
      wrapper,
      getQueryToolStudyParticipantStub,
      getParticipantDataFactStub,
      getToggledFeaturesFactStub,
      checkEDCMilestonesFactStub,
    } = createMountedWrapper();
    await getQueryToolStudyParticipantStub();
    await getParticipantDataFactStub();
    await getToggledFeaturesFactStub();
    await checkEDCMilestonesFactStub();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
