<template>
  <div id="video-chat-container" v-if="this.apiKey!='' && this.sessionId!='' && this.token!=''">
    <Session :sessionId="sessionId" :apiKey="apiKey" :token="token" :tokensNKeys="tokenResponse"></Session>
  </div>
</template>

<script>
import toastr from "toastr";
import Session from "./Session.vue";
import { mapGetters } from "vuex";
export default {
  name: "videoChat",
  data() {
    return {
      sessionId: "",
      apiKey: "",
      token: "",
      tokenResponse: ""
    };
  },
  created() {},
  components: { Session },
  computed: { ...mapGetters(["user"]) },
  mounted() {
    var that = this;
    that.$root.$on("videoCallingInitiated", callObj => {
      that.$root.telehealthStarted = true;
      let startTimeMillisec = 0;
      let offset = 0;
      if (callObj.startTime) {
        let startTimeObj = new Date(callObj.startTime);
        offset = startTimeObj.getTimezoneOffset() * -60000;
        startTimeMillisec = callObj.startTime;
      } else {
        let currentDateObj = new Date();
        offset = currentDateObj.getTimezoneOffset() * -60000;
        startTimeMillisec = currentDateObj.getTime();
      }

      let dataObj = {
        studyId: callObj.studyId,
        participantId: callObj.threadID
          ? callObj.threadID
          : callObj.participantId,
        siteId: this.user.siteIds ? this.user.siteIds[0] : null,
        startTime: startTimeMillisec,
        endTime: null,
        completionWindow: 0,
        visitType: callObj.id ? "Scheduled" : "Unscheduled",
        visitId: callObj.visitId ? callObj.visitId : null
      };

      let queryParams = {
        pid: this.user.id,
        offset: offset,
        appointmentId: callObj.id ? callObj.id : null
      };
      if(callObj.deviceRegistrationStatus!=undefined){
        queryParams.deviceRegistrationStatus = callObj.deviceRegistrationStatus;
      }

      that.$api.getVideoCallSession(queryParams, dataObj).then(
        response => {
          let responseObj = response.body;
          that.tokenResponse = responseObj;
          that.apiKey = responseObj.apiKey;
          that.sessionId = responseObj.sessionId;
          that.token = responseObj.token;
          window.localStorage.setItem(
            "thread-currentCallId",
            responseObj.appointmentId
          );

          //add appointment to tokenResponse to bifurcate between the schedule and unschedule call
          that.tokenResponse.appointmentType = callObj.type
            ? callObj.type
            : "Unscheduled";
        },
        error => {
          that.$root.$emit("videoCallEnded");
          if(error.status==406){
            toastr.error("This participant is no longer using the app. This call is not possible.");
            return;
          }

          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the session tokens!"
          );
        }
      );
    });

    //Look for the end call event initiated from the PI
    this.$root.$on("videoCallEnded", () => {
      this.apiKey = "";
      this.sessionId = "";
      this.token = "";
      this.$root.telehealthStarted = false;
    });
  }
};
</script>

<style scoped lang="scss">
#video-chat-container {
  position: fixed;
  width: 26%;
  height: 100%;
  background: transparent;
  z-index: 999;
  right: 0;
  top: 0;
}
</style>
