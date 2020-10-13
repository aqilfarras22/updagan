<template>
  <table-component
    showEmpty
    noGutters
    :items="history"
    :fields="formHistoryFields"
  >
    <!-- date -->
    <template slot="createdOn" slot-scope="data">
      {{ new Date(data.row.item.createdOn) | formatGMTDate }}
    </template>
    <!-- action -->
    <template slot="eventType" slot-scope="data">
      {{ verificationStatusText[data.row.item.eventType] || approvalStatusText[data.row.item.eventType] || historyStatusText[data.row.item.eventType] }}
    </template>
    <!-- view -->
    <template slot="view" slot-scope="data">
      <a v-if="historyStatus.MODIFIED === data.row.item.eventType" @click.prevent="view(data.row.item)" href="">View</a>
    </template>
  </table-component>
</template>

<script>
import TableComponent from '@/components/common/table';
import {
  approvalStatusText,
  verificationStatusText,
  historyStatusText,
  historyStatus,
} from '@/constants/form';

export default {
  name: 'form-history-list',
  components: {
    TableComponent,
  },
  props: {
    history: Array,
  },
  data() {
    return {
      approvalStatusText,
      verificationStatusText,
      historyStatusText,
      historyStatus,
      formHistoryFields: [
        {
          key: 'createdOn',
          label: 'Date',
          sortable: true,
        },
        {
          key: 'eventType',
          label: 'Action',
          sortable: true,
        },
        {
          key: 'issuer',
          label: 'By',
          sortable: true,
        },
        {
          key: 'view',
          label: ' ',
        },
      ],
    };
  },
  methods: {
    view(item) {
      this.$emit('view', item);
    },
  },
};
</script>
