<template>
  <div class="search-container">
    <!-- 搜索 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 结果 -->
    <search-result v-if="isResultShow" :searchText="searchText"></search-result>
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- 历史 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @remove-all-item="searchHistories = []"
      @search="onSearch"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from './component/search-history'
import SearchSuggestion from './component/search-suggestion'
import SearchResult from './component/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  computed: {},
  created() { },
  watch: {
    searchHistories(val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  methods: {
    onSearch(val) {
      console.log(val)
      this.searchText = val
      if (this.searchHistories.indexOf(val) !== -1) {
        this.searchHistories.splice(this.searchHistories.indexOf(val), 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }
}
</style>
