<template>
  <van-cell
    class="article"
    :to="{
      name: 'article',
      params: { articleId: article.art_id },
    }"
  >
    <!-- 标题 -->
    <div class="title van-multi-ellipsis--l2" slot="title">
      {{ article.title }}
    </div>
    <!-- 三张图片 -->
    <div slot="label">
      <div v-if="article.cover.type === 3" class="three">
        <div
          class="three-cover"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image fit="cover" :src="img" />
        </div>
      </div>
      <!-- 底部信息 -->
      <div class="bottom-info">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 一张图片 -->
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
    .right-cover {
      width: 232px;
      height: 146px;
    }
  }
  .bottom-info span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 24px;
  }
  .three {
    display: flex;
    padding: 30px 0;
    .three-cover {
      &:not(last-child) {
        padding-left: 4px;
      }
      flex: 1;
      height: 146px;
      .van-image {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
