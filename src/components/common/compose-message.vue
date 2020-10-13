<template>
  <div>
    <div class="card">
      <div class="card-body" :class="{'paticipant-profile': participantInfo}">
        <form>
          <div v-if="!participantInfo" class="form-group row to-group">
            <label class="col-md-1 col-form-label left-label">To</label>
            <div class="col-md-11 col-form-label to-participant-link fs-14">
              <router-link :to="{ name: 'study-participants-list', query: {'composeMessageId': composeMessageId}}">{{selectedParticipantCount}}</router-link>
            </div>
          </div>
          <div class="form-group pb-5 row">
            <label class="col-md-1 col-form-label left-label">From</label>
            <div class="col-md-11 col-form-label elements">
              <div class="no-reply-email">no-reply@threadresearch.com</div>
            </div>
          </div>       
          <div class="form-group row center-subject">
            <label for="subjectInput" class="col-md-1 col-form-label subject-label left-label">Subject</label>
            <div class="col-md-9 elements">
              <input type="text" class="form-control fs-14" id="subjectInput" name="subject" :maxlength="48" v-model="message.subject" v-validate.immediate="{ required: true, regex: '[^\s]', isParticipantsSelected: true }" placeholder="Enter Subject"/>
            </div>
            <div class="col-md-2 placeholder pt-9">{{charachterLimitORLeft}}</div>
          </div>
          <div class="form-group row">
            <label for="bodyText" class="col-md-1 col-form-label left-label">Body</label>
            <div class="col-md-11 elements">
              <textarea rows="10" class="form-control fs-14" id="bodyText" name="bodyText" v-model="message.body" v-validate.immediate="{ required: true, regex: '[^\s]' }" placeholder="Enter Content"></textarea>
            </div>
          </div>
        </form>
      </div>       
      <div class="card-footer bg-transparent">
        <div class="row">
          <div class="col-md-9 fs-14 disclaimer">
            NOTE: Messages are outgoing. E-mail messages come from a no-reply email address. Any responses from the participants will not be delivered.
          </div>
          <div class="col-md-3 p-0">
            <div class="row modal-button">
              <div class="col-md-6">
                <button class="btn btn-secondary can" @click="cancelComposing">Cancel</button>
              </div>
              <div class="col-md-6">
                <button :disabled="errors.any()" @click="sendMessages()" class="btn btn-info sen">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Progress modal starts -->
    <b-modal id="send-progress-modal" ref="send-progress-modal" :hide-header="true" size="lg" hide-footer :no-close-on-esc="true"
    :no-close-on-backdrop="true">
      <div class="progress-modal">
        <div class="d-block text-center">
          <div class="title">Sending Messages</div>
        </div>
        <div class="parent">
          <div class="progress-bar-gray"></div>
          <vue-progress-bar class="progress-bar"></vue-progress-bar>
          <p>Sending message to participant(s)</p>
        </div>
      </div>
    </b-modal>
    <!-- Progress modal ends -->
  </div>
