<template>
  <div class="study-particip-details-block" :class="{'telehealth-call': telehealthCallStatus}">
    <div class="nav-breadcrumb pt-10 pl-4">
      <NavigationBreadcrumb :navigationWidth="navigationWidth" :navigationOptions="navigationOptions" @toggleParticipant="toggleParticipant"></NavigationBreadcrumb>
    </div>
	  <div class="clear-float"></div>
    <PiiAndNonPiiInfo class="clear-both" v-if="participantInfo" :participantDetails="participantInfo" @expanded="piInfoExpanded"></PiiAndNonPiiInfo>
    <b-row class="mt-6" id="edcFromDetail">
      <b-col cols="12" class="p-0 forms-action-button">
        <ParticipantInfo :participantDetails="participantInfo" :areActionsAllowed="areActionsAllowed" />
      </b-col>
      <b-col cols="12" class=" edc-wrap pl-0 pr-0 mt-45">
        <div class="primaryBackGround fs-12">
          <b-row>
            <b-col cols="5">
              <label>
                <b>Select an unscheduled packet</b>
              </label>
              <b-form-select class="fs-12" size="md" v-model="packetSelected">
                <option :value="null">Select Unscheduled Packet</option>
                <option v-for="packet in unscheduledPackets" v-bind:value="packet.id">{{ packet.name }}</option>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="pt-20 pb-10">
            <b-col class="pr-0 col-sm-2 col-md-2" cols="1">
              <b-btn size="sm" class="fs-12 btn-block cancel" variant="outline-secondary" @click="goToParticipantDetails">Cancel</b-btn>
            </b-col>
            <b-col class="pr-0 col-sm-2 col-md-2" cols="1">
              <b-btn size="sm" class="fs-12 btn-block primaryBgColor" variant="primary" @click="goToUnscheduledPacketPiView" :disabled="!packetSelected || !packetSelected.length">Continue</b-btn>
            </b-col>
          </b-row>
        </div>
        <b-row>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import find from 'lodash/find';
import PiiAndNonPiiInfo from "@/components/participants/pii-and-non-pii-info";
import NavigationBreadcrumb from "@/components/common/navigation-breadcrumb";
import ParticipantInfo from '@/components/participants/participant-info-new';
import { mapGetters } from 'vuex';
export default {
  name: 'Form-view',
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      participantInfo: {},
      unscheduledPackets: [],
      packetSelected: null,
      navigationOptions: [
        {name: "Profile", isLink: true, route: 'participant-profile', params: {studyId: this.$route.params.studyId}, displayOrder: 2},
        {name: "Participants", isLink: true, route: 'study-participants-list', params: {studyId: this.$route.params.studyId}, displayOrder: 1},
        {name: "Packet", isLink: false, route: null, params: null, displayOrder: 3}
      ],
      areActionsAllowed: {
        document: false,
        telehealth: true,
        edcforms: false,
        approval: false,
        verifyBtn: false,
        send: false,
        sign: false,
        print: false,
      },
      navigationWidth: "66%",
      telehealthCallStatus: false
    };
  },
  components: {
    PiiAndNonPiiInfo,
    NavigationBreadcrumb,
    ParticipantInfo
  },
  methods: {
    // get the participant details
    piInfoExpanded(isExpanded) {
      let c = document.getElementById('edcFromDetail');
      if(isExpanded) {
        setTimeout(() => {
          let expandEle = document.getElementById('collapse-piiandnon-pii');
          window.$('#edcFromDetail').animate({
            paddingTop: (expandEle.offsetHeight - 34) + 'px'
          })
        }, 400);
      } else {
        c.style.paddingTop = '0px';
      }
    },
    getParticipantInfo() {
      this.$api.getParticipantDataFactV2(this.studyId, this.$route.params.participantId).then(
        response => {
          this.participantInfo = response.body;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting participant.',
          );
        },
      );
    },
    sortArrayOfObject(arrObject) {
      arrObject.sort(function(a, b) {
        var strA = a.name.toUpperCase();
        var strB = b.name.toUpperCase();
        return (strA < strB) ? -1 : (strA > strB) ? 1 : 0;
      });
      return arrObject;
    },
    // get the unscheduled packets details
    getEDCUnscheduledPackets() {
      this.$api
        .getUnscheduledPacketsFact(this.studyId)
        .then(response => {
          this.unscheduledPackets = response.body;
          this.unscheduledPackets = this.sortArrayOfObject(this.unscheduledPackets);
        })
        .catch(error => {
          if (error && (error.message || error.body.message)) {
            this.$toastr.error(error.message || error.body.message);
          } else {
            this.$toastr.error('Unable to fetch the unscheduled packets');
          }
        });
    },

    // goto participant details page
    goToParticipantDetails() {
      this.$router.push({
        name: 'participant-profile',
        params: { studyId: this.studyId, participantId: this.participantId },
      });
    },

    // goto unscheduled packet forms page
    goToUnscheduledPacketPiView() {
      if (find(this.unscheduledPackets, ['id', this.packetSelected]).unscheduledForms.length) {
        this.$router.push({
          name: 'study-participant-edc-unschedule-form-reskin',
          params: {
            studyId: this.studyId,
            participantId: this.participantId,
            packetId: this.packetSelected,
            unscheduledPacketResponseId: '0',
          },
        });
      } else {
        this.$toastr.warning('There are no forms available in the selected packet.');
      }
    },
    toggleParticipant(participant) {
      this.$router.push({
        name: 'study-participant-edc-unschedule-packets-reskin',
        params: {studyId: this.studyId, participantId: participant.id}
      });
      this.participantId = participant.id;
      this.getParticipantInfo();
    }
  },
  mounted() {
    this.getParticipantInfo();
    this.getEDCUnscheduledPackets();
  },
  computed: {
    ...mapGetters(["getVideoCallStatus"]),
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.telehealthCallStatus = isCallInProgress;
    },
  }
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';
.study-particip-details-block {
  background-color: #ffffff !important;
  .participant-detail-section {
    background-color: #fff;
  }
}
.edc-wrap {
  height: 630px;
  label {
    font-size: 14px;
    color:  #4a4a4a;
  }
}
.btn-block {
  border: solid 1px #e4e8eb;
  padding: 11px;
  font-size: 14px;
  border-radius: 4px;
  &.cancel {
    color:  #4a4a4a;
  }
}
.custom-select {
  background-image: url(/static/img/icon-2-down.png) !important ;
}
</style>
