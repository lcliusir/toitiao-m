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
      <!-- 汉堡按钮底层站位 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮  -->
      <div slot="nav-right" class="hamburger-box" @click="showEdit">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>
    <!-- 编辑面板弹出层 -->
    <van-popup
      v-model="isEdit"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :fixChannels="isEdit"
        :active="active"
        :my-channels="channels"
        @to-channel="toActiveChannel"
        @change-active="changeActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/articleList'
import ChannelEdit from './component/channelEdit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'homeIndex',
  data() {
    return {
      active: 0,
      channels: [],
      isEdit: false
    }
  },
  created() {
    this.loadUserChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    async loadUserChannels() {
      let channels = []
      try {
        if (this.user) {
          // 已登录
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_UNLOADED_CHANNEL')
          if (localChannels) {
            // 未登录，本地有数据
            channels = localChannels
          } else {
            // 未登录，本地无数据
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道失败！')
      }
    },
    showEdit() {
      this.isEdit = true
    },
    toActiveChannel(index) {
      this.active = index
      this.isEdit = false
    },
    changeActive() {
      this.active = this.active - 1
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
      right: 1px;
      .van-tabs__nav {
        padding-left: 0;
      }
    }
    .van-tabs__content {
      margin-top: 176px;
    }
    .van-tab {
      min-width: 180px;
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
      opacity: 1;
      right: 0;
      width: 66px;
      height: 82px;
      background-color: #fff;
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
