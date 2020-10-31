<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 文章组件 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      refreshing: false,
      refreshSuccessText: ''
    }
  },
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 初始化或是滑动到底部时 调用 onload()
    // 当初始化数据没有铺满屏幕，会在调用一次 onload()
    async onLoad() {
      try {
        // 1、发起请求。获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        console.log('获取文章', data)
        // 2、向 list 里面追加文章数据
        const { results } = data.data
        this.list.push(...results)
        // 3、加载状态结束,设置为 false 才会触发下一次onload()
        this.loading = false
        // 4、判断是否已经获取所有的数据
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false
        this.error = true
      }
    },
    async onRefresh() {
      try {
        // 1、请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        // 模拟失败
        // if (Math.random() > 0.2) {
        //   JSON.parse('asfoiasf')
        // }
        // 2、数据追加到顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3、关闭下拉刷新的loading状态
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        this.refreshing = false
        console.log('下拉刷新成功', data)
      } catch (err) {
        console.log('下拉刷新失败', err)
        this.refreshing = false
        this.refreshSuccessText = '刷新失败！'
      }
    }
  }
}
</script>

<style lang="less">
.article-list {
  height: 80vh;
  overflow-y: auto;
}
</style>
