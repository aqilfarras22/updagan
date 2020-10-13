<template>
  <b-card :title="title">
    <vue-perfect-scrollbar
      class="scroll picker-container"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
    >
      <b-row>
        <b-colxx md="5">
          <div
            :class="{'search':true, 'mobile-view':true}"
            ref="searchContainer"
            @mouseenter="isSearchOver=true"
            @mouseleave="isSearchOver=false"
          >
            <b-input :placeholder="$t('menu.search')" @input="filterData" v-model="searchKeyword" />
          </div>
        </b-colxx>
        <b-colxx md="7">
          <b-button v-if="showApply" class="mb-1 float-right ml-1" variant="primary" @click="apply">{{ $t('button.apply') }}</b-button>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx md="12" class="mt-1">
          <b-form-group>
            <b-form-radio-group stacked v-model="chosenData">
              <b-form-radio v-if="includeAll" @change="btnClick($event)" value="all">All</b-form-radio>
              <b-form-radio
                v-for="d in data"
                :key="d"
                :value="d"
                v-model="chosenData"
                @change="btnClick($event)"
                v-show="pattern.test(d)"
              >{{d}}</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-colxx>
      </b-row>
    </vue-perfect-scrollbar>
  </b-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Array
    },
    title: {
      type: String,
      default: "DropdownPicker"
    },
    showApply: { // True = Click through the options wont fire event, it has to click Apply button.
      type: Boolean,
      default: false
    },
    includeAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chosenData: this.includeAll ? "all" : null,
      searchKeyword: "",
      pattern: new RegExp("^", "i")
    };
  },
  methods: {
    btnClick(event){
      this.chosenData = event;
      if (!this.showApply) {
        this.apply();
      }
    },
    filterData() {
      let searchTxt = this.searchKeyword;
      searchTxt = searchTxt.replace(/[.()+]/g, "\\$&");
      this.pattern = new RegExp("^" + searchTxt, "i");
    },
    apply() {
      this.$emit("onApply", this.chosenData);
    }
  }
};
</script>
