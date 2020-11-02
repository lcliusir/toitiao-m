<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <div v-if="isEdit" slot="title" class="tip">点击移除频道</div>
      <div v-else slot="title" class="tip">点击进入频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        size="small"
        round
        v-model="isEdit"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 我的频道 --宫格 -->
    <van-grid class="my-grid" :border="false" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="editMyChannels(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
      <div slot="title" class="tip">点击添加频道</div>
    </van-cell>
    <!-- 推荐频道--宫格 -->
    <van-grid class="recommand-grid" :border="false" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        icon="plus"
        :text="channel.name"
        @click="addToMyChannels(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addMyChannel, deleteMyChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true,
      maxlength: 12
    },
    active: {
      type: Number,
      required: true
    },
    fixChannels: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false,
      // 推荐、固有频道
      fixedChannels: [0]
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel =>
          channel.id === myChannel.id
        )
      })
    }
  },
  created() {
    this.loadAllChannel()
  },
  methods: {
    async loadAllChannel() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log('所有频道', this.allChannels)
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },
    // 添加我的频道
    async addToMyChannels(channel) {
      this.myChannels.push(channel)
      // 数据真实化，持久化-------已登录、未登录
      if (this.user) {
        try {
          const { data } = await addMyChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          console.log('添加成功', data)
        } catch (err) {
          this.$toast('添加失败，请稍后再试！')
        }
      } else {
        setItem('TOUTIAO_UNLOADED_CHANNEL', this.myChannels)
      }
    },
    // 删除我的频道
    editMyChannels(channel, index) {
      // 编辑状态
      if (this.isEdit) {
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        this.myChannels.splice(index, 1)
        if (index <= this.active) this.$emit('change-active')
        console.log('是否编辑状态：', this.isEdit)
        this.removeMychannel(channel.id)
      } else {
        // 非编辑状态
        this.$emit('to-channel', index)
      }
    },
    async removeMychannel(channelId) {
      if (this.user) {
        try {
          await deleteMyChannel(channelId)
        } catch (err) {
          this.$toast('删除失败，请稍后再试！')
        }
      } else {
        setItem('TOUTIAO_UNLOADED_CHANNEL', this.myChannels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .van-cell__title {
    display: flex;
    flex-direction: row;
    justify-content: left;
    .title-text {
      font-size: 32px;
      color: #333;
    }
    .tip {
      font-size: 22px;
      color: #888;
      line-height: 55px;
      margin-left: 10px;
    }
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    line-height: 48px;
    color: #f85959;
    border: 2px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      border-radius: 10px;
      background-color: #f4f5f6 !important;
      .van-grid-item__text,
      .text {
        margin-top: 0px;
        font-size: 28px;
        color: #222;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.recommand-grid {
    .van-grid-item__content {
      display: flex;
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
      }
      .van-grid-item__text {
        margin-top: 10px;
        margin-left: 6px;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__icon-wrapper {
        position: static;
        .van-icon-clear {
          position: absolute;
          top: -10px;
          right: 10px;
          font-size: 40px;
          color: #ccc;
          z-index: 3;
        }
      }
    }
  }
}
</style>
