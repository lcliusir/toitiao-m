<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 评论回复内容 -->
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>
      <van-cell title="全部回复" />
      <comment-list
        :source="comment.com_id"
        type="c"
        @reply-click="replyClick"
        :list="commentList"
      ></comment-list>
    </div>
    <!-- 底部 发表回复 -->
    <div class="post-box">
      <van-button class="post-btn" round @click="postReply"
        >我要发言</van-button
      >
    </div>
    <!-- 发表评论回复弹出层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :targetId="comment.com_id"
        @post-success="postSuccess"
      ></comment-post>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from '../comment-item'
import CommentList from '../comment-list'
import CommentPost from '../comment-post'
export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  created() { },
  data() {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    postSuccess(data) {
      this.comment.reply_count++
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    },
    replyClick() {
      console.log('回复发言')
    },
    postReply() {
      console.log('回复楼主')
      this.isPostShow = true
    }
  }
}
</script>

<style lang='less' scoped>
.post-box {
  position: fixed;
  height: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 2px solid #d8d8d8;
  .post-btn {
    width: 60%;
    color: rgb(0, 98, 255);
    font-size: 30px;
    opacity: 0.6;
    border: 2px solid #d8d8d8;
  }
}
.scroll-wrap {
  position: absolute;
  bottom: 88px;
  top: 92px;
  left: 0;
  right: 0;
  overflow-y: scroll;
}
</style>
