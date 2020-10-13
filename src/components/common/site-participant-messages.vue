<template>
  <div>   
	  <div class="table-column">
      <div class="row">
        <div class="col-sm-9 col-md-9 col-lg-9 col-xs-9 pl-21 pt-4 pb-4">
          <span class="sent-msg">Sent Messages</span>
        </div>
        <div class="col-sm-3 col-md-3 col-lg-3 col-xs-3 show_section text-right">
          <select v-model="selectedShowOption" class="input-bg select_control mb-4 fs-12" @change="showNumberOfRecords">
            <option
            :value="option.value"
            v-for="option in listOptions"
            :key="option.value"
            >{{option.text}}</option>
          </select>
        </div>
      </div>
		  <div class="wrapper">
        <div>
          <table class="table">
            <thead class="table-border">
              <tr>
              <th :class="[field.class, field.key]" v-for="(field, index) in messageFields" :key ="index">
                <span class="pr-3 position-relative" @click="sortList(field)"> {{field.label}} 
                  <span class="sortUp"  :class="{'disable-icon': !field.ascOrder}"><i class="fa fa-angle-up" aria-hidden="true"></i></span>
                  <span class="sortDown" :class="{'disable-icon': !field.descOrder}"><i class="fa fa-angle-down" aria-hidden="true"></i></span>
                </span>
              </th>
              </tr>
            </thead>
            <tbody v-if="sentMessages && sentMessages.length > 0">
              <tr v-for="(message, index) in sentMessages" :key="index" :class="{'active': message.notificationId === selectedMessage}">
              <td class="pl-21 notificationType"  :title="message.notificationType">{{message.notificationType}}</td>
              <td class="link subject"  :title="message.subject" @click="showMessageDetailModal(message)">{{message.subject}}</td>
              <td v-if="!participantId" class="link participantCount"  @click="getToParticipants(message.notificationId)" :title="`${message.participantCount} participants`">{{message.participantCount}} participants</td>
              <td class="senderName"  :title="message.senderName">{{message.senderName}}</td>
              <td class="notificationSentAt" :title="new Date(message.notificationSentAt) | formatUTCDate">{{ new Date(message.notificationSentAt) | formatUTCDate }}</td>
              </tr>
            </tbody>
            <tbody v-else-if="sentMessages && sentMessages.length==0">
              <tr>
                <td :colspan="colspan">
                <div class="empty-div">
                  <div class="emptyGrid">
                    {{participantId?"No record of messages available.":"No record of messages available. To send a message, click “Compose Message”."}}
                  </div>
                </div>  
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="colspan">
                  <div class="snippet" data-title=".dot-stretching">
                    <div class="stage">
                      <div class="dot-stretching"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pb-5 pl-22 pagination-conatiner" v-if="sentMessages && sentMessages.length">
            <div class="row display-inline-flex">
              <div @click="prevPage()" class="arrow-icon"
              :class="{ 'disabledPagination': currentPage <= 1}">
                <i class="fa fa-angle-left fs-23 pt-3"></i>
              </div>
              <div class="pagination pt-3">{{currentPage}}</div>
              <div class="pagination2 pt-3">of {{totalPages}}</div>
              <div
              @click="nextPage()"
              class="arrow-icon pt-3"
              :class="{ 'disabledPagination': currentPage >= totalPages}">
              <i class="fa fa-angle-right fs-23"></i>
              </div>
            </div>
          </div>
        </div>
         
		  </div>
    </div>
    <!-- Message preview modal -->
   <messageDetailModal ref="sentMessageDetailModal" :messageDetailObject = "messageDetailObject" @resetMessageDetailObj="resetMessageDetailObj" />
  </div>
