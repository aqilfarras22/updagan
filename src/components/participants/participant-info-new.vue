<template>
  <div>
    <EdcFormInfo v-if="edcFormInfo.formId" :edcFormInfo="edcFormInfo"></EdcFormInfo>
    <div class="participant-detail-section">
      <div class="action-btns pt-17 pb-20">
        <button type="button" class="btn btn-default btn-md action-btn btn-padding" id="show-document-ele" v-if="areActionsAllowed.document && (canPiAccess || canSubPiAccess || canHomeHealthAccess || canScAccess || canCraAccess || canSiteDataLockAccess)" @click="switchText('document')" :class="{'btnActive': showDocuments}"><span class="mb-3 pl-17" :class="{'agreement-off': !showDocuments, 'agreement-on': showDocuments}"></span>{{showDocuments?'Hide':'Show'}} Agreements</button>
        <button type="button" class="btn btn-default btn-md action-btn btn-padding" @click="changeState('study-participant-edc-unschedule-packets-reskin')" v-if="areActionsAllowed.edcforms && edcEnabled && (canPiAccess || canSubPiAccess || canHomeHealthAccess || canScAccess)"><span class="forms mb-3 pl-17"></span>Unscheduled Forms</button>
        <button type="button" class="btn btn-default btn-md btn-padding" v-if="areActionsAllowed.send" @click="showSignatureModal('confirmSendModal')" :disabled="user.userRole === 'Cra' || user.userRole === 'SiteDataLock'"><i class="fa fa-paper-plane pr-5" aria-hidden="true"></i>Send to Participant</button>
        <button type="button" class="btn btn-default btn-md active btn-padding" v-if="areActionsAllowed.sign" @click="showSignatureModal('signatureModal')" :disabled="!documentDetails.isParticipantSigned || documentDetails.isPISigned || !documentDetails.isPISignRequired || user.userRole === 'Cra' || user.userRole === 'SiteDataLock'"><span class="sign"></span>Sign</button>
        <button type="button" class="btn btn-default btn-md btn-padding" v-if="areActionsAllowed.print" @click="printDocument()"><i class="fa fa-print pr-5" aria-hidden="true"></i>Print</button>
        <button type="button" class="btn btn-default btn-md btn-padding" @click="openApprovalModal" v-if="areActionsAllowed.approval && (canPiAccess || canSubPIAccess || canHomeHealthAccess || canScAccess)">{{ approvalBtnText }}</button>
        <button type="button" class="btn btn-default btn-md btn-padding" @click="openVerificationModal" v-if="areActionsAllowed.verifyBtn && canCraAccess">{{ verifyBtnText }}</button>
        <div
          class="vertical-seperator"
          v-if="(areActionsAllowed.send ||
            areActionsAllowed.document ||
            areActionsAllowed.sign ||
            areActionsAllowed.print ||
            areActionsAllowed.edcforms ||
            areActionsAllowed.approval ||
            areActionsAllowed.verifyBtn) && !canSysAdminAccess && canInitiateTelehealthCall()">
        </div>
        <button type="button" class="btn btn-default btn-md action-btn btn-padding" v-if="areActionsAllowed.telehealth && canInitiateTelehealthCall() && !canSiteDataLockAccess" @click="InitateVideoCall" :disabled="disableCallBtn()"> <span class="telehealth mb-3 pl-17"></span>Start Telehealth</button>
        <button v-if="areActionsAllowed.sendMessage && canResearchSiteTeamAccess" type="button" class="btn btn-default btn-md action-btn btn-padding" :class="{'btnActive': showSendMessage}" @click="toggleMessageSection()"> <span class="mb-1 pl-17" :class="{'send-message-off': !showSendMessage, 'send-message-on': showSendMessage}"></span>
        {{showSendMessage?'Close':'Send'}} Messages
        </button>
      </div>
    </div>
    <transition name="fade">
      <DocumentsList v-if="showDocuments"></DocumentsList>
      <div v-if="showSendMessage && participantDetails && composeMessageId">
        <ParticipantSendMessage v-on:toggleMessageSec="toggleMessageSecEvHan" :participantInfo="{participantId: participantDetails.id, emailId: participantDetails.email}" :participantComMsgId="composeMessageId"></ParticipantSendMessage>
      </div>
    </transition>
    <!--Edit participant id modal-->
    <div v-if="edcFormInfo.formId">
      <formApprovalModal
      v-if="(canPiAccess || canSubPIAccess || canHomeHealthAccess || canScAccess)"
      ref="approvalModal"
      callApi
      :formId="edcFormInfo.formId"
      :approved="approved"
      @confirmed="approvalConfirmed"
    />
    <formVerificationModal
      v-if="canCraAccess"
      ref="verificationModal"
      callApi
      :formId="edcFormInfo.formId"
      :verified="verified"
      @confirmed="verificationConfirmed"
    />
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
      <div class="modal-heading">Are you sure you want to send
        <span v-if="documentDetails && documentDetails.docName">{{documentDetails.docName}}</span> to participant
        <span v-if="documentDetails && documentDetails.toEmail">{{documentDetails.toEmail}}</span>
      </div>
      <div class="text-center pt-20">
        <b-button variant="primary" class="font-1rem custom-btn" @click="sendMail('confirmSendModal')">Yes, send</b-button>
      </div>
      <div class="text-center pt-10">
        <b-button variant="secondary" class="font-1rem custom-btn" @click="closeModal('confirmSendModal')">No, do not send</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import { AclRule } from 'vue-acl';
