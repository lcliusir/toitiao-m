<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <span v-show="deleteState" @click="$emit('remove-all-item')"
        >全部删除</span
      >
      <span v-show="deleteState" @click="deleteState = !deleteState">完成</span>
      <!-- 删除按钮 -->
      <van-icon
        name="delete"
        @click="deleteState = true"
        v-show="!deleteState"
      ></van-icon>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="removeItem(item, index)"
    >
      <van-icon v-show="deleteState" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data() {
    return {
      deleteState: false
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    removeItem(item, index) {
      if (this.deleteState) {
        // 删除状态
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-history {
  :first-child {
    margin-right: 15px;
  }
}
</style>
