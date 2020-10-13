<template>
  <div :class="containerClass" :id="componentId">
    <!-- Legends -->
    <div class="participant-completion-legend-table-wrap">
      <table class="participant-completion-legend-table">
        <tr>
          <td>
            <span class="participant-completion-legend-visited completion-item-anim"></span>
            <span class="participant-completion-legend-text">Complete</span>
          </td>
          <td>
            <span class="participant-completion-legend-unvisited completion-item-anim"></span>
            <span class="participant-completion-legend-text">Incomplete</span>
          </td>
          <td>
            <span class="participant-completion-legend-incoming completion-item-anim"></span>
            <span class="participant-completion-legend-text">Upcoming</span>
          </td>
        </tr>
      </table>
    </div>
    <!-- Main table container -->
    <table>
      <tr>
        <td style="width: 90%;">
            <transition name="fade">
              <div v-if="showTableContainer">
                <table v-if="tableData != null" class="participant-completion-table">
                  <!-- <tr style="display:none;">
                    <td :colspan="maxActivities + 2"></td>
                    <td>  
                  </tr> -->
                  <!-- Participant rows -->
                  <tbody>
                  <tr v-for="(r, i) in tableData" :key="r.participantName">
                    <!-- Participant name column -->
                    <td style="width: 10%;">
                      <div class="completion-description-anim">{{r.participantName}}</div>
                    </td>
                    <!-- Completion boxes matrix -->
                    <td
                      v-for="c in r.completionMatrix"
                      :key="c.completionItemId"
                      :style="'width: ' + tableItemSize + '%;'"
                    >
                      <div class="participant-completion-box-wrap">
                        <!-- Status box -->
                        <div :id="c.completionItemId" :class="c.statusClass + ' completion-item-anim'"></div>
                        <!-- Tooltip -->
                        <b-tooltip :target="c.completionItemId">
                          <div style="text-align: left;">
                            <strong>Participant:</strong>
                            {{r.participantName}}
                            <br />
                            <strong>Activity:</strong>
                            {{c.activityName}}
                            <br />
                            <strong>Status:</strong>
                            {{c.status}}
                            <br />
                            <strong>Completed at:</strong>
                            {{c.completedDate}}
                          </div>
                        </b-tooltip>
                      </div>
                    </td>
                    <!-- Completion percentage column -->
                    <td style="width: 10%;">
                      <div class="completion-description-anim">
                        <span
                          class="completion-counter participant-completion-percent"
                        >{{r.completionPercent}}%</span>
                      </div>
                    </td>
                  </tr>
                  <!-- Site completion footer -->
                  <tr v-if="footerData != null">
                    <td style="width: 10%;">
                      <div class="completion-description-anim">
                        <strong>{{$t('general.activity')}}</strong>
                      </div>
                    </td>
                    <td v-for="fc in footerData" :key="fc" :style="'width: ' + tableItemSize + '%;'">
                      <div class="participant-completion-footer completion-description-anim">
                        <div class="participant-completion-footer-text">{{fc}}</div>
                      </div>
                    </td>
                    <td style="width: 10%;"></td>
                  </tr>
                  <tr>
                    <td style="width: 10%;" />
                    <td :colspan="maxActivities" align="center">
                      <div style="font-style: italic;">
                        {{$t('enrollment.completionChartXAxisLabel')}}
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </transition>
        </td>
        <td style="width: 10%;">
            <div class="rotate">
                  {{$t('enrollment.percentCompletion')}}
            </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
// import * as d3 from "d3";
// import * as constant from "../../constants/config";

export default {
  props: {
    data: {
      type: Array,
    },
    containerClass: {
      type: String,
      default: "thread-chart",
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timelineChart: null,
      componentId: "completion-chart",
      newData: this.data,
      tableData: null,
      footerData: null,
      tableItemSize: 0,
      showTableContainer: false,
      maxActivities: 0,
    };
  },
  watch: {
    data() {
      this.newData = this.data;
      this.render();
    },
  },
  methods: {
    async animatePercent() {
      const maxSteps = 20;
      const delayMs = 1000 / maxSteps;
      var steps = 1;
      const tableData = this.tableData;
      const updateCounter = function () {
        tableData.forEach(function (c) {
          const maxTarget = c.completionPercentMax;
          const counterValue = Math.round(maxTarget * (steps / maxSteps));
          c.completionPercent = counterValue;
        });
        steps += 1;
        if (steps <= maxSteps) {
          setTimeout(updateCounter, delayMs);
        }
      };
      updateCounter();
    },
    render() {
      const vis = this.newData;
      // Reset state
      this.showTableContainer = false;
      this.tableData = null;
      var tooltipCount = 0;
      // Get maximum steps
      var maxStep = 0;
      for (var a in vis) {
        const checkMax = vis[a].max_activities;
        if (checkMax > maxStep) {
          maxStep = checkMax;
        }
      }
      this.maxActivities = maxStep;
      // 10% id for header, 10% for participant percentage, rest 70% is actual matrix map
      this.tableItemSize = 70 / maxStep;
      var tableData = [];
      // Build footer
      var footerCols = [];
      for (var b = 1; b <= maxStep; b++) {
        footerCols.push(`${b}`);
      }
      // Now build table
      for (var row_index in vis) {
        const participant = vis[row_index];
        var visitedCount = 0;
        var completionMatrix = [];
        for (var col_index in participant.completion_matrix) {
          const activity = participant.completion_matrix[col_index];
          const c = activity.statusInt;
          const vNum = parseInt(col_index) + 1;
          var statusClass = "participant-completion-box-unvisited";
          switch (c) {
            case 1:
              statusClass = "participant-completion-box-visited";
              visitedCount += 1;
              break;
            case 2:
              statusClass = "participant-completion-box-incoming";
              break;
          }
          const completionItemId = `completion-item-t${tooltipCount}`;
          tooltipCount += 1;
          completionMatrix.push({
            completionItemId: completionItemId,
            activityName: activity.name,
            status: activity.status,
            completedDate: activity.completedDate,
            statusClass: statusClass,
          });
        }
        const completionPercentMax = Math.round((visitedCount / maxStep) * 100);
        // Push into table item data
        tableData.push({
          participantName: participant.participant_name,
          completionPercent: 0,
          completionPercentMax: completionPercentMax,
          completionMatrix: completionMatrix,
        });
      }
      this.tableData = tableData;
      this.footerData = footerCols;
      const obj = this;
      setTimeout(function () {
        obj.showTableContainer = true;
        // Then animate percents
        setTimeout(obj.animatePercent, 100);
      }, 100);
    },
  },
  async mounted() {
    this.render();
  },
};
</script>

<style scoped>
.rotate {
  /* FF3.5+ */
  -moz-transform: rotate(90.0deg);
  /* Opera 10.5 */
  -o-transform: rotate(90.0deg);
  /* Saf3.1+, Chrome */
  -webkit-transform: rotate(90.0deg);
  /* IE6,IE7 */
  filter: progid: DXImageTransform.Microsoft.BasicImage(rotation=0.083);
  /* IE8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0.083)";
  /* Standard */
  transform: rotate(90.0deg);
}
</style>