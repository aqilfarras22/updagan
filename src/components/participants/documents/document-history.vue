<template>
  <div class="document-history">
    <div class=" p-0">
      <table-component class="p-0" noGutters tableWrapperComponent="b-card" :items="history" :fields="tableFields">
        <!-- statusDate -->
        <template slot="eventTime" slot-scope="data">
          {{ new Date(data.row.item.eventTime) | formatGMTDate }}
        </template>
        <!-- action -->
        <template slot="eventName" v-if="data.row.item.eventName" slot-scope="data">
          <span v-if="data.row.item.eventName == getDocumentEventStatuses.REQUESTED_SIGNATURE">Sent to participant</span>
          <span v-if="data.row.item.eventName == getDocumentEventStatuses.SIGNED_BY_PARTICIPANT">Signed by participant</span>
          <span v-if="data.row.item.eventName == getDocumentEventStatuses.SIGNED_BY_PI">Signed by PI</span>
          <span v-if="data.row.item.eventName == getDocumentEventStatuses.COPY_EMAIL_TO_PARTICIPANT">Copy emailed to participant</span>
        </template>
        <!-- by -->
        <template slot="eventLoggedBy" slot-scope="data">{{ data.row.item.eventLoggedBy }}</template>
      </table-component>
    </div>
  </div>
</template>

<script>
import TableComponent from '@/components/common/table';
import documentEventStatuses from '@/constants/documentStatuses';

export default {
  name: 'document-history',
  components: { TableComponent },
  props: {
    participantDetails: {
      type: Object,
    },
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      docId: this.$route.params.documentId,
      history: [],
    };
  },
  computed: {
    tableFields() {
      const fields = [
        {
          key: 'eventTime',
          label: 'Date',
          sortable: true,
        },
        {
          key: 'eventName',
          label: 'Action',
        },
        {
          key: 'eventLoggedBy',
          label: 'By',
        },
      ];
      return fields;
    },
    getDocumentEventStatuses() {
      return documentEventStatuses;
    },
  },
  methods: {
    getHistory() {
      const docData = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.docId,
      };
      this.$api.documentHistoryFact(docData).then(
        response => {
          this.history = response.body;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting documents.');
        },
      );
    },
  },
  mounted() {
    this.getHistory();
  },
};
</script>

<style scoped lang="scss">
.document-history {
  height: 100%;
}
 /deep/ .col {
  padding: 0px;
}

/deep/ .table th {
  border-top: none !important;
  min-width: 100px !important;
  max-width: 100px !important;
}

/deep/ .table td {
  width: 120px !important;
}

</style>
