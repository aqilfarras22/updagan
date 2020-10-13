<template>
  <div class="component">
    <b-container id="sent-message-list" fluid class="pl-30 pt-32 pb-30" :class="{'shrink': notificationId}">
      <div class="header-title mb-24">
        Messages
        <div class="compose-div">
          <button @click="composeMessage" class="btn compose-btn">Compose Message</button>
        </div>
      </div>
      <sentMessages v-on:participantSelected="getNotificationId"></sentMessages>
      <div class="note">Note: This is a list of outgoing messages sent to the participants. Messages come from a noreply email address. Any responses from participants will not be delivered.</div>
    </b-container>
    <transition name="slide-fade">
      <div v-show="notificationId" id="sent-message-right-bar"> <SendMessagesRightBar :notificationId="notificationId" v-on:closeParticipantRightSidebar="closeSidebar"></SendMessagesRightBar> </div>
    </transition>
  </div>
</template>
<script>
import localStorageService from "@/services/localStorage";
import sentMessages from "@/components/common/site-participant-messages";
import SendMessagesRightBar from "@/components/common/sent-to-participant-list.vue";

export default {
  name: "study-participant-messages",
  components: {
   sentMessages,
   SendMessagesRightBar
  },
  data() {
    return {
      notificationId: null
    };
  },
  methods: {
    createCompseID(){
      return Array(16)
        .fill(0)
        .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
        .join('') + 
        Date.now().toString(24);
    },
    composeMessage(){
      let composeMessageId = this.createCompseID();
      localStorageService.setItem(composeMessageId, {});
      this.$router.push({
        name: "study-participant-compose-message",
        params: { composeMessageId: composeMessageId }
      });
    },
    getNotificationId(value) {
      this.notificationId = value;
    },
    closeSidebar() {
      this.notificationId = null;
    }
  }
};
</script>
<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.header-title {
  font-family: "Roboto-medium", sans-serif;
  font-size: 22px !important;
  font-weight: 500 !important;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.09;
  letter-spacing: normal;
  color: #2d3752;
  position: relative;
}

.compose-div{
  position: absolute;
  right: 0;
  top: -10px;  
  .compose-btn{
  border: solid 1px #e4e8eb;
  background-color: #4c8ce4;
  color: #ffffff;
  font-size: 14px;
  font-family: "Roboto-Regular", sans-serif;
   letter-spacing: -0.34px;
   padding: 8px 26px;
}
}
.note{
  margin-top: 16px;
  color: #2d3752;
  opacity: 0.6 !important;
}
#sent-message-list {
  padding-right: 2%;
}
#sent-message-list {
  &.shrink {
  width: 70%;
  float: left;
  }
/*   &.expand {
    width: 100%;
    float: none;
  } */
}
#sent-message-right-bar {
  width: 30%;
  float: right;
 /*  padding-right: 2%; */
}
</style>