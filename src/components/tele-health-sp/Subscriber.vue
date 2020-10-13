<template>
  <div></div>
</template>

<script>
import toastr from "toastr";

export default {
  name: "subscriber",
  data() {
    return {
      subscriber: null
    };
  },
  props: {
    stream: {
      type: OT.Stream,
      required: true
    },
    session: {
      type: OT.Session,
      required: true
    },
    opts: {
      type: Object,
      required: false
    },
    enableSpeaker: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    enableSpeaker(value) {
      this.subscriber.subscribeToAudio(value);
    }
  },
  mounted: function() {
    var self = this;

    this.subscriber = this.session.subscribe(
      this.stream,
      this.$el,
      this.opts,
      err => {
        if (err) {
          this.$emit("error", err);
        } else {
          //Based on the speaker button value, start the stream intially with
          this.subscriber.subscribeToAudio(this.enableSpeaker);
          this.$emit("subscriberConnected", this.subscriber);
        }
      }
    );

    this.$emit("subscriberCreated", this.subscriber);

    this.subscriber.on("audioBlocked", function() {
      self.$emit("enableBlockedAudio");
    });

    this.subscriber.on("disconnected", function() {
      self.$emit(
        "streamSatus",
        "Oops seems like video stream has been interrupted"
      );
    });

    //Event listner for the video disabled event
    this.subscriber.on("videoDisabled", function() {
      self.$emit("videoDisabled", true);
      self.$emit("streamSatus", "Seems like video has been disabled");
    });

    //Event listner for the video enabled event
    this.subscriber.on("videoEnabled", function() {
      self.$emit("videoDisabled", false);
    });

    this.subscriber.on("destroyed", function() {
      if (self.session.isConnected()) {
        self.session.disconnect();
        //Emit an event to hide/end the video call component
        self.$root.$emit("videoCallEnded");
        toastr.error("This meeting has been ended by the participant");
      }
    });
  }
};
</script>
