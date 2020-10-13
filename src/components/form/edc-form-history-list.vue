<template>
  <table-component
    showEmpty
    noGutters
    :items="history"
    :fields="formHistoryFields"
  >
    <!-- date -->
    <template slot="createdAt" slot-scope="data">
      {{ new Date(data.row.item.createdAt) | formatUTCDate }}
    </template>
    <!-- action -->
    <template slot="eventType" slot-scope="data">
      {{ data.row.item.primaryReason && data.row.item.primaryReason!='' ? data.row.item.primaryReason : (verificationStatusText[data.row.item.eventType] || approvalStatusText[data.row.item.eventType] || historyStatusText[data.row.item.eventType]) }}
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
    history: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      approvalStatusText,
      verificationStatusText,
      historyStatusText,
      historyStatus,
      formHistoryFields: [
        {
          key: 'createdAt',
          label: 'Date',
          sortable: true,
        },
        {
          key: 'eventType',
          label: 'Action / Changes',
          sortable: true,
        },
        {
          key: 'createdBy',
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