</template>
<script>
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import swal from "sweetalert2";
import messageDetailModal from "@/components/common/sent-message-detail-modal";
import localStorageService from "@/services/localStorage";
export default {
  name: "sentMessagesList",
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.participantInfo && this.participantInfo.participantId ? this.participantInfo.participantId : null,//This code is for the Participant profile
      sentMessages: null,
      currentPage: 1,
      totalPages: 1,
      sortValue: "",
      sortOrder: "",
      selectedShowOption: 15,
      listOptions: [
        {
          value: 15,
          text: "Show 15 items"
        },
        {
          value: 50,
          text: "Show 50 items"
        },
        {
          value: 100,
          text: "Show 100 items"
        }
      ],
      messageFields: [
        {
          key: "notificationType",
          ascOrder: false,
          descOrder: false,
          label: "Type",
          class: "pl-21",
          currentOrder: null
        },
        {
          key: "subject",
          ascOrder: false,
          descOrder: false,
          label: "Subject",
          class: "pl-10"
        },
        {
          key: "participantCount",
          label: "To",
          class: "pl-10",
          ascOrder: false,
          descOrder: false
        },
        {
          key: "senderName",
          label: "From",
          class: "pl-10",
          ascOrder: false,
          descOrder: false
        },
        {
          key: "notificationSentAt",
          label: "Time Sent",
          ascOrder: false,
          descOrder: false,
          class: "pl-10"
        }
      ],
      messageDetailObject: null,
      selectedMessage: null,
      colspan: 5
    };
  },
  components: {
    messageDetailModal
  },
  props: {
    participantInfo: Object
  },
  watch: {
    participantInfo(newParticipantInfo, oldParticipantInfo){
      //This watcher will work for Participant Profile
      //This code will fire when the participant is changed from the PID drop-down on the PPR page
      if(newParticipantInfo.participantId == oldParticipantInfo.participantId){
        return; //There is some code flaw in study-participants-details file thats why we have added this code.
      }
      
      this.participantId = newParticipantInfo.participantId;
      this.sentMessages = null; //To reset the previous participants message
      this.getAllSentMessages();
    }
  },
  beforeMount() {

    if(this.participantId){
      this.messageFields = _.filter(this.messageFields, function(mf) { return mf.key  != "participantCount"; });
      this.colspan = 4;
    }
    this.getAllSentMessages();
  },
  methods: {
    prevPage() {
      if (this.currentPage <= this.totalPages) {
          this.currentPage -= 1;
          this.getAllSentMessages();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
          this.currentPage += 1;
          this.getAllSentMessages();
      }
    },
    sortList(field) {
      this.sortValue = field.key;
      field.ascOrder = !field.ascOrder;
      if(field.ascOrder){
        this.sortOrder = "asc";
        field.descOrder = false;
      }else{
        field.descOrder = true;
        this.sortOrder = "desc";
      }

      //Reset sort flags for other keys
      this.messageFields.map(field => {
        if(field.key != this.sortValue) {
          field.ascOrder = false;
          field.descOrder = false;
        }
      });

      this.currentPage = 1;
      this.getAllSentMessages();

    },
    showMessageDetailModal(messageDetailObj){
      this.messageDetailObject = messageDetailObj;
      this.$refs.sentMessageDetailModal.show();
    },
    resetMessageDetailObj(){
      this.messageDetailObject = null;
    },
    getAllSentMessages() {
      this.CloseSentToParticipantList();
      nprogress.start();
      let user = localStorageService.getItem("userObj");
      let siteId = user.siteIds[0];
      let pathParams = {
        studyId: this.studyId,
        siteId : siteId
      };

      let queryParams = {
        pageSize: this.selectedShowOption,
        pageNum: this.currentPage
      }
      
      if(this.sortValue!=""){
        queryParams.sortValue = this.sortValue;
        queryParams.sortOrder = this.sortOrder;
      }

      //Send participant id if we are on participant profile page
      if(this.participantId){
        queryParams.participantId = this.participantId;
      }

      this.$api
        .getSentMessagesList(pathParams, queryParams)
        .then(
          response => {
            this.sentMessages = response.body.notifications;
            this.totalPages = response.body.totalPages;
            nprogress.done();
          },
          error => {
            nprogress.done();
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting sent messages."
            );
          }
        );
    },
    showNumberOfRecords() {
      this.currentPage = 1;
      this.getAllSentMessages();
    },
    getToParticipants( to ) {
      this.$emit('participantSelected', to);
      this.selectedMessage = to;
    },
    CloseSentToParticipantList(){
      //Hide the participant-sent list shown in right 
      this.selectedMessage = null;
      this.$emit('participantSelected', this.selectedMessage);
    }
  }
};
</script>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">

