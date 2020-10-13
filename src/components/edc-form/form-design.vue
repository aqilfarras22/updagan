<template>
    <b-row class="formBorder">
      <b-col cols="12" class="p-0 pt-20">
        <div class="primaryBackground">
          <div>
            <!-- Drag and drop a field from the right panel to add to form -->
            <div class="drag-drop-component textColor" v-if="!dropText">{{dropTextDefault}}</div>
            <div class="drag-drop-component textColor" v-if="dropText">{{dropText}}</div>
          </div>
        </div>
      </b-col>
    </b-row>
</template>

<script>

export default {
  name: 'form-design',
  props: ['dropText'],
  mounted() {},
  data() {
    return {
      dropTextDefault: 'Drag and drop a field from the right panel to add to form',
    };
  },
  methods: {
  },
};
</script>

<style scoped>

.primaryBackground {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.drag-drop-component {
  font-size: 16px;
  padding: 40px;
  background-color: #f5f6f7;
  border: 1.5px solid #d5d7dc;
  border-radius: 2px;
  border-style: dashed;
  text-align: center;
}

.textColor {
  color: #9b9b9b;
}
</style>

