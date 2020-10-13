<template>
  <div class="document-details-history">
    <div class="row p-16">
      <div class="col-lg-3 col-md-3 col-sm-4 col-xs-4 p-0">
        <DocumentSidenav v-bind="documentDetails"></DocumentSidenav>
        <ParticipantInfo :participantDetails="participantDetails"></ParticipantInfo>
      </div>
      <div class="col-lg-9 col-md-9 col-sm-8 col-xs-8 pr-0">
        <b-card class="card-section">
          <navTabs :routes="navBarRoutes" :replaceHistory="true" />
          <router-view :studyId="studyId" :participantId="participantId" :documentId="documentId" :participantDetails="participantDetails" :documentDetails="documentDetails"></router-view>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import navTabs from '@/components/common/nav-tabs';
import signatureStatuses from '@/constants/signatureStatuses';
import ParticipantInfo from '../participant-info';
import DocumentSidenav from './document-sidenav';

export default {
  name: 'document-details-history',
  components: { ParticipantInfo, DocumentSidenav, navTabs },
  data() {
    return {
      participantDetails: null,
      documentDetails: null,
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      documentId: this.$route.params.documentId,
      signatureStatuses,
    };
  },
  computed: {
    ...mapGetters(['getSignatureStatus']),
    navBarRoutes() {
      return [
        {
          label: 'Document',
          to: {
            name: 'document-details',
            params: {
              studyId: this.studyId,
              participantId: this.participantId,
              documentId: this.documentId,
            },
          },
        },
        {
          label: 'History',
          to: {
            name: 'document-history',
            params: {
              studyId: this.studyId,
              participantId: this.participantId,
              documentId: this.documentId,
            },
          },
        },
      ];
    },
  },
  watch: {
    getSignatureStatus: {
      handler(val) {
        if (val === this.signatureStatuses.SIGNATURE_COMPLETED) {
          this.$toastr.success('Please wait while we get the updated consent document.');
          this.getParticipantDetails();
          this.getDocumentDetails();
        }
      },
    },
  },
  methods: {
    getParticipantDetails() {
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
        response => {
          this.participantDetails = response.body;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
        },
      );
    },
    getDocumentDetails() {
      const docObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        documentId: this.documentId,
      };
      this.$api.getDocumentDetailsFact(docObj).then(
        response => {
          this.documentDetails = response.body;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
        },
      );
    },
  },
  mounted() {
    this.getParticipantDetails();
    this.getDocumentDetails();
  },
};
</script>

<style scoped>
.document-details-history {
  background-color: #f5f8fa !important;
}
.card-section .card-body {
  padding: 0;
}
</style>
