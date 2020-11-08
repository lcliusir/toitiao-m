<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载错误，点击重试"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
      :immediate-check="false"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from '../comment-item'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  created() {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // http://localhost:8080/#/article/137825  测试文章
        const { data } = await getComments({
          type: this.type, // a 文章评论，c 评论回复
          source: this.source + '', // 文章评论或评论回复的id
          offset: this.offset, // 偏移量
          limit: this.limit // 每次数据条数
        })
        console.log(data)
        const { results } = data.data
        this.$emit('comments-loaded', data)
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
