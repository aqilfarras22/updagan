<template>
  <b-btn v-bind="$props" v-on="this.$listeners"><slot /></b-btn>
</template>

<script>
export default {
  name: 'button-cmp',
  props: {
    variant: String,
    type: String,
    size: String,
    disabled: Boolean,
  },
};
</script>

<style scoped lang="scss">
.btn-primary,
.btn-secondary,
.btn-outline-primary,
.btn-outline-secondary {
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  letter-spacing: 1px;
  text-align: center;
  min-width: 81px;
  border-radius: 3px;
  border-color: transparent;
  box-shadow: none !important;
}
.btn-primary,
.btn-secondary {
  text-transform: uppercase;
  box-shadow: none !important;
}
.btn-outline-primary,
.btn-outline-secondary {
  text-transform: uppercase;
  letter-spacing: 1px;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  background-color: #ffffff;
}
.btn-primary {
  font-weight: bold;
  background-color: #4c8ce4;
}
.btn-outline-primary {
  color: #4c8ce4;
  border-color: #d3dfe4;
}
.btn-secondary {
  background-color: #666669;
}
.btn-outline-secondary {
  color: #666669;
  border-color: #d3dfe4;
}

</style>
