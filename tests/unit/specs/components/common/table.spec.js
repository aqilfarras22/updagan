import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';
import tableComponent from '@/components/common/table';
import { mount, createLocalVue } from '@vue/test-utils';

const sandbox = sinon.createSandbox();
const { it, describe, expect, afterEach } = global;

const localVue = createLocalVue();

localVue.use(BootstrapVue);

describe('components/common/table.vue', () => {
  const fields = [{ key: 'id', label: 'ID' }, { key: 'label', label: 'Label' }];
  const firstItem = { id: 1, label: 'test' };
  const secondItem = { id: 2, label: 'mock' };
  const thirdItem = { id: 3, label: 'spy' };

  const itemRowSelector = 'tbody tr';
  const pageSelector = '[aria-label=Pagination] li';
  const pageLinkSelector = `${pageSelector} a[role="menuitemradio"]`;
  const itemsTotalSelector = '[role=itemstotal]';
  const filterSelector = '[role=itemsfilter]';
  const filterInputSelector = `${filterSelector} input[type=text]`;
  const filterSelectSelector = `${filterSelector} select`;
  const filterSelectOptionsSelector = `${filterSelector} select option`;
  const headerColumnSelector = 'thead th';

  const createMountedWrapper = (mountOptions = {}) => {
    let wrapperOptions = {
      localVue,
      propsData: {
        fields,
        items: [firstItem, secondItem, thirdItem],
      },
      stubs: {
        'b-input-group-button': { name: 'b-input-group-button', render: h => h('b') },
      },
    };

    Object.keys(mountOptions).forEach(optionKey => {
      if (Object.keys(mountOptions[optionKey]).length) {
        wrapperOptions = {
          ...wrapperOptions,
          [optionKey]: {
            ...(wrapperOptions[optionKey] || {}),
            ...mountOptions[optionKey],
          },
        };
      } else {
        wrapperOptions[optionKey] = {};
      }
    });

    return mount(tableComponent, wrapperOptions);
  };

  const changeFormElementValue = (formElement, newValue) => {
    formElement.element.setAttribute('value', newValue);
    formElement.trigger('change');
  };

  afterEach(() => {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it('should not create if required props items and fields were not passed', () => {
    const mockedLogger = sandbox.stub(console, 'error');
    const wrapper = createMountedWrapper({ propsData: {} });

    const expectedErrorsCount = 2;
    const expectedErrors = ['Missing required prop: "fields"', 'Missing required prop: "items"'];

    const actualErrorsCount = mockedLogger.callIds
      .map(callId => mockedLogger.getCall(callId).args[0])
      .filter(actualError => expectedErrors.reduce(
        (errorCount, expectedError) => errorCount + Number(String(actualError)
          .indexOf(expectedError) > -1),
        0,
      ),
      ).length;

    expect(actualErrorsCount).toBe(expectedErrorsCount);
    expect(wrapper.text()).toBe('');
  });

  it('should show empty table if no items passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        items: [],
      },
    });

    expect(wrapper.findAll('tr').length).toBe(1);
    expect(wrapper.text().trim()).toBe(fields[0].label + fields[1].label);
  });

  it('should show items that passed', () => {
    const wrapper = createMountedWrapper();

    const renderedTableRows = wrapper.findAll(itemRowSelector);
    expect(renderedTableRows.length).toBe(3);
    expect(renderedTableRows.at(0).text()).toBe(firstItem.id + firstItem.label);
    expect(renderedTableRows.at(1).text()).toBe(secondItem.id + secondItem.label);
    expect(renderedTableRows.at(2).text()).toBe(thirdItem.id + thirdItem.label);
  });

  it('should show items when item provider passed', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        items: () => [firstItem, secondItem, thirdItem],
      },
    });

    wrapper.vm.$nextTick().then(() => {
      const renderedTableRows = wrapper.findAll(itemRowSelector);
      expect(renderedTableRows.length).toBe(3);
      expect(renderedTableRows.at(0).text()).toBe(firstItem.id + firstItem.label);
      expect(renderedTableRows.at(1).text()).toBe(secondItem.id + secondItem.label);
      expect(renderedTableRows.at(2).text()).toBe(thirdItem.id + thirdItem.label);

      done();
    });
  });

  it('should show items at first page by default', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 1,
      },
    });

    const renderedTableRows = wrapper.findAll(itemRowSelector);
    expect(renderedTableRows.length).toBe(1);
    expect(renderedTableRows.at(0).text()).toBe(firstItem.id + firstItem.label);
  });

  it('should show correct items at current page', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 1,
        currentPage: 2,
      },
    });

    const renderedTableRows = wrapper.findAll(itemRowSelector);
    expect(renderedTableRows.length).toBe(1);
    expect(renderedTableRows.at(0).text()).toBe(secondItem.id + secondItem.label);
  });

  it('should not show pagination if such option not passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 1,
      },
    });

    expect(wrapper.findAll(pageLinkSelector).length).toBe(0);
  });

  it('should show pagination if such option passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        showPagination: true,
        perPage: 1,
      },
    });

    expect(wrapper.findAll(pageLinkSelector).length).toBe(3);
  });

  it('should show pagination with selected current page', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        showPagination: true,
        perPage: 1,
        currentPage: 2,
      },
    });

    expect(wrapper.findAll(pageLinkSelector).length).toBe(3);
    expect(wrapper.find(`${pageSelector}.active`).text()).toBe('2');
  });

  it('should show pages according to passed totalItems', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        showPagination: true,
        perPage: 2,
        totalItems: 10,
      },
    });

    expect(wrapper.findAll(pageLinkSelector).length).toBe(5);
  });

  it('should show pages according to passed totalItems', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        showPagination: true,
        perPage: 2,
        totalItems: 10,
      },
    });

    expect(wrapper.findAll(pageLinkSelector).length).toBe(5);
  });

  it('should not show total items count if such option is not passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 2,
      },
    });

    expect(wrapper.findAll(itemsTotalSelector).length).toBe(0);
  });

  it('should show total items count if such option passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 2,
        showTotal: true,
        printTotalFormatter: total => total,
      },
    });

    expect(wrapper.findAll(itemRowSelector).length).toBe(2);
    expect(wrapper.find(itemsTotalSelector).text()).toBe('3');
  });

  it('should show total items count according to passed totalItems prop', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        perPage: 20,
        showTotal: true,
        printTotalFormatter: total => total,
        totalItems: 10,
      },
    });

    expect(wrapper.findAll(itemRowSelector).length).toBe(3);
    expect(wrapper.find(itemsTotalSelector).text()).toBe('10');
  });

  it('should show filtered items by default if such prop passed', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        filter: 'spy',
        showFilter: true,
      },
    });

    expect(wrapper.findAll(itemRowSelector).length).toBe(1);
  });

  it('should not show filter input if such prop is not passed', () => {
    const wrapper = createMountedWrapper();

    expect(wrapper.findAll(filterSelector).length).toBe(0);
    expect(wrapper.findAll(filterInputSelector).length).toBe(0);
    expect(wrapper.findAll(filterSelectSelector).length).toBe(0);
  });

  it('should show filtered items after typing in filter input', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        showFilter: true,
        filter: '',
      },
    });

    expect(wrapper.findAll(itemRowSelector).length).toBe(3);
    expect(wrapper.find(filterInputSelector).element.value).toBe('');

    changeFormElementValue(wrapper.find(filterInputSelector), 'mock');

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.findAll(itemRowSelector).length).toBe(1);
      expect(wrapper.find(filterInputSelector).element.value).toBe('mock');

      done();
    });
  });

  it('should show select filter if filter options passed in props', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        showFilter: true,
        filter: '',
        filterOptions: ['', 'test', 'mock', 'spy'],
      },
    });

    expect(wrapper.findAll(filterInputSelector).length).toBe(0);
    expect(wrapper.findAll(filterSelectSelector).length).toBe(1);
    expect(wrapper.findAll(filterSelectOptionsSelector).length).toBe(4);
  });

  it('should show filtered items after selecting filter option', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        showFilter: true,
        filter: '',
        filterOptions: ['', 'test', 'mock', 'spy'],
      },
    });

    expect(wrapper.findAll(itemRowSelector).length).toBe(3);
    expect(wrapper.find(filterSelectSelector).element.value).toBe('');

    wrapper.find(filterSelectSelector).element.value = 'test';
    wrapper.find(filterSelectSelector).trigger('change');

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.findAll(itemRowSelector).length).toBe(1);
      expect(wrapper.find(filterSelectSelector).element.value).toBe('test');

      done();
    });
  });

  it('should change page count if filter was applied', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        showFilter: true,
        showPagination: true,
        filter: '',
        perPage: 2,
        currentPage: 1,
      },
    });
    wrapper.find(filterInputSelector).element.setAttribute('value', 's');

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.findAll(pageLinkSelector).length).toBe(2);
      expect(wrapper.findAll(itemRowSelector).length).toBe(2);

      done();
    });
  });

  it('should sort items when sort field is specified', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        sortBy: 'label',
      },
    });

    // sorted in following order: mock, spy, test
    const renderedTableRows = wrapper.findAll(itemRowSelector);
    expect(renderedTableRows.at(0).text()).toBe(secondItem.id + secondItem.label);
    expect(renderedTableRows.at(1).text()).toBe(thirdItem.id + thirdItem.label);
    expect(renderedTableRows.at(2).text()).toBe(firstItem.id + firstItem.label);
  });

  it('should sort items in descending order when such is specified', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        sortBy: 'label',
        sortDesc: true,
      },
    });

    // sorted in descending order: test, spy, mock
    const renderedTableRows = wrapper.findAll(itemRowSelector);
    expect(renderedTableRows.at(0).text()).toBe(firstItem.id + firstItem.label);
    expect(renderedTableRows.at(1).text()).toBe(thirdItem.id + thirdItem.label);
    expect(renderedTableRows.at(2).text()).toBe(secondItem.id + secondItem.label);
  });

  it('should change item sorting when click on the column header', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        sortBy: 'label',
        fields: [{ ...fields[0], sortable: true }, { ...fields[1], sortable: true }],
      },
    });

    const renderedTableRows = wrapper.findAll(itemRowSelector);
    // sorted in ascending order: mock, spy, test
    expect(renderedTableRows.at(0).text()).toBe(secondItem.id + secondItem.label);
    expect(renderedTableRows.at(1).text()).toBe(thirdItem.id + thirdItem.label);
    expect(renderedTableRows.at(2).text()).toBe(firstItem.id + firstItem.label);

    // click to apply sorting in descending order
    wrapper
      .findAll(headerColumnSelector)
      .at(1)
      .trigger('click');

    wrapper.vm.$nextTick().then(() => {
      // sorted in descending order: test, spy, mock
      expect(renderedTableRows.at(0).text()).toBe(firstItem.id + firstItem.label);
      expect(renderedTableRows.at(1).text()).toBe(thirdItem.id + thirdItem.label);
      expect(renderedTableRows.at(2).text()).toBe(secondItem.id + secondItem.label);

      done();
    });
  });

  // it('should apply field formatting when slots are provided', () => {
  //   const replacedIdField = 'id';

  //   const wrapper = createMountedWrapper({
  //     slots: {
  //       id: replacedIdField,
  //     },
  //   });

  //   const renderedTableRows = wrapper.findAll(itemRowSelector);
  //   expect(renderedTableRows.length).toBe(3);
  //   expect(renderedTableRows.at(0).text()).toBe(`1${firstItem.label}`);
  //   expect(renderedTableRows.at(1).text()).toBe(`2${secondItem.label}`);
  //   expect(renderedTableRows.at(2).text()).toBe(`3${thirdItem.label}`);
  // });

  it('should fire rowClicked event when user clicks on row', done => {
    const wrapper = createMountedWrapper();

    wrapper
      .findAll(itemRowSelector)
      .at(1)
      .trigger('click');
    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.emitted('rowClicked')[0][0]).toBe(secondItem);

      done();
    });
  });

  it('should fire rowHovered event when user hovers row', done => {
    const wrapper = createMountedWrapper();

    wrapper
      .findAll(itemRowSelector)
      .at(1)
      .trigger('mouseenter');
    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.emitted('rowHovered')[0][0]).toBe(secondItem);

      done();
    });
  });

  const testContextChangedEvent = (done, fieldToCheck, fieldValue) => {
    const wrapper = createMountedWrapper({
      propsData: { perPage: 1, currentPage: 1, sortBy: 'label', sortDesc: false, filter: '' },
    });

    wrapper.vm[fieldToCheck] = fieldValue;

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.emitted('contextChanged')[0][0][fieldToCheck]).toBe(fieldValue);

      done();
    });
  };

  it('should fire contextChanged event when per page items count is changed', done => {
    testContextChangedEvent(done, 'perPage', 2);
  });

  it('should fire contextChanged event when current page is changed', done => {
    testContextChangedEvent(done, 'currentPage', 3);
  });

  it('should fire contextChanged event when filter is changed', done => {
    testContextChangedEvent(done, 'filter', 'dd');
  });

  it('should fire contextChanged event when sort field is changed', done => {
    testContextChangedEvent(done, 'sortBy', 'id');
  });

  it('should fire contextChanged event when sort direction is changed', done => {
    testContextChangedEvent(done, 'sortDesc', true);
  });

  it('should fire sortChanged event when click on the column header', done => {
    const wrapper = createMountedWrapper({
      propsData: {
        fields: [{ ...fields[0], sortable: true }, { ...fields[1], sortable: true }],
      },
    });

    wrapper
      .findAll(headerColumnSelector)
      .at(1)
      .trigger('click');

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.emitted('sortChanged')[0][0].sortBy).toBe('label');
      expect(wrapper.emitted('sortChanged')[0][0].sortDesc).toBe(false);

      done();
    });
  });

  it('should fire refreshed event when item provider returns items', () => {
    const wrapper = createMountedWrapper({
      propsData: {
        items: () => [firstItem, secondItem, thirdItem],
      },
    });

    expect(wrapper.emitted('refreshed')).toBeInstanceOf(Array);
  });

  const testItemProviderReceivedCorrectProps = (done, fieldToCheck, fieldValue) => {
    const itemProvider = sinon.spy(() => [firstItem, secondItem, thirdItem]);

    const propsData = {
      items: itemProvider,
      perPage: 1,
      currentPage: 1,
      sortBy: 'label',
      sortDesc: false,
      filter: '',
    };

    const wrapper = createMountedWrapper({ propsData });

    wrapper.vm[fieldToCheck] = fieldValue;

    wrapper.vm.$nextTick().then(() => {
      expect(itemProvider.firstCall.args[0][fieldToCheck]).toBe(propsData[fieldToCheck]);
      expect(itemProvider.secondCall.args[0][fieldToCheck]).toBe(fieldValue);

      done();
    });
  };

  it('should call item provider when per page items count is changed', done => {
    testItemProviderReceivedCorrectProps(done, 'perPage', 2);
  });

  it('should call item provider when current page is changed', done => {
    testItemProviderReceivedCorrectProps(done, 'currentPage', 2);
  });

  it('should call item provider when filter is changed', done => {
    testItemProviderReceivedCorrectProps(done, 'filter', 'dd');
  });

  it('should call item provider when sort field is changed', done => {
    testItemProviderReceivedCorrectProps(done, 'sortBy', 'id');
  });

  it('should call item provider when sort order is changed', done => {
    testItemProviderReceivedCorrectProps(done, 'sortDesc', true);
  });
});
