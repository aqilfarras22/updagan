import { storiesOf } from '@storybook/vue';
import { withKnobs, array, text, boolean, number, object } from '@storybook/addon-knobs/vue';
import TableComponent from '@/components/common/table';

const story = storiesOf('Common/Table', module);

story.addDecorator(withKnobs);

story.add('Table (items as array)', () => ({
  components: { TableComponent },
  data() {
    const items = [
      object('first item', {
        id: '5a5f32f36e0ebeadfc25e7ab',
        isActive: false,
        age: 24,
        name: 'Florence Wallace',
      }),
      object('second item', {
        id: '5a5f32f343bf835091c58156',
        isActive: false,
        age: 25,
        name: 'Mckenzie Hunter',
      }),
      object('third item', {
        id: '5a5f32f30d1123367198aeb2',
        isActive: true,
        age: 36,
        name: 'Fitzgerald Gaines',
      }),
    ];

    const fields = [
      object('id field definition', { key: 'id', label: 'ID', sortable: true }),
      object('name field definition', { key: 'name', label: 'Name', sortable: true }),
      object('age field definition', { key: 'age', label: 'Age', sortable: true }),
      object('isActive field definition', { key: 'isActive', label: 'Is Active', sortable: true }),
    ];

    return {
      items,
      fields,
      perPage: number('Items per page to show', 2),
      currentPage: number('Current page', 1),
      sortBy: text('Field to sort by', ''),
      totalItems: number('Provide explicitly total items count', undefined),
      sortDesc: boolean('Whether to user descending direction for sorting', false),
      filter: text('Filter value', ''),
      filterUseSelectInsteadInput: boolean('Filter use select instead input', false),
      filterOptions: array('Select filter options', ['', 'wallace', 'hunter', 'gaines']),
      showTotal: boolean('Whether to show total items count', true),
      showFilter: boolean('Whether to show filter input/select', true),
      showPagination: boolean('Whether to show pagination block', true),
      filterPlaceholderMessage: text('Filter placeholder message', 'Type to Search'),
      filterLabelMessage: text('Filter label mesage', 'Filter'),
    };
  },
  template: `
    <b-container fluid>
      <br />
      <b-row>
        <b-col>
          <TableComponent
            :items="items"
            :fields="fields"
            :perPage="perPage"
            :currentPage="currentPage"
            :totalItems="totalItems"
            :sortBy="sortBy"
            :sortDesc="sortDesc"
            :filter="filter"
            :filterOptions="filterUseSelectInsteadInput ? filterOptions : null"
            :showTotal="showTotal"
            :showFilter="showFilter"
            :showPagination="showPagination"
            :filterPlaceholderMessage="filterPlaceholderMessage"
            :filterLabelMessage="filterLabelMessage"
          />
        </b-col>
      </b-row>
    </b-container>
  `,
}));
