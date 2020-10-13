<template>
    <div class="participant-send-section">
      <ParticipantComposeMessage v-if="participantComMsgId" v-on:toggleMessageSec="toggleMessageSec" :participantInfo="participantInfo" :participantComMsgId="participantComMsgId" class="mb-22" ></ParticipantComposeMessage>
      <sentMessages :participantInfo="participantInfo"></sentMessages>
    </div>
</template>
<script>
import ParticipantComposeMessage from "@/components/common/compose-message";
import sentMessages from "@/components/common/site-participant-messages";

export default {
    name: "ParticipantSendMessage",
/*     data(){
      return {
        composeMessageId: null
      }
    }, */
    props: {
      participantInfo: Object,
      participantComMsgId: String
    },
    components: {
      ParticipantComposeMessage,
      sentMessages
    },
    /* watch: {
      participantInfo(newParticipantInfo, oldParticipantInfo){
        //This code will fire when the participant is changed from the PID drop-down
        if(newParticipantInfo.participantId == oldParticipantInfo.participantId){
          return; //There is some code flaw in study-participants-details file thats why we have added this code.
        }
        console.log('watcher sendMessage file')  
        this.composeMessageId = null;
        //todo remove this compose id from local storage.
      }
    }, */
    methods: {
      toggleMessageSec(value) {
        this.$emit('toggleMessageSec', value)
      },
      /* createCompseID(){
        return Array(16)
          .fill(0)
          .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
          .join('') + 
          Date.now().toString(24);
      } */
    },
    /* mounted() {    
      //TODO: Need to create composeid only if it is null and store in the data prop, send to the send-messages comp.
      if(!this.composeMessageId){
        console.log('send-message-first')
        this.composeMessageId = this.createCompseID();
        localStorage.setItem(this.composeMessageId, JSON.stringify({}));
      }
    }, */
}
</script>
<style lang="scss" scoped>
.participant-send-section{
  padding: 0px 20px 40px;
}
</style>