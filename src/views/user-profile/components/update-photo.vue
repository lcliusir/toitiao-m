<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="bottom-box">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="confirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  components: {},
  created() { },
  data() {
    return {
      cropper: null
    }
  },
  methods: {
    confirm() {
      // 后端裁剪形式用 getData
      // const data = this.cropper.getData()
      // 前端裁剪用 getCroppedCanvas
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // Content-Type 是 multipart/form-data 时，必须传入formData 对象数据才行
        try {
          this.$toast.loading({
            message: '保存中...',
            duration: 0,
            forbidClick: true
          })
          const formData = new FormData()
          formData.append('photo', blob)
          const { data } = await updateUserPhoto(formData)
          this.$emit('close')
          this.$emit('update-avatar', data.data.photo)
          this.$toast.success('更新成功')
        } catch (err) {
          this.$toast.fail('更新失败，请重试')
        }
      })
    }
  },
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: true,
      background: false
      // movable: true
    })
  }
}
</script>

<style lang='less' scoped>
.update-photo {
  height: 100%;
  width: 100%;
  background-color: #000;
  .img {
    // max-height: 1100px;
    display: block;
    max-width: 100%;
  }
  .bottom-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .cancel,
    .confirm {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90px;
      height: 90px;
      font-size: 35px;
      color: #fff;
      font-weight: 700;
    }
  }
}
</style>
