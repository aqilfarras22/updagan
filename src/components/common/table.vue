<template>
  <b-container
    fluid
    v-if="items && fields"
    class="custom-b-table"
    :class="{ 'p-0': noGutters }"
  >
    <b-row>
      <b-col md="9" class="my-2 itemstotal" role="itemstotal" v-if="showTotal && !showButton">
        {{ printTotal }}
      </b-col>
      
      <b-col md="6" class="my-2 itemstotal" role="itemstotal" v-if="showButton && showTotal">
        {{ printTotal }}
      </b-col>
      
      <b-col md="3" class="my-2 itemstotal" role="itemstotal" v-if="showButton && showTotal">
        <b-btn size="sm" class="fs-12 pull-right" variant="outline-primary" @click="btnClick"> {{btnText}} </b-btn>
      </b-col>

      <b-col md="3" class="my-1" role="itemsfilter" v-if="showFilter">
        <b-form-group class="mb-0">
          <b-form-select
            v-if="filterOptions"
            :value="filterModel"
            @input="onFilterChange"
            @change="onFilterChange"
            :options="filterOptions"/>

          <b-input-group v-else>
            <b-form-input
              :value="filterModel"
              @input="onFilterChange"
              @change="onFilterChange"
              :placeholder="filterPlaceholderMessage"/>

            <b-input-group-button>
              <b-button @click="onFilterChange('')">Clear</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row :noGutters="noGutters">
      <b-col>
        <component :is="tableWrapperComponent" :noGutters="noGutters" :class="{'border-0 shadow': tableWrapperComponent === 'b-card'}">
          <b-table
            :fields="fields"
            :items="items"
            :id="id"
            :sortBy="sortBy"
            :sortDesc="sortDesc"
            :noProviderPaging="noProviderPaging"
            :noProviderSorting="noProviderSorting"
            :noProviderFiltering="noProviderFiltering"
            :filter="filterModel"
            :per-page="perPage"
            :current-page="currentPageModel"
            :showEmpty="showEmpty"
            :emptyText="emptyText"
            :emptyFilteredText="emptyText"
            @row-clicked="(...args) => transferListener('rowClicked', ...args)"
            @row-hovered="(...args) => transferListener('rowHovered', ...args)"
            @sort-changed="(...args) => transferListener('sortChanged', ...args)"
            @context-changed="(...args) => transferListener('contextChanged', ...args)"
            @filtered="onFiltered"
            @refreshed="(...args) => transferListener('refreshed', ...args)">

            <template v-for="field in fields" :slot="field.key" slot-scope="row">
              <slot :name="field.key" :row="row">{{row.value}}</slot>
            </template>
          </b-table>
        </component>
      </b-col>
    </b-row>

    <b-row :noGutters="noGutters" v-if="showPagination && totalItemsModel > perPage">
      <b-col md="6" class="my-1">
        <b-pagination
          :total-rows="totalItemsModel"
          :per-page="perPage"
          :value="currentPageModel"
          @change="onPageChange"
          class="my-0 pt-20"/>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
export default {
  props: {
    fields: {
      // Array of objects: {key, label, class, sortable, formatter}
      type: Array,
      required: true,
    },
    items: {
      // Array of objects
      // Function ( { perPage, currentPage, filter, sortBy, sortDesc } ) => []
      type: [Array, Function],
      required: true,
    },
    id: String,
    sortBy: String,
    btnText: String,
    sortDesc: Boolean,
    totalItems: Number,
    perPage: {
      type: Number,
      default: 0,
    },
    currentPage: Number,
    filter: [String, RegExp, Function],
    filterOptions: Array,
    noProviderPaging: {
      type: Boolean,
      default: false,
    },
    noProviderSorting: {
      type: Boolean,
      default: false,
    },
    noProviderFiltering: {
      type: Boolean,
      default: false,
    },
    noGutters: {
      type: Boolean,
      default: false,
    },
    showFilter: Boolean,
    showButton: Boolean,
    showPagination: Boolean,
    showTotal: Boolean,
    tableWrapperComponent: {
      type: String,
      default: 'div',
    },
    printTotalFormatter: {
      type: Function,
      default: totalCount => `Total item count: ${totalCount}`,
    },
    filterPlaceholderMessage: {
      type: String,
      default: 'Type to Search',
    },
    filterLabelMessage: {
      type: String,
      default: 'Filter',
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'No documents available to view.',
    },
  },
  data() {
    return {
      filteredItems: [],
      filterModel: this.filter || '',
      currentPageModel: this.currentPage || 1,
    };
  },
  watch: {
    filter(newFilter) {
      this.filterModel = newFilter;
    },
    currentPage(newPage) {
      this.currentPageModel = newPage;
    },
  },
  computed: {
    totalItemsModel() {
      const isItemProviderUsing = this.items instanceof Function;

      if (this.filterModel && (this.noProviderFiltering || !isItemProviderUsing)) {
        return this.filteredItems.length;
      }

      return this.totalItems || (!isItemProviderUsing ? this.items.length : 0);
    },
    printTotal() {
      return this.printTotalFormatter(this.totalItemsModel);
    },
  },
  methods: {
    transferListener(listenerName, ...args) {
      this.$emit(listenerName, ...args);
    },
    onFiltered(filteredItems) {
      this.filteredItems = filteredItems;
      this.transferListener('filtered', filteredItems);
    },
    onFilterChange(value) {
      this.$emit('filterChanged', value);
      this.currentPageModel = 1;
      this.filterModel = value;
    },
    onPageChange(value) {
      this.$emit('pageChanged', value);
      this.currentPageModel = value;
    },
    btnClick() {
      this.$emit('tableBtn', this.btnText);
    },
  },
};
</script>

<style lang="scss" src="./styles/table.scss" />