.show_section {
  margin-top: 5px;
  select{
    color: #4a4a4a;
    background-image: none;
    padding: 5px;
    padding-right: 48px;
    padding-left: 10px;
  }
}

.table {
  margin-bottom: 0;
  color: #4a4a4a;
  
  thead {
    border: 1px solid #e4e8eb;
    border-right: 0;
    border-left: 0;

    th {
      color: #9b9b9b !important;
      border-top: none;
      border-bottom: none;
      vertical-align: top;
      font-weight: bold;
      font-size: 12px;
      background: rgba(249, 249, 251, 0.2);
      padding-top: 6px;
      padding-bottom: 6px;
      span{
        cursor: pointer;
      }
    }
  }

  th,
  td {
    padding: 10px;
    // line-height: 30px;
    word-break: break-all;
    &.link{
      color: #1e8fe1;
      font-weight: bold;
      cursor: pointer;
    }

    //.trim-text{
      white-space: nowrap;
      text-overflow:ellipsis;
      overflow: hidden;
    //}

    &.notificationType{
      max-width: 80px;
    }
    &.subject{
      max-width: 180px;
    }
    &.participantCount{
      max-width: 80px;
    }
    &.senderName{
      max-width: 130px;
    }
    &.notificationSentAt{
      max-width: 140px;
    }
  }

  tr.active {
    border: solid 1px #e4e8eb;
    background-color: rgba(211, 222, 227, 0.2);
  }
}

.table-column {
  background-color: #fff;
  border: solid 1px #e4e8eb;
  border-radius: 4px;
  font-family: "Roboto-Regular", sans-serif;
 /*  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06); */
}

.select_control {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
}

.gridHead {
  margin-top: -7px;
}

.wrapper {
  overflow-x: hidden;
}

@media (max-width: 1199px) {
  .has-sidemenu .container {
    padding-left: 30px !important;
    padding-right: 30px !important;
    width: auto;
    max-width: inherit;
  }
}



.select_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #4a4a4a;
  right: 15px;
  top: 10px;
  height: 34px;
  padding: 0px 0px 0px 1px;
  position: absolute;
  pointer-events: none;
}

.show_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #4a4a4a;
  right: 25px;
  top: 5px;
  padding: 0px 0px 0px 1px;
  position: absolute;
  pointer-events: none;
}

.sortDown {
  position: absolute;
  margin-left: 5px;
  margin-top: 3px;
}

.sortUp {
  position: absolute;
  margin-top: -4px;
  margin-left: 5px;
}

.sortUp, .sortDown {
  cursor: pointer;
  color: #666769;
  &.disable-icon {
    color: #A8A8A8;
  }
  i {
    font-size: 11px;
  }
}

.position-relative {
  position: relative;
}


.arrow-icon {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 23px;
  line-height: 10px !important;
  color: #e4e8eb;
  cursor: pointer;
}

.pagination {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 11px !important;
}

.pagination2 {
  width: 40px;
  height: 32px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 6px !important;
}

.disabledPagination {
  pointer-events: none;
}

.display-inline-flex {
  display: inline-flex !important;
}

.empty-div{
  position: relative;
  min-height: 98px;
}

.emptyGrid {
  position: absolute;
  top: 50%;
  left:48%;
  color: #4a4a4a;
  transform: translate(-50%,-48%);
}


.sent-msg{
  font-family: "Roboto-Regular", sans-serif;
  font-size: 16px;
  font-weight: bold !important;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #4a4a4a;
}
.pagination-conatiner{
  padding-top:5px;
  border-top: 1px solid #e4e8eb;
}
 .stage {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 2rem 0;
    margin: 0 -5%;
    overflow: hidden;
  }
</style>