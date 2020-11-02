<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', suggestion)"
    >
      <div slot="title" v-html="redText(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    // 加载联想建议
    async loadSuggestion(val) {
      try {
        const { data } = await getSuggestions({ q: val })
        console.log('联想建议', val, data)
        this.suggestions = data.data.options
      } catch (err) {
        console.log('获取联想数据失败，但不影响正常搜索！')
      }
    },
    redText(suggestion) {
      const hightText = `<span style="color:#3692fa">${this.searchText}</span>`
      // 动态创建正则表达式
      // new RegExp(匹配的字符串，规则[全局？大小写？])
      const reg = new RegExp(this.searchText, 'i')
      return suggestion.replace(reg, hightText)
    }
  },
  watch: {
    // 监控文本框输入，获取联想建议
    searchText: {
      handler: debounce(function (val) {
        this.loadSuggestion(val)
      }, 500),
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
