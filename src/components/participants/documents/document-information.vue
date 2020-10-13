<template>
  <div class="doc-details">
    <div v-if="documentDetails" class="document-detail-wrap">
      <div class="row">
        <div v-if="documentDetails.docName" class="col-md-3">
          <div class="heading">Document Name</div>
          <div>{{documentDetails.docName}}</div>
        </div>
        <div class="col-md-3">
          <div class="heading">Participant Signed On</div>
          <div v-if="documentDetails.parentDocId">
            <div v-if="documentDetails.participantSignDate">{{ new Date(documentDetails.participantSignDate) | dateUTC }}</div>
            <div v-else class="color_red">N/A</div>  
          </div>
          <div v-else>
            <div v-if="documentDetails.isParticipantSigned">{{ new Date(documentDetails.participantSignedTime) | formatUTCDate }}</div>
            <div v-else class="color_red">Not signed</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="heading">PI Signed On</div>
          <div v-if="documentDetails.parentDocId">
            <div v-if="documentDetails.siteMemberSignDate">{{ new Date(documentDetails.siteMemberSignDate) | dateUTC }}</div>
            <div v-else class="color_red">N/A</div> 
          </div>
          <div v-else>
            <div v-if="documentDetails.isPISigned">{{ new Date(documentDetails.piSignedTime) | formatUTCDate }}</div>
            <div v-if="!documentDetails.isPISigned" class="color_red">Not signed</div>
          </div>
        </div>
      </div>
    </div>
    <ParticipantInfo class="clear-both" v-if="documentDetails" :participantDetails="participantDetails" :documentDetails="documentDetails" :areActionsAllowed="areActionsAllowed"/>
    <div class="document-details">
      <iframe v-if="documentDetails && documentDetails.preSignedUrl" :src="documentDetails.preSignedUrl" style="width:100%; height:700px;" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// import signature from '@/components/common/signature';
import signatureStatuses from '@/constants/signatureStatuses';
import { AclRule } from 'vue-acl';
import { PI, CRA, DM, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH } from '@/constants/authRoles';
import ParticipantInfo from "@/components/participants/participant-info-new";

export default {
  name: 'document-information',
  components: { ParticipantInfo },
  props: {
    docId: String,
    docName: String,
    isPISigned: Boolean,
    isPISignRequired: Boolean,
    isParticipantSigned: Boolean,
    piSignedTime: Number,
    participantSignedTime: Number,
    docType: String,
    documentDetails: {
      type: Object
    },
    participantDetails: {
      type: Object
    }
  },
  data() {
    return {
      name: null,
      toEmail: null,
      signed: false,
      userCredentials: {
        username: '',
        password: '',
      },
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      documentId: this.$route.params.documentId,
      signatureStatuses,
      charLimit: 60,
      areActionsAllowed: {
        document: false,
        telehealth: true,
        edcforms: false,
        approval: false,
        verifyBtn: false,
        send: true,
        sign: true,
        print: true,
      },
    };
  },
  computed: {
    ...mapGetters(['getSignatureData', 'user']),
    showDocDetails() {
      return this.$route.name === 'document-details' || this.$route.name === 'document-history';
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
  },
  methods: {
    ...mapActions(['userLogin', 'setSignatureAction', 'setSignatureStatusAction']),
    signDocuemnt() {
      console.log('dsad');
    },
    showSignatureModal(ref) {
      if (ref === 'signatureModal') this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_INIT);
      this.$refs[ref].show();
    },
    printDocument() {
      window.open(this.documentDetails.preSignedUrl, '_blank');
    },
    confirmSign() {
      if (this.name) {
        this.signed = true;
      }
    },
    closeModal(ref) {
      this.signed = false;
      this.$refs[ref].hide();
      this.userCredentials = {
        username: '',
        password: '',
      };
      this.name = null;
      this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_RESET);
      this.setSignatureAction(null);
    },
    sendMail(ref) {
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.documentId,
        data: {
          piName: this.user.firstName,
        },
      };
      this.$api.sendMailFact(dataObj).then(
        response => {
          this.$toastr.success(response.body && response.body.message ? response.body.message : 'Mail sent successfully');
          this.closeModal(ref);
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while sending mail');
          this.closeModal(ref);
        },
      );
    },
    requestPISignature() {
      const signObj = new FormData();
      signObj.append('piSign', this.getSignatureData);
      signObj.append('name', this.name);
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.documentId,
        data: signObj,
      };
      this.$api.requestPISignatureFact(dataObj).then(
        response => {
          this.$toastr.success(response.body && response.body.message ? response.body.message : 'PI signature saved successfully');
          this.closeModal('signatureModal');
          this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_COMPLETED);
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
        },
      );
    },
    async loginUser() {
      if (!this.errors.any()) {
        try {
          await this.userLogin(this.userCredentials);
          this.requestPISignature();
        } catch (error) {
          this.$toastr.error(error.message);
          window.console.log('error');
        }
      } else if (!this.userCredentials.username && !this.userCredentials.password) {
        this.$toastr.error('Please enter your credentials.');
      } else if (!this.userCredentials.username) {
        this.$toastr.error('Please provide your email, it is required');
      } else if (!this.userCredentials.password) {
        this.$toastr.error('Please provide your password, it is required');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.buttons-wrap {
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    button {
      border-radius: 2px;
      border: solid 0.5px #e4e8eb;
      font-weight: bold;
      width: 160px;
      padding: 8px;
      letter-spacing: 0.2px;
      font-size: 12px;
    }
    button:nth-child(n) {
      margin-right: 10px;
    }
    button:last-child {
      margin-right: 0px;
    }
    .btn-default {
      background-color: #ffffff;
      color: #4c8ce4;
      transition-duration: 0.6s;
      &.active {
        background-color:#4c8ce4;
        color: #ffffff;
        transition-duration: 0.6s;
      }
    }
    .btn-default:focus {
      box-shadow: none;
    }
    .btn-primary {
      background-color: #4c8ce4;
      color: #ffffff
    }
  }
.doc-details {
  clear: both;
  /deep/ .modal-content {
    min-width: 400px;
  }
  .btn.disabled,
  .btn:disabled {
    pointer-events: none;
  }
}
#confirmSendModal {
  .modal-heading {
    font-size: 14px;
  }
  .custom-btn {
    width: 100%
  }
}
.document-detail-wrap {
  padding: 15px 0px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: #fff;
  margin-top: 3px;
  .heading {
    letter-spacing: 0.5px;
    color: #A8A8A8;
  }
}
.font-1rem {
  font-size: 1rem;
}
.pi-info-bars {
  .heading {
    color: #4a4a4a;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  .pi-info-bar {
     box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.06);
     padding: 15px 0px;
     &.resize-text {
       font-size: 10px;
     }
     .custom-max-width {
        &.email {
          max-width: 12%;
        }
        &.gender {
          max-width: 13.66666%;
        }
     }
  }
}
</style>
