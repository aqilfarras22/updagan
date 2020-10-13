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
          <b-button class="mb-1 float-right ml-1" variant="primary" @click="apply">{{ $t('button.apply') }}</b-button>
          <b-button
            v-if="isCheckAll"
            class="mb-1 float-right mr-0"
            variant="danger"
            @click="unselectAll"
          >{{ $t('button.unselect') }}</b-button>
          <b-button
            v-else
            class="mb-1 float-right mr-0"
            variant="success"
            @click="selectAll"
          >{{ $t('forms.selectAll') }}</b-button>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx md="12" class="mt-1">
          <b-form-group>
            <b-form-checkbox-group v-model="checkedDatas" stacked>
              <b-form-checkbox
                v-for="d in data"
                :key="d"
                :value="d"
                ref="cbItem"
                v-show="pattern.test(d)"
              >{{d}}</b-form-checkbox>
            </b-form-checkbox-group>
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
      default: "CheckboxPicker"
    }
  },
  data() {
    return {
      isCheckAll: false,
      checkedDatas: [],
      searchKeyword: "",
      pattern: new RegExp("^", "i")
    };
  },
  methods: {
    unselectAll() {
      this.checkedDatas = [];
      this.isCheckAll = false;
    },
    selectAll() {
      this.checkedDatas = [];
      this.data.forEach(d => {
        this.checkedDatas.push(d);
      });
      this.isCheckAll = true;
    },
    filterData() {
      let searchTxt = this.searchKeyword;
      searchTxt = searchTxt.replace(/[.()+]/g, "\\$&");
      this.pattern = new RegExp("^" + searchTxt, "i");
    },
    apply() {
      let checkedDatas = [];
      checkedDatas = checkedDatas.concat(this.checkedDatas); //remove _ob observer reactive properties
      const payload = {
        checkedDatas,
        isCheckAll: this.data.length === this.checkedDatas.length
      }
      this.$emit('onApply', payload);
    }
  },
  mounted() {
    this.data.forEach(d => {
        this.checkedDatas.push(d);
    });
  }
};
</script>
