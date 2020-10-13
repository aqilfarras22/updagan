<template>
  <div id="SecondsUntilExpire" :style="{ width: activeWidth}">
    <vue-progress-bar class="progress_bar_header"></vue-progress-bar>
    <router-view></router-view>
    <videoChat></videoChat>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { browserClassNames } from "@/utils/browserInfo";
import videoChat from "../tele-health-sp/video-chat";
export default {
  name: "App",
  data() {
    return {
      activeWidth: "auto"
    };
  },
  components: {videoChat},
  computed: mapGetters(["user", "token"]),
  watch: {
    user() {
      this.setAccess();
    }
  },
  created() {
    this.setAccess();
  },
  methods: {
    ...mapActions(["clientIdSuccess", "clientName"]),
    setAccess() {
      if (this.token) {
        this.access = ["public", "auth", this.user.userRole];
      } else {
        this.access = ["public"];
      }
    }
  },
  mounted() {
    document.body.className += ` ${browserClassNames}`;

    var self = this;

    //Video Call Started resize the width of main div
    this.$root.$on("videoCallSessionConnected", callObj => {
      self.$store.dispatch("setVideoCallStatusAction", true);

      this.activeWidth = "74%";
    });

    //Video Call ended revert back the width
    this.$root.$on("videoCallEnded", () => {
      this.$store.dispatch("setVideoCallStatusAction", false);

      this.activeWidth = "100%";
    });
  }
};
</script>
<style scoped lang="scss">
#SecondsUntilExpire {
  max-height: 0px;
}
</style>
