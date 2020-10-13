<template>
  <div class="icon-row-item">
    <b-card class="text-center">
      <slot />
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, default: 'icon-card-title' },
    icon: { type: String, default: 'iconsminds-clock' },
    value: { type: Number, default: 0 }
  }
}
</script>
