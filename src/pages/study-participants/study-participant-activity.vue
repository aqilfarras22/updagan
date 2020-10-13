<template>
  <b-container
    fluid
    v-if="activity"
    class="study-particip-activity-page pt-30"
  >
    <b-row>
      <b-col cols="2">
        <ActivityInfo v-bind="activity" />
        <hr class="mt-30 mb-30" />
        <ParticipantInfo :participantDetails="participantInfo" :surveyLocalResponseDate="surveyLocalResponseDate" :surveyLocalResponseOffset="surveyLocalResponseOffset"/>
      </b-col>
      <b-col>
        <b-card>
          <JsonTree readableKeys :json="payload" />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import JsonTree from '@/components/common/json-tree';
import ParticipantInfo from '@/components/participants/participant-info';
import ActivityInfo from '@/components/activity/activity-info';
import moment from 'moment';

export default {
  name: 'study-participant-activity',
  components: {
    ActivityInfo,
    ParticipantInfo,
    JsonTree,
  },
  data() {
    return {
      participantInfo: {},
      activity: null,
      payload: null,
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      surveyLocalResponseDate: '',
      surveyLocalResponseOffset: '',
    };
  },
  computed: {
    activityId() {
      return this.$route.params.activityId;
    },
  },
  methods: {
    getDetails() {
      this.$api
        .getActivity({
          aId: this.activityId,
        })
        .then(data => {
          this.payload = JSON.parse(data.payload);
          this.activity = data.activity;
          if (data.surveyLocalResponseDate && data.surveyLocalResponseOffset) {
            let d = moment(data.surveyLocalResponseDate).utcOffset(data.surveyLocalResponseOffset);
            this.surveyLocalResponseDate = moment(d).format('DD MMMM YYYY hh:mm A');
            this.surveyLocalResponseOffset = data.surveyLocalResponseOffset ? (data.surveyLocalResponseOffset): ('');
          }
        })
        .catch(error => {
          const { message = 'Error while activity request' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    getParticipantDetails() {
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
        response => {
          this.participantInfo = response.body;
        },
        error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : 'Error while getting participant.');
        },
      );
    },
  },
  mounted() {
    this.getDetails();
    this.getParticipantDetails();
  },
};
</script>

<style lang="scss">
@import '~@/assets/variables.scss';
.study-particip-activity-page {
  background-color: $color_content_background;
}
</style>
