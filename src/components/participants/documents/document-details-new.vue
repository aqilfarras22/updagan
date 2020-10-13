<template>
  <div class="document-details">
    <iframe v-if="documentDetails && documentDetails.preSignedUrl" :src="documentDetails.preSignedUrl" style="width:100%; height:320px;" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'document-details',
  components: {},
  props: {
    documentDetails: {
      type: Object,
    },
  },
};
</script>

<style scoped>
.document-details {
  padding: 16px;
}
</style>

