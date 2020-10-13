<template>
  <div class="documents-list">
    <div class="docs-card">
      <h4 class="main-heading fw-600 pl-15" v-if="documents">Documents: {{documents.length}}</h4>
      <table-component class="p-0" :totalrows="totalDocuments" :items="documents" :fields="tableFields">
        <!-- docName -->
        <template slot="docName" slot-scope="data">
          <button class="btn btn-sm btn-link br-30" v-on:click="documentSelected(data.row.item)">{{ data.row.item.docName }}</button>
        </template>
        <!-- status -->
        <template slot="status" slot-scope="data" v-if="data.row.item.status">
          <div>
            <b-btn variant="outline-secondary" class="br-30" v-if="data.row.item.status == 'SignatureNotRequested' || data.row.item.status == 'RequestedSignature'" @click="showReqSignModal(data.row.item)" :disabled="user.userRole === 'Cra' || user.userRole === 'SiteDataLock'">
              <span v-if="data.row.item.status == 'SignatureNotRequested'">Request Signature</span>
              <span v-if="data.row.item.status == 'RequestedSignature'">Resend Document</span>
            </b-btn>
          </div>
          <span v-if="data.row.item.isParticipantSigned">{{new Date(data.row.item.participantSignedTime) | formatGMTDate}}</span>
        </template>
        <template slot="isPISigned" slot-scope="data" >
          <div v-if="data.row.item.isPISignRequired">
            <span class="pi-sign-color" v-if="!data.row.item.isPISigned">Not Signed</span>
            <span v-if="data.row.item.isPISigned">{{ new Date(data.row.item.piSignedTime) | formatGMTDate }}</span>
          </div>
          <div v-if="!data.row.item.isPISignRequired">
            <span class="pi-sign-color">N/A</span>
          </div>
        </template>
        <template slot="" slot-scope="data">
        </template>
      </table-component>
    </div>
    <!-- Modal Component -->
    <b-modal ref="reqSignModalRef" id="requestSignModal" hide-footer hide-header>
      <p class="fs-16 p-10">Are you sure you want to request signature for
        <b>{{selectedDoc.docName}}</b>?</p>
      <b-col cols="10" offset="1" class="pt-10">
        <b-btn class="br-30" variant="primary" block @click="requestSignature()">Yes, send request</b-btn>
      </b-col>
      <b-col cols="10" offset="1" class="pb-20">
        <b-btn class="mt-20 br-30" size="md" variant="secondary" block @click="hideModal">No, do not send request</b-btn>
      </b-col>
    </b-modal>
  </div>
</template>

<script>
import TableComponent from '@/components/common/table';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'DocumentsList',
  components: { TableComponent },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      documents: [],
      totalDocuments: 0,
      tableFields: [{ key: 'docName', label: 'DOCUMENT NAME' }, { key: 'status', label: 'PARTICIPANT SIGNED ON', sortable: true }, { key: 'isPISigned', label: 'PI SIGNED ON' }],
      selectedDoc: {},
    };
  },
    computed: {
    ...mapGetters(['user'])
  },
  methods: {
    showReqSignModal(doc) {
      this.selectedDoc = doc;
      this.$refs.reqSignModalRef.show();
    },
    getDocuments() {
      const docObj = { studyId: this.studyId, participantId: this.participantId };
      this.$api.documentsListFact(docObj).then(
        response => {
          this.documents = response.body;
          this.totalDocuments = this.documents.length;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting documents.');
        },
      );
    },
    documentSelected(document) {
      this.$router.push({ name: 'document-details', params: { studyId: this.studyId, participantId: this.participantId, documentId: document.docId } });
    },
    requestSignature() {
      let currentDate = new Date();
      const docData = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.selectedDoc.docId,
        reqSignDate:moment.utc(currentDate).format()
      };
      this.$api.requestSignatureFact(docData).then(
        () => {
          this.getDocuments();
          this.$toastr.success('Request for signature sent');
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting documents.');
        },
      );
      this.hideModal();
    },
    hideModal() {
      this.$refs.reqSignModalRef.hide();
    },
  },
  mounted() {
    this.getDocuments();
  },
};
</script>

<style scoped lang="scss">
.documents-list {
  .docs-card {
    width: 100%;
    background-color: #fff;
    padding: 12px 0 0 0;
    border: 1px solid #d4d9e2;
  }

  .table-column {
    width: 100%;
    background-color: #fff;
    height: 100%;
    padding: 16px;
    color: #4a4a4a;
  }

  .main-heading {
    color: #666669;
    font-size: 18px;
  }
  /deep/ .table th {
    border-top: none !important;
    min-width: 120px !important;
    max-width: 150px !important;
  }

  .doc-name {
    color: #4c8ce4 !important;
  }

  .pi-sign-color {
    text-align: left;
    color: #f16559;
  }

  /deep/ .col {
    padding: 0px;
  }

  .btn-outline-secondary:focus,
  .btn-outline-secondary.focus {
    box-shadow: none !important;
  }

  .btn-outline-secondary:not(:disabled):not(.disabled):active,
  .btn-outline-secondary:not(:disabled):not(.disabled).active,
  .show > .btn-outline-secondary.dropdown-toggle {
    color: #fff;
    background-color: #9fb1b8 !important;
    border-color: #9fb1b8 !important;
  }
}
</style>