</template>
<script>
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import localStorageService from "@/services/localStorage";
import { Validator } from 'vee-validate';
import _ from 'lodash';
export default {
  name: "ParticipantComposeMessage",
  components: {},
  props: {
    participantInfo: Object,
    participantComMsgId: String //Will get it when we are on participant profile
  },
  data() {
    return {
      composeMessageId: this.$route.params.composeMessageId,
      message: {
        from: "noreply@threadresearch.com",
        notificationType: "email",
        participantList: [],
        subject: "",
        body: "" }
    };
  },
  watch: {
    message: {
      handler(val){
        this.saveMessageObject(val);
      },
      deep: true
    },
    participantInfo(newParticipantInfo, oldParticipantInfo){
      //This watcher will work for Participant Profile
      //This code will fire when the participant is changed from the PID drop-down
      if(newParticipantInfo.participantId == oldParticipantInfo.participantId){
        return; //There is some code flaw in study-participants-details file thats why we have added this code.
      }   
      this.message.participantList = [newParticipantInfo];
    }
  },
  computed: {
    selectedParticipantCount(){
      let selPartCount = this.message.participantList.length;
      if(selPartCount>0){
         return `${selPartCount} participant(s) selected`;
      }
      else{
        return "Select Participants"
      }
    },
    charachterLimitORLeft(){
      let charStr = "character";
      let limitLeftStr = "limit";
      let subLength = this.message.subject.length;
      let charLeft = 48 - subLength;
      if(charLeft > 1 ){
        charStr = "characters";
      }

      if(subLength > 0 || subLength == 48 ){
        limitLeftStr = "left";
      }

      return `${charLeft} ${charStr} ${limitLeftStr}`;

    }
  },
  methods: {
    saveMessageObject: _.debounce(function(msgObj) {
      localStorageService.setItem(this.composeMessageId, JSON.stringify(msgObj));
    }, 1000, { maxWait: 3000 }),
    sendMessages() {
      this.$validator.validateAll().then(result => {
        this.$refs["send-progress-modal"].show();
        this.sendMessagesToParticipants()
      });
    },
    sendMessagesToParticipants(){
      nprogress.start();
      let user = localStorageService.getItem("userObj");
      let siteId = user.siteIds[0];
      let queryParams = {
        studyId: this.$route.params.studyId,
        siteId: siteId 
      }
      this.$api
        .sendMessagesToParticipants(queryParams, this.message)
        .then(
          response => {
            nprogress.done();
            localStorageService.removeItem(this.composeMessageId);
            this.$toastr.success("Message sent");

            if(this.participantComMsgId){
              //Since we are on the participant profile page we will just hide the section and not redirect to the main message listing page.
              this.$emit('toggleMessageSec', false);
            }
            else{
              this.$router.push({
                name: "study-participant-messages"
              });
            }
            
            ///this.hideModal('send-progress-modal');
          },
          error => {
            nprogress.done();
            this.hideModal('send-progress-modal');
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while sending message to participant(s)."
            );
          }
        );
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    cancelComposing(){
      this.$swal({
        title: 'Are you sure you want to cancel? This message will not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4a4a4a',
        cancelButtonColor: '#1e8fe1',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          localStorageService.removeItem(this.composeMessageId);
          if(this.participantComMsgId){
            //Since we are on the participant profile page we will just hide the section and not redirect to the main message listing page.
            this.$emit('toggleMessageSec', false);
          }
          else{
            this.$router.push({
              name: "study-participant-messages"
            });
          }     
        }
      });
    }
  },
  created(){
    Validator.extend('isParticipantsSelected', {
      getMessage: field => {
        return `Please select atleat one participant!`;
      },
      // Returns a boolean value
      validate: value => {
        return this.message.participantList.length > 0;
      }
    });
  },
  mounted() {
    //Below condition is for participant profile page
    if(this.participantInfo && this.participantComMsgId){
      this.message.participantList.push(this.participantInfo);
      this.composeMessageId = this.participantComMsgId;
    }  

    let comMsgObj = localStorageService.getItem(this.composeMessageId);  
    if (comMsgObj === null || comMsgObj === undefined) {
      this.$toastr.error("Compose Message Id not available");
      if(!this.participantInfo){
        //this code will handle the condition that if id gets removed from local storage/session gets timed and user redirect to this page
        this.$router.push({
          name: "study-participant-messages"
        }); 
      }
      else{
        this.$emit('toggleMessageSec', false);
      }    
    } else {
      if(Object.keys(comMsgObj).length!=0){
        this.message = comMsgObj;
      }else{
        localStorageService.setItem(this.composeMessageId, JSON.stringify(this.message))
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// for making placeholder change color
textarea::-webkit-input-placeholder {
  color: #e2e7ea !important;
  font-size: 14px !important;
}
textarea:-moz-placeholder {
  /* Firefox 18- */
  color: #e2e7ea !important;
  font-size: 14px !important;
}
textarea::-moz-placeholder {
  /* Firefox 19+ */
  color: #e2e7ea !important;
  font-size: 14px !important;
}
textarea:-ms-input-placeholder {
  color: #e2e7ea !important;
  font-size: 14px !important;
}
textarea::placeholder {
  color: #e2e7ea !important;
  font-size: 14px !important;
}
// for making placeholder italic
::-webkit-input-placeholder {
  color: #e2e7ea !important;
  font-style: italic !important;
  font-size: 14px !important;
}
:-moz-placeholder {
  color: #e2e7ea !important;
  font-style: italic !important;
  font-size: 14px !important;
}
::-moz-placeholder {
  color: #e2e7ea !important;
  font-style: italic !important;
  font-size: 14px !important;
}
:-ms-input-placeholder {
  color: #e2e7ea;
  font-style: italic;
  font-size: 14px;
}
.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 10px;
}
.card{
  border-color: #e2e7ea;
  .card-body{
    padding: 8px 0;
    padding-bottom: 0;
    &.paticipant-profile{
      padding-top: 0;
    }
    .form-group{
      padding-top: 3px;
      padding-bottom: 3px;
      &.to-group{
        border-bottom: 0;
        padding-bottom: 0;
      }
      .form-control{
        color: #4a4a4a;
      }
    }
  }
}

.to-participant-link {
  padding-left: 3%;
  a {
    color: #1e8fe1;
  }
}

.elements {
  padding-bottom: 2px;
  padding-left: 2% !important;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
  input {
    border: none;
    &.email-control {
      background-color: #fff;
      line-height: 1.71;
      color: #666669;
      cursor: text;
    }
  }
  textarea {
    border: none;
    resize: none;
  }
}
.form-group {
  border-bottom: 1px solid #e2e7ea;
  &.row {
    margin-bottom: 0;
  }
}
.center-subject {
  width: auto;
  text-align: center;
}
.subject-label {
  text-align: left;
}
.left-label {
  opacity: 0.6;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  font-family: RobotoRegular;
  color: #4a4a4a;
  padding-right: 0;
  padding-left: 32px;
}
.fs-14 {
  font-size: 14px;
}
input.fs-14:focus,
textarea.fs-14:focus,
select:focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
}
.pl-22 {
  padding-left: 22px;
}
.pl-13 {
  padding-left: 13px;
}
.pb-22 {
  padding-bottom: 22px;
}
.card-footer {
  border-top: none !important;
  padding: 18px 10px 19px 19px
}
.placeholder {
  opacity: 0.5;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.5;
  letter-spacing: normal;
  color: #666669;
  padding: 0.5% 0;
}
.disclaimer {
  padding-left: 2px;
  padding-right: 0px;
  color: #4a4a4a;
  word-wrap: break-word;
  opacity: 0.4;
}
.modal-button {
  margin-top: 1%;
}
.btn-section {
  text-align: right;
  padding-top: 1%;
  .cancel {
    border-radius: 2px;
    border-color: #fff;
    margin-right: 12px;
    color: #1e8fe1;
    background-color: #fff;
  }
  .send {
    border-radius: 2px;
    color: #fff;
  }
}
.can {
  padding: 6% 29%;
  border-radius: 2px;
  border-color: #fff;
  margin-right: 12px;
  color: #1e8fe1;
  background-color: #fff;
}
.sen {
  padding: 6% 29%;
  border-radius: 2px;
  background-color: #1e8fe1;
  color: #fff;
  &:disabled {
    opacity: 0.4;
  }
}

#send-progress-modal {
  .modal-body {
    padding: 0.6rem !important;
  }
  .modal-content {
    padding: 20px !important;
    background-color: red !important;
  }
  .title {
    padding: 24px 0px 26px;
    font-family: RobotoRegular;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #666669;
  }
  .parent {
    position: relative;
    width: auto;
    text-align: center;
    p {
      padding: 2.5% 15%;
    }
  }
  .progress-bar-gray {
    background-color: rgb(205, 219, 211) !important;
    opacity: 1 !important;

    top: 0px !important;
    left: auto !important;
    width: 100% !important;
    height: 14px !important;
    transition: opacity 0.5s ease 0s !important;
    border-radius: 50px !important;
  }
  .progress-bar {
    background-color: rgb(46, 204, 113) !important;
    opacity: 1 !important;
    position: absolute !important;
    top: 0px !important;
    left: auto !important;
    //width: 35% !important;
    height: 14px !important;
    transition: opacity 0.5s ease 0s !important;
    border-radius: 50px !important;
  }
  .button-section {
    width: auto;
    text-align: center;
  }
  .progress-modal {
    width: 358px;
    padding: 1% 5%;
  }
  .progress-cancel {
    border: none;
    background-color: transparent;
    color: #1e8fe1;
    font-size: 14px;
    font-family: RobotoRegular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
  }
  .progress-cancel:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}
