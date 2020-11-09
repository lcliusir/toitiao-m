<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div v-if="user" class="header logined">
      <div class="user-info">
        <div class="left">
          <van-image
            fit="cover"
            class="avatar"
            round
            src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2233431505,2282541580&fm=26&gp=0.jpg"
          />
          <span class="username">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" to="/user/profile" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="login-img" src="~@/assets/mobile.png" alt="" />
        <span class="login-text">登录 / 注册</span>
      </div>
    </div>
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-nav-item">
        <i slot="icon" class="iconfont iconshoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-nav-item">
        <i slot="icon" class="iconfont iconlishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <van-cell class="note-cell" title="消息通知" is-link />
    <van-cell class="message-cell" title="小刘同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      clickable
      @click="logout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'myIndex',
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    logout() {
      console.log(11)
      this.$dialog.confirm({
        title: '确认退出？'
      })
        .then(() => {
          console.log('确认')
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消')
        })
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        console.log(this.userInfo)
      } catch (err) {
        this.$toast('获取信息失败，请稍后再试！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url(~@/assets/banner.png);
    background-size: cover;
  }
  .not-login {
    // display: none;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .login-img {
        width: 132px;
        height: 132px;
      }
      .login-text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .logined {
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          height: 132px;
          width: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .username {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-nav-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      i.iconshoucang {
        color: #eb5253;
      }
      span.text {
        font-size: 28px;
      }
      i.iconlishi {
        color: #ff9d1d;
      }
    }
  }
  .note-cell {
    height: 100px;
    font-size: 30px;
    margin-top: 9px;
  }
  .message-cell {
    font-size: 30px;
    height: 100px;
    margin-bottom: 9px;
  }
  .logout-cell {
    height: 104px;
    font-size: 30px;
    line-height: 64px;
    color: #d86262;
    text-align: center;
  }
}
</style>
