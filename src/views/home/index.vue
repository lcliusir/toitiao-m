<template>
  <div class="home-container">
    <!-- 导航 -->
    <van-nav-bar class="page-nav-bar">
      <van-button slot="title" type="info" size="small" round icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- tab 标签栏 -->
    <van-tabs class="choose-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
        >{{ channel.name }}的内容</van-tab
      >
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-box">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
export default {
  name: 'homeIndex',
  data() {
    return {
      active: 0,
      channels: []
    }
  },
  created() {
    this.loadUserChannels()
  },
  methods: {
    async loadUserChannels() {
      try {
        const { data } = await getUserChannels()
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('获取频道失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .page-nav-bar {
    .van-button {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon-search {
        font-size: 32px;
        color: #fff;
      }
    }
  }
  /deep/.choose-tabs {
    .van-tabs__wrap {
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      font-size: 30px;
      color: #777;
      border-right: 1px solid #edeff3;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      margin-bottom: 8px;
      background-color: #3296fa;
    }
    .hamburger-box {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.902;
      right: 0;
      width: 66px;
      height: 82px;
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 82px;
        background: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
}
</style>
