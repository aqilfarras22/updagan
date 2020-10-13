<template>
  <transition name="slide">
    <div
      id="video-chat-session"
      :class="{subscriberVideoDisabled: isSubscriberVideoOff}"
      @error="errorHandler"
      class="d-flex"
    >
      <div class="video-container">
        <div id="end-call" v-if="askEndCallConfirmation">
          <div id="end-call-content">
            <div class="mb-15">Are you sure want to end the call</div>
            <button type="button" @click="hangUp" class="btn btn-danger btn-sm btn-block">End call</button>
            <button
              type="button"
              @click="cancelEndCall"
              class="btn btn-secondary btn-sm btn-block"
            >Cancel</button>
          </div>
        </div>
        <div id="subscribers" class="subscribers" v-for="stream in streams" :key="stream.streamId">
          <subscriber
            @error="errorHandler"
            @streamSatus="onStreamSatusUpdate"
            @videoDisabled="onVideoDisabled"
            @enableBlockedAudio="enableBrowserDisabledAudio"
            :stream="stream"
            :session="session"
            :opts="options"
            :enableSpeaker="publishSpeakerAudio"
          ></subscriber>
        </div>
        <publisher
          :session="session"
          @error="errorHandler"
          :opts="options"
          :enableAudio="publishMicAudio"
          :endCall="endVideoCall"
          :stream="streams"
          :apiTokensResponse="tokensNKeys"
          :screenShare="screenShareValue" 
          :changeMode="changeModeValue"
          @sharingStopped="videoChange"
          @videoStopped="screenSharing"
        ></publisher>
      </div>
      <div class="button-controls">
        <div v-if="callConnected"
          title="Screen share"
          @click="videoChange"
          :class="[ screenShareOn ? 'share-btn-off': 'share-btn', 'btn-set' ]"
        ></div>
        <div
          title="Toggle Speaker"
          @click="toggleSpeaker"
          :class="[ publishSpeakerAudio ? 'speaker-btn': 'speaker-btn-off', 'btn-set' ]"
        ></div>
        <div
          title="Toggle Microphone"
          @click="toggleMic"
          :class="[ publishMicAudio ? 'mic-btn': 'mic-btn-off', 'btn-set' ]"
        ></div>
        <div title="Leave Meeting" @click="showEndCallConfrimation" class="btn-set hang-up"></div>
      </div>
      <div class="stream-status-container align-self-center text-center">
        <div class="spinner" v-if="waiting">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        {{ streamStatusTxt }}
      </div>
      <div id="preloadBtnImages">
        <img src="/static/img/video-call/mute-mic.png">
        <img src="/static/img/video-call/speaker-off.png">
      </div>
    </div>
  </transition>
</template>

<script>
import toastr from "toastr";
import moment from "moment";
import OT from "@opentok/client";
import Publisher from "./Publisher.vue";
import Subscriber from "./Subscriber.vue";
import { mapGetters } from "vuex";


export default {
  name: "session",
  data: () => ({
    streams: [],
    session: null,
    options: {
      insertMode: "append",
      width: "100%",
      height: "100%",
      style: {
        buttonDisplayMode: "off",
        nameDisplayMode: "off",
        backgroundImageURI: "",
        audioBlockedDisplayMode: "off"
      }
    },
    streamStatusTxt: "Waiting for your participant to join",
    publishMicAudio: true,
    publishSpeakerAudio: true,
    endVideoCall: false,
    waiting: true,
    isSubscriberVideoOff: false,
    askEndCallConfirmation: false,
    screenShareValue: '',
    screenShareOn: false,
    callConnected: false,
    changeModeValue: false
  }),
  computed: {
    ...mapGetters(["user"])
  },
  components: { Publisher, Subscriber },
  props: {
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
    tokensNKeys: {
      required: true,
      type: Object
    }
  },
  created() {
    var self = this;
    this.session = OT.initSession(this.apiKey, this.sessionId);
    if (this.session) {
      this.session.connect(this.token, err => {
        if (err) {
          errorHandler(err);
        }

        //Emit an event to notify that video call session has been created
        this.$root.$emit("videoCallSessionConnected");
      });

      this.session.on("streamCreated", event => {
        //Subscriber has joined the meeting hide waiting icon
        this.callConnected = true;
        this.waiting = false;
        if (this.streams.length == 0) {
          this.streams.push(event.stream);
        }

        let currentDateObj = new Date();
        let sessionId = event.target.sessionId;
        let offset = currentDateObj.getTimezoneOffset();
        let callStartTime = moment.utc().valueOf(); //currentDateObj.getTime() - offset * -60000;
        let pId = self.user.id;
        //Call an API to update the call start time
        self.$api
          .updateTelehealthCallStartTime(sessionId, callStartTime, pId)
          .then(
            response => {},
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while updating the call time!"
              );
            }
          );
      });

      this.session.on("streamDestroyed", event => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
        }
      });
    }
  },
  methods: {
    // errorHandler,
    toggleMic() {
      this.publishMicAudio = !this.publishMicAudio;
    },
    toggleSpeaker() {
      this.publishSpeakerAudio = !this.publishSpeakerAudio;
    },
    hangUp() {
      this.endVideoCall = true;
      this.cancelEndCall();
    },
    showEndCallConfrimation() {
      this.askEndCallConfirmation = true;
    },
    cancelEndCall() {
      this.askEndCallConfirmation = false;
    },
    onStreamSatusUpdate(streamStatus) {
      this.waiting = false;
      this.streamStatusTxt = streamStatus;
    },
    onVideoDisabled(videoValue) {
      this.isSubscriberVideoOff = videoValue;
    },
    enableBrowserDisabledAudio() {
      if (this.publishSpeakerAudio) {
        OT.unblockAudio();
      }
    },
    videoChange() {
      this.changeModeValue = true;
      if(this.screenShareValue === '') {
      this.screenShareValue = 'screen';
      }
      else if(this.screenShareValue === 'screen'){
        this.screenShareValue = 'video';
      }
      else {
        this.screenShareValue = 'screen';
      }
    },
    screenSharing(value) {
      this.screenShareOn = value;
      this.changeModeValue = false;
      if(value) {
      this.screenShareValue = 'screen';
      }
      else {
      this.screenShareValue = 'video';
      }
    },
    errorHandler(err) {
      if (err.name == "OT_USER_MEDIA_ACCESS_DENIED" && (this.screenShareValue !== '')) {
        toastr.error(
          "Screen sharing has been declined"
        );
        this.screenShareValue = 'video';
        this.changeModeValue = false;
      }
      else if (err.name == "OT_USER_MEDIA_ACCESS_DENIED") {
        toastr.warning(
          "Please grant access to camera and microphone in order to start the call"
        );
      }

      else {
        toastr.error(err.message);
      }
      }
      },
  mounted() {
    /* // Make the DIV element draggable:
    dragElement(document.getElementById("video-chat-session"));

    function dragElement(elmnt) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(
          elmnt.id + "header"
        ).onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    } */
  }
};
</script>

