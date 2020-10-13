<template>
  <div id="no-data-page-id" class="full-page">
    <div class="box--wrapper">
      <div class="box--header" v-if="iconProps">
        <div class="box--header-icon">
          <i :class="icon"/>
        </div>
      </div>
      <div class="box--title" v-if="titleProps">
        <h3 class="box--title-text">{{ title }}</h3>
      </div>
      <div class="box--message" v-if="messageProps">{{ message }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    titleProps: { type: String, default: '' },
    messageProps: { type: String, default: '' },
    iconProps: { type: String, default: '' }
  },
  data() {
    return {
      title: this.titleProps,
      message: this.messageProps,
      icon: this.iconProps
    }
  },
  watch: {
    titleProps() {
      this.title = this.titleProps
    },
    messageProps() {
      this.message = this.messageProps
    },
    icon() {
      this.icon = this.iconProps
    }
  }
}
</script>