#cancel-modal {
  .progress-modal {
    padding: 20px 13px 2px;
  }
  .parent {
    width: auto;
    text-align: center;
    p {
      font-size: 18px;
      font-family: RobotoRegular;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
  .button-section {
    text-align: right;
    padding-top: 1%;
    button {
      border-radius: 2px;
      padding: 1% 2.8%;
      font-size: 15px;
    }
    .cancel {
      border-color: #fff;
      margin-right: 12px;
      color: #1e8fe1;
      background-color: #fff;
    }
    .yes {
      background-color: #1e8fe1;
    }
  }
}
.no-reply-email{
  padding-left: 1%;
  padding-top: 2px;
  color: #666669;
}

//** This is to resize the compose section when compose section is visible and telehealth call is in progress */
.telehealth-call{
  width: 70%;
  .col-md-1{
    min-width: 15%;
  }
  .col-md-11{
    max-width: 85%;
  }
  .col-md-9{
    max-width: 68%;
  }
  .to-participant-link{
    padding-left: 3.7%;
  }
  .no-reply-email{
    padding-left: 2.2%;
  }
}
</style>
<style lang="scss">
@media (min-width: 992px) {
  #send-progress-modal{
    .modal-dialog {
      min-width: 400px !important;
      width: 400px !important;
    }
  } 
}
</style>
