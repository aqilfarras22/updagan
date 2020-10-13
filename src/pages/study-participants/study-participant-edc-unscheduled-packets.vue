<template>
  <b-container fluid class="study-particip-details-block pt-30">
    <b-row>
      <b-col cols="2">
        <ParticipantInfo :participantDetails="participantInfo" />
      </b-col>
      <b-col cols="8" class="pl-0 pr-0">
        <div class="primaryBackGround fs-12">
          <b-row class="mb-20">
            <b-col class="pt-25" cols="5">
              <label>
                <b>Select an unscheduled packet</b>
              </label>
              <b-form-select class="fs-12" size="sm" v-model="packetSelected">
                <option :value="null">Select Unscheduled Packet</option>
                <option v-for="packet in unscheduledPackets" v-bind:value="packet.id">{{ packet.name }}</option>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="pt-20 pb-10">
            <b-col class="pr-0" cols="2">
              <b-btn size="sm" class="fs-12 btn-block" variant="outline-secondary" @click="goToParticipantDetails">Cancel</b-btn>
            </b-col>
            <b-col class="pr-0" cols="2">
              <b-btn size="sm" class="fs-12 btn-block primaryBgColor" variant="primary" @click="goToUnscheduledPacketPiView" :disabled="!packetSelected || !packetSelected.length">Continue</b-btn>
            </b-col>
          </b-row>
        </div>
        <b-row>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import find from 'lodash/find';
import ParticipantInfo from '@/components/participants/participant-info';

export default {
  name: 'Form-view',
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      participantInfo: {},
      unscheduledPackets: [],
      packetSelected: null,
    };
  },
  components: {
    ParticipantInfo,
  },
  methods: {
    // get the participant details
    getParticipantInfo() {
      this.$api.getParticipantDataFact(this.studyId, this.$route.params.participantId).then(
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
        name: 'study-participant-details',
        params: { studyId: this.studyId, participantId: this.participantId },
      });
    },

    // goto unscheduled packet forms page
    goToUnscheduledPacketPiView() {
      if (find(this.unscheduledPackets, ['id', this.packetSelected]).unscheduledForms.length) {
        this.$router.push({
          name: 'study-participant-edc-unschedule-form',
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
  },
  mounted() {
    this.getParticipantInfo();
    this.getEDCUnscheduledPackets();
  },
  computed: {},
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';
.study-particip-details-block {
  background-color: $color_content_background;
}

.primaryBackGround {
  background-color: #ffffff !important;
  padding: 0px 0px 20px 0px !important;
  width: 100% !important;
}

.primaryBgColor {
  background-color: #1e8fe1;
}
</style>

