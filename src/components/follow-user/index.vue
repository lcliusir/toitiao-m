<template>
  <van-button
    v-if="is_followed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'is_followed',
    event: 'changeFollowed'
  },
  props: {
    aut_id: {
      required: true,
      type: [String, Number, Object]
    },
    is_followed: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow() {
      this.loading = true
      try {
        if (this.is_followed) {
          await deleteFollow(this.aut_id)
        } else {
          await addFollow(this.aut_id)
        }
        this.$emit('changeFollowed', !this.is_followed)
      } catch (err) {
        let msg = '操作失败，请稍后再试！'
        if (err.response && err.response.status === 400) msg = '不能关注自己！'
        this.$toast(msg)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
