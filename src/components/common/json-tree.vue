<template>
  <div>
    <a
      v-if="!hideOpenLink && hasSubTree"
      href=""
      class="open-link"
      @click.prevent="toggleAll"
    >{{ levelOpen ? 'Close All' : 'Open All' }}</a>
    <ul class="json-tree" :class="`level-${level}`">
      <li v-for="key in jsonKeys" :key="key">
        <strong v-if=" !(key.toLowerCase().includes('timestamp') ||  key.toLowerCase().includes('time stamp') )">{{ key }} :</strong>
        <span v-if="isArray(preparedJson[key])" class="array">
          <a href="" v-if="isOpenKey(key)" @click.prevent="close(key)"><i class="fa fa-minus-square"></i></a>
          <span v-if="isOpenKey(key)" class="open-item">
            <JsonTree
              hideOpenLink
              class="child-tree"
              :level="level+1"
              :json="preparedJson[key]"
              :treeOpen="levelOpen"
            />
          </span>
          <span v-else>[...] <a href="" @click.prevent="open(key)"><i class="fa fa-plus-square"></i></a></span>
        </span>
        <span v-else-if="isObject(preparedJson[key])" class="object">
          <a href="" v-if="isOpenKey(key)" @click.prevent="close(key)"><i class="fa fa-minus-square"></i></a>
          <span v-if="isOpenKey(key)" class="open-item">
            <JsonTree
              hideOpenLink
              class="child-tree"
              :level="level+1"
              :json="preparedJson[key]"
              :treeOpen="levelOpen"
            />
          </span>
          <span v-else>{...} <a href="" @click.prevent="open(key)"><i class="fa fa-plus-square"></i></a></span>
        </span>
        <span v-else>
          <span v-if="!(key.toLowerCase().includes('timestamp') ||  key.toLowerCase().includes('time stamp') )">{{ preparedJson[key] }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import renameJsonKeys from '@/utils/json';

export default {
  name: 'json-tree',
  props: {
    json: {
      type: [Object, Array],
      default: {},
    },
    level: {
      type: Number,
      default: 0,
    },
    treeOpen: {
      type: Boolean,
      default: false,
    },
    hideOpenLink: {
      type: Boolean,
      default: false,
    },
    readableKeys: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      levelOpen: this.treeOpen,
      openKeys: this.treeOpen ? Object.keys(this.json) : [],
    };
  },
  computed: {
    preparedJson() {
      let { json } = this;
      if (this.readableKeys) {
        json = renameJsonKeys(json);
      }
      return json;
    },
    jsonKeys() {
      return Object.keys(this.preparedJson);
    },
    hasSubTree() {
      return this.jsonKeys.map(k => typeof this.preparedJson[k] === 'object').includes(true);
    },
  },
  methods: {
    isOpenKey(key) {
      if (this.openKeys.length) {
        return this.openKeys.includes(key);
      }
      return false;
    },
    isArray(value) {
      return Array.isArray(value);
    },
    isObject(value) {
      return typeof value === 'object';
    },
    open(key) {
      this.openKeys.push(key);
      this.levelOpen = true;
    },
    close(key) {
      this.openKeys = this.openKeys.filter(k => k !== key);
      if (this.openKeys.length === 0) {
        this.levelOpen = false;
      }
    },
    toggleAll() {
      this.levelOpen = !this.levelOpen;
      if (this.levelOpen) {
        this.openKeys = Object.keys(this.preparedJson)
          .filter(key => (
            this.isArray(this.preparedJson[key])
            || this.isObject(this.preparedJson[key])
          ));
      } else {
        this.openKeys = [];
      }
    },
  },
};
</script>

<style scoped>
.json-tree {
  margin: 0;
  padding: 0;
  list-style: none;
}
.level-0 {
  overflow: hidden;
}
.open-link {
  display: inline-block;
  margin-bottom: 1rem;
}
.child-tree {
  margin-top: 0.5rem;
  padding: 0.5rem 0 0 0;
}
.open-item {
  display: block;
  border-left: 1px dotted #ccc;
}
li {
  margin-bottom: 0.5rem;
  position: relative;
}
.child-tree li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
}
.child-tree strong {
  position: relative;
  display: inline-block;
}
.child-tree strong:before {
  display: block;
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 50%;
  width: 1.2rem;
  border-bottom: 1px dotted #ccc;
}
.child-tree li:last-child:before {
  display: block;
  content: '';
  position: absolute;
  left: -1px;
  top: 11px;
  height: 100%;
  width: 1px;
  background: white;
}
</style>
