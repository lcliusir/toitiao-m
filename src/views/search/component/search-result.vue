<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="加载失败，请重试"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(res, index) in list" :key="index" :title="res.title" />
    </van-list>
  </div>
</template>

<script>
import { getResults } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 15,
      error: false
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getResults({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        console.log(data)
        // 模拟失败
        // if (Math.random() > 0.2) {
        //   JSON.parse('asfoiasf')
        // }
        const { results } = data.data
        this.list.push(...results)
        // 关闭loading状态
        this.loading = false
        // 还有数据
        if (results.length) {
          this.page++
        } else {
          // 没数据了------显示没有更多了
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        // this.$toast('无结果，请重试！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
