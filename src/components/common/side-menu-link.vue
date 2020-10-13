<template>
  <li class="menu-item" v-if="isExternalResource" @click="goToExternal">
    <div v-if="faIcon" class="display-inline img fs-18"><i :class="`fa ${faIcon}`" aria-hidden="true"></i></div>
    <div v-if="icon" class="display-inline">
      <span class="icon-img"><img :src="icon"/></span>
      <span class="icon-img-active"><img :src="activeIcon"/></span>
    </div>
    <span class="pl-10  display_none_xs">{{ title }}</span>
  </li>
  <router-link v-else-if="to" tag="li" :to="to" :class="{'pointer_events_none': !to}">
    <div v-if="faIcon" class="display-inline img fs-18"><i :class="`fa ${faIcon}`" aria-hidden="true"></i></div>
    <div v-if="icon" class="display-inline">
      <span class="icon-img"><img :src="icon"/></span>
      <span class="icon-img-active"><img :src="activeIcon"/></span>
    </div>
    <span class="pl-10 display_none_xs">{{ title }}</span>
  </router-link>
  <li v-else class="pointer_events_none">
    <div v-if="faIcon" class="display-inline img fs-18"><i :class="`fa ${faIcon}`" aria-hidden="true"></i></div>
    <div v-if="icon" class="display-inline">
      <span class="icon-img"><img :src="icon"/></span>
      <span class="icon-img-active"><img :src="activeIcon"/></span>
    </div>
    <span class="pl-10 display_none_xs">{{ title }}</span>
  </li>
</template>

<script>
export default {
  name: 'SideMenuLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    to: {
      type: [Object, String],
    },
    faIcon: String,
    icon: String,
    activeIcon: String,
  },
  computed: {
    isExternalResource() {
      if (typeof this.to === 'string') {
        return this.to.indexOf('http') === 0;
      }
      return false;
    },
  },
  methods: {
    goToExternal() {
      window.open(this.to, '_blank');
    },
  },
};
</script>

<style scoped lang="scss" src="./styles/side-menu-link.scss" />
