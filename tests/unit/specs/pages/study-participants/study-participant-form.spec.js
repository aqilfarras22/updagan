import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import studyParticipantsFormPage from '@/pages/study-participants/study-participant-form';
import { formFieldQueryStatus } from '@/constants/form';

const { it, describe, expect } = global;

describe('pages/study-participants/study-participant-details.vue', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  const studyIdProp = '100';
  const formId = 111;

  const createMountedWrapper = testMocks => {
    const getQueryToolStudyFormResponse = {
      generalInfo: { name: 'name' },
      participant: { name: 'name' },
      sections: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      dataQueries: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    };

    const getQueryToolStudyFormHistoryResponse = [];

    const getQueryToolStudyFormStub = jest.fn().mockResolvedValue(getQueryToolStudyFormResponse);
    const getQueryToolStudyFormHistoryStub = jest
      .fn()
      .mockResolvedValue(getQueryToolStudyFormHistoryResponse);

    const routerGoStub = jest.fn();
    const toastrSuccessStub = jest.fn();
    const setQueryToolFormQueryStatusStub = jest.fn().mockResolvedValue({});
    const getQueryToolStudyFormHistoryVersionStub = jest.fn().mockResolvedValue({});
    const addQueryToolFormQueryCommentStub = jest.fn().mockResolvedValue({});
    const addQueryToolFieldQueryStub = jest.fn().mockResolvedValue({});
    const saveQueryToolStudyFormStub = jest.fn().mockResolvedValue({});
    const vueAclCheckStub = jest.fn().mockResolvedValue({});
    const vueAclChangeStub = jest.fn().mockResolvedValue({});
    return {
      wrapper: shallowMount(studyParticipantsFormPage, {
        localVue,
        propsData: {
          studyId: studyIdProp,
        },
        mocks: {
          $api: {
            getQueryToolStudyForm: getQueryToolStudyFormStub,
            getQueryToolStudyFormHistory: getQueryToolStudyFormHistoryStub,
            setQueryToolFormQueryStatus: setQueryToolFormQueryStatusStub,
            getQueryToolStudyFormHistoryVersion: getQueryToolStudyFormHistoryVersionStub,
            addQueryToolFormQueryComment: addQueryToolFormQueryCommentStub,
            addQueryToolFieldQuery: addQueryToolFieldQueryStub,
            saveQueryToolStudyForm: saveQueryToolStudyFormStub,
          },
          $toastr: {
            success: toastrSuccessStub,
          },
          $route: {
            params: {
              formId,
            },
          },
          $router: {
            go: routerGoStub,
          },
          $acl: {
            check: vueAclCheckStub,
            change: vueAclChangeStub,
          },
          ...testMocks,
        },
        stubs: {
          ParticipantInfo: { name: 'ParticipantInfo', render: h => h('b', 'ParticipantInfoCmp') },
          FormInfo: { name: 'FormInfo', render: h => h('b', 'FormInfoCmp') },
          FormHistoryList: { name: 'FormHistoryList', render: h => h('b', 'FormHistoryListCmp') },
          FormHistoryVersion: {
            name: 'FormHistoryVersion',
            render: h => h('b', 'FormHistoryVersionCmp'),
          },
          FormFieldsList: { name: 'FormFieldsList', render: h => h('b', 'FormFieldsListCmp') },
          FormFieldsEditList: {
            name: 'FormFieldsEditList',
            render: h => h('b', 'FormFieldsEditListCmp'),
          },
          FormQueries: { name: 'FormQueries', render: h => h('b', 'FormQueriesCmp') },
          FormQueriesHeader: {
            name: 'FormQueriesHeader',
            render: h => h('b', 'FormQueriesHeaderCmp'),
          },
          ButtonCmp: { name: 'ButtonCmp', render: h => h('b', 'ButtonCmp') },
        },
      }),
      setQueryToolFormQueryStatusStub,
      addQueryToolFormQueryCommentStub,
      saveQueryToolStudyFormStub,
      addQueryToolFieldQueryStub,
      getQueryToolStudyFormHistoryVersionStub,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormResponse,
      getQueryToolStudyFormHistoryStub,
      getQueryToolStudyFormHistoryResponse,
      routerGoStub,
      toastrSuccessStub,
    };
  };

  it('should create instance', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('should have described child components', () => {
    expect(studyParticipantsFormPage.components.ParticipantInfo).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormInfo).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormHistoryList).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormHistoryVersion).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormFieldsList).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormFieldsEditList).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormQueries).toBeTruthy();
    expect(studyParticipantsFormPage.components.FormQueriesHeader).toBeTruthy();
    expect(studyParticipantsFormPage.components.ButtonCmp).toBeTruthy();
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
    // initial data
    expect(wrapper.vm.tabIndex).toBe(0);
    expect(wrapper.vm.participantInfo).toEqual(null);
    expect(wrapper.vm.formHistory).toEqual(null);
    expect(wrapper.vm.newQuery).toEqual(null);
    expect(wrapper.vm.formHistoryVersion).toEqual(null);
    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.edit).toBe(false);
    expect(wrapper.vm.filterFieldId).toEqual(null);
    expect(wrapper.vm.generalInfo).toEqual(null);
    expect(wrapper.vm.participant).toEqual(null);
    expect(wrapper.vm.sections).toEqual([]);
    expect(wrapper.vm.queries).toEqual([]);
  });

  it('should return computed property: fId', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.fId).toBe(formId);
  });

  it('should return computed property: fieldsWithQueries', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.fieldsWithQueries).toEqual([]);
    const queries = [
      {
        fieldId: 1,
        status: formFieldQueryStatus.OPEN,
      },
      {
        fieldId: 2,
        status: formFieldQueryStatus.CLOSE,
      },
      {
        fieldId: 3,
        status: formFieldQueryStatus.OPEN,
      },
    ];
    wrapper.setData({
      queries,
    });
    expect(wrapper.vm.fieldsWithQueries).toEqual([1, 3]);
  });

  it('should have method which request all required data: getData', async () => {
    const {
      wrapper,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormResponse,
      getQueryToolStudyFormHistoryStub,
      getQueryToolStudyFormHistoryResponse,
    } = createMountedWrapper();
    wrapper.setData({
      isLoading: true,
    });
    // method is called on mount
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormStub).toBeCalledWith({
      fId: formId,
    });
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalledWith({
      fId: formId,
    });

    // getData should change state
    await getQueryToolStudyFormStub();
    await getQueryToolStudyFormHistoryStub();

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.generalInfo).toEqual(getQueryToolStudyFormResponse.generalInfo);
    expect(wrapper.vm.sections).toEqual(getQueryToolStudyFormResponse.sections);
    expect(wrapper.vm.queries).toEqual(getQueryToolStudyFormResponse.dataQueries);
    expect(wrapper.vm.participantInfo).toEqual(getQueryToolStudyFormResponse.participant);
    expect(wrapper.vm.formHistory).toEqual(getQueryToolStudyFormHistoryResponse);
  });

  it('should have method which reopen query: onQueryReopened', async () => {
    const {
      wrapper,
      setQueryToolFormQueryStatusStub,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
      toastrSuccessStub,
    } = createMountedWrapper();
    const query = {
      queryId: 1,
    };
    wrapper.vm.onQueryReopened(query);

    expect(setQueryToolFormQueryStatusStub).toBeCalled();
    expect(setQueryToolFormQueryStatusStub).toBeCalledWith({
      qId: query.queryId,
      patchId: 'open',
    });

    await setQueryToolFormQueryStatusStub();

    // should notify
    expect(toastrSuccessStub).toBeCalled();
    expect(toastrSuccessStub).toBeCalledWith('Query reopened');

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method which close query: onQueryClosed', async () => {
    const {
      wrapper,
      setQueryToolFormQueryStatusStub,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
      toastrSuccessStub,
    } = createMountedWrapper();
    const query = {
      queryId: 1,
    };
    wrapper.vm.onQueryClosed(query);

    expect(setQueryToolFormQueryStatusStub).toBeCalled();
    expect(setQueryToolFormQueryStatusStub).toBeCalledWith({
      qId: query.queryId,
      patchId: 'close',
    });

    await setQueryToolFormQueryStatusStub();

    // should notify
    expect(toastrSuccessStub).toBeCalled();
    expect(toastrSuccessStub).toBeCalledWith('Query closed');

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method which get form history version: viewHistoryForm', async () => {
    const { wrapper, getQueryToolStudyFormHistoryVersionStub } = createMountedWrapper();
    expect(wrapper.vm.formHistoryVersion).toEqual(null);
    wrapper.vm.viewHistoryForm({ versionId: 1 });

    await getQueryToolStudyFormHistoryVersionStub();

    expect(getQueryToolStudyFormHistoryVersionStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryVersionStub).toBeCalledWith({
      vId: 1,
      fId: formId,
    });
    expect(wrapper.vm.formHistoryVersion).toEqual({});
  });

  it('should have method which post a comment: createComment', async () => {
    const {
      wrapper,
      addQueryToolFormQueryCommentStub,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();
    wrapper.vm.createComment({ comment: 'comment' });

    await addQueryToolFormQueryCommentStub();

    expect(addQueryToolFormQueryCommentStub).toBeCalled();
    expect(addQueryToolFormQueryCommentStub).toBeCalledWith({ comment: 'comment' });

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method which save form: saveForm', async () => {
    const {
      wrapper,
      saveQueryToolStudyFormStub,
      getQueryToolStudyFormStub,
      toastrSuccessStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();

    const form = {
      sections: [],
      primaryReason: 'reason',
    };
    wrapper.setData({
      edit: true,
    });
    wrapper.vm.saveForm(form);

    await saveQueryToolStudyFormStub();

    expect(saveQueryToolStudyFormStub).toBeCalled();
    expect(saveQueryToolStudyFormStub).toBeCalledWith({ fId: formId }, form);

    expect(wrapper.vm.edit).toBe(false);

    // should notify
    expect(toastrSuccessStub).toBeCalled();
    expect(toastrSuccessStub).toBeCalledWith('Edits saved');

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method which post a query: createQuery', async () => {
    const {
      wrapper,
      addQueryToolFieldQueryStub,
      getQueryToolStudyFormStub,
      toastrSuccessStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();

    wrapper.vm.createQuery({ comment: 'comment' });

    await addQueryToolFieldQueryStub();

    expect(addQueryToolFieldQueryStub).toBeCalled();
    expect(addQueryToolFieldQueryStub).toBeCalledWith({ comment: 'comment' });

    // should notify
    expect(toastrSuccessStub).toBeCalled();
    expect(toastrSuccessStub).toBeCalledWith('Query created');

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method to handle verification confirmation: verificationConfirmed', () => {
    const {
      wrapper,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();
    wrapper.setData({
      generalInfo: { verificationStatus: false },
    });
    wrapper.vm.verificationConfirmed(true);
    expect(wrapper.vm.generalInfo.verificationStatus).toBe(true);
    wrapper.vm.verificationConfirmed(false);
    expect(wrapper.vm.generalInfo.verificationStatus).toBe(false);

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method to handle approval confirmation: approvalConfirmed', () => {
    const {
      wrapper,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();
    wrapper.setData({
      generalInfo: { approvalStatus: false },
    });
    wrapper.vm.approvalConfirmed(true);
    expect(wrapper.vm.generalInfo.approvalStatus).toBe(true);
    wrapper.vm.approvalConfirmed(false);
    expect(wrapper.vm.generalInfo.approvalStatus).toBe(false);

    // should update page data
    expect(getQueryToolStudyFormStub).toBeCalled();
    expect(getQueryToolStudyFormHistoryStub).toBeCalled();
  });

  it('should have method which cancel edit mode: cancelEdit', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      edit: true,
    });
    wrapper.vm.cancelEdit();
    expect(wrapper.vm.edit).toBe(false);
  });

  it('should have method which set field id to new query: openQuery', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.newQuery).toEqual(null);
    wrapper.vm.openQuery(1);
    expect(wrapper.vm.newQuery).toBe(1);
  });
  it('should have method which reset history mode: historyBack', () => {
    const { wrapper } = createMountedWrapper();
    wrapper.setData({
      formHistoryVersion: 1,
    });
    wrapper.vm.historyBack();
    expect(wrapper.vm.formHistoryVersion).toEqual(null);
  });

  it('should have method which set filtered field: filterByField', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.filterFieldId).toEqual(null);
    wrapper.vm.filterByField(1);
    expect(wrapper.vm.filterFieldId).toBe(1);
  });

  it('should have method which reset filtered field: resetFilter', () => {
    const { wrapper } = createMountedWrapper();
    expect(wrapper.vm.filterFieldId).toEqual(null);
    wrapper.vm.filterByField(1);
    expect(wrapper.vm.filterFieldId).toBe(1);
    wrapper.vm.resetFilter();
    expect(wrapper.vm.filterFieldId).toEqual(null);
  });

  it('should have method which route to previous page: goToPreviousScreen', () => {
    const { wrapper, routerGoStub } = createMountedWrapper();
    wrapper.vm.goToPreviousScreen();
    expect(routerGoStub).toBeCalled();
    expect(routerGoStub).toBeCalledWith(-1);
  });

  it('should has the expected html structure', async () => {
    const {
      wrapper,
      getQueryToolStudyFormStub,
      getQueryToolStudyFormHistoryStub,
    } = createMountedWrapper();
    await getQueryToolStudyFormStub();
    await getQueryToolStudyFormHistoryStub();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
