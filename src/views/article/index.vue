<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="小刘头条">
      <van-icon slot="left" name="arrow-left" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- 加载完成 -->
      <div v-else-if="articleInfo.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleInfo.title }}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articleInfo.aut_photo"
          />
          <div slot="title" class="user-name">{{ articleInfo.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articleInfo.pubdate | relativeTime }}
          </div>
          <!-- 关注用户按钮 组件 -->
          <!-- :is_followed="articleInfo.is_followed"
            @changeFollowed="articleInfo.is_followed = $event" -->
          <follow-user
            class="follow-btn"
            :aut_id="articleInfo.aut_id"
            v-model="articleInfo.is_followed"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="articleInfo.content"
          ref="articleContentRef"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论组件 -->
        <comment-list
          :source="articleInfo.art_id"
          @comments-loaded="CommentsCount = $event.data.total_count"
          :list="commentList"
          @reply-click="replyClick"
        />
        <!-- 底部区域 -->
        <!-- 评论 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPopupShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="CommentsCount" color="#777" />
          <!-- 收藏 -->
          <collect-article
            v-model="articleInfo.is_collected"
            :article-id="articleInfo.art_id"
          />
          <!-- 点赞 -->
          <like-article
            v-model="articleInfo.attitude"
            :article-id="articleInfo.art_id"
          />
          <!-- 转发 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>

        <!-- 评论弹出框 -->
        <van-popup v-model="isPopupShow" position="bottom" closeable>
          <comment-post
            :targetId="articleInfo.art_id"
            @post-success="postSuccess"
          />
        </van-popup>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="status === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticleInfo" class="retry-btn"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 回复评论弹出层 -->
    <!-- 弹出层  有懒加载问题 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-replay'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      articleInfo: {},
      loading: true,
      status: 0, // 控制加载失败的两个面板
      followLoading: false, // 的
      CommentsCount: 0, // 评论计数
      isPopupShow: false, // 评论文章弹出层
      commentList: [], // 评论列表数据
      isReplyShow: false,
      currentComment: {} // 当前回复的评论对象
    }
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticleInfo()
  },
  mounted() { },
  methods: {
    async loadArticleInfo() {
      this.loading = true
      try {
        const { data } = await getArticleInfo(this.articleId)
        // 模拟失败
        // if (Math.random() < 0.5) {
        //   JSON.parse('sajbfasjfsa')
        // }
        this.articleInfo = data.data
        // 获取图片节点
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.status = 404
        }
        console.log('获取文章详情失败')
      }
      this.loading = false
    },
    previewImage() {
      const articleContent = this.$refs.articleContentRef
      const imgs = articleContent.querySelectorAll('img')
      const imgUrls = []
      // 获取图片地址加到 数据中
      imgs.forEach((img, i) => {
        imgUrls.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images: imgUrls,
            startPosition: i
          })
        }
      })
    },
    postSuccess(data) {
      // 关闭弹出层
      this.isPopupShow = false
      // 更新视图
      this.commentList.unshift(data.new_obj)
    },
    replyClick(comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  /deep/.page-nav-bar {
    .van-nav-bar__left {
      .van-icon-arrow-left {
        color: #fff;
        font-size: 30px;
      }
    }
    .van-nav-bar__title {
      color: #fff;
      font-size: 32px;
    }
  }

  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }
    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
