<template>
  <b-card :title="$t('enrollment.completionChartTitle')">
    <p><strong>{{chosenCountry}} - {{chosenSite}} </strong></p>
    <div class=".thread-consent-ct1">
      <participant-completion :data="vis" />
    </div>
  </b-card>
</template>

<script>
import ParticipantCompletionChart from "../charts/completion-chart";

export default {
  props: {
    vis: { type: Array, default: [] },
    chosenCountry: { type: String, default: null },
    chosenSite: { type: String, default: null },
  },
  data() {
    return {
      newVis: this.vis
    };
  },
  watch: {
    vis() {
      this.newVis = this.vis;
    }
  },
  components: {
    "participant-completion": ParticipantCompletionChart,
  },
};
</script>
