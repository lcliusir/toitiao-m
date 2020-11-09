<template>
  <div class="user-profile">
    <!-- 头部 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- 信息部分 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      @click="isNamePopupShow = true"
      title="昵称"
      :value="user.name"
      is-link
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isGenderPopupShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isBirthdayPopupShow = true"
    ></van-cell>
    <!-- 昵称 弹出层 -->
    <van-popup v-model="isNamePopupShow" position="bottom" style="height: 100%">
      <update-name
        v-if="isNamePopupShow"
        @close="isNamePopupShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 性别 弹出层 -->
    <van-popup v-model="isGenderPopupShow" position="bottom">
      <update-gender
        v-if="isGenderPopupShow"
        v-model="user.gender"
        @close="isGenderPopupShow = false"
      />
    </van-popup>
    <!-- 生日 弹出层 -->
    <van-popup v-model="isBirthdayPopupShow" position="bottom">
      <update-birthday
        v-if="isBirthdayPopupShow"
        v-model="user.birthday"
        @close="isBirthdayPopupShow = false"
      />
    </van-popup>
    <!-- 头像 弹出层 -->
    <van-popup
      style="height: 100%"
      v-model="isPhotoPopupShow"
      position="bottom"
    >
      <update-photo
        v-if="isPhotoPopupShow"
        :img="photoUrl"
        @close="isPhotoPopupShow = false"
        @update-avatar="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  props: {},
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created() {
    this.loadUserProfile()
  },
  data() {
    return {
      user: {},
      isNamePopupShow: false,
      isGenderPopupShow: false,
      isBirthdayPopupShow: false,
      isPhotoPopupShow: false,
      photoUrl: null
    }
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast.fail('获取信息失败')
      }
    },
    onFileChange() {
      const file = this.$refs.file.files[0]
      this.photoUrl = window.URL.createObjectURL(file)
      this.isPhotoPopupShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  /deep/.van-nav-bar {
    .van-nav-bar__title {
      color: #fff;
      font-size: 32px;
    }
    .van-nav-bar__left {
      .van-icon-arrow-left {
        color: #fff;
      }
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
  .van-cell {
    padding-top: 20px;
    height: 100px;
  }
}
</style>
