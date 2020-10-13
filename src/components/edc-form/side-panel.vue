<template>
  <div>
    <b-row>
      <h6 class="pl-15 pt-20"><b>Fields</b></h6>
    </b-row>
    <b-row >
      <b-col cols="12" lg="6" v-for="(component, index) in allFormComponents" :key="index" class="pb-3 pr-3 cursor-pointer">
        <drag class="formComponentsColor cursor_pointer fs-13 pt-10 pb-5" @drag="dragging" @dragend="dragStopped" :transfer-data="{ component }"><i :class="[component.icon, {'icon-border': component.id == 'formTextArea'}]" class="pr-5" aria-hidden="true"></i>{{ component.name }}
          <div slot="image" class="drag-image dragComponent">
            <i :class="[component.icon, {'icon-border': component.id == 'formTextArea'}]" class="pr-5" aria-hidden="true"></i>{{ component.name }}
          </div>
        </drag>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import AllFormComponentsJson from '../../data/form-components-json/all-form-components.json';

export default {
  name: 'side-panel',
  components: { draggable },
  props: [],
  data() {
    return {
      allFormComponents: AllFormComponentsJson,
    };
  },
  computed: {
  },
  methods: {
    dragging() {
      this.$emit('draggingText', 'Drop here');
    },
    dragStopped() {
      this.$emit('draggingText', 'Drag and drop a field from the right panel to add to form');
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.formComponentsColor {
  color: #4a4a4a;
}

.dragComponent {
  background-color: #ffffff;
  border: 0.5px solid #d5d7dc;
  border-radius: 3px;
  padding: 4px 25px 4px 6px;
}

.icon-border {
  border: 1px solid#4a4a4a;
  padding: 0.5px 2px 0.5px 2px !important;
  margin-right: 4px;
  font-size: 10px;
}

</style>

