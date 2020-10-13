<template>
  <div class="doc-details">
    <div>
      <div class="color_blue pb-20 cursor_pointer">
        <router-link :to="{ name: 'study-participant-details', params: { studyId, participantId }}"><i class="fa fa-caret-left" aria-hidden="true"></i> Back</router-link>
      </div>
      <dl v-if="docName">
        <dt>Document Name</dt>
        <dd>{{ docName }}</dd>
      </dl>
      <dl>
        <dt>Participant Signed on</dt>
        <dd>
          <span v-if="isParticipantSigned">{{ new Date(participantSignedTime) | formatGMTDate }}</span>
          <span v-else class="color_red">Not signed</span>
        </dd>
      </dl>
      <dl >
        <dt>PI Signed on</dt>
        <dd v-if="isPISignRequired">
          <span v-if="isPISigned">{{ new Date(piSignedTime) | formatGMTDate }}</span>
          <span v-else class="color_red">Not signed</span>
        </dd>
        <dd v-if="!isPISignRequired">
          <span class="color_red">N/A</span>
        </dd>
      </dl>
      <b-btn variant="primary" @click="showSignatureModal('signatureModal')" :disabled="(!isParticipantSigned || isPISigned || !isPISignRequired) || user.userRole === 'Cra' || user.userRole === 'SiteDataLock'" >Sign</b-btn>
      <b-btn variant="outline-primary" class="mt-10" @click="showSignatureModal('confirmSendModal')" :disabled="user.userRole === 'Cra' || user.userRole === 'SiteDataLock'">Send to Participant</b-btn>
      <b-btn variant="outline-primary" class="mt-10" @click="printDocument()">Print</b-btn>
    </div>
    <!-- signatureModal -->
    <b-modal id="signatureModal" ref="signatureModal" :busy="true" :hide-footer="true" :hide-header="true" body-class="modal-body-custom">
      <div v-if="!signed">
        <div role="group">
          <label for="inputLive">Enter your name:</label>
          <b-form-input id="inputLive" v-model.trim="name" type="text" placeholder="First and last name"></b-form-input>
          <span class="color_red fs-12" v-if="name && name.length > charLimit">Enter max of {{charLimit}} characters only</span>
        </div>
        <div role="group" class="pt-20">
          <label for="inputLive" class="m-0">Draw your signature:</label>
          <!-- <b-form-input id="inputLive" v-model.trim="signature" type="text" placeholder="Enter your name"></b-form-input> -->
          <div class="fs-12">Draw using your mousepad or keypad</div>
          <signature></signature>
        </div>
        <div class="text-center pt-10">
          <b-button variant="primary" class="custom-btn" @click="confirmSign()" :disabled="!name || !getSignatureData || (name && name.length > charLimit)">Confirm Signature</b-button>
        </div>
      </div>
      <div v-if="signed">
        <div class="pb-20 text-center">Herewith I confirm the completeness and correctness of all data entered into the THREAD Platform by applying an electronic signature, using my account name and password. This electronic signature is the legally binding equivalent of my handwritten signature. I understand that this electronic signature is assigned only to my account name and password; no other person is authorized to use these.</div>
        <div class="pb-20 text-center">Please enter username and password to sign this document. You may not rescind your signature once you have signed the document</div>
        <div role="group" class="pl-40 pr-40">
          <b-form-input type="text" placeholder="Email" v-model="userCredentials.username"></b-form-input>
        </div>
        <div role="group" class="pl-40 pr-40 pt-20">
          <b-form-input type="password" placeholder="Password" v-model="userCredentials.password"></b-form-input>
        </div>
        <div class="text-center pt-10">
          <b-button variant="primary" class="custom-btn" v-on:click.prevent="loginUser" :disabled="!userCredentials.username || !userCredentials.password">Confirm and sign</b-button>
        </div>
      </div>
      <div class="text-center pt-10">
        <b-button variant="secondary" class="custom-btn" @click="closeModal('signatureModal')">Do not sign</b-button>
      </div>
    </b-modal>

    <!-- confirmSendModal -->
    <b-modal id="confirmSendModal" ref="confirmSendModal" :busy="true" :hide-footer="true" :hide-header="true" body-class="modal-body-custom">
      <div>Are you sure you want to send
        <span>{{docName}}</span> to participant
        <span>{{toEmail}}</span>
      </div>
      <div class="text-center pt-20">
        <b-button variant="primary" class="custom-btn" @click="sendMail('confirmSendModal')">Yes, send</b-button>
      </div>
      <div class="text-center pt-10">
        <b-button variant="secondary" class="custom-btn" @click="closeModal('confirmSendModal')">No, do not send</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import signature from '@/components/common/signature';
import signatureStatuses from '@/constants/signatureStatuses';

export default {
  name: 'participant-info',
  components: { signature },
  props: {
    docId: String,
    docName: String,
    isPISigned: Boolean,
    isPISignRequired: Boolean,
    isParticipantSigned: Boolean,
    piSignedTime: Number,
    participantSignedTime: Number,
    preSignedUrl: String,
    docType: String,
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
    };
  },
  computed: {
    ...mapGetters(['getSignatureData', 'user']),
    showDocDetails() {
      return this.$route.name === 'document-details' || this.$route.name === 'document-history';
    },
  },
  methods: {
    ...mapActions(['userLogin', 'setSignatureAction', 'setSignatureStatusAction']),
    showSignatureModal(ref) {
      if (ref === 'signatureModal') this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_INIT);
      this.$refs[ref].show();
    },
    printDocument() {
      window.open(this.preSignedUrl, '_blank');
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
          if (this.user.username.toUpperCase().trim() === this.userCredentials.username.toUpperCase().trim()) {
            this.userCredentials.electronicSignatureSignIn = 'YES';
            await this.userLogin(this.userCredentials);
            this.requestPISignature();
          } else {
            this.$toastr.error('Please check your username, login with your credentials');
          }
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
.doc-details {
  border-bottom: 1px solid #aaa;
  padding-bottom: 16px;
  margin-bottom: 16px;
  dt {
    font-size: 10px;
    line-height: 1.6;
    text-transform: uppercase;
    color: #adaeb1;
  }
  dd {
    font-size: 14px;
    font-weight: 500;
    color: #666669;
    word-break: break-all;
  }
  .btn {
    display: block;
    width: 100%;
  }
  /deep/ .modal-content {
    min-width: 400px;
  }
  .btn.disabled,
  .btn:disabled {
    pointer-events: none;
  }
}
</style>
