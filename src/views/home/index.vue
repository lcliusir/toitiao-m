<template>
  <div class="home-container">
    <!-- 导航 -->
    <van-nav-bar class="page-nav-bar" fixed>
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
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-box">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/index'
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
  components: {
    ArticleList
  },
  methods: {
    async loadUserChannels() {
      try {
        const { data } = await getUserChannels()
        this.channels = data.data.channels
        console.log('获取面板', data)
      } catch (err) {
        this.$toast('获取频道失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
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
      overflow: hidden;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tabs__content {
      margin-top: 176px;
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