import { mapGetters, mapActions } from 'vuex';
import {
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  CRA,
  DM,
  HOME_HEALTH,
  QUALITY,
  SYSTEM_ADMIN,
  participantStatusesText,
  SITEDATALOCK
} from "@/constants/authRoles";
import DocumentsList from "@/components/participants/documents/documents-list-new";
import {
  approvalStatusText,
  verificationStatusText,
  verificationStatus,
  approvalStatus,
} from '@/constants/form';
import formVerificationModal from '@/components/modals/edc-form-verification-modal';
import formApprovalModal from '@/components/modals/edc-form-approval-modal';
import EdcFormInfo from '@/components/form/edc-form-info-new';
import signatureStatuses from '@/constants/signatureStatuses';
import signature from '@/components/common/signature';
import ParticipantSendMessage from "@/components/participants/send-messages";
import localStorageService from "@/services/localStorage";

export default {
  name: "participant-info",
  components: {
    DocumentsList,
    formVerificationModal,
    formApprovalModal,
    EdcFormInfo,
    signature,
    ParticipantSendMessage
  },
  props: {
    edcFormInfo: {
      type: Object,
      default: function() {
        return {};
      }
    },
    documentDetails: {
      type: Object,
      default: () => {}
    },
    participantDetails: {
      type: Object,
      default: function() {
        return {};
      }
    },
    hasToHide: {
      type: Boolean,
      deafult: false
    },
    areActionsAllowed: {
      type: Object,
      default: function() {
        return {
          document: true,
          telehealth: true,
          edcforms: true,
          approval: false,
          verifyBtn: false,
          send: false,
          sign: false,
          print: false,
          sendMessage: false
        }
      }
    },
    enableSection: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      visitDetails: {
        visitId: ""
      },
      teleHealthConfigured: false,
      studyData: {},
      toggleFeatures: [],
      telehealthEnabled: false,
      userDefinedParticipantId: "",
      isTelehealthV2Enabled: false,
      isCallBtnDisabled: false,
      edcEnabled: false,
      showDocuments: false,
      approvalStatusText,
      verificationStatusText,
      signed: false,
      name: null,
      toEmail: null,
      userCredentials: {
        username: '',
        password: '',
      },
      charLimit: 60,
      activeClass: false,
      signingIsInProcess: false,
      signatureStatuses,
      participantStatusesText,
      showSendMessage: false,
      composeMessageId: null
    };
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.isCallBtnDisabled = isCallInProgress;
    },
    'participantDetails': {
      handler (val) {
        if(this.showDocuments) {
          this.switchText('document');
        }

        //Since the participant  got changed we need to get back to the initial state, so hide the msg section
        //reinitialize the compose id and remove it from local storage.
        if(this.composeMessageId){
          localStorageService.removeItem(this.composeMessageId);
          this.composeMessageId = null;
          this.showSendMessage = false;
          //Emit event to show the site/participant task
          this.$emit("toggleSitePartTaskSec", !this.showSendMessage);
        }

      },
      deep: true,
    },
    showDocuments(isShown){
      if(isShown){
        //Emit event to show/hide the site/participant task based on the send messages sec is open or not
        this.$emit("toggleSitePartTaskSec", true);
      }
    }
  },
  computed: {
    ...mapGetters(["token", "user", "getVideoCallStatus", "getSignatureData"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
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
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    verifyBtnText() {
      return this.verified ? 'Unverify' : 'Verify';
    },
    approvalBtnText() {
      return this.approved ? 'Unapprove' : 'Approve';
    },
    verified() {
      return this.edcFormInfo.verificationStatus === verificationStatus.VERIFIED;
    },
    approved() {
      return this.edcFormInfo.approvalStatus === approvalStatus.APPROVED;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
    canResearchSiteTeamAccess(){
      return (this.canPiAccess || this.canSubPIAccess || this.canStudyCoordinatorAccess || this.canHomeHealthAccess);
    }
  },
  methods: {
    ...mapActions(['userLogin', 'setSignatureAction', 'setSignatureStatusAction']),
    openEditModal() {
      this.userDefinedParticipantId = this.participantDetails.userDefinedParticipantId;
      window.$("#edit-participant-modal").modal("show");
    },
    cancelEdit() {
      window.$("#edit-participant-modal").modal("hide");
    },
    updateParticipantID() {
      if(this.userDefinedParticipantId == null || this.userDefinedParticipantId == "") {
        return;
      }
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        data: {
          userDefinedParticipantId: this.userDefinedParticipantId.trim()
        }
      };
      this.$api.updateParticipantIdFact(dataObj).then(
        response => {
          this.participantDetails.userDefinedParticipantId =
            response.body.userDefinedParticipantId;
          this.$forceUpdate();
          this.$toastr.success("Participant ID updated successfully.");
          window.$("#edit-participant-modal").modal("hide");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while updating the participant id."
          );
        }
      );
    },
    changeState(state) {
      this.$router.push({name: state});
    },
    printDocument() {
      window.open(this.documentDetails.preSignedUrl, '_blank');
    },
    showSignatureModal(ref) {
      if (ref === 'signatureModal') {
        this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_INIT);
      }
      this.$refs[ref].show();
    },
    switchText(button) {
      if (button == "document") {
        if(this.showSendMessage){
          this.showSendMessage = false;
        }
        this.showDocuments = !this.showDocuments;
      }
    },
    getAppointmentDetails() {
      this.$api.getAppointmentDetailsFact(this.participantId).then(
        response => {
          this.visitDetails = response.body;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting encounter status."
          );
        }
      );
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          if (response.body) {
            this.studyData = response.body;
            if(!this.canSysAdminAccess) {
              this.getToggledFeatures();
            }
            if(this.teleHealthConfigured && this.canPiAccess) {
              this.getAppointmentDetails();
            }
          }
        },
        error => {
          const err =
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details";
          this.$toastr.error(err);
        })
        .catch(error => {
          if (error && (error.message || error.body.message)) {
            this.$toastr.error(error.message || error.body.message);
          } else {
            this.$toastr.error('Unable to fetch the study details');
          }
        });
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach(feature => {
              if (feature.featureKey === "TELEHEALTH") {
                this.isTelehealthV2Enabled = feature.enabled;
              } else if (feature.featureKey === "EDC") {
                this.edcEnabled = feature.enabled;
              }
            });
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting trueclinic features."
          );
        }
      );
    },
    canInitiateTelehealthCall() {
      //Call cannot be initiated for these statuses
      let statusArray = ["INVITED", "NOTINVITED", "REGISTERED", "DISQUALIFIED", "WITHDRAWSTUDY"]
      if(statusArray.includes(this.participantDetails.status)){
        return false;
      }

      if (
        this.studyData.telehealthIntegration &&
        this.isTelehealthV2Enabled &&
        (this.canPiAccess || this.canSubPiAccess || this.canScAccess || this.canHomeHealthAccess) &&
        this.user.countries && _.chain(this.user.countries).filter({'isTelehealthEnabled': true, 'country_id': this.participantDetails.countryId}).size().value()>0
      ) {
        return true;
      }

      return false;
    },
    InitateVideoCall() {
      this.isCallBtnDisabled = true;
      //Emit an event to show/start the video call component
      this.$root.$emit("videoCallingInitiated", {
        participantId: this.participantDetails.id,
        studyId: this.studyId,
        deviceRegistrationStatus: this.participantDetails.deviceRegistrationStatus
      });
    },
    disableCallBtn() {
      return this.getVideoCallStatus || this.isCallBtnDisabled ? true : false;
    },
    openVerificationModal() {
      this.$refs.verificationModal.show();
    },
    openApprovalModal() {
      this.$refs.approvalModal.show();
    },
    verificationConfirmed({ verified }) {
      const status = verified ? verificationStatus.VERIFIED : verificationStatus.NOT_VERIFIED;
      this.$emit('verificationConfirmed', status);
    },
    approvalConfirmed({ approved }) {
      const status = approved ? approvalStatus.APPROVED : approvalStatus.NOT_APPROVED;
      this.$emit('approvalConfirmed', status);
    },
    sendMail(ref) {
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.documentDetails.docId,
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
    confirmSign() {
      if (this.name) {
        this.signed = true;
      }
    },
    async loginUser() {
      if(this.signingIsInProcess) {
        return;
      }
      this.signingIsInProcess = true;
      if (!this.errors.any()) {
        try {
           if (this.user.username.toUpperCase().trim() === this.userCredentials.username.toUpperCase().trim()) {
             this.userCredentials.electronicSignatureSignIn = 'YES';
             await this.userLogin(this.userCredentials);
             this.requestPISignature();
           } else {
            this.$toastr.error('Please check your username, login with your credentials');
            this.signingIsInProcess = false;
           }
        } catch (error) {
          this.$toastr.error(error.message);
          this.signingIsInProcess = false;
        }
      } else if (!this.userCredentials.username && !this.userCredentials.password) {
        this.$toastr.error('Please enter your credentials.');
        this.signingIsInProcess = false;
      } else if (!this.userCredentials.username) {
        this.$toastr.error('Please provide your email, it is required');
        this.signingIsInProcess = false;
      } else if (!this.userCredentials.password) {
        this.$toastr.error('Please provide your password, it is required');
        this.signingIsInProcess = false;
      }
    },
    requestPISignature() {
      const signObj = new FormData();
      signObj.append('piSign', this.getSignatureData);
      signObj.append('name', this.name);
      const dataObj = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.documentDetails.docId,
        data: signObj,
      };
      this.$api.requestPISignatureFact(dataObj).then(
        response => {
          this.$toastr.success(response.body && response.body.message ? response.body.message : 'PI signature saved successfully');
          this.closeModal('signatureModal');
          this.setSignatureStatusAction(this.signatureStatuses.SIGNATURE_COMPLETED);
          this.signingIsInProcess = false;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
          this.signingIsInProcess = false;
        },
      );
    },
    toggleMessageSection() {
      //Hide Agreement section if it is visible
      if(this.showDocuments){
        this.showDocuments = false;
      }

      this.showSendMessage = !this.showSendMessage;
      if(!this.composeMessageId){
        this.composeMessageId = this.createCompseID();
        localStorageService.setItem(this.composeMessageId, {});
      }
      //Emit event to show/hide the site/participant task based on the send messages sec is open or not
      this.$emit("toggleSitePartTaskSec", !this.showSendMessage);
    },
    toggleMessageSecEvHan(value) {
      //This event is fired from compose-message component either by cancel composing/after sending msg
      this.showSendMessage = value;

      if(!value){
        this.composeMessageId = null;
      }

      //Emit event to show/hide the site/participant task based on the send messages sec is open or not
      this.$emit("toggleSitePartTaskSec", !value); 

    },
    createCompseID(){
      return Array(16)
        .fill(0)
        .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
        .join('') + 
        Date.now().toString(24);
    }
  },
  mounted() {
    this.getStudyDetails();
    this.$root.$on("videoCallEnded", () => {
      this.isCallBtnDisabled = false;
    });
  }
};
</script>
<style lang="scss" src="@/assets/participant-information.scss"></style>
