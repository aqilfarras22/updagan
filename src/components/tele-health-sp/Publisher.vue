<template>
  <div></div>
</template>

<script>
import toastr from "toastr";
import moment from "moment";
import OT from "@opentok/client";
import { mapGetters } from "vuex";
export default {
  name: "publisher",
  data() {
    return {
      publisher: null,
      callStartedTime: null,
      autoDisconnected: false,
      waitTimeInterval: null
    };
  },
  props: {
    session: {
      type: OT.Session,
      required: false
    },
    opts: {
      type: Object,
      required: false
    },
    enableAudio: {
      type: Boolean,
      required: false
    },
    endCall: {
      type: Boolean,
      required: false
    },
    stream: {
      type: Array,
      required: true
    },
    apiTokensResponse: {
      type: Object,
      required: true
    },
    screenShare: {
      type: String,
      required: false
    },
    changeMode: {
      type: Boolean,
      required: false
    }
  },
  computed: { ...mapGetters(["user"]) },
  watch: {
    enableAudio(value) {
      this.publisher.publishAudio(value);
    },
    endCall() {
      //Stop publishing the video
      this.publisher.publishVideo(false);

      //Destroy the publisher  session
      this.publisher.destroy();
    },
    stream(streamVal) {
      if (streamVal.length > 0) {
        clearInterval(this.waitTimeInterval);
      }
    },
    changeMode(value) {
      if(value) {
      this.changeVideo();
      }
    }
  },
  mounted() {
    this.startPublisherVideo(this.opts);
  },
  methods: {
    startPublisherVideo(opts) {
    var self = this;

    this.publisher = OT.initPublisher(this.$el, opts, err => {
      if (err) {
        this.$emit("error", err);
      } else {
        this.$emit("publisherCompleted");
        this.$root.$emit("publisherStreamStarted");
      }
    });

    //this.$emit("publisherCreated", this.publisher);
    const publish = () => {
      this.session.publish(this.publisher, err => {
        if (err) {
          this.$emit("error", err);
        } else {
          //Based on the mic button value, start the stream intially with
          this.publisher.publishAudio(this.enableAudio);
          this.$emit("publisherConnected", this.publisher);

          //update the callStarted
          this.callStartedTime = moment();

          //And start calculating the wait time till the participant join it for unschedule call. this is for auto hangout

          if (
            this.apiTokensResponse.appointmentType.toLowerCase() ==
            "unscheduled"
          ) {
            this.calculateWaitTime();
          }

          if (self.stream.length <= 0) {
            this.notifyParticipantOfTelehealthCall();
          }
        }
      });
    };

    if (this.session && this.session.isConnected()) {
      publish();
    }

    if (this.session) {
      this.session.on("sessionConnected", publish);
    }

    this.publisher.on("accessDenied", function() {
      //self.setDeclineCallStatus(); //Commented as per discussion with Divesh
      //Emit an event to hide/end the video call component
      self.$root.$emit("videoCallEnded");
      self.session.disconnect();
    });

    this.publisher.on("disconnected", function() {
      toastr.error("Oops seems like video stream has been interrupted");
    });

    this.publisher.on("destroyed", function(event) {
      if (self.session.isConnected()) {
        self.session.disconnect();
        //Emit an event to hide/end the video call component
        self.$root.$emit("videoCallEnded");

        //ClearWaitTimeInterval
        clearInterval(self.waitTimeInterval);

        if (self.autoDisconnected) {
          toastr.error("Participant was unable to answer the call");
        } else if (!self.endCall) {
          toastr.error("Your participant declined your video call invite");
        }

    
        /* //Commented as per discussion with Divesh
        if (
          (self.autoDisconnected || self.endCall) &&
          self.stream.length <= 0
        ) {
          self.setDeclineCallStatus();
        } */
      }
    });
  },
  startPublisherScreen(opts) {
    var self = this;
    
    OT.checkScreenSharingCapability(function(response) {
  if(!response.supported || response.extensionRegistered === false) {
    // This browser does not support screen sharing.
    toastr.error("This browser does not support screen sharing");

  } else if (response.extensionInstalled === false) {
    // Prompt to install the extension.
    toastr.error("Please install the extension to support screen sharing");
  } else {
    self.publisherScreen = OT.initPublisher(self.$el, opts, err => {
      if (err) {
        self.$emit("error", err);
      } 
      else {
        self.$emit("videoStopped",true)
        // this.$emit("publisherCompleted");
        // this.$root.$emit("publisherStreamStarted");
      }
    });
  }
    });

    //this.$emit("publisherCreated", this.publisher);

    const publish = () => {
      this.session.publish(this.publisherScreen, err => {
        if (err) {
          this.$emit("error", err);
        } else {
          //Based on the mic button value, start the stream intially with
          this.publisherScreen.publishAudio(this.enableAudio);
          this.$emit("publisherConnected", this.publisherScreen);

        }
      });
    };

    if (this.session && this.session.isConnected()) {
      publish();
    }

    if (this.session) {
      this.session.on("sessionConnected", publish);
    }

    this.publisherScreen.on("disconnected", function() {
      toastr.error("Oops seems like screen stream has been interrupted");
    });

    this.publisherScreen.on('mediaStopped', function(event) {
      self.$emit('videoStopped',false);
    });

  },
    calculateWaitTime() {
      this.waitTimeInterval = setInterval(() => {
        let currentTime = moment();
        let timeDiff = currentTime.diff(this.callStartedTime, "minutes");

        if (this.stream.length <= 0 && timeDiff >= 5) {
          clearInterval(this.waitTimeInterval);

          //Auto Disconnect
          this.autoDisconnected = true;

          //Stop publishing the video
          this.publisher.publishVideo(false);

          //Destroy the publisher  session
          this.publisher.destroy();
        }
      }, 3000);
    },
    /* setDeclineCallStatus() {
      //Call an API to update the call start time
      let declineParams = {
        pId: this.user.id,
        id: this.apiTokensResponse.appointmentId
      };

      this.$api.setDeclineCallStatus(declineParams).then(
        response => {},
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while setting cacelled call status!"
          );
        }
      );
    }, */
    notifyParticipantOfTelehealthCall() {
      let notifyParams = {
        studyId: this.apiTokensResponse.studyId,
        participantId: this.apiTokensResponse.participantId,
        appointmentId: this.apiTokensResponse.appointmentId,
        message: "Your study team is video calling you. Tap to join call."
      };

      this.$api.notifyParticipantForTelehealthCall(notifyParams).then(
        response => {
          if(response.status==406){
            toastr.warning(response.bodyText);
          }
        },
        error => {
          if(error.status==406){
            toastr.warning(error.bodyText);
            return;
          }
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while notifyinng participant about this call"
          );
        }
      );
    },
    changeVideo() { 
      if(this.screenShare === 'screen') {
      this.opts.videoSource = 'screen'
      this.startPublisherScreen(this.opts);
      }
      else if(this.screenShare === 'video'){
      this.session.unpublish(this.publisherScreen);
      this.$emit("videoStopped",false)
      }
  }
  }
};
</script>
