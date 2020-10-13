<template>
  <div class="details pb-12">
    <div class="card br-2">
      <div class="p-10">
        <div>
          <h6 class="fw-bold text-transform">Manually Start Study for Participants</h6>
        </div>
      </div>
      <div class="row pb-12">
        <div class="col-md-2">Enabled</div>
        <div class="col-md-10 bold-text">Participants in the study will not start their schedule of events/activities until manually triggered by the Site Team</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'participant-day-zero-detals',
  data() {
    return {
    };
  },
  components: {},
  props: {
  },
  methods: {
  },
};
</script>

<style scoped>
  .text-transform {
    text-transform: capitalize;
  }
  .bold-text {
    font-weight: 600;
    font-size: 12px;
  }
</style>
