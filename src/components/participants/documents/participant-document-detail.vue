<template>
  <div class="document-details-history wrap" :class="{'telehealth-call': telehealthCallStatus}">
    <NavigationBreadcrumb :navigationWidth="navigationWidth" :navigationOptions="navigationOptions" @toggleParticipant="toggleParticipant"></NavigationBreadcrumb>
    <PiiAndNonPiiInfo class="clear-both" v-if="participantDetails" :participantDetails="participantDetails" @expanded="piInfoExpanded"></PiiAndNonPiiInfo>
    <div class="documents-wrap" id="documents-wrap">
      <DocumentInformation v-if="participantDetails && documentDetails" :participantDetails="participantDetails" :documentDetails="documentDetails"></DocumentInformation>
    </div>
    <div style="clear:both;"></div>
    <DocumentHistory></DocumentHistory>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import signatureStatuses from '@/constants/signatureStatuses';
import PiiAndNonPiiInfo from "@/components/participants/pii-and-non-pii-info";
import DocumentInformation from './document-information';
import DocumentHistory from './document-history-new';
import NavigationBreadcrumb from "@/components/common/navigation-breadcrumb";

export default {
  name: 'document-details-history',
  components: { PiiAndNonPiiInfo, DocumentHistory, DocumentInformation, NavigationBreadcrumb },
  data() {
    return {
      participantDetails: null,
      documentDetails: null,
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      documentId: this.$route.params.documentId,
      areActionsAllowed: {showDocument: false, edcForms: false, canDisqualifyParticipant: false},
      signatureStatuses,
      navigationOptions: [
        {name: "Profile", isLink: true, route: 'participant-profile', params: { studyId: this.$route.params.studyId, participantId: this.$route.params.participantId }, displayOrder: 2},
        {name: "Participants", isLink: true, route: 'study-participants-list', params: {studyId: this.$route.params.studyId}, displayOrder: 1},
        {name: "Agreement", isLink: false, route: null, params: null, displayOrder: 3}
      ],
      navigationWidth: "64%",
      telehealthCallStatus: false,
    };
  },
  computed: {
    ...mapGetters(['getSignatureStatus', "getVideoCallStatus"]),
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
    getVideoCallStatus(isCallInProgress) {
      this.telehealthCallStatus = isCallInProgress;
    },
  },
  methods: {
    ...mapActions(['userLogin', 'setSignatureAction', 'setSignatureStatusAction']),
    getParticipantDetails() {
      this.$api.getParticipantDataFactV2(this.studyId, this.participantId).then(
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
    toggleParticipant(participant) {
      this.$router.push({
        name: 'participant-document',
        params: {studyId: this.studyId, participantId: participant.id, documentId: this.documentId }
      });
      this.participantId = participant.id;
      this.getParticipantDetails();
      this.getDocumentDetails();
    },
    piInfoExpanded(isExpanded) {
      let c = document.getElementById('documents-wrap');
      if(isExpanded) {
        setTimeout(() => {
          let expandEle = document.getElementById('collapse-piiandnon-pii');
          window.$('#documents-wrap').animate({
            marginTop: (expandEle.offsetHeight - 34) + 'px'
          })
        }, 450);
      } else {
        c.style.marginTop = '0px';
      }
    }
  },
  mounted() {
    this.getParticipantDetails();
    this.getDocumentDetails();
  },
};
</script>
<style scoped lang="scss" src="../../../../public/static/fonts.scss"></style>
<style scoped lang="scss">

.wrap {
  background-color: #ffffff;
  padding-top: 10px;
  overflow: hidden;
  min-height: 500px;
  font-family: Roboto-Regular;
  .documents-wrap {
    margin-top: 3px;
  }
  nav {
    &.participant-toggle {
      float: right;
      padding-right: 18px;
      .custom-text-css {
        padding: 1px 10px 0px 5px;
        background-color: #ffffff;
        border-top: solid 0.5px #e4e8eb;
        border-bottom: solid 0.5px #e4e8eb;
        font-size: 9px;
        letter-spacing: 0.3px;
        width: 140px;
        .pi-id {
          font-weight: 600;
          color: #000000;
          width: 150px;
          font-size: 10px;
        }
        .pi-status {
          color: #b0bac9;
          font-weight: 600;
          font-size: 9px;
        }
      }
      .page-item {
        .page-link {
          border: solid 0.5px #e4e8eb;
          span {
            width: 6px;
            height: 12px;
            display: inline-block;
            img {
              width: 100%;
              &.previous-item {
                transform: scaleX(-1);
              }
            }
          }
          &.disable {
            cursor: auto;
          }
          &.disable:hover {
            background-color: #ffffff;
          }
        }
      }
    }
  }
}
.clear-both {
  clear: both;
}
.telehealth-call {
  .documents-wrap {
    font-size: 11px;
  }
}
</style>