<style>
#video-chat-session {
  background: #000;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  color: #ffffff;
}

.video-container .OT_subscriber {
  position: absolute;
  width: 100%;
  height: 100%;
}

.video-container .OT_publisher {
  width: 100px !important;
  height: 120px !important;
  top: 20px;
  right: 20px;
  z-index: 100;
  border: 0;
  border-radius: 3px;
  position: absolute;
}
.button-controls {
  background: #2d3752;
  color: #000;
  padding: 20px;
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
}
.button-controls .btn-set {
  border: 1px solid #ffffff;
  border-radius: 100%;
  display: inline-block;
  cursor: pointer;
  margin-left: 15px;
  /* transition: all 250ms cubic-bezier(0.02, 0.01, 0.47, 1); */
}

#preloadBtnImages {
  position: absolute;
  top: -5000px;
  background: url("/static/img/video-call/mute-mic.png") no-repeat -9999px -9999px;
  background: url("/static/img/video-call/mute-mic.png") no-repeat -9999px -9999px,
    url("/static/img/video-call/speaker-off.png") no-repeat -9999px -9999px;
}

.mic-btn {
  background: url("/static/img/video-call/mic.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") 11px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

/* .mic-btn::before {
  content: url("/static/img/video-call/mute-mic.svg") no-repeat;
  width: 0;
  height: 0;
  visibility: hidden;
} */

/* .mic-btn:hover {
  background: url("/static/img/video-call/mute-mic.svg") no-repeat;
  width: 40px;
  height: 40px;
  background-size: cover; */
/* transform: translate(0, -3px);
  transition-delay: 0s !important; */
/* } */

.mic-btn-off {
  background: url("/static/img/video-call/mute-mic.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") -31px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

/* .mic-btn-off:hover {
  background: url("/static/img/video-call/mic.svg") no-repeat;
  width: 40px;
  height: 40px;
  background-size: cover; */
/* transform: translate(0, -3px);
  transition-delay: 0s !important; */
/* } */

.speaker-btn {
  background: url("/static/img/video-call/speaker.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") -73px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

.share-btn {
  background: url("/static/img/video-call/screen-on.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") -73px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

.share-btn-off {
  background: url("/static/img/video-call/screen-off.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") -73px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

/* .speaker-btn::before {
  content: url("/static/img/video-call/speaker-off.svg") no-repeat;
  width: 0;
  height: 0;
  visibility: hidden;
} */

/* .speaker-btn:hover {
  background: url("/static/img/video-call/speaker-off.svg") no-repeat;
  width: 40px;
  height: 40px;
  background-size: cover; */
/* transform: translate(0, -3px);
  transition-delay: 0s !important; */
/* } */

.speaker-btn-off {
  background: url("/static/img/video-call/speaker-off.png") no-repeat;
  /* background: url("/static/img/video-call/btn-sprite.svg") -115px 0 no-repeat; */
  width: 40px;
  height: 40px;
  background-size: cover;
}

/* .speaker-btn-off:hover {
  background: url("/static/img/video-call/speaker.svg") no-repeat;
  width: 40px;
  height: 40px;
  background-size: cover; */
/* transform: translate(0, -3px);
  transition-delay: 0s !important; */
/*}*/

.hang-up {
  background: url("/static/img/video-call/hangup.png") no-repeat;
  width: 40px;
  height: 40px;
  background-size: cover;
  border: 0 !important;
}

/*.hang-up:hover {
   transform: translate(0, -3px);
  transition-delay: 0s !important;
} */

.stream-status-container {
  width: 100%;
}

#video-chat-session.subscriberVideoDisabled .stream-status-container {
  z-index: 1;
}

#video-chat-session.subscriberVideoDisabled .OT_video-poster {
  z-index: inherit;
}

#video-chat-session.subscriberVideoDisabled
  .OT_audio-level-meter__audio-only-img {
  display: none;
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}

/*Waiting for Participant Loader Css*/
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 0 auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
/*Waiting for Participant Loader Ends*/
#end-call {
  position: absolute; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  background-color: rgba(
    105,
    105,
    105,
    0.7
  ); /* Black background with opacity */
  z-index: 9999; /* Specify a stack order in case you're using a different order for other elements */
}
#end-call-content {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 16px;
  color: white;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
</style>

